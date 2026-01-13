import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../core/app_theme.dart';
import '../providers/financial_provider.dart';
import 'package:intl/intl.dart';

class EmailMarketingRoiScreen extends ConsumerWidget {
  const EmailMarketingRoiScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final financialDataAsync = ref.watch(financialDataProvider);
    final currencyFormat = NumberFormat.simpleCurrency(decimalDigits: 0);

    return CustomScrollView(
      slivers: [
        financialDataAsync.when(
          data: (data) => SliverToBoxAdapter(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeroMetric(data, currencyFormat),
                  const SizedBox(height: 32),
                  _buildProfitabilityChart(),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(child: _buildLtvCard()),
                      const SizedBox(width: 16),
                      Expanded(child: _buildHealthCard()),
                    ],
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    'RECENT CAMPAIGNS',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white38,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildCampaignCard(
                    'Black Friday Teaser',
                    'COMPLETED',
                    '42.5%',
                    '8.2%',
                    '450%',
                  ),
                  _buildCampaignCard(
                    'Welcome Series Drip',
                    'ACTIVE',
                    '68.1%',
                    '12.4%',
                    '120%',
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

  Widget _buildHeroMetric(dynamic data, NumberFormat format) {
    return Center(
      child: Column(
        children: [
          Text(
            format.format(data.revenue * 0.12), // Simulated email revenue
            style: const TextStyle(
              color: Colors.white,
              fontSize: 36,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Total Email Revenue',
                style: TextStyle(color: Colors.white60, fontSize: 14),
              ),
              SizedBox(width: 8),
              Icon(Icons.arrow_upward, color: AppTheme.primaryBlue, size: 14),
              Text(
                '12%',
                style: TextStyle(
                  color: AppTheme.primaryBlue,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildProfitabilityChart() {
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
            'Campaign Profitability',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          const Text(
            'Revenue vs Cost (Last 3 Mo)',
            style: TextStyle(color: Colors.white24, fontSize: 11),
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 150,
            child: BarChart(
              BarChartData(
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                barGroups: [
                  _makeGroupData(0, 40, 65),
                  _makeGroupData(1, 45, 75),
                  _makeGroupData(2, 50, 90),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  BarChartGroupData _makeGroupData(int x, double cost, double rev) {
    return BarChartGroupData(
      x: x,
      barRods: [
        BarChartRodData(
          toY: cost,
          color: Colors.white.withValues(alpha: 0.1),
          width: 12,
        ),
        BarChartRodData(toY: rev, color: AppTheme.primaryBlue, width: 12),
      ],
    );
  }

  Widget _buildLtvCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('LTV', style: TextStyle(color: Colors.white60, fontSize: 12)),
          SizedBox(height: 8),
          Text(
            '\$52.40',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 16),
          Text(
            '+15% vs Avg',
            style: TextStyle(
              color: AppTheme.primaryBlue,
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHealthCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'List Health',
            style: TextStyle(color: Colors.white60, fontSize: 12),
          ),
          SizedBox(height: 8),
          Text(
            '92%',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 16),
          Text(
            'ACTIVE',
            style: TextStyle(
              color: AppTheme.profitGreen,
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCampaignCard(
    String title,
    String status,
    String open,
    String ctr,
    String roi,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  status,
                  style: const TextStyle(
                    color: AppTheme.primaryBlue,
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildCampaignStat('OPEN RATE', open),
              _buildCampaignStat('CTR', ctr),
              _buildCampaignStat('ROI', roi, isPrimary: true),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCampaignStat(
    String label,
    String value, {
    bool isPrimary = false,
  }) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 9, color: Colors.white24)),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: isPrimary ? AppTheme.primaryBlue : Colors.white,
          ),
        ),
      ],
    );
  }
}
