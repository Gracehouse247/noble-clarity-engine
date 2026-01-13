import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../core/app_theme.dart';
import '../providers/financial_provider.dart';
import 'package:intl/intl.dart';

class SocialMediaRoiScreen extends ConsumerWidget {
  const SocialMediaRoiScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final financialDataAsync = ref.watch(financialDataProvider);
    final currencyFormat = NumberFormat.compactCurrency(symbol: '\$');

    return CustomScrollView(
      slivers: [
        financialDataAsync.when(
          data: (data) => SliverToBoxAdapter(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildPlatformOverview(data, currencyFormat),
                  const SizedBox(height: 32),
                  _buildEngagementChart(),
                  const SizedBox(height: 32),
                  const Text(
                    'PLATFORM BREAKDOWN',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white38,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildPlatformRow(
                    'TikTok Ads',
                    '4.2x ROI',
                    '\$12.5k Spent',
                    Colors.black,
                    Icons.music_note,
                  ),
                  _buildPlatformRow(
                    'LinkedIn',
                    '3.1x ROI',
                    '\$8.2k Spent',
                    const Color(0xFF0077B5),
                    Icons.business,
                  ),
                  _buildPlatformRow(
                    'Meta (Instagram)',
                    '2.8x ROI',
                    '\$15.0k Spent',
                    const Color(0xFFE4405F),
                    Icons.camera_alt,
                  ),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
          loading: () => const SliverFillRemaining(
            child: Center(
              child: CircularProgressIndicator(color: AppTheme.primaryBlue),
            ),
          ),
          error: (err, stack) => SliverFillRemaining(
            child: Center(
              child: Text(
                'Error: $err',
                style: const TextStyle(color: Colors.white),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPlatformOverview(dynamic data, NumberFormat format) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _buildQuickStat(
            'Total Spend',
            format.format(data.marketingSpend * 0.7),
          ),
          _buildQuickStat('Avg. ROI', '3.5x'),
          _buildQuickStat('Engagement', '124k'),
        ],
      ),
    );
  }

  Widget _buildQuickStat(String label, String value) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white38, fontSize: 10),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildEngagementChart() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Engagement Trends',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 180,
            child: LineChart(
              LineChartData(
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: const [
                      FlSpot(0, 10),
                      FlSpot(1, 15),
                      FlSpot(2, 13),
                      FlSpot(3, 20),
                      FlSpot(4, 18),
                      FlSpot(5, 25),
                    ],
                    isCurved: true,
                    color: AppTheme.primaryBlue,
                    dotData: const FlDotData(show: false),
                    belowBarData: BarAreaData(
                      show: true,
                      color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlatformRow(
    String name,
    String roi,
    String spent,
    Color color,
    IconData icon,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
                Text(
                  spent,
                  style: const TextStyle(color: Colors.white24, fontSize: 11),
                ),
              ],
            ),
          ),
          Text(
            roi,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: AppTheme.profitGreen,
            ),
          ),
        ],
      ),
    );
  }
}
