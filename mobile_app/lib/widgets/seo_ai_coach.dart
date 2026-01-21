import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../models/financial_models.dart';
import '../services/api_service.dart';

class SeoMetricData {
  final double traffic;
  final double conversionRate;
  final double valuePerLead;
  final double monthlyCost;
  final double potentialRevenue;
  final double roi;

  SeoMetricData({
    required this.traffic,
    required this.conversionRate,
    required this.valuePerLead,
    required this.monthlyCost,
    required this.potentialRevenue,
    required this.roi,
  });
}

class SeoAiCoach extends ConsumerStatefulWidget {
  final String contextPrompt;
  final SeoMetricData data;

  const SeoAiCoach({
    super.key,
    required this.contextPrompt,
    required this.data,
  });

  @override
  ConsumerState<SeoAiCoach> createState() => _SeoAiCoachState();
}

class _SeoAiCoachState extends ConsumerState<SeoAiCoach> {
  final List<ChatMessage> _messages = [];
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;

  final List<String> _quickActions = [
    "How to improve organic traffic?",
    "Optimize conversion rates",
    "Keyword strategy advice",
    "Technical SEO audit",
  ];

  @override
  void initState() {
    super.initState();
    _runInitialAnalysis();
  }

  Future<void> _runInitialAnalysis() async {
    setState(() => _isLoading = true);
    try {
      final apiService = ref.read(apiServiceProvider);

      // Use the context prompt to get AI insights
      final response = await apiService.getAiFinancialInsights(
        FinancialData(
          revenue: widget.data.potentialRevenue,
          operatingExpenses: widget.data.monthlyCost,
          // Mapping SEO cost to marketing spend
          marketingSpend: widget.data.monthlyCost,
          // Mapping traffic to leads for the sake of the generic model
          leadsGenerated: widget.data.traffic.round(),
          conversions: (widget.data.traffic * widget.data.conversionRate)
              .round(),
          cogs: 0,
          currentAssets: 0,
          currentLiabilities: 0,
          industry: 'SEO & Content Marketing',
          date: DateTime.now().toIso8601String(),
        ),
        question: widget.contextPrompt,
      );

      if (mounted) {
        setState(() {
          _messages.add(ChatMessage(role: 'assistant', content: response));
          _isLoading = false;
        });
        _scrollToBottom();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _messages.add(
            ChatMessage(
              role: 'assistant',
              content:
                  '⚠️ Unable to connect to SEO AI Coach. Please check your connection.',
            ),
          );
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _sendMessage(String message) async {
    if (message.trim().isEmpty) return;

    setState(() {
      _messages.add(ChatMessage(role: 'user', content: message));
      _isLoading = true;
    });
    _controller.clear();
    _scrollToBottom();

    try {
      final apiService = ref.read(apiServiceProvider);
      final fullPrompt = '${widget.contextPrompt}\n\nUser Question: $message';

      final response = await apiService.getAiFinancialInsights(
        FinancialData(
          revenue: widget.data.potentialRevenue,
          operatingExpenses: widget.data.monthlyCost,
          marketingSpend: widget.data.monthlyCost,
          leadsGenerated: widget.data.traffic.round(),
          conversions: (widget.data.traffic * widget.data.conversionRate)
              .round(),
          cogs: 0,
          currentAssets: 0,
          currentLiabilities: 0,
          industry: 'SEO & Content Marketing',
          date: DateTime.now().toIso8601String(),
        ),
        question: fullPrompt,
      );

      if (mounted) {
        setState(() {
          _messages.add(ChatMessage(role: 'assistant', content: response));
          _isLoading = false;
        });
        _scrollToBottom();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _messages.add(
            ChatMessage(role: 'assistant', content: '⚠️ Error: $e'),
          );
          _isLoading = false;
        });
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
    return Column(
      children: [
        // Messages
        Expanded(
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.all(20),
            itemCount: _messages.length + (_isLoading ? 1 : 0),
            itemBuilder: (context, index) {
              if (index == _messages.length && _isLoading) {
                return _buildLoadingIndicator();
              }
              return _buildMessageBubble(_messages[index]);
            },
          ),
        ),

        // Quick Actions
        if (_messages.length <= 1)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _quickActions.map((action) {
                return InkWell(
                  onTap: () => _sendMessage(action),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: AppTheme.primaryBlue.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Text(
                      action,
                      style: const TextStyle(
                        color: AppTheme.primaryBlue,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

        // Input Area
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.03),
            border: Border(
              top: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Ask your SEO Coach...',
                    hintStyle: const TextStyle(color: Colors.white38),
                    filled: true,
                    fillColor: Colors.white.withValues(alpha: 0.05),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  onSubmitted: _sendMessage,
                ),
              ),
              const SizedBox(width: 12),
              Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppTheme.primaryBlue, AppTheme.accentBlue],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: IconButton(
                  icon: const Icon(Icons.send, color: Colors.white),
                  onPressed: () => _sendMessage(_controller.text),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMessageBubble(ChatMessage message) {
    final isUser = message.role == 'user';
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        decoration: BoxDecoration(
          gradient: isUser
              ? LinearGradient(
                  colors: [AppTheme.primaryBlue, AppTheme.accentBlue],
                )
              : LinearGradient(
                  colors: [
                    Colors.white.withValues(alpha: 0.08),
                    Colors.white.withValues(alpha: 0.03),
                  ],
                ),
          borderRadius: BorderRadius.circular(16),
          border: isUser
              ? null
              : Border.all(color: Colors.white.withValues(alpha: 0.1)),
        ),
        child: Text(
          message.content,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            height: 1.5,
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withValues(alpha: 0.08),
            Colors.white.withValues(alpha: 0.03),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: AppTheme.primaryBlue,
            ),
          ),
          const SizedBox(width: 12),
          const Text(
            'Analyzing SEO strategy...',
            style: TextStyle(color: Colors.white54, fontSize: 14),
          ),
        ],
      ),
    );
  }
}

class ChatMessage {
  final String role;
  final String content;

  ChatMessage({required this.role, required this.content});
}
