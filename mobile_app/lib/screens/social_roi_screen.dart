import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../core/app_theme.dart';
import '../models/social_roi_models.dart';
import '../providers/social_roi_provider.dart';
import '../providers/multi_tenant_provider.dart'; // For currency symbol
import '../services/pdf_service.dart';

class SocialMediaRoiScreen extends ConsumerWidget {
  const SocialMediaRoiScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final roiState = ref.watch(socialRoiProvider);
    final activeProfile = ref.watch(activeProfileProvider);
    final currencySymbol = activeProfile?.currency == 'NGN'
        ? '₦'
        : '\$'; // Simple check, ideally map all
    final currencyFormat = NumberFormat.currency(
      symbol: currencySymbol,
      decimalDigits: 0,
    );

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Social Media ROI',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          // PDF Export Button
          IconButton(
            icon: const Icon(Icons.picture_as_pdf, color: AppTheme.primaryBlue),
            onPressed: () => _exportToPdf(context, roiState, currencyFormat),
            tooltip: 'Export PDF',
          ),
          // Timeframe Selector
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: DropdownButton<String>(
              value: roiState.timeframe,
              dropdownColor: const Color(0xFF1E293B),
              underline: const SizedBox(),
              icon: const Icon(
                Icons.keyboard_arrow_down,
                color: Colors.white70,
                size: 16,
              ),
              style: const TextStyle(color: Colors.white, fontSize: 12),
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. KPI Cards (Top Summary)
            _buildSummaryCards(roiState, currencyFormat),
            const SizedBox(height: 24),

            // 2. Charts (Cost & Value Pie Charts)
            _buildChartsSection(roiState, currencyFormat),
            const SizedBox(height: 24),

            // 3. Analysis Text Block
            _buildAnalysisText(roiState, currencyFormat),
            const SizedBox(height: 24),

            // 4. Channel Efficiency Bar Chart
            if (roiState.platforms.isNotEmpty)
              _buildChannelEfficiencyChart(roiState),
            if (roiState.platforms.isNotEmpty) const SizedBox(height: 24),

            // 5. Inputs Section (Collapsible/Editable)
            const Text(
              'INPUT PARAMETERS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Colors.white38,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 12),
            _buildInputCard(
              context,
              'Overhead Costs',
              Icons.filter_list,
              currencyFormat.format(roiState.overheads.total),
              () => _showOverheadsSheet(context, ref, roiState.overheads),
            ),
            const SizedBox(height: 12),
            _buildInputCard(
              context,
              'Brand Equity',
              Icons.trending_up,
              currencyFormat.format(roiState.brandEquity.totalValue),
              () => _showBrandEquitySheet(context, ref, roiState.brandEquity),
            ),

            const SizedBox(height: 32),

            // 4. Platforms List
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'PLATFORMS',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.white38,
                    letterSpacing: 1.5,
                  ),
                ),
                TextButton.icon(
                  onPressed: () =>
                      ref.read(socialRoiProvider.notifier).addPlatform(),
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('Add Platform'),
                  style: TextButton.styleFrom(
                    foregroundColor: AppTheme.profitGreen,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            if (roiState.platforms.isEmpty)
              const Center(
                child: Text(
                  'No platforms added',
                  style: TextStyle(color: Colors.white24),
                ),
              )
            else
              ...roiState.platforms.map(
                (p) => _buildPlatformCard(context, ref, p, currencyFormat),
              ),

            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCards(SocialRoiState state, NumberFormat format) {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      shrinkWrap: true, // Important for nested scroll views
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.5,
      children: [
        _buildKpiCard(
          'Total Investment',
          format.format(state.totalInvestment),
          Colors.white,
          Icons.attach_money,
        ),
        _buildKpiCard(
          'Total Value',
          format.format(state.totalValueGenerated),
          AppTheme.profitGreen,
          Icons.share,
        ),
        _buildKpiCard(
          'Net Profit',
          format.format(state.netProfit),
          state.netProfit >= 0 ? Colors.white : AppTheme.lossRed,
          Icons.account_balance_wallet,
        ),
        _buildKpiCard(
          'Social ROI',
          '${state.socialRoi.toStringAsFixed(1)}%',
          state.socialRoi >= 0 ? AppTheme.primaryBlue : AppTheme.lossRed,
          Icons.auto_graph,
        ),
      ],
    );
  }

  Widget _buildKpiCard(String label, String value, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 20, color: color.withValues(alpha: 0.5)),
          const Spacer(),
          Text(
            label.toUpperCase(),
            style: const TextStyle(color: Colors.white38, fontSize: 10),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
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
        radius: 15,
        showTitle: false,
      ), // Blue
      PieChartSectionData(
        value: state.totalPlatformSpend,
        color: const Color(0xFFF59E0B),
        radius: 15,
        showTitle: false,
      ), // Orange
    ];

    final valueData = [
      PieChartSectionData(
        value: state.totalDirectValue,
        color: const Color(0xFF10B981),
        radius: 15,
        showTitle: false,
      ), // Green
      PieChartSectionData(
        value: state.brandEquity.totalValue,
        color: const Color(0xFF8B5CF6),
        radius: 15,
        showTitle: false,
      ), // Purple
    ];

