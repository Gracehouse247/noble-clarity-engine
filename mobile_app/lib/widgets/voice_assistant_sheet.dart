import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../services/api_service.dart';
import '../providers/financial_provider.dart';
import 'dart:async';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:permission_handler/permission_handler.dart';

class VoiceAssistantSheet extends ConsumerStatefulWidget {
  const VoiceAssistantSheet({super.key});

  @override
  ConsumerState<VoiceAssistantSheet> createState() =>
      _VoiceAssistantSheetState();
}

class _VoiceAssistantSheetState extends ConsumerState<VoiceAssistantSheet>
    with TickerProviderStateMixin {
  bool _isListening = false;
  bool _isProcessing = false;
  bool _isSpeaking = false;
  String _statusText = "Tap mic to speak";
  String _userTranscript = "";
  String _aiResponse = "";
  late AnimationController _waveController;

  // Speech services
  final SpeechToText _speechToText = SpeechToText();
  final FlutterTts _flutterTts = FlutterTts();

  @override
  void initState() {
    super.initState();
    _waveController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);

    _initializeSpeech();
  }

  Future<void> _initializeSpeech() async {
    bool available = await _speechToText.initialize(
      onError: (error) => _handleError(error.errorMsg),
      onStatus: (status) => debugPrint('Speech status: $status'),
    );

    await _flutterTts.setLanguage("en-US");
    await _flutterTts.setSpeechRate(0.5);
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.0);

    _flutterTts.setCompletionHandler(() {
      if (mounted) {
        setState(() {
          _isSpeaking = false;
          _statusText = "Tap mic to speak";
        });
      }
    });

    if (!available) {
      _handleError("Speech recognition not available");
    }
  }

  void _handleError(String error) {
    setState(() {
      _statusText = "Error: $error";
      _isListening = false;
      _isProcessing = false;
    });
  }

  Future<void> _startListening() async {
    if (_isListening || _isProcessing || _isSpeaking) return;

    // Check microphone permission
    var status = await Permission.microphone.status;
    if (status.isDenied) {
      status = await Permission.microphone.request();
      if (status.isDenied) {
        _handleError("Microphone permission denied");
        return;
      }
    }

    if (status.isPermanentlyDenied) {
      _handleError(
        "Microphone permission permanently denied. Please enable in settings.",
      );
      openAppSettings();
      return;
    }

    setState(() {
      _isListening = true;
      _statusText = "Listening...";
      _userTranscript = "";
      _aiResponse = "";
    });

    await _speechToText.listen(
      onResult: (result) {
        setState(() {
          _userTranscript = result.recognizedWords;
        });
      },
      listenFor: const Duration(seconds: 30),
      pauseFor: const Duration(seconds: 3),
      listenOptions: SpeechListenOptions(
        partialResults: true,
        cancelOnError: true,
        listenMode: ListenMode.confirmation,
      ),
    );
  }

  Future<void> _stopListening() async {
    await _speechToText.stop();

    setState(() {
      _isListening = false;
    });

    if (_userTranscript.isNotEmpty) {
      _processQuery();
    }
  }

  Future<void> _processQuery() async {
    if (_userTranscript.isEmpty) return;

    setState(() {
      _isProcessing = true;
      _statusText = "Processing...";
    });

    try {
      final apiService = ref.read(apiServiceProvider);
      final financialDataAsync = ref.read(financialDataProvider);

      await financialDataAsync.when(
        data: (financialData) async {
          // Get AI response
          final response = await apiService.getAiFinancialInsights(
            financialData,
            question: _userTranscript,
          );

          if (mounted) {
            setState(() {
              _aiResponse = response;
              _isProcessing = false;
              _statusText = "Speaking...";
              _isSpeaking = true;
            });

            // Speak the response
            await _speak(response);
          }
        },
        loading: () async {
          _handleError("Loading financial data...");
        },
        error: (error, stack) async {
          _handleError("Failed to get financial data");
        },
      );
    } catch (e) {
      _handleError("Failed to process query: $e");
    }
  }

  Future<void> _speak(String text) async {
    await _flutterTts.speak(text);
  }

  @override
  void dispose() {
    _waveController.dispose();
    _speechToText.stop();
    _flutterTts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 500,
      width: double.infinity,
      decoration: const BoxDecoration(
        color: Color(0xFF0F1116),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: 24),

          // Visualizer
          SizedBox(
            height: 100,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (index) {
                return AnimatedBuilder(
                  animation: _waveController,
                  builder: (context, child) {
                    final height = _isListening
                        ? 40 +
                              (30 *
                                  (index % 2 == 0
                                      ? _waveController.value
                                      : 1 - _waveController.value))
                        : 10.0;
                    return Container(
                      width: 10,
                      height: height,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        color: _isListening
                            ? AppTheme.primaryBlue
                            : Colors.white24,
                        borderRadius: BorderRadius.circular(20),
                      ),
                    );
                  },
                );
              }),
            ),
          ),

          const SizedBox(height: 32),

          // Status
          Text(
            _statusText,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),

          const SizedBox(height: 16),

          // User Transcript
          if (_userTranscript.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: AppTheme.primaryBlue.withValues(alpha: 0.3),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(
                          Icons.person,
                          color: AppTheme.primaryBlue,
                          size: 16,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'You asked:',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _userTranscript,
                      style: const TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),

          const SizedBox(height: 16),

          // AI Response
          if (_aiResponse.isNotEmpty)
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: AppTheme.primaryBlue.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(
                            Icons.auto_awesome,
                            color: AppTheme.primaryBlue,
                            size: 16,
                          ),
                          SizedBox(width: 8),
                          Text(
                            'Clarity AI:',
                            style: TextStyle(
                              color: AppTheme.primaryBlue,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _aiResponse,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          const Spacer(),

          // Processing Indicator
          if (_isProcessing)
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: CircularProgressIndicator(
                color: AppTheme.primaryBlue,
                strokeWidth: 2,
              ),
            ),

          // Mic Button
          GestureDetector(
            onTap: _isListening ? _stopListening : _startListening,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _isListening ? Colors.redAccent : AppTheme.primaryBlue,
                boxShadow: [
                  BoxShadow(
                    color:
                        (_isListening ? Colors.redAccent : AppTheme.primaryBlue)
                            .withValues(alpha: 0.4),
                    blurRadius: 20,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: Icon(
                _isListening ? Icons.stop : Icons.mic,
                color: Colors.white,
                size: 32,
              ),
            ),
          ),
          const SizedBox(height: 48),
        ],
      ),
    );
  }
}
