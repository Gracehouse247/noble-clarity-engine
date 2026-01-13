import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../models/financial_models.dart';
import '../services/api_service.dart';
import '../services/realtime_service.dart';

class AiCoachSheet extends ConsumerStatefulWidget {
  final FinancialData data;
  const AiCoachSheet({super.key, required this.data});

  @override
  ConsumerState<AiCoachSheet> createState() => _AiCoachSheetState();
}

class _AiCoachSheetState extends ConsumerState<AiCoachSheet> {
  final List<ChatMessage> _messages = [];
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  final String _loadingText = "Consulting financial models...";
  String? _currentlySpeakingId;

  final List<String> _quickActions = [
    "Analyze my burn rate",
    "How to increase runway?",
    "Revenue optimization tips",
    "Benchmarking analysis",
  ];

  @override
  void initState() {
    super.initState();
    _setupRealtimeListener();
    _runInitialAnalysis();
  }

  void _setupRealtimeListener() {
    final realtimeService = ref.read(realtimeServiceProvider);

    realtimeService.aiResponseStream.listen(
      (chunk) {
        if (!mounted) return;

        setState(() {
          _isLoading = false;

          // If the last message is from the assistant, append to it.
          // Otherwise, start a new message.
          if (_messages.isNotEmpty && _messages.last.role == 'assistant') {
            final lastMsg = _messages.last;
            _messages.removeLast();
            _messages.add(
              ChatMessage(role: 'assistant', content: lastMsg.content + chunk),
            );
          } else {
            _messages.add(ChatMessage(role: 'assistant', content: chunk));
          }
        });
        _scrollToBottom();
      },
      onError: (err) {
        if (!mounted) return;
        setState(() {
          _isLoading = false;
          _messages.add(
            ChatMessage(role: 'assistant', content: "\n\nâš ï¸ Error: $err"),
          );
        });
      },
    );
  }

