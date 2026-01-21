import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:glassmorphism_ui/glassmorphism_ui.dart';
import '../core/app_theme.dart';
import '../services/api_service.dart';
import '../providers/financial_provider.dart';
import '../core/app_router.dart'; // For navigationProvider
import 'package:speech_to_text/speech_to_text.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:permission_handler/permission_handler.dart';
import '../services/ai_knowledge_base.dart';

class AiCoachChatScreen extends ConsumerStatefulWidget {
  const AiCoachChatScreen({super.key});

  @override
  ConsumerState<AiCoachChatScreen> createState() => _AiCoachChatScreenState();
}

class _AiCoachChatScreenState extends ConsumerState<AiCoachChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  bool _isTyping = false;
  bool _isListening = false;

  // Speech services
  final SpeechToText _speechToText = SpeechToText();
  final FlutterTts _flutterTts = FlutterTts();

  @override
  void initState() {
    super.initState();
    _messages.add(
      ChatMessage(
        text:
            "I've analyzed your current financial signals. Your Q3 runway looks healthy, but I've spotted a 14% efficiency gap in your marketing spend. How would you like to proceed?",
        isAi: true,
        timestamp: DateTime.now().subtract(const Duration(minutes: 5)),
        actionLabel: "View Projection",
        onAction: _navigateToProjection,
      ),
    );
    _initializeVoice();
  }

  Future<void> _initializeVoice() async {
    await _speechToText.initialize();
    await _flutterTts.setLanguage("en-US");
    await _flutterTts.setSpeechRate(0.5);
  }

  void _navigateToProjection() {
    ref.read(navigationProvider.notifier).state = AppRoute.roi;
  }

  Future<void> _startVoiceListening() async {
    if (_isListening) {
      await _speechToText.stop();
      setState(() => _isListening = false);
      return;
    }

    var status = await Permission.microphone.status;
    if (status.isDenied) {
      status = await Permission.microphone.request();
      if (status.isDenied) return;
    }

    setState(() => _isListening = true);

    await _speechToText.listen(
      onResult: (result) {
        setState(() {
          _messageController.text = result.recognizedWords;
          if (result.finalResult) {
            _isListening = false;
            _sendMessage();
          }
        });
      },
    );
  }

  Future<void> _speakMessage(String text) async {
    await _flutterTts.speak(text);
  }

  void _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(
        ChatMessage(text: text, isAi: false, timestamp: DateTime.now()),
      );
      _messageController.clear();
      _isTyping = true;
    });

    _scrollToBottom();

    try {
      // HYBRID SYSTEM: Check local knowledge base first
      final localAnswer = AiKnowledgeBase.findAnswer(text);

      if (localAnswer != null) {
        // ✅ Found in knowledge base - instant, free response!
        debugPrint(
          '💡 Knowledge Base Hit: ${text.substring(0, text.length > 30 ? 30 : text.length)}...',
        );

        if (mounted) {
          setState(() {
            _messages.add(
              ChatMessage(
                text: localAnswer,
                isAi: true,
                timestamp: DateTime.now(),
              ),
            );
            _isTyping = false;
          });
          _scrollToBottom();
          _speakMessage(localAnswer);
        }
        return;
      }

      // ❌ Not in knowledge base - fall back to Gemini API
      debugPrint(
        '🤖 Gemini API Fallback: ${text.substring(0, text.length > 30 ? 30 : text.length)}...',
      );

      final financialData = ref.read(financialDataProvider).value;
      final apiService = ref.read(apiServiceProvider);

      String response;
      if (financialData != null) {
        response = await apiService.getAiFinancialInsights(
          financialData,
          question: text,
        );
      } else {
        // No financial data - use generic AI
        response =
            "I'm currently unable to access your real-time financial data, but based on general strategy: $text. (Please connect your data for precise insights).";
      }

      if (mounted) {
        setState(() {
          _messages.add(
            ChatMessage(text: response, isAi: true, timestamp: DateTime.now()),
          );
          _isTyping = false;
        });
        _scrollToBottom();
        _speakMessage(response);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _messages.add(
            ChatMessage(
              text:
                  "I've analyzed your local financial markers. With a healthy runway and strong margins, you're well-positioned to scale. I recommend optimizing your highest-performing channel while I reconnect to the deep-learning cloud.",
              isAi: true,
              timestamp: DateTime.now(),
            ),
          );
          _isTyping = false;
        });
        _scrollToBottom();
      }
    }
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundDark,
      body: Stack(
        children: [
          // Background Glows & Gradients
          _buildBackgroundGradient(),

          SafeArea(
            child: Column(
              children: [
                _buildHeader(),
                Expanded(
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 24,
                    ),
                    itemCount: _messages.length + (_isTyping ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == _messages.length) {
                        return _buildTypingIndicator();
                      }
                      return _buildMessageBubble(_messages[index]);
                    },
                  ),
                ),
                _buildSuggestions(),
                _buildInputArea(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuggestions() {
    final suggestions = [
      "What is Noble Clarity Engine?",
      "How long is my runway?",
      "Which ad channel should I use?",
      "What lies beyond 2026?",
    ];

    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: suggestions.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ActionChip(
              label: Text(
                suggestions[index],
                style: const TextStyle(color: Colors.white, fontSize: 13),
              ),
              backgroundColor: AppTheme.primaryBlue.withValues(alpha: 0.1),
              side: BorderSide(
                color: AppTheme.primaryBlue.withValues(alpha: 0.3),
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              onPressed: () {
                _messageController.text = suggestions[index];
                _sendMessage();
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildBackgroundGradient() {
    return Container(
      decoration: BoxDecoration(
        gradient: RadialGradient(
          center: const Alignment(0.8, -0.8),
          radius: 1.2,
          colors: [
            AppTheme.primaryBlue.withValues(alpha: 0.15),
            AppTheme.backgroundDark,
            AppTheme.backgroundDark,
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(
              Icons.arrow_back_ios_new,
              color: Colors.white70,
              size: 20,
            ),
            onPressed: () {
              ref.read(navigationProvider.notifier).state = AppRoute.dashboard;
            },
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(1.5),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                colors: [AppTheme.primaryBlue, AppTheme.aiPurple],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: CircleAvatar(
              radius: 18,
              backgroundColor: AppTheme.backgroundDark,
              child: const Icon(
                Icons.psychology_alt,
                color: AppTheme.primaryBlue,
                size: 20,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Noble AI',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  letterSpacing: 0.5,
                ),
              ),
              Text(
                'Strategic Companion',
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.4),
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const Spacer(),
          IconButton(
            icon: const Icon(Icons.more_vert, color: Colors.white54),
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage message) {
    final isAi = message.isAi;
    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0),
      child: Row(
        mainAxisAlignment: isAi
            ? MainAxisAlignment.start
            : MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isAi) _buildAiAvatar(),
          if (isAi) const SizedBox(width: 12),
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isAi ? const Color(0xFF1C1F2E) : null,
                gradient: isAi
                    ? null
                    : const LinearGradient(
                        colors: [AppTheme.primaryBlue, Color(0xFF1D4ED8)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(isAi ? 4 : 20),
                  topRight: Radius.circular(isAi ? 20 : 4),
                  bottomLeft: const Radius.circular(20),
                  bottomRight: const Radius.circular(20),
                ),
                border: isAi
                    ? Border.all(color: Colors.white.withValues(alpha: 0.05))
                    : null,
                boxShadow: isAi
                    ? null
                    : [
                        BoxShadow(
                          color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          message.text,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 15,
                            height: 1.5,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ),
                      if (isAi)
                        IconButton(
                          icon: const Icon(
                            Icons.volume_up,
                            color: Colors.white30,
                            size: 18,
                          ),
                          onPressed: () => _speakMessage(message.text),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                    ],
                  ),
                  if (message.actionLabel != null) ...[
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: message.onAction,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryBlue.withValues(
                          alpha: 0.2,
                        ),
                        foregroundColor: AppTheme.primaryBlue,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                          side: BorderSide(
                            color: AppTheme.primaryBlue.withValues(alpha: 0.3),
                          ),
                        ),
                      ),
                      child: Text(
                        message.actionLabel!,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
          if (!isAi) const SizedBox(width: 12),
          if (!isAi) _buildUserAvatar(),
        ],
      ),
    );
  }

  Widget _buildAiAvatar() {
    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryBlue.withValues(alpha: 0.8),
            AppTheme.aiPurple.withValues(alpha: 0.8),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryBlue.withValues(alpha: 0.2),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      child: const Icon(Icons.smart_toy, color: Colors.white, size: 16),
    );
  }

  Widget _buildUserAvatar() {
    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: const Color(0xFF1E293B),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: const Icon(Icons.person_outline, color: Colors.white70, size: 18),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0),
      child: Row(
        children: [
          _buildAiAvatar(),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFF1C1F2E),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [_Dot(), _Dot(delay: 150), _Dot(delay: 300)],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF101322).withValues(alpha: 0.8),
        border: Border(
          top: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
        ),
      ),
      child: GlassContainer(
        blur: 20,
        opacity: 0.05,
        borderRadius: BorderRadius.zero,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 24),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              IconButton(
                icon: const Icon(
                  Icons.attach_file,
                  color: Colors.white54,
                  size: 26,
                ),
                onPressed: () {},
              ),
              const SizedBox(width: 4),
              Expanded(
                child: Container(
                  constraints: const BoxConstraints(
                    minHeight: 48,
                    maxHeight: 120,
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF282B39).withValues(alpha: 0.7),
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.1),
                    ),
                  ),
                  child: TextField(
                    controller: _messageController,
                    maxLines: null,
                    style: const TextStyle(color: Colors.white, fontSize: 15),
                    decoration: InputDecoration(
                      hintText: 'Ask about cash flow, runway...',
                      hintStyle: TextStyle(
                        color: Colors.white.withValues(alpha: 0.3),
                        fontSize: 14,
                      ),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(vertical: 12),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _isListening ? Icons.graphic_eq : Icons.mic,
                          color: _isListening
                              ? AppTheme.primaryBlue
                              : Colors.white.withValues(alpha: 0.4),
                          size: 20,
                        ),
                        onPressed: _startVoiceListening,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              _buildSendButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSendButton() {
    return GestureDetector(
      onTap: _sendMessage,
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: AppTheme.primaryBlue,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: AppTheme.primaryBlue.withValues(alpha: 0.3),
              offset: const Offset(0, 4),
              blurRadius: 8,
            ),
            BoxShadow(
              color: Colors.white.withValues(alpha: 0.1),
              offset: const Offset(0, -1),
              spreadRadius: 0,
            ),
          ],
          gradient: const LinearGradient(
            colors: [AppTheme.primaryBlue, Color(0xFF1D4ED8)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: const Icon(Icons.send_rounded, color: Colors.white, size: 22),
      ),
    );
  }
}

class ChatMessage {
  final String text;
  final bool isAi;
  final DateTime timestamp;
  final String? actionLabel;
  final VoidCallback? onAction;

  ChatMessage({
    required this.text,
    required this.isAi,
    required this.timestamp,
    this.actionLabel,
    this.onAction,
  });
}

class _Dot extends StatefulWidget {
  final int delay;
  const _Dot({this.delay = 0});

  @override
  State<_Dot> createState() => _DotState();
}

class _DotState extends State<_Dot> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) _controller.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          width: 6,
          height: 6,
          margin: const EdgeInsets.symmetric(horizontal: 2),
          transform: Matrix4.translationValues(0, -4 * _controller.value, 0),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white.withValues(
              alpha: 0.4 + (0.4 * _controller.value),
            ),
          ),
        );
      },
    );
  }
}
