import 'package:flutter/material.dart';
import '../core/app_theme.dart';
import '../models/financial_models.dart';

class BenchmarkCard extends StatelessWidget {
  final FinancialData data;

  const BenchmarkCard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    if (data.benchmark == null) return const SizedBox.shrink();

    final benchmark = data.benchmark!;
    final revenueDiff =
        ((data.revenue - benchmark.avgRevenue) / benchmark.avgRevenue) * 100;

    // Calculate net margin
    final netProfit = data.revenue - data.cogs - data.operatingExpenses;
    final margin = data.revenue > 0 ? (netProfit / data.revenue) * 100 : 0.0;
    final marginDiff = margin - benchmark.avgNetMargin;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E2C),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.aiPurple.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.bar_chart,
                  color: AppTheme.aiPurple,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Benchmark Analysis',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    benchmark.cohortName,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.5),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),

          _buildComparisonRow(
            'Revenue',
            '\$${(data.revenue / 1000).toStringAsFixed(1)}k',
            '\$${(benchmark.avgRevenue / 1000).toStringAsFixed(1)}k',
            revenueDiff,
          ),
          const Divider(height: 32, color: Colors.white10),
          _buildComparisonRow(
            'Net Margin',
            '${margin.toStringAsFixed(1)}%',
            '${benchmark.avgNetMargin.toStringAsFixed(1)}%',
            marginDiff,
            isPercentage: true,
          ),
        ],
      ),
    );
  }

  Widget _buildComparisonRow(
    String label,
    String myValue,
    String peerValue,
    double diff, {
    bool isPercentage = false,
  }) {
    final isPositive = diff > 0;
    final diffText = isPercentage
        ? '${diff > 0 ? '+' : ''}${diff.toStringAsFixed(1)}%'
        : '${diff > 0 ? '+' : ''}${diff.toStringAsFixed(1)}%';

    return Row(
      children: [
        Expanded(
          flex: 2,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(color: Colors.white70, fontSize: 14),
              ),
              const SizedBox(height: 4),
              Text(
                myValue,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          flex: 3,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    'vs Peers: $peerValue',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.4),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: isPositive
                      ? AppTheme.profitGreen.withValues(alpha: 0.1)
                      : Colors.red.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  diffText,
                  style: TextStyle(
                    color: isPositive ? AppTheme.profitGreen : Colors.red,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
