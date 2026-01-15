import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../providers/financial_provider.dart';
import 'package:intl/intl.dart';

class SeoRoiScreen extends ConsumerWidget {
  const SeoRoiScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final financialDataAsync = ref.watch(financialDataProvider);
    final currencyFormat = NumberFormat.compactCurrency(symbol: '\$');

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'SEO Intelligence',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: financialDataAsync.when(
        data: (data) => SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSeoOverview(data, currencyFormat),
              const SizedBox(height: 32),
              const Text(
                'TOP PERFORMING KEYWORDS',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.white38,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 16),
              _buildKeywordRow(
                'Financial Intelligence',
                'Pos #1',
                '+12%',
                AppTheme.profitGreen,
              ),
              _buildKeywordRow(
                'SaaS ROI Calculator',
                'Pos #3',
                '+5%',
                AppTheme.profitGreen,
              ),
              _buildKeywordRow(
                'Noble Clarity Engine',
                'Pos #1',
                '0%',
                Colors.white24,
              ),
              _buildKeywordRow(
                'Predictive Analytics SME',
                'Pos #12',
                '+18%',
                AppTheme.profitGreen,
              ),

              const SizedBox(height: 32),
              _buildDomainAuthorityCard(),
              const SizedBox(height: 100),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }

  Widget _buildSeoOverview(dynamic data, NumberFormat format) {
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
          _buildQuickStat('Organic Traffic', '42.5k'),
          _buildQuickStat('Value / Lead', '\$8.40'),
          _buildQuickStat('SEO ROI', '8.2x'),
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

  Widget _buildKeywordRow(
    String keyword,
    String pos,
    String trend,
    Color trendColor,
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
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                keyword,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              Text(
                pos,
                style: const TextStyle(color: Colors.white38, fontSize: 12),
              ),
            ],
          ),
          Text(
            trend,
            style: TextStyle(fontWeight: FontWeight.bold, color: trendColor),
          ),
        ],
      ),
    );
  }

  Widget _buildDomainAuthorityCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryBlue.withValues(alpha: 0.2),
            Colors.transparent,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.primaryBlue.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Domain Authority',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'Your site authority has increased by 4 points since last month.',
            style: TextStyle(color: Colors.white54, fontSize: 13),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              const Text(
                '42',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'SCORE / 100',
                    style: TextStyle(color: Colors.white38, fontSize: 10),
                  ),
                  Text(
                    'HEALTHY',
                    style: TextStyle(
                      color: AppTheme.profitGreen,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
