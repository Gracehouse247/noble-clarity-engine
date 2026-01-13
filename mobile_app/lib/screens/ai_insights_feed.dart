import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../widgets/story_insight_card.dart';
import '../main.dart';
import '../providers/financial_provider.dart';
import '../services/api_service.dart';

// Provider for AI-generated insights
final aiInsightsProvider = FutureProvider<List<InsightCardData>>((ref) async {
  final financialDataAsync = ref.watch(financialDataProvider);
  final apiService = ref.watch(apiServiceProvider);

  return financialDataAsync.when(
    data: (financialData) async {
      try {
        // Generate insights from AI based on financial data
        final insights = await _generateInsightsFromAI(
          apiService,
          financialData,
        );
        return insights;
      } catch (e) {
        // If AI fails, generate rule-based insights
        return _generateRuleBasedInsights(financialData);
      }
    },
    loading: () => [],
    error: (_, __) => _getDefaultInsights(),
  );
});

// Generate AI-powered insights
Future<List<InsightCardData>> _generateInsightsFromAI(
  ApiService apiService,
  dynamic financialData,
) async {
  final insights = <InsightCardData>[];

  try {
    // Request AI analysis for insights
    final aiResponse = await apiService.getAiFinancialInsights(
      financialData,
      question:
          'Analyze my financial data and provide 3-5 critical insights, opportunities, or warnings. Format each as: TITLE|TYPE|DESCRIPTION where TYPE is critical, opportunity, or info.',
    );

    // Parse AI response into insights
    final lines = aiResponse.split('\n').where((l) => l.contains('|')).toList();

    for (var line in lines.take(5)) {
      final parts = line.split('|');
      if (parts.length >= 3) {
        insights.add(
          InsightCardData(
            title: parts[0].trim(),
            description: parts[2].trim(),
            type: _parseInsightType(parts[1].trim()),
            actionLabel: _getActionLabel(parts[1].trim()),
            timestamp: DateTime.now(),
          ),
        );
      }
    }
  } catch (e) {
    debugPrint('AI Insights Error: $e');
  }

  return insights.isEmpty ? _getDefaultInsights() : insights;
}

// Rule-based insights as fallback
List<InsightCardData> _generateRuleBasedInsights(dynamic data) {
  final insights = <InsightCardData>[];

  // Cash Flow Analysis
  final runway = data.currentAssets / (data.operatingExpenses + 1);
  if (runway < 6) {
    insights.add(
      InsightCardData(
        title: 'Cash Flow Alert',
        description:
            'Your runway is ${runway.toStringAsFixed(1)} months. Consider reducing OpEx or raising capital.',
        type: InsightType.critical,
        actionLabel: 'Analyze Cash Flow',
        timestamp: DateTime.now(),
      ),
    );
  }

  // Profitability Check
  final netProfit = data.revenue - (data.cogs + data.operatingExpenses);
  final margin = (netProfit / data.revenue) * 100;
  if (margin > 20) {
    insights.add(
      InsightCardData(
        title: 'Strong Profitability',
        description:
            'Your net margin of ${margin.toStringAsFixed(1)}% is excellent. Consider reinvesting in growth.',
        type: InsightType.opportunity,
        actionLabel: 'View Scenarios',
        timestamp: DateTime.now(),
      ),
    );
  } else if (margin < 0) {
    insights.add(
      InsightCardData(
        title: 'Negative Margin',
        description:
            'You\'re operating at a loss. Review pricing strategy and cost structure.',
        type: InsightType.critical,
        actionLabel: 'Scenario Planner',
        timestamp: DateTime.now(),
      ),
    );
  }

  // Marketing ROI
  if (data.marketingSpend > 0 && data.conversions > 0) {
    final cac = data.marketingSpend / data.conversions;
    if (cac < 100) {
      insights.add(
        InsightCardData(
          title: 'Efficient Marketing',
          description:
              'Your CAC of \$${cac.toStringAsFixed(0)} is strong. Consider scaling ad spend.',
          type: InsightType.opportunity,
          actionLabel: 'View Marketing ROI',
          timestamp: DateTime.now(),
        ),
      );
    }
  }

  return insights.isEmpty ? _getDefaultInsights() : insights;
}

// Default insights when no data available
List<InsightCardData> _getDefaultInsights() {
  return [
    InsightCardData(
      title: 'Welcome to Insights',
      description:
          'Add your financial data to receive AI-powered insights and recommendations.',
      type: InsightType.info,
      actionLabel: 'Add Data',
      timestamp: DateTime.now(),
    ),
  ];
}

InsightType _parseInsightType(String type) {
  switch (type.toLowerCase()) {
    case 'critical':
    case 'warning':
    case 'alert':
      return InsightType.critical;
    case 'opportunity':
    case 'growth':
      return InsightType.opportunity;
    default:
      return InsightType.info;
  }
}

String _getActionLabel(String type) {
  switch (type.toLowerCase()) {
    case 'critical':
      return 'Take Action';
    case 'opportunity':
      return 'Explore';
    default:
      return 'Learn More';
  }
}

class AiInsightsFeedScreen extends ConsumerStatefulWidget {
  const AiInsightsFeedScreen({super.key});

  @override
  ConsumerState<AiInsightsFeedScreen> createState() =>
      _AiInsightsFeedScreenState();
}

class _AiInsightsFeedScreenState extends ConsumerState<AiInsightsFeedScreen> {
  @override
  Widget build(BuildContext context) {
    final insightsAsync = ref.watch(aiInsightsProvider);

    return Scaffold(
      backgroundColor: Colors.black,
      body: insightsAsync.when(
        data: (insights) => Stack(
          children: [
            PageView.builder(
              scrollDirection: Axis.vertical,
              itemCount: insights.length,
              itemBuilder: (context, index) {
                return StoryInsightCard(
                  data: insights[index],
                  onAction: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Action: ${insights[index].actionLabel}'),
                      ),
                    );
                  },
                );
              },
            ),
            _buildTopBar(context),
          ],
        ),
        loading: () => Stack(
          children: [
            const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(color: AppTheme.primaryBlue),
                  SizedBox(height: 16),
                  Text(
                    'Generating AI Insights...',
                    style: TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            ),
            _buildTopBar(context),
          ],
        ),
        error: (error, stack) => Stack(
          children: [
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, color: Colors.red, size: 48),
                  const SizedBox(height: 16),
                  Text(
                    'Failed to load insights',
                    style: const TextStyle(color: Colors.white70),
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: () => ref.refresh(aiInsightsProvider),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
            _buildTopBar(context),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar(BuildContext context) {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () {
                  ref.read(navigationProvider.notifier).state =
                      AppRoute.dashboard;
                },
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  children: [
                    Text(
                      "Noble Clarity",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(width: 4),
                    Icon(Icons.verified, color: AppTheme.primaryBlue, size: 14),
                  ],
                ),
              ),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.white),
                onPressed: () {
                  ref.read(navigationProvider.notifier).state =
                      AppRoute.dashboard;
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

enum InsightType { critical, opportunity, info }

class InsightCardData {
  final String title;
  final String description;
  final InsightType type;
  final String? actionLabel;
  final DateTime timestamp;

  InsightCardData({
    required this.title,
    required this.description,
    required this.type,
    this.actionLabel,
    required this.timestamp,
  });
}