  Future<void> _runInitialAnalysis() async {
    // For initial analysis, we can still use the REST API or switch to socket
    // Keeping REST for now to avoid double-streaming on load
    // But we could easily switch to realtimeService.askAi(...)
    setState(() => _isLoading = true);
    try {
      final apiService = ref.read(apiServiceProvider);
      // Construct a strategic briefing prompt
      final briefingPrompt =
          """
      Provide a concise 'Noble Strategic Briefing' based on these financials: ${widget.data.toJson()}.
      Highlight one major strength and one immediate risk. Use bullet points.
      """;

      final response = await apiService.getAiFinancialInsights(
        widget.data,
        question: briefingPrompt,
      );
      if (mounted) {
        setState(() {
          _messages.add(ChatMessage(role: 'assistant', content: response));
          _isLoading = false;
        });
        _scrollToBottom();
      }
    } catch (e) {
      // Fallback or silent fail
      setState(() => _isLoading = false);
    }
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 50), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 100),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isEmpty || _isLoading) return;

    setState(() {
      _messages.add(ChatMessage(role: 'user', content: text));
      _controller.clear();
      _isLoading = true;
    });
    _scrollToBottom();

    final realtimeService = ref.read(realtimeServiceProvider);

    // Construct a context-aware system instruction
    final systemInstruction =
        "You are the Noble AI Financial Coach. "
        "User Context: ${widget.data.toJson()} "
        "Answer briefly and strategically.";

    // Trigger the stream
    realtimeService.askAi(text, systemInstruction);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: Color(0xFF0B0E14),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
      ),
      child: Column(
        children: [
          // Header
          _buildHeader(),

          // Messages
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length + (_isLoading ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length) {
                  return _buildLoadingBubble();
                }
                return _buildMessageBubble(_messages[index], index);
              },
            ),
          ),

          // Quick Actions
          if (!_isLoading && _messages.isNotEmpty) _buildQuickActions(),

          // Input
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
      decoration: BoxDecoration(
        color: const Color(0xFF13151F),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              // ... icon and text ...
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                  ),
                ),
                child: const Icon(
                  Icons.psychology,
                  color: AppTheme.primaryBlue,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Noble AI Coach',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  Text(
                    'NEURAL ENGINE ACTIVE',
                    style: TextStyle(
                      fontSize: 10,
                      color: AppTheme.profitGreen,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.close, color: Colors.white38),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Divider(color: Colors.white.withValues(alpha: 0.05), height: 1),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage message, int index) {
    bool isUser = message.role == 'user';
    bool isSpeaking = _currentlySpeakingId == index.toString();

    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        mainAxisAlignment: isUser
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFF13151F),
                shape: BoxShape.circle,
                border: Border.all(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.3),
                ),
              ),
              child: const Icon(
                Icons.smart_toy_outlined,
                color: AppTheme.primaryBlue,
                size: 16,
              ),
            ),
            const SizedBox(width: 12),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isUser ? AppTheme.primaryBlue : const Color(0xFF1E232D),
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(20),
                  topRight: const Radius.circular(20),
                  bottomLeft: Radius.circular(isUser ? 20 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 20),
                ),
                border: isUser
                    ? null
                    : Border.all(color: Colors.white.withValues(alpha: 0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message.content,
                    style: TextStyle(
                      color: isUser
                          ? Colors.white
                          : Colors.white.withValues(alpha: 0.9),
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                  if (!isUser) ...[
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        _buildActionIcon(
                          isSpeaking
                              ? Icons.volume_up
                              : Icons.volume_up_outlined,
                          () async {
                            if (isSpeaking) {
                              setState(() => _currentlySpeakingId = null);
                              return;
                            }
                            setState(
                              () => _currentlySpeakingId = index.toString(),
                            );

                            // Call TTS API
                            final apiService = ref.read(apiServiceProvider);
                            final audioBase64 = await apiService.getTtsAudio(
                              message.content,
                            );

                            if (audioBase64.isNotEmpty) {
                              if (!mounted) return;
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Speaking... (Audio playback requires audioplayers package)',
                                  ),
                                  duration: Duration(seconds: 2),
                                ),
                              );
                            }

                            // Mock end of speaking
                            Future.delayed(const Duration(seconds: 3), () {
                              if (mounted) {
                                setState(() => _currentlySpeakingId = null);
                              }
                            });
                          },
                          isActive: isSpeaking,
                        ),
                        const SizedBox(width: 8),
                        _buildActionIcon(Icons.copy_outlined, () {
                          // Copy logic
                        }),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 12),
            Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                color: Colors.white12,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.person_outline,
                color: Colors.white70,
                size: 16,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildLoadingBubble() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: const Color(0xFF13151F),
              shape: BoxShape.circle,
              border: Border.all(
                color: AppTheme.primaryBlue.withValues(alpha: 0.3),
              ),
            ),
            child: const SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AppTheme.primaryBlue,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF1E232D),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
            ),
            child: Text(
              _loadingText,
              style: TextStyle(
                color: Colors.white38,
                fontSize: 12,
                fontStyle: FontStyle.italic,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: EdgeInsets.fromLTRB(
        20,
        16,
        20,
        16 + MediaQuery.of(context).viewInsets.bottom,
      ),
      decoration: BoxDecoration(
        color: const Color(0xFF13151F),
        border: Border(
          top: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _controller,
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Ask about your financial health...',
                hintStyle: TextStyle(
                  color: Colors.white.withValues(alpha: 0.2),
                ),
                filled: true,
                fillColor: Colors.black26,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
              ),
              onSubmitted: (_) => _sendMessage(),
            ),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: _sendMessage,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primaryBlue, AppTheme.aiPurple],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(Icons.send, color: Colors.white, size: 20),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: _quickActions.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: ActionChip(
              label: Text(
                _quickActions[index],
                style: const TextStyle(color: Colors.white70, fontSize: 12),
              ),
              backgroundColor: Colors.white.withValues(alpha: 0.05),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
              ),
              onPressed: () {
                _controller.text = _quickActions[index];
                _sendMessage();
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildActionIcon(
    IconData icon,
    VoidCallback onTap, {
    bool isActive = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(6),
        decoration: BoxDecoration(
          color: isActive
              ? AppTheme.primaryBlue.withValues(alpha: 0.2)
              : Colors.black12,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          size: 14,
          color: isActive ? AppTheme.primaryBlue : Colors.white38,
        ),
      ),
    );
  }
}
