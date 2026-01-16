import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../core/app_theme.dart';
import '../models/financial_models.dart';
import '../providers/financial_provider.dart';
import 'package:intl/intl.dart';
import '../core/app_router.dart';
import '../widgets/drill_down_modal.dart';
import '../widgets/benchmark_card.dart';
import '../providers/multi_tenant_provider.dart';
import '../widgets/kpi_card.dart';
import '../widgets/business_switcher.dart';
import '../widgets/dashboard_action_buttons.dart';

class DashboardHome extends ConsumerStatefulWidget {
  const DashboardHome({super.key});

  @override
  ConsumerState<DashboardHome> createState() => _DashboardHomeState();
}

class _DashboardHomeState extends ConsumerState<DashboardHome> {
  bool _hasCheckedNewUser = false;

  @override
  Widget build(BuildContext context) {
    final financialDataAsync = ref.watch(financialDataProvider);
    final profileData = ref.watch(activeProfileDataProvider);

    return SafeArea(
      bottom: false,
      child: financialDataAsync.when(
        data: (data) {
          // Auto-redirect new users to DataEntryScreen
          if (!_hasCheckedNewUser &&
              data.revenue == 0 &&
              data.currentAssets == 0) {
            _hasCheckedNewUser = true;
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (mounted) {
                ref.read(navigationProvider.notifier).state =
                    AppRoute.dataEntry;
              }
            });
          }
          return _buildDashboardContent(context, data, profileData, ref);
        },
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppTheme.primaryBlue),
        ),
        error: (err, stack) => _buildErrorState(ref),
      ),
    );
  }

  Widget _buildDashboardContent(
    BuildContext context,
    FinancialData data,
    ProfileData? profileData,
    WidgetRef ref,
  ) {
    final currencyFormat = NumberFormat.compactCurrency(symbol: '\$');

    // Derived Metrics
    final netProfit = data.revenue - data.cogs - data.operatingExpenses;
    final margin = data.revenue > 0 ? (netProfit / data.revenue) * 100 : 0.0;
    final runway = data.operatingExpenses > 0
        ? (data.currentAssets / data.operatingExpenses)
        : 0.0;

    return RefreshIndicator(
      onRefresh: () async => ref.refresh(financialDataProvider),
      color: AppTheme.primaryBlue,
      backgroundColor: const Color(0xFF13151F),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header removed as per request
            const SizedBox(height: 16),
            _buildSubHeader(),
            const SizedBox(height: 24),
            _buildActionButtons(context, ref),
            const SizedBox(height: 24),
            _buildKpiCarousel(
              data,
              profileData,
              currencyFormat,
              margin,
              runway,
            ),
            const SizedBox(height: 32),
            _buildCashFlowSection(context, data, profileData),
            const SizedBox(height: 32),
            _buildNetMarginSection(margin),
            const SizedBox(height: 32),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: BenchmarkCard(data: data),
            ),
            const SizedBox(height: 120),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorState(WidgetRef ref) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.cloud_off, color: Colors.white24, size: 64),
          const SizedBox(height: 16),
          const Text(
            'Connection timed out',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Text(
            'Verify server status at clarity.noblesworld.com.ng',
            style: TextStyle(color: Colors.white54, fontSize: 13),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => ref.refresh(financialDataProvider),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryBlue,
            ),
            child: const Text('Retry Connection'),
          ),
        ],
      ),
    );
  }

  Widget _buildSubHeader() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 24),
      child: BusinessSwitcher(),
    );
  }

  Widget _buildActionButtons(BuildContext context, WidgetRef ref) {
    return const DashboardActionButtons();
  }

  Widget _buildKpiCarousel(
    FinancialData data,
    ProfileData? profileData,
    NumberFormat format,
    double margin,
    double runway,
  ) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      physics: const BouncingScrollPhysics(),
      child: Row(
        children: [
          KpiCard(
            title: 'Revenue Run Rate',
            value: format.format(data.revenue),
            trend: _calculateRevenueTrend(data, profileData),
            isPositive: _isRevenueTrendPositive(data, profileData),
          ),
          KpiCard(
            title: 'Time Until Cash Low',
            value: '${runway.toStringAsFixed(1)} Mo.',
            trend: runway > 6 ? 'Healthy Buffer' : 'Action Needed',
            isPositive: runway > 6,
            glowColor: Colors.purple,
          ),
          KpiCard(
            title: 'Efficiency Score',
            value: '${margin.toStringAsFixed(1)}%',
            trend:
                '${(margin - (margin * 0.95)).toStringAsFixed(1)}% vs Last Mo.',
            isPositive: margin > 0,
            glowColor: AppTheme.profitGreen,
          ),
        ],
      ),
    );
  }

  Widget _buildCashFlowSection(
    BuildContext context,
    FinancialData data,
    ProfileData? profileData,
  ) {
    List<FlSpot> trendSpots = [];
    if (profileData != null && profileData.history.isNotEmpty) {
      final history = profileData.history;
      // Use last 11 months + current
      final recentHistory = history.length > 11
          ? history.sublist(history.length - 11)
          : history;

      for (int i = 0; i < recentHistory.length; i++) {
        final h = recentHistory[i];
        final netFlow = h.revenue - h.cogs - h.operatingExpenses;
        trendSpots.add(FlSpot(i.toDouble(), netFlow / 100000));
      }
      // Add current month
      final currentNetFlow = data.revenue - data.cogs - data.operatingExpenses;
      trendSpots.add(
        FlSpot(recentHistory.length.toDouble(), currentNetFlow / 100000),
      );
    } else {
      // Fallback Demo Data
      trendSpots = [
        FlSpot(0, data.revenue * 0.6 / 100000),
        FlSpot(4, data.revenue * 0.7 / 100000),
        FlSpot(8, data.revenue * 0.8 / 100000), // Scaled for demo
        FlSpot(11, data.revenue / 100000),
      ];
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: GestureDetector(
        onTap: () {
          showModalBottomSheet(
            context: context,
            backgroundColor: Colors.transparent,
            isScrollControlled: true,
            builder: (context) => DrillDownModal(
              title: 'Cash Flow Analysis',
              onExplainPressed: () {
                Navigator.pop(context);
                // In a real app, this would trigger the AI Chat with context
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('AI Coach is analyzing this chart...'),
                    backgroundColor: AppTheme.primaryBlue,
                  ),
                );
              },
              items: [
                DrillDownItem(
                  label: 'SaaS Revenue',
                  value: '\$${(data.revenue * 0.75).toStringAsFixed(0)}',
                  subLabel: 'Recurring subscriptions',
                  trend: '+12%',
                  isPositive: true,
                ),
                DrillDownItem(
                  label: 'Services Revenue',
                  value: '\$${(data.revenue * 0.25).toStringAsFixed(0)}',
                  subLabel: 'One-time implementations',
                  trend: '-5%',
                  isPositive: false,
                ),
                DrillDownItem(
                  label: 'Operating Expenses',
                  value: '\$${data.operatingExpenses.toStringAsFixed(0)}',
                  trend: '+2%',
                  isPositive: false, // Spending more isn't always good
                ),
              ],
            ),
          );
        },
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF13151F).withValues(alpha: 0.6),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Cash Flow Trend',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Text(
                            'SaaS vs Services',
                            style: TextStyle(
                              color: Colors.white54,
                              fontSize: 13,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            Icons.touch_app,
                            size: 14,
                            color: AppTheme.primaryBlue.withValues(alpha: 0.7),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Tap to drill-down',
                            style: TextStyle(
                              color: AppTheme.primaryBlue.withValues(
                                alpha: 0.7,
                              ),
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.05),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.show_chart,
                      color: Colors.white70,
                      size: 20,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              SizedBox(
                height: 200,
                child: LineChart(
                  LineChartData(
                    gridData: const FlGridData(show: false),
                    titlesData: const FlTitlesData(show: false),
                    borderData: FlBorderData(show: false),
                    lineBarsData: [
                      LineChartBarData(
                        spots: trendSpots,
                        isCurved: true,
                        color: AppTheme.primaryBlue,
                        barWidth: 4,
                        dotData: const FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                        ),
                      ),
                    ],
                    lineTouchData: LineTouchData(
                      touchTooltipData: LineTouchTooltipData(
                        getTooltipColor: (touchedSpot) =>
                            const Color(0xFF2A2D3E),
                        tooltipRoundedRadius: 8,
                        tooltipPadding: const EdgeInsets.all(8),
                        getTooltipItems: (List<LineBarSpot> touchedBarSpots) {
                          return touchedBarSpots.map((barSpot) {
                            return LineTooltipItem(
                              '\$${(barSpot.y * 100).toStringAsFixed(0)}k',
                              const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            );
                          }).toList();
                        },
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNetMarginSection(double margin) {
    bool isHealthy = margin > 15.0;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF13151F).withValues(alpha: 0.6),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
        ),
        child: Column(
          children: [
            const Text(
              'Net Margin Health',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              '${margin.toStringAsFixed(1)}%',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              isHealthy ? 'HEALTHY' : 'NEEDS OPTIMIZATION',
              style: TextStyle(
                color: isHealthy ? AppTheme.profitGreen : Colors.amber,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Calculate revenue trend from historical data
  String _calculateRevenueTrend(FinancialData data, ProfileData? profileData) {
    if (profileData == null || profileData.history.isEmpty) {
      return 'Current';
    }

    final previous = profileData.history.last;
    if (previous.revenue == 0) return 'New';

    final change = ((data.revenue - previous.revenue) / previous.revenue) * 100;
    final prefix = change >= 0 ? '+' : '';
    return '$prefix${change.toStringAsFixed(1)}%';
  }

  bool _isRevenueTrendPositive(FinancialData data, ProfileData? profileData) {
    if (profileData == null || profileData.history.isEmpty) {
      return true;
    }

    final previous = profileData.history.last;
    return data.revenue >= previous.revenue;
  }
}
