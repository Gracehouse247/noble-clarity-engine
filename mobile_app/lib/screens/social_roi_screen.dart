import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../core/app_theme.dart';
import '../core/app_router.dart';
import '../models/social_roi_models.dart';
import '../providers/social_roi_provider.dart';
import '../providers/multi_tenant_provider.dart';
import '../providers/integrations_provider.dart';
import '../services/pdf_service.dart';
import '../widgets/social_roi_ai_coach.dart' as social_ai;

class SocialMediaRoiScreen extends ConsumerWidget {
  const SocialMediaRoiScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final roiState = ref.watch(socialRoiProvider);
    final activeProfile = ref.watch(activeProfileProvider);
    final currencySymbol = activeProfile?.currency == 'NGN' ? '₦' : '\$';
    final currencyFormat = NumberFormat.currency(
      symbol: currencySymbol,
      decimalDigits: 0,
    );

    return Scaffold(
      backgroundColor: const Color(0xFF0A0E1A),
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        leading: Container(
          margin: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
          ),
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.primaryBlue.withValues(alpha: 0.2),
                    AppTheme.accentBlue.withValues(alpha: 0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.analytics,
                color: AppTheme.primaryBlue,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Social Media ROI',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  'Intelligence Dashboard',
                  style: TextStyle(
                    color: Colors.white38,
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          // PDF Export
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [AppTheme.primaryBlue, AppTheme.accentBlue],
              ),
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: IconButton(
              icon: const Icon(
                Icons.picture_as_pdf,
                color: Colors.white,
                size: 20,
              ),
              onPressed: () => _exportToPdf(context, roiState, currencyFormat),
              tooltip: 'Export Intelligence Report',
            ),
          ),
          // Timeframe Selector
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: DropdownButton<String>(
              value: roiState.timeframe,
              dropdownColor: const Color(0xFF1E293B),
              underline: const SizedBox(),
              icon: const Icon(
                Icons.keyboard_arrow_down,
                color: AppTheme.primaryBlue,
                size: 18,
              ),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
              items: ['Monthly', 'Quarterly', 'Annually'].map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) {
                  ref.read(socialRoiProvider.notifier).setTimeframe(val);
                }
              },
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      floatingActionButton: roiState.platforms.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: () => _showAiCoachForSocialROI(context, ref, roiState),
              backgroundColor: AppTheme.primaryBlue,
              icon: const Icon(Icons.psychology, color: Colors.white),
              label: const Text(
                'AI Marketing Coach',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            )
          : null,
      body: Stack(
        children: [
          // Background Glows
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.primaryBlue.withValues(alpha: 0.1),
              ),
            ),
          ),
          Positioned(
            bottom: 200,
            left: -100,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.purple.withValues(alpha: 0.05),
              ),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  const Color(0xFF0A0E1A),
                  const Color(0xFF1A1F2E),
                  AppTheme.primaryBlue.withValues(alpha: 0.05),
                ],
              ),
            ),
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 120, 20, 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Hero ROI Card
                  _buildHeroRoiCard(roiState, currencyFormat),
                  const SizedBox(height: 16),

                  // KPI Grid
                  _buildKpiGrid(roiState, currencyFormat),
                  const SizedBox(height: 16),

                  // Charts Section
                  _buildChartsSection(roiState, currencyFormat),
                  const SizedBox(height: 16),

                  // AI-Powered Analysis
                  _buildAnalysisText(roiState, currencyFormat),
                  const SizedBox(height: 16),

                  // Channel Efficiency
                  if (roiState.platforms.isNotEmpty) ...[
                    _buildChannelEfficiencyChart(roiState),
                    const SizedBox(height: 16),
                  ],

                  // Input Parameters
                  _buildSectionHeader('Configuration', Icons.tune),
                  const SizedBox(height: 16),
                  _buildInputCard(
                    context,
                    'Overhead Costs',
                    Icons.account_balance_wallet_outlined,
                    currencyFormat.format(roiState.overheads.total),
                    () => _showOverheadsSheet(context, ref, roiState.overheads),
                    AppTheme.primaryBlue,
                  ),
                  const SizedBox(height: 12),
                  _buildInputCard(
                    context,
                    'Brand Equity',
                    Icons.trending_up,
                    currencyFormat.format(roiState.brandEquity.totalValue),
                    () => _showBrandEquitySheet(
                      context,
                      ref,
                      roiState.brandEquity,
                    ),
                    AppTheme.accentBlue,
                  ),

                  const SizedBox(height: 16),

                  // Platforms Section
                  _buildPlatformsSection(
                    context,
                    ref,
                    roiState,
                    currencyFormat,
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showAiCoachForSocialROI(
    BuildContext context,
    WidgetRef ref,
    SocialRoiState state,
  ) {
    // Create a context-rich prompt for the AI Coach
    final platformSummary = state.platforms
        .map((p) {
          return '${p.name}: ROI ${p.roi.toStringAsFixed(1)}%, Spend \$${p.totalCost.toStringAsFixed(0)}, Revenue \$${p.totalValue.toStringAsFixed(0)}';
        })
        .join('; ');

    final contextPrompt =
        '''
You are an expert digital marketing strategist analyzing social media ROI data.

CURRENT PERFORMANCE:
- Overall Social ROI: ${state.socialRoi.toStringAsFixed(1)}%
- Total Investment: \$${state.totalInvestment.toStringAsFixed(0)}
- Total Value Generated: \$${state.totalValueGenerated.toStringAsFixed(0)}
- Net Profit: \$${state.netProfit.toStringAsFixed(0)}
- Timeframe: ${state.timeframe}

PLATFORM BREAKDOWN:
$platformSummary

OVERHEADS:
- Team Hours: ${state.overheads.teamHours}h @ \$${state.overheads.hourlyRate}/hr
- Tool Costs: \$${state.overheads.toolCosts}

BRAND EQUITY:
- New Followers: ${state.brandEquity.newFollowers} (valued at \$${state.brandEquity.valuePerFollower} each)
- Engagements: ${state.brandEquity.totalEngagements} (valued at \$${state.brandEquity.valuePerEngagement} each)

Provide actionable insights on:
1. Which platforms to scale or pause
2. Budget reallocation recommendations
3. ROI optimization strategies
4. Industry benchmarking (if applicable)
5. Specific tactics to improve underperforming channels

Be direct, data-driven, and focused on profit maximization.
''';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: Color(0xFF0F172A),
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.primaryBlue.withValues(alpha: 0.2),
                    AppTheme.primaryBlue.withValues(alpha: 0.05),
                  ],
                ),
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(24),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.psychology,
                      color: AppTheme.primaryBlue,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'AI Marketing Coach',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Expert Social Media ROI Analysis',
                          style: TextStyle(color: Colors.white54, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white54),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            // AI Coach Content
            Expanded(
              child: social_ai.SocialROIAiCoach(
                contextPrompt: contextPrompt,
                state: state,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroRoiCard(SocialRoiState state, NumberFormat format) {
    final isPositive = state.socialRoi >= 0;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isPositive
              ? [
                  AppTheme.profitGreen.withValues(alpha: 0.15),
                  AppTheme.profitGreen.withValues(alpha: 0.05),
                ]
              : [
                  AppTheme.lossRed.withValues(alpha: 0.15),
                  AppTheme.lossRed.withValues(alpha: 0.05),
                ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: (isPositive ? AppTheme.profitGreen : AppTheme.lossRed)
              .withValues(alpha: 0.2),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: (isPositive ? AppTheme.profitGreen : AppTheme.lossRed)
                .withValues(alpha: 0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: (isPositive ? AppTheme.profitGreen : AppTheme.lossRed)
                      .withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  isPositive ? Icons.trending_up : Icons.trending_down,
                  color: isPositive ? AppTheme.profitGreen : AppTheme.lossRed,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'SOCIAL MEDIA ROI',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: Colors.white.withValues(alpha: 0.5),
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      state.timeframe,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.white54,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${state.socialRoi.toStringAsFixed(1)}%',
                style: TextStyle(
                  fontSize: 48,
                  fontWeight: FontWeight.bold,
                  color: isPositive ? AppTheme.profitGreen : AppTheme.lossRed,
                  height: 1,
                ),
              ),
              const SizedBox(width: 12),
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color:
                        (isPositive ? AppTheme.profitGreen : AppTheme.lossRed)
                            .withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    isPositive ? 'PROFITABLE' : 'LOSS',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: isPositive
                          ? AppTheme.profitGreen
                          : AppTheme.lossRed,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.03),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildMiniStat(
                  'Investment',
                  format.format(state.totalInvestment),
                  Icons.arrow_downward,
                  AppTheme.lossRed,
                ),
                Container(
                  width: 1,
                  height: 40,
                  color: Colors.white.withValues(alpha: 0.1),
                ),
                _buildMiniStat(
                  'Value',
                  format.format(state.totalValueGenerated),
                  Icons.arrow_upward,
                  AppTheme.profitGreen,
                ),
                Container(
                  width: 1,
                  height: 40,
                  color: Colors.white.withValues(alpha: 0.1),
                ),
                _buildMiniStat(
                  'Net',
                  format.format(state.netProfit),
                  Icons.account_balance_wallet,
                  isPositive ? AppTheme.profitGreen : AppTheme.lossRed,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniStat(
    String label,
    String value,
    IconData icon,
    Color color,
  ) {
    return Expanded(
      child: Column(
        children: [
          Icon(icon, size: 16, color: color.withValues(alpha: 0.7)),
          const SizedBox(height: 8),
          Text(
            label.toUpperCase(),
            style: const TextStyle(
              fontSize: 9,
              color: Colors.white38,
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: color,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildKpiGrid(SocialRoiState state, NumberFormat format) {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.4,
      children: [
        _buildGlassKpiCard(
          'Platform Spend',
          format.format(state.totalPlatformSpend),
          Icons.campaign,
          AppTheme.primaryBlue,
          'Direct ad costs',
        ),
        _buildGlassKpiCard(
          'Direct Value',
          format.format(state.totalDirectValue),
          Icons.monetization_on,
          AppTheme.profitGreen,
          'Sales + Leads',
        ),
        _buildGlassKpiCard(
          'Overheads',
          format.format(state.overheads.total),
          Icons.settings,
          const Color(0xFFF59E0B),
          'Team + Tools',
        ),
        _buildGlassKpiCard(
          'Brand Equity',
          format.format(state.brandEquity.totalValue),
          Icons.star,
          const Color(0xFF8B5CF6),
          'Estimated value',
        ),
      ],
    );
  }

  Widget _buildGlassKpiCard(
    String label,
    String value,
    IconData icon,
    Color color,
    String subtitle,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withValues(alpha: 0.08),
            Colors.white.withValues(alpha: 0.03),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.1),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, size: 18, color: color),
              ),
              const Spacer(),
            ],
          ),
          const Spacer(),
          Text(
            label.toUpperCase(),
            style: const TextStyle(
              fontSize: 10,
              color: Colors.white38,
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(fontSize: 9, color: Colors.white24),
          ),
        ],
      ),
    );
  }

  Widget _buildChartsSection(SocialRoiState state, NumberFormat format) {
    final investmentData = [
      PieChartSectionData(
        value: state.overheads.total,
        color: const Color(0xFF00AEEF),
        radius: 18,
        title:
            '${((state.overheads.total / state.totalInvestment) * 100).toStringAsFixed(0)}%',
        titleStyle: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
      PieChartSectionData(
        value: state.totalPlatformSpend,
        color: const Color(0xFFF59E0B),
        radius: 18,
        title:
            '${((state.totalPlatformSpend / state.totalInvestment) * 100).toStringAsFixed(0)}%',
        titleStyle: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    ];

    final valueData = [
      PieChartSectionData(
        value: state.totalDirectValue,
        color: const Color(0xFF10B981),
        radius: 18,
        title:
            '${((state.totalDirectValue / state.totalValueGenerated) * 100).toStringAsFixed(0)}%',
        titleStyle: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
      PieChartSectionData(
        value: state.brandEquity.totalValue,
        color: const Color(0xFF8B5CF6),
        radius: 18,
        title:
            '${((state.brandEquity.totalValue / state.totalValueGenerated) * 100).toStringAsFixed(0)}%',
        titleStyle: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    ];

    final hasInvest = state.totalInvestment > 0;
    final hasValue = state.totalValueGenerated > 0;

    return Row(
      children: [
        Expanded(
          child: _buildEnhancedPieChart(
            'Cost Structure',
            hasInvest ? investmentData : [],
            [
              {'label': 'Overheads', 'color': const Color(0xFF00AEEF)},
              {'label': 'Ad Spend', 'color': const Color(0xFFF59E0B)},
            ],
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildEnhancedPieChart(
            'Value Sources',
            hasValue ? valueData : [],
            [
              {'label': 'Direct', 'color': const Color(0xFF10B981)},
              {'label': 'Brand', 'color': const Color(0xFF8B5CF6)},
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildEnhancedPieChart(
    String title,
    List<PieChartSectionData> sections,
    List<Map<String, dynamic>> legend,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withValues(alpha: 0.06),
            Colors.white.withValues(alpha: 0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        children: [
          Text(
            title.toUpperCase(),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 140,
            child: sections.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.pie_chart_outline,
                          size: 40,
                          color: Colors.white.withValues(alpha: 0.1),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'No data',
                          style: TextStyle(color: Colors.white24, fontSize: 11),
                        ),
                      ],
                    ),
                  )
                : PieChart(
                    PieChartData(
                      sections: sections,
                      centerSpaceRadius: 30,
                      sectionsSpace: 3,
                    ),
                  ),
          ),
          const SizedBox(height: 16),
          ...legend.map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: item['color'],
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    item['label'],
                    style: const TextStyle(color: Colors.white54, fontSize: 11),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnalysisText(SocialRoiState state, NumberFormat format) {
    final directPercentage = state.totalValueGenerated > 0
        ? (state.totalDirectValue / state.totalValueGenerated * 100)
              .toStringAsFixed(0)
        : '0';
    final brandPercentage = state.totalValueGenerated > 0
        ? (state.brandEquity.totalValue / state.totalValueGenerated * 100)
              .toStringAsFixed(0)
        : '0';

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primaryBlue.withValues(alpha: 0.08),
            AppTheme.accentBlue.withValues(alpha: 0.03),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.primaryBlue.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.auto_awesome,
                  color: AppTheme.primaryBlue,
                  size: 16,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'AI-POWERED INSIGHTS',
                style: TextStyle(
                  color: AppTheme.primaryBlue,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          RichText(
            text: TextSpan(
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 14,
                height: 1.7,
                fontWeight: FontWeight.w400,
              ),
              children: [
                TextSpan(
                  text:
                      'For this ${state.timeframe.toLowerCase()} period, your social media investment of ',
                ),
                TextSpan(
                  text: format.format(state.totalInvestment),
                  style: const TextStyle(
                    color: AppTheme.lossRed,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const TextSpan(text: ' generated '),
                TextSpan(
                  text: format.format(state.totalValueGenerated),
                  style: const TextStyle(
                    color: AppTheme.profitGreen,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const TextSpan(text: ' in total value. '),
                if (state.netProfit >= 0)
                  TextSpan(
                    children: [
                      const TextSpan(text: 'This resulted in a '),
                      TextSpan(
                        text: 'Net Profit of ${format.format(state.netProfit)}',
                        style: const TextStyle(
                          color: AppTheme.profitGreen,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const TextSpan(text: '.'),
                    ],
                  )
                else
                  TextSpan(
                    children: [
                      const TextSpan(text: 'This resulted in a '),
                      TextSpan(
                        text:
                            'Net Loss of ${format.format(state.netProfit.abs())}',
                        style: const TextStyle(
                          color: AppTheme.lossRed,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const TextSpan(text: '.'),
                    ],
                  ),
                const TextSpan(text: '\n\nDirect sales and leads contributed '),
                TextSpan(
                  text: '$directPercentage%',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const TextSpan(
                  text:
                      ' of total value, while estimated brand equity contributed ',
                ),
                TextSpan(
                  text: '$brandPercentage%',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const TextSpan(text: '.'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChannelEfficiencyChart(SocialRoiState state) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withValues(alpha: 0.06),
            Colors.white.withValues(alpha: 0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.profitGreen.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.bar_chart,
                  color: AppTheme.profitGreen,
                  size: 16,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'CHANNEL EFFICIENCY',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 220,
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceAround,
                maxY:
                    state.platforms
                        .map((p) => p.roi)
                        .reduce((a, b) => a > b ? a : b) +
                    20,
                minY:
                    state.platforms
                        .map((p) => p.roi)
                        .reduce((a, b) => a < b ? a : b) -
                    20,
                barTouchData: BarTouchData(
                  touchTooltipData: BarTouchTooltipData(
                    getTooltipColor: (_) => AppTheme.primaryBlue,
                    getTooltipItem: (group, groupIndex, rod, rodIndex) {
                      return BarTooltipItem(
                        '${state.platforms[groupIndex].name}\n${rod.toY.toStringAsFixed(1)}%',
                        const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      );
                    },
                  ),
                ),
                titlesData: FlTitlesData(
                  show: true,
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        if (value.toInt() >= 0 &&
                            value.toInt() < state.platforms.length) {
                          return Padding(
                            padding: const EdgeInsets.only(top: 10),
                            child: Text(
                              state.platforms[value.toInt()].name,
                              style: const TextStyle(
                                color: Colors.white54,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          );
                        }
                        return const SizedBox();
                      },
                    ),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 45,
                      getTitlesWidget: (value, meta) {
                        return Text(
                          '${value.toInt()}%',
                          style: const TextStyle(
                            color: Colors.white38,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        );
                      },
                    ),
                  ),
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: 20,
                  getDrawingHorizontalLine: (value) {
                    return FlLine(
                      color: Colors.white.withValues(alpha: 0.05),
                      strokeWidth: 1,
                    );
                  },
                ),
                borderData: FlBorderData(show: false),
                barGroups: state.platforms.asMap().entries.map((entry) {
                  final index = entry.key;
                  final platform = entry.value;
                  return BarChartGroupData(
                    x: index,
                    barRods: [
                      BarChartRodData(
                        toY: platform.roi,
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: platform.roi >= 0
                              ? [
                                  AppTheme.profitGreen.withValues(alpha: 0.6),
                                  AppTheme.profitGreen,
                                ]
                              : [
                                  AppTheme.lossRed.withValues(alpha: 0.6),
                                  AppTheme.lossRed,
                                ],
                        ),
                        width: 24,
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(6),
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppTheme.primaryBlue.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: AppTheme.primaryBlue, size: 16),
        ),
        const SizedBox(width: 12),
        Text(
          title.toUpperCase(),
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: Colors.white,
            letterSpacing: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildInputCard(
    BuildContext context,
    String title,
    IconData icon,
    String value,
    VoidCallback onTap,
    Color accentColor,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.white.withValues(alpha: 0.08),
              Colors.white.withValues(alpha: 0.03),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: accentColor.withValues(alpha: 0.2)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: accentColor.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: accentColor, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    value,
                    style: TextStyle(
                      color: accentColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              size: 14,
              color: accentColor.withValues(alpha: 0.5),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlatformsSection(
    BuildContext context,
    WidgetRef ref,
    SocialRoiState state,
    NumberFormat format,
  ) {
    final connectedPlatforms = ref.watch(connectedPlatformsProvider);
    final hasConnectedSocial = connectedPlatforms.entries.any(
      (e) => e.value && (e.key.contains('Ads') || e.key == 'Mailchimp'),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildSectionHeader('Platforms', Icons.campaign),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.profitGreen,
                    AppTheme.profitGreen.withValues(alpha: 0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.profitGreen.withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextButton.icon(
                onPressed: () =>
                    ref.read(socialRoiProvider.notifier).addPlatform(),
                icon: const Icon(Icons.add, size: 16, color: Colors.white),
                label: const Text(
                  'Add Platform',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        if (state.platforms.isEmpty)
          _buildQuickStartSection(context, ref, hasConnectedSocial)
        else ...[
          ...state.platforms.map(
            (p) => _buildPlatformCard(context, ref, p, format),
          ),

          // Show import option even when platforms exist
          if (hasConnectedSocial) ...[
            const SizedBox(height: 16),
            _buildImportCard(context, ref),
          ],
        ],
      ],
    );
  }

  Widget _buildQuickStartSection(
    BuildContext context,
    WidgetRef ref,
    bool hasConnectedSocial,
  ) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primaryBlue.withValues(alpha: 0.08),
            AppTheme.accentBlue.withValues(alpha: 0.03),
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.primaryBlue.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.primaryBlue.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.rocket_launch,
              size: 40,
              color: AppTheme.primaryBlue,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Quick Start Your ROI Analysis',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          const Text(
            'Choose how you want to get started:',
            style: TextStyle(color: Colors.white54, fontSize: 14),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),

          // Option 1: Load Example Data
          _buildQuickStartOption(
            icon: Icons.auto_awesome,
            title: 'Load Example Data (Demo)',
            subtitle: 'See how calculations work with sample platforms',
            color: const Color(0xFFF59E0B), // Orange to indicate it's not real
            onTap: () {
              ref.read(socialRoiProvider.notifier).loadDemoData();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Row(
                    children: [
                      const Icon(
                        Icons.info_outline,
                        color: Colors.white,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Text(
                          '📊 Example data loaded! Replace with your real numbers for accurate ROI.',
                        ),
                      ),
                    ],
                  ),
                  backgroundColor: const Color(0xFFF59E0B),
                  behavior: SnackBarBehavior.floating,
                  duration: const Duration(seconds: 4),
                ),
              );
            },
          ),

          const SizedBox(height: 16),

          // Option 2: Import from Connected Platforms
          if (hasConnectedSocial)
            _buildQuickStartOption(
              icon: Icons.cloud_download,
              title: 'Import from Connected Platforms',
              subtitle: 'Auto-fill data from your ad accounts',
              color: AppTheme.primaryBlue,
              onTap: () {
                final connectedPlatforms = ref.read(connectedPlatformsProvider);
                ref
                    .read(socialRoiProvider.notifier)
                    .importFromConnectedPlatforms(connectedPlatforms);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('📊 Data imported from connected platforms!'),
                    backgroundColor: AppTheme.primaryBlue,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
            )
          else
            _buildQuickStartOption(
              icon: Icons.link,
              title: 'Connect Ad Platforms First',
              subtitle: 'Link Facebook, Instagram, LinkedIn, TikTok',
              color: Colors.white.withValues(alpha: 0.3),
              onTap: () {
                ref.read(navigationProvider.notifier).state =
                    AppRoute.integrations;
              },
            ),

          const SizedBox(height: 16),

          // Option 3: Manual Entry
          _buildQuickStartOption(
            icon: Icons.edit,
            title: 'Manual Entry',
            subtitle: 'Add platforms and input data yourself',
            color: AppTheme.accentBlue,
            onTap: () {
              ref.read(socialRoiProvider.notifier).addPlatform();
            },
          ),

          const SizedBox(height: 24),

          // Help text
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.03),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline, size: 16, color: Colors.white38),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Tip: Start with demo data to understand the metrics, then replace with your actual numbers.',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.6),
                      fontSize: 11,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStartOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color.withValues(alpha: 0.15),
                color.withValues(alpha: 0.05),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: color.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: color.withValues(alpha: 0.5),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildImportCard(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primaryBlue.withValues(alpha: 0.08),
            AppTheme.primaryBlue.withValues(alpha: 0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.primaryBlue.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppTheme.primaryBlue.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(
              Icons.cloud_download,
              color: AppTheme.primaryBlue,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Import More Platforms',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Pull data from connected ad accounts',
                  style: TextStyle(color: Colors.white54, fontSize: 12),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: () {
              final connectedPlatforms = ref.read(connectedPlatformsProvider);
              ref
                  .read(socialRoiProvider.notifier)
                  .importFromConnectedPlatforms(connectedPlatforms);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('📊 Data imported successfully!'),
                  backgroundColor: AppTheme.primaryBlue,
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
            child: const Text(
              'IMPORT',
              style: TextStyle(
                color: AppTheme.primaryBlue,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlatformCard(
    BuildContext context,
    WidgetRef ref,
    SocialPlatformData platform,
    NumberFormat format,
  ) {
    final isPositive = platform.roi >= 0;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withValues(alpha: 0.06),
            Colors.white.withValues(alpha: 0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: (isPositive ? AppTheme.profitGreen : AppTheme.lossRed)
              .withValues(alpha: 0.2),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showPlatformEditSheet(context, ref, platform),
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color:
                            (isPositive
                                    ? AppTheme.profitGreen
                                    : AppTheme.lossRed)
                                .withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        isPositive ? Icons.trending_up : Icons.trending_down,
                        color: isPositive
                            ? AppTheme.profitGreen
                            : AppTheme.lossRed,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            platform.name,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'ROI: ${platform.roi.toStringAsFixed(1)}%',
                            style: TextStyle(
                              color: isPositive
                                  ? AppTheme.profitGreen
                                  : AppTheme.lossRed,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      Icons.arrow_forward_ios,
                      size: 14,
                      color: Colors.white.withValues(alpha: 0.3),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.03),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildPlatformStat(
                        'Spend',
                        format.format(platform.totalCost),
                        Icons.payments,
                      ),
                      Container(
                        width: 1,
                        height: 40,
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                      _buildPlatformStat(
                        'Revenue',
                        format.format(platform.totalValue),
                        Icons.attach_money,
                      ),
                      Container(
                        width: 1,
                        height: 40,
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                      _buildPlatformStat(
                        'Profit',
                        format.format(platform.netProfit),
                        Icons.account_balance_wallet,
                        color: platform.netProfit >= 0
                            ? AppTheme.profitGreen
                            : AppTheme.lossRed,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPlatformStat(
    String label,
    String value,
    IconData icon, {
    Color? color,
  }) {
    return Expanded(
      child: Column(
        children: [
          Icon(
            icon,
            size: 16,
            color: (color ?? Colors.white).withValues(alpha: 0.5),
          ),
          const SizedBox(height: 8),
          Text(
            label.toUpperCase(),
            style: const TextStyle(
              color: Colors.white24,
              fontSize: 9,
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: color ?? Colors.white70,
              fontSize: 13,
              fontWeight: FontWeight.bold,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  // Bottom Sheets (keeping existing logic, just updating styles)

  void _showOverheadsSheet(
    BuildContext context,
    WidgetRef ref,
    SocialOverheads data,
  ) {
    final hoursCtrl = TextEditingController(text: data.teamHours.toString());
    final rateCtrl = TextEditingController(text: data.hourlyRate.toString());
    final toolsCtrl = TextEditingController(text: data.toolCosts.toString());

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom,
          left: 24,
          right: 24,
          top: 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryBlue.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.settings,
                    color: AppTheme.primaryBlue,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                const Text(
                  'Edit Overheads',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            _buildTextField('Team Hours', hoursCtrl, isDecimal: true),
            _buildTextField('Hourly Rate', rateCtrl, isDecimal: true),
            _buildTextField('Tool Costs', toolsCtrl, isDecimal: true),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryBlue,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () {
                  ref
                      .read(socialRoiProvider.notifier)
                      .updateOverheads(
                        data.copyWith(
                          teamHours: double.tryParse(hoursCtrl.text),
                          hourlyRate: double.tryParse(rateCtrl.text),
                          toolCosts: double.tryParse(toolsCtrl.text),
                        ),
                      );
                  Navigator.pop(ctx);
                },
                child: const Text(
                  'Save Overheads',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  void _showBrandEquitySheet(
    BuildContext context,
    WidgetRef ref,
    BrandEquity data,
  ) {
    final followersCtrl = TextEditingController(
      text: data.newFollowers.toString(),
    );
    final valFollowerCtrl = TextEditingController(
      text: data.valuePerFollower.toString(),
    );
    final engageCtrl = TextEditingController(
      text: data.totalEngagements.toString(),
    );
    final valEngageCtrl = TextEditingController(
      text: data.valuePerEngagement.toString(),
    );

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom,
          left: 24,
          right: 24,
          top: 24,
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.accentBlue.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.trending_up,
                      color: AppTheme.accentBlue,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Edit Brand Equity',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              _buildTextField('New Followers', followersCtrl, isDecimal: false),
              _buildTextField(
                'Value per Follower',
                valFollowerCtrl,
                isDecimal: true,
              ),
              _buildTextField(
                'Total Engagements',
                engageCtrl,
                isDecimal: false,
              ),
              _buildTextField(
                'Value per Engagement',
                valEngageCtrl,
                isDecimal: true,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.accentBlue,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () {
                    ref
                        .read(socialRoiProvider.notifier)
                        .updateBrandEquity(
                          data.copyWith(
                            newFollowers: int.tryParse(followersCtrl.text),
                            valuePerFollower: double.tryParse(
                              valFollowerCtrl.text,
                            ),
                            totalEngagements: int.tryParse(engageCtrl.text),
                            valuePerEngagement: double.tryParse(
                              valEngageCtrl.text,
                            ),
                          ),
                        );
                    Navigator.pop(ctx);
                  },
                  child: const Text(
                    'Save Equity',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  void _showPlatformEditSheet(
    BuildContext context,
    WidgetRef ref,
    SocialPlatformData data,
  ) {
    final nameCtrl = TextEditingController(text: data.name);
    final adSpendCtrl = TextEditingController(text: data.adSpend.toString());
    final contentCtrl = TextEditingController(
      text: data.contentCost.toString(),
    );
    final influencerCtrl = TextEditingController(
      text: data.influencerCost.toString(),
    );
    final clicksCtrl = TextEditingController(
      text: data.websiteClicks.toString(),
    );
    final convCtrl = TextEditingController(
      text: data.websiteConversionRate.toString(),
    );
    final aovCtrl = TextEditingController(text: data.aov.toString());
    final leadsCtrl = TextEditingController(
      text: data.leadsGenerated.toString(),
    );
    final leadConvCtrl = TextEditingController(
      text: data.leadToCustomerRate.toString(),
    );
    final ltvCtrl = TextEditingController(text: data.ltv.toString());

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (_, scrollController) => ListView(
          controller: scrollController,
          padding: const EdgeInsets.all(24),
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryBlue.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        Icons.campaign,
                        color: AppTheme.primaryBlue,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'Edit Platform',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: AppTheme.lossRed),
                  onPressed: () {
                    ref
                        .read(socialRoiProvider.notifier)
                        .removePlatform(data.id);
                    Navigator.pop(ctx);
                  },
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildTextField('Platform Name', nameCtrl, isDecimal: false),
            const SizedBox(height: 16),
            const Text(
              'COSTS',
              style: TextStyle(
                color: Colors.white38,
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 8),
            _buildTextField('Ad Spend', adSpendCtrl, isDecimal: true),
            _buildTextField('Content Cost', contentCtrl, isDecimal: true),
            _buildTextField('Influencer Cost', influencerCtrl, isDecimal: true),
            const SizedBox(height: 16),
            const Text(
              'WEBSITE METRICS',
              style: TextStyle(
                color: Colors.white38,
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 8),
            _buildTextField('Clicks', clicksCtrl, isDecimal: false),
            _buildTextField('Conversion Rate (%)', convCtrl, isDecimal: true),
            _buildTextField('Avg Order Value (AOV)', aovCtrl, isDecimal: true),
            const SizedBox(height: 16),
            const Text(
              'LEAD METRICS',
              style: TextStyle(
                color: Colors.white38,
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 8),
            _buildTextField('Leads Generated', leadsCtrl, isDecimal: false),
            _buildTextField(
              'Lead-to-Customer Rate (%)',
              leadConvCtrl,
              isDecimal: true,
            ),
            _buildTextField('Lifetime Value (LTV)', ltvCtrl, isDecimal: true),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryBlue,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () {
                  ref
                      .read(socialRoiProvider.notifier)
                      .updatePlatform(
                        data.copyWith(
                          name: nameCtrl.text,
                          adSpend: double.tryParse(adSpendCtrl.text),
                          contentCost: double.tryParse(contentCtrl.text),
                          influencerCost: double.tryParse(influencerCtrl.text),
                          websiteClicks: int.tryParse(clicksCtrl.text),
                          websiteConversionRate: double.tryParse(convCtrl.text),
                          aov: double.tryParse(aovCtrl.text),
                          leadsGenerated: int.tryParse(leadsCtrl.text),
                          leadToCustomerRate: double.tryParse(
                            leadConvCtrl.text,
                          ),
                          ltv: double.tryParse(ltvCtrl.text),
                        ),
                      );
                  Navigator.pop(ctx);
                },
                child: const Text(
                  'Update Platform',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _exportToPdf(
    BuildContext context,
    SocialRoiState state,
    NumberFormat format,
  ) async {
    try {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.white,
                ),
              ),
              SizedBox(width: 16),
              Text('Generating Intelligence Report...'),
            ],
          ),
          backgroundColor: AppTheme.primaryBlue,
          duration: const Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
        ),
      );

      await PdfService.generateSocialRoiReport(state: state, format: format);
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error generating PDF: $e'),
            backgroundColor: AppTheme.lossRed,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    required bool isDecimal,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          TextFormField(
            controller: controller,
            keyboardType: isDecimal
                ? const TextInputType.numberWithOptions(decimal: true)
                : TextInputType.text,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
            decoration: InputDecoration(
              filled: true,
              fillColor: Colors.white.withValues(alpha: 0.05),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: Colors.white.withValues(alpha: 0.1),
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: Colors.white.withValues(alpha: 0.1),
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(
                  color: AppTheme.primaryBlue,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