    // Handle empty data to avoid crash
    final hasInvest = state.totalInvestment > 0;
    final hasValue = state.totalValueGenerated > 0;

    return Row(
      children: [
        Expanded(
          child: _buildMiniPieChart(
            'Cost Structure',
            hasInvest ? investmentData : [],
            Colors.blue,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildMiniPieChart(
            'Value Sources',
            hasValue ? valueData : [],
            Colors.purple,
          ),
        ),
      ],
    );
  }

  Widget _buildMiniPieChart(
    String title,
    List<PieChartSectionData> sections,
    Color color,
  ) {
    return Container(
      height: 160,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
          Expanded(
            child: sections.isEmpty
                ? const Center(
                    child: Text('--', style: TextStyle(color: Colors.white24)),
                  )
                : PieChart(
                    PieChartData(
                      sections: sections,
                      centerSpaceRadius: 25,
                      sectionsSpace: 2,
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputCard(
    BuildContext context,
    String title,
    IconData icon,
    String value,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppTheme.primaryBlue, size: 20),
            const SizedBox(width: 12),
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            const Spacer(),
            Text(
              value,
              style: const TextStyle(
                color: Colors.white70,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 8),
            const Icon(
              Icons.arrow_forward_ios,
              size: 12,
              color: Colors.white24,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlatformCard(
    BuildContext context,
    WidgetRef ref,
    SocialPlatformData platform,
    NumberFormat format,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: InkWell(
        onTap: () => _showPlatformEditSheet(context, ref, platform),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    platform.name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
                Text(
                  'ROI: ${platform.roi.toStringAsFixed(1)}%',
                  style: TextStyle(
                    color: platform.roi >= 0
                        ? AppTheme.profitGreen
                        : AppTheme.lossRed,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildCompactStat('Spend', format.format(platform.totalCost)),
                _buildCompactStat('Rev', format.format(platform.totalValue)),
                _buildCompactStat(
                  'Profit',
                  format.format(platform.netProfit),
                  color: platform.netProfit >= 0
                      ? Colors.white70
                      : AppTheme.lossRed,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCompactStat(
    String label,
    String value, {
    Color color = Colors.white70,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white24, fontSize: 10),
        ),
        Text(
          value,
          style: TextStyle(
            color: color,
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  // --- Bottom Sheets for Editing ---

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
            const Text(
              'Edit Overheads',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
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
              const Text(
                'Edit Brand Equity',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
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
                'Value per Engage',
                valEngageCtrl,
                isDecimal: true,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryBlue,
                    padding: const EdgeInsets.symmetric(vertical: 16),
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
    // Basic Info
    final nameCtrl = TextEditingController(text: data.name);
    // Costs
    final adSpendCtrl = TextEditingController(text: data.adSpend.toString());
    final contentCtrl = TextEditingController(
      text: data.contentCost.toString(),
    );
    final influencerCtrl = TextEditingController(
      text: data.influencerCost.toString(),
    );
    // Performance
    final clicksCtrl = TextEditingController(
      text: data.websiteClicks.toString(),
    );
    final convCtrl = TextEditingController(
      text: data.websiteConversionRate.toString(),
    );
    final aovCtrl = TextEditingController(text: data.aov.toString());
    // Leads
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
                const Text(
                  'Edit Platform',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
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
            _buildTextField(
              'Platform Name',
              nameCtrl,
              isDecimal: false,
            ), // Text

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
              'Lead-to-Cust Rate (%)',
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

  // --- NEW FEATURES ---

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
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.analytics, color: AppTheme.primaryBlue, size: 16),
              const SizedBox(width: 8),
              const Text(
                'RESULTS ANALYSIS',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          RichText(
            text: TextSpan(
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 13,
                height: 1.6,
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
                const TextSpan(text: ' in value. '),
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
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.bar_chart, color: AppTheme.primaryBlue, size: 16),
              const SizedBox(width: 8),
              const Text(
                'CHANNEL EFFICIENCY',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 200,
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
                    getTooltipColor: (_) => const Color(0xFF1E293B),
                    getTooltipItem: (group, groupIndex, rod, rodIndex) {
                      return BarTooltipItem(
                        '${state.platforms[groupIndex].name}\n${rod.toY.toStringAsFixed(1)}%',
                        const TextStyle(color: Colors.white, fontSize: 12),
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
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              state.platforms[value.toInt()].name,
                              style: const TextStyle(
                                color: Colors.white54,
                                fontSize: 10,
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
                      reservedSize: 40,
                      getTitlesWidget: (value, meta) {
                        return Text(
                          '${value.toInt()}%',
                          style: const TextStyle(
                            color: Colors.white38,
                            fontSize: 10,
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
                        color: platform.roi >= 0
                            ? AppTheme.profitGreen
                            : AppTheme.lossRed,
                        width: 20,
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(4),
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

  void _exportToPdf(
    BuildContext context,
    SocialRoiState state,
    NumberFormat format,
  ) async {
    try {
      // Show loading snackbar
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
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
          const SizedBox(height: 6),
          TextFormField(
            controller: controller,
            keyboardType: isDecimal
                ? const TextInputType.numberWithOptions(decimal: true)
                : TextInputType.text,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
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
          ),
        ],
      ),
    );
  }
}
