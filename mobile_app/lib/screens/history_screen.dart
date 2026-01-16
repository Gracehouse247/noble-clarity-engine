import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/multi_tenant_provider.dart';
import '../models/financial_models.dart';
import '../core/app_theme.dart';
import 'package:intl/intl.dart';

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeId = ref.watch(activeProfileIdProvider);
    final profileData = ref.watch(profilesDataProvider)[activeId];
    final history = profileData?.history ?? [];

    // Sort history by date descending (newest first)
    final sortedHistory = List<FinancialData>.from(history)
      ..sort((a, b) {
        final dateA = DateTime.tryParse(a.date) ?? DateTime.now();
        final dateB = DateTime.tryParse(b.date) ?? DateTime.now();
        return dateB.compareTo(dateA);
      });

    return Scaffold(
      backgroundColor: AppTheme.backgroundDark,
      body: sortedHistory.isEmpty
          ? _buildEmptyState()
          : ListView.builder(
              padding: const EdgeInsets.all(24),
              itemCount: sortedHistory.length,
              itemBuilder: (context, index) {
                final snapshot = sortedHistory[index];
                return _buildSnapshotCard(
                  context,
                  snapshot,
                  profileData?.current,
                );
              },
            ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.history,
            size: 64,
            color: Colors.white.withValues(alpha: 0.1),
          ),
          const SizedBox(height: 16),
          const Text(
            'No snapshots saved yet',
            style: TextStyle(color: Colors.white38),
          ),
        ],
      ),
    );
  }

  Widget _buildSnapshotCard(
    BuildContext context,
    FinancialData snapshot,
    FinancialData? currentData,
  ) {
    final date = DateTime.tryParse(snapshot.date) ?? DateTime.now();
    final dateStr = DateFormat('MMM dd, yyyy • HH:mm').format(date);
    final currencyFormat = NumberFormat.compactCurrency(symbol: '\$');

    return GestureDetector(
      onTap: () => _showComparisonSheet(context, snapshot, currentData),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.history_toggle_off,
                      size: 16,
                      color: AppTheme.primaryBlue,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      dateStr,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.white70,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'COMPARE',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryBlue,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStat('Revenue', currencyFormat.format(snapshot.revenue)),
                _buildStat(
                  'Burn Rate',
                  currencyFormat.format(snapshot.operatingExpenses),
                ),
                _buildStat(
                  'Net Margin',
                  '${snapshot.netMargin.toStringAsFixed(1)}%',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: const TextStyle(fontSize: 10, color: Colors.white24),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ],
    );
  }

  void _showComparisonSheet(
    BuildContext context,
    FinancialData snapshot,
    FinancialData? current,
  ) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F172A),
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      builder: (context) =>
          _ComparisonSheet(snapshot: snapshot, current: current),
    );
  }
}

class _ComparisonSheet extends StatelessWidget {
  final FinancialData snapshot;
  final FinancialData? current;

  const _ComparisonSheet({required this.snapshot, required this.current});

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.compactCurrency(symbol: '\$');
    final date = DateTime.tryParse(snapshot.date) ?? DateTime.now();
    final dateStr = DateFormat('MMM dd, HH:mm').format(date);

    return Container(
      padding: const EdgeInsets.all(24),
      height: MediaQuery.of(context).size.height * 0.7,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Text(
            'Historical Comparison',
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Snapshot from $dateStr vs. Live Data',
            style: const TextStyle(fontSize: 14, color: Colors.white54),
          ),
          const SizedBox(height: 32),
          _buildComparisonHeader(),
          const SizedBox(height: 16),
          Expanded(
            child: ListView(
              children: [
                _buildComparisonRow(
                  'Revenue',
                  snapshot.revenue,
                  current?.revenue,
                  currencyFormat,
                ),
                _buildComparisonRow(
                  'Net Profit',
                  snapshot.netProfit,
                  current?.netProfit,
                  currencyFormat,
                ),
                _buildComparisonRow(
                  'Op. Expenses',
                  snapshot.operatingExpenses,
                  current?.operatingExpenses,
                  currencyFormat,
                  inverse: true,
                ),
                _buildComparisonRow(
                  'Cash on Hand',
                  snapshot.currentAssets,
                  current?.currentAssets,
                  currencyFormat,
                ),
                _buildComparisonRow(
                  'Marketing',
                  snapshot.marketingSpend,
                  current?.marketingSpend,
                  currencyFormat,
                ),
                _buildComparisonRow(
                  'Leads',
                  snapshot.leadsGenerated.toDouble(),
                  current?.leadsGenerated.toDouble(),
                  NumberFormat.compact(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildComparisonHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          const Expanded(
            flex: 2,
            child: Text(
              'METRIC',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: Colors.white38,
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              'OLD',
              textAlign: TextAlign.right,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: Colors.white38,
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              'LIVE',
              textAlign: TextAlign.right,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryBlue,
              ),
            ),
          ),
          const SizedBox(width: 40), // Space for indicator
        ],
      ),
    );
  }

  Widget _buildComparisonRow(
    String label,
    double oldVal,
    double? newVal,
    NumberFormat fmt, {
    bool inverse = false,
  }) {
    final currentVal = newVal ?? 0.0;
    final diff = currentVal - oldVal;
    final pct = oldVal != 0 ? (diff / oldVal) * 100 : 0.0;

    // Determine color (green for good, red for bad)
    // If inverse is true (like expenses), higher is bad (red)
    bool isPositiveOutcome = inverse ? diff < 0 : diff > 0;
    if (diff == 0) isPositiveOutcome = true; // Neutral

    final color = isPositiveOutcome ? AppTheme.profitGreen : AppTheme.lossRed;
    final icon = diff > 0
        ? Icons.arrow_upward
        : (diff < 0 ? Icons.arrow_downward : Icons.remove);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: const TextStyle(
                color: Colors.white70,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              fmt.format(oldVal),
              textAlign: TextAlign.right,
              style: const TextStyle(
                color: Colors.white54,
                fontFamily: 'RobotoMono',
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              fmt.format(currentVal),
              textAlign: TextAlign.right,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontFamily: 'RobotoMono',
              ),
            ),
          ),
          SizedBox(
            width: 40,
            child: diff == 0
                ? const Icon(Icons.remove, size: 16, color: Colors.white24)
                : Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Icon(icon, size: 12, color: color),
                      const SizedBox(width: 2),
                      Text(
                        '${pct.abs().toStringAsFixed(0)}%',
                        style: TextStyle(
                          fontSize: 10,
                          color: color,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
          ),
        ],
      ),
    );
  }
}
