import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/multi_tenant_provider.dart';
import '../core/app_theme.dart';
import 'package:intl/intl.dart';

class ConsolidationScreen extends ConsumerWidget {
  const ConsolidationScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final consolidatedData = ref.watch(consolidatedDataProvider);
    final profiles = ref.watch(profilesProvider);
    final currencyFormat = NumberFormat.compactCurrency(symbol: '\$');

    if (consolidatedData == null) {
      return const Center(child: Text('No data to consolidate'));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTotalCard(consolidatedData, currencyFormat),
          const SizedBox(height: 32),
          const Text(
            'BUSINESS BREAKDOWN',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Colors.white38,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 16),
          ...profiles.map((p) => _buildBusinessRow(ref, p, currencyFormat)),
        ],
      ),
    );
  }

  Widget _buildTotalCard(dynamic data, NumberFormat format) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppTheme.primaryBlue, AppTheme.aiPurple],
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryBlue.withValues(alpha: 0.3),
            blurRadius: 20,
          ),
        ],
      ),
      child: Column(
        children: [
          const Text(
            'TOTAL PORTFOLIO REVENUE',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            format.format(data.revenue),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Divider(height: 32, color: Colors.white24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMiniStat('Total Assets', format.format(data.currentAssets)),
              _buildMiniStat(
                'Op. Expenses',
                format.format(data.operatingExpenses),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMiniStat(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white60, fontSize: 11),
        ),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildBusinessRow(
    WidgetRef ref,
    dynamic profile,
    NumberFormat format,
  ) {
    final profileData = ref.watch(profilesDataProvider)[profile.id];
    final revenue = profileData?.current.revenue ?? 0;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                profile.name,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              Text(
                profile.industry,
                style: const TextStyle(color: Colors.white24, fontSize: 11),
              ),
            ],
          ),
          Text(
            format.format(revenue),
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
