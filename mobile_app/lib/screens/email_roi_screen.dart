import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../core/app_theme.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/social_roi_models.dart';
import '../widgets/social_roi_ai_coach.dart' as social_ai;

// State Provider for Email ROI Inputs
final emailRoiInputsProvider =
    StateNotifierProvider<EmailRoiInputsNotifier, EmailRoiInputs>((ref) {
      return EmailRoiInputsNotifier();
    });

class EmailRoiInputs {
  final String businessModel; // 'ecommerce' or 'leadgen'
  final String espCostType; // 'fixed' or 'cpm'
  final double espCost;
  final double softwareCost;
  final double teamHours;
  final double hourlyRate;
  final double agencyFees;
  final double subscriberAcquisitionCost;
  final double contentCost;
  final double listCost;

  // Metrics
  final double emailsSent;
  final double openRate;
  final double ctr;
  final double conversionRate;
  final double unsubscribeRate;

  // Value
  final double aov;
  final double valuePerLead;
  final double ltv;

  // Scenarios
  final double whatIfOpenRate;
  final double whatIfConversionRate;

  // A/B Test
  final double abConversionA;
  final double abConversionB;

  // Deliverability
  final double bounceRate;

  EmailRoiInputs({
    this.businessModel = 'ecommerce',
    this.espCostType = 'fixed',
    this.espCost = 200,
    this.softwareCost = 150,
    this.teamHours = 40,
    this.hourlyRate = 30,
    this.agencyFees = 500,
    this.subscriberAcquisitionCost = 2,
    this.contentCost = 250,
    this.listCost = 100,
    this.emailsSent = 50000,
    this.openRate = 25,
    this.ctr = 4,
    this.conversionRate = 5,
    this.unsubscribeRate = 0.5,
    this.aov = 75,
    this.valuePerLead = 50,
    this.ltv = 500,
    this.whatIfOpenRate = 0,
    this.whatIfConversionRate = 0,
    this.abConversionA = 2.0,
    this.abConversionB = 2.5,
    this.bounceRate = 2.0,
  });

  EmailRoiInputs copyWith({
    String? businessModel,
    String? espCostType,
    double? espCost,
    double? softwareCost,
    double? teamHours,
    double? hourlyRate,
    double? agencyFees,
    double? subscriberAcquisitionCost,
    double? contentCost,
    double? listCost,
    double? emailsSent,
    double? openRate,
    double? ctr,
    double? conversionRate,
    double? unsubscribeRate,
    double? aov,
    double? valuePerLead,
    double? ltv,
    double? whatIfOpenRate,
    double? whatIfConversionRate,
    double? abConversionA,
    double? abConversionB,
    double? bounceRate,
  }) {
    return EmailRoiInputs(
      businessModel: businessModel ?? this.businessModel,
      espCostType: espCostType ?? this.espCostType,
      espCost: espCost ?? this.espCost,
      softwareCost: softwareCost ?? this.softwareCost,
      teamHours: teamHours ?? this.teamHours,
      hourlyRate: hourlyRate ?? this.hourlyRate,
      agencyFees: agencyFees ?? this.agencyFees,
      subscriberAcquisitionCost:
          subscriberAcquisitionCost ?? this.subscriberAcquisitionCost,
      contentCost: contentCost ?? this.contentCost,
      listCost: listCost ?? this.listCost,
      emailsSent: emailsSent ?? this.emailsSent,
      openRate: openRate ?? this.openRate,
      ctr: ctr ?? this.ctr,
      conversionRate: conversionRate ?? this.conversionRate,
      unsubscribeRate: unsubscribeRate ?? this.unsubscribeRate,
      aov: aov ?? this.aov,
      valuePerLead: valuePerLead ?? this.valuePerLead,
      ltv: ltv ?? this.ltv,
      whatIfOpenRate: whatIfOpenRate ?? this.whatIfOpenRate,
      whatIfConversionRate: whatIfConversionRate ?? this.whatIfConversionRate,
      abConversionA: abConversionA ?? this.abConversionA,
      abConversionB: abConversionB ?? this.abConversionB,
      bounceRate: bounceRate ?? this.bounceRate,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'businessModel': businessModel,
      'espCostType': espCostType,
      'espCost': espCost,
      'softwareCost': softwareCost,
      'teamHours': teamHours,
      'hourlyRate': hourlyRate,
      'agencyFees': agencyFees,
      'subscriberAcquisitionCost': subscriberAcquisitionCost,
      'contentCost': contentCost,
      'listCost': listCost,
      'emailsSent': emailsSent,
      'openRate': openRate,
      'ctr': ctr,
      'conversionRate': conversionRate,
      'unsubscribeRate': unsubscribeRate,
      'aov': aov,
      'valuePerLead': valuePerLead,
      'ltv': ltv,
      'whatIfOpenRate': whatIfOpenRate,
      'whatIfConversionRate': whatIfConversionRate,
      'abConversionA': abConversionA,
      'abConversionB': abConversionB,
      'bounceRate': bounceRate,
    };
  }

  factory EmailRoiInputs.fromJson(Map<String, dynamic> json) {
    return EmailRoiInputs(
      businessModel: json['businessModel'] ?? 'ecommerce',
      espCostType: json['espCostType'] ?? 'fixed',
      espCost: (json['espCost'] ?? 200).toDouble(),
      softwareCost: (json['softwareCost'] ?? 150).toDouble(),
      teamHours: (json['teamHours'] ?? 40).toDouble(),
      hourlyRate: (json['hourlyRate'] ?? 30).toDouble(),
      agencyFees: (json['agencyFees'] ?? 500).toDouble(),
      subscriberAcquisitionCost: (json['subscriberAcquisitionCost'] ?? 2)
          .toDouble(),
      contentCost: (json['contentCost'] ?? 250).toDouble(),
      listCost: (json['listCost'] ?? 100).toDouble(),
      emailsSent: (json['emailsSent'] ?? 50000).toDouble(),
      openRate: (json['openRate'] ?? 25).toDouble(),
      ctr: (json['ctr'] ?? 4).toDouble(),
      conversionRate: (json['conversionRate'] ?? 5).toDouble(),
      unsubscribeRate: (json['unsubscribeRate'] ?? 0.5).toDouble(),
      aov: (json['aov'] ?? 75).toDouble(),
      valuePerLead: (json['valuePerLead'] ?? 50).toDouble(),
      ltv: (json['ltv'] ?? 500).toDouble(),
      whatIfOpenRate: (json['whatIfOpenRate'] ?? 0).toDouble(),
      whatIfConversionRate: (json['whatIfConversionRate'] ?? 0).toDouble(),
      abConversionA: (json['abConversionA'] ?? 2.0).toDouble(),
      abConversionB: (json['abConversionB'] ?? 2.5).toDouble(),
      bounceRate: (json['bounceRate'] ?? 2.0).toDouble(),
    );
  }
}

class EmailRoiInputsNotifier extends StateNotifier<EmailRoiInputs> {
  EmailRoiInputsNotifier() : super(EmailRoiInputs()) {
    _loadFromStorage();
  }

  Future<void> _loadFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString('emailRoiInputs');
    if (saved != null) {
      try {
        state = EmailRoiInputs.fromJson(json.decode(saved));
      } catch (e) {
        // Ignore errors, use defaults
      }
    }
  }

  Future<void> saveToStorage() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('emailRoiInputs', json.encode(state.toJson()));
  }

  void updateField(String field, dynamic value) {
    switch (field) {
      case 'businessModel':
        state = state.copyWith(businessModel: value);
        break;
      case 'espCostType':
        state = state.copyWith(espCostType: value);
        break;
      case 'espCost':
        state = state.copyWith(espCost: value);
        break;
      case 'softwareCost':
        state = state.copyWith(softwareCost: value);
        break;
      case 'teamHours':
        state = state.copyWith(teamHours: value);
        break;
      case 'hourlyRate':
        state = state.copyWith(hourlyRate: value);
        break;
      case 'agencyFees':
        state = state.copyWith(agencyFees: value);
        break;
      case 'subscriberAcquisitionCost':
        state = state.copyWith(subscriberAcquisitionCost: value);
        break;
      case 'contentCost':
        state = state.copyWith(contentCost: value);
        break;
      case 'listCost':
        state = state.copyWith(listCost: value);
        break;
      case 'emailsSent':
        state = state.copyWith(emailsSent: value);
        break;
      case 'openRate':
        state = state.copyWith(openRate: value);
        break;
      case 'ctr':
        state = state.copyWith(ctr: value);
        break;
      case 'conversionRate':
        state = state.copyWith(conversionRate: value);
        break;
      case 'unsubscribeRate':
        state = state.copyWith(unsubscribeRate: value);
        break;
      case 'aov':
        state = state.copyWith(aov: value);
        break;
      case 'valuePerLead':
        state = state.copyWith(valuePerLead: value);
        break;
      case 'ltv':
        state = state.copyWith(ltv: value);
        break;
      case 'whatIfOpenRate':
        state = state.copyWith(whatIfOpenRate: value);
        break;
      case 'whatIfConversionRate':
        state = state.copyWith(whatIfConversionRate: value);
        break;
      case 'abConversionA':
        state = state.copyWith(abConversionA: value);
        break;
      case 'abConversionB':
        state = state.copyWith(abConversionB: value);
        break;
      case 'bounceRate':
        state = state.copyWith(bounceRate: value);
        break;
    }
  }
}

// Calculation Results
class EmailRoiResults {
  final double platformCosts;
  final double hrCosts;
  final double otherCosts;
  final double acquisitionCost;
  final double emailsOpened;
  final double clicks;
  final double conversions;
  final double unsubscribes;
  final double ctor;
  final double immediateRevenue;
  final double totalValueLTV;
  final double totalInvestment;
  final double netProfit;
  final double overallROI;
  final double cpa;
  final double profitUplift;
  final double abUplift;
  final double lostRevenue;

  EmailRoiResults({
    required this.platformCosts,
    required this.hrCosts,
    required this.otherCosts,
    required this.acquisitionCost,
    required this.emailsOpened,
    required this.clicks,
    required this.conversions,
    required this.unsubscribes,
    required this.ctor,
    required this.immediateRevenue,
    required this.totalValueLTV,
    required this.totalInvestment,
    required this.netProfit,
    required this.overallROI,
    required this.cpa,
    required this.profitUplift,
    required this.abUplift,
    required this.lostRevenue,
  });

  factory EmailRoiResults.calculate(EmailRoiInputs inputs) {
    final espCostTotal = inputs.espCostType == 'fixed'
        ? inputs.espCost
        : (inputs.emailsSent / 1000) * inputs.espCost;
    final laborCost = inputs.teamHours * inputs.hourlyRate;
    final platformCosts = espCostTotal + inputs.softwareCost;
    final hrCosts = laborCost + inputs.agencyFees;
    final otherCosts = inputs.contentCost + inputs.listCost;

    final emailsOpened = inputs.emailsSent * (inputs.openRate / 100);
    final clicks = inputs.emailsSent * (inputs.ctr / 100);
    final conversions = clicks * (inputs.conversionRate / 100);
    final unsubscribes = inputs.emailsSent * (inputs.unsubscribeRate / 100);
    final ctor = emailsOpened > 0.0 ? (clicks / emailsOpened) * 100.0 : 0.0;

    final valuePerConversion = inputs.businessModel == 'ecommerce'
        ? inputs.aov
        : inputs.valuePerLead;
    final immediateRevenue = conversions * valuePerConversion;
    final totalValueLTV = conversions * inputs.ltv;
    final acquisitionCost = conversions * inputs.subscriberAcquisitionCost;

    final totalInvestment =
        platformCosts + hrCosts + otherCosts + acquisitionCost;
    final netProfit = totalValueLTV - totalInvestment;
    final overallROI = totalInvestment > 0.0
        ? (netProfit / totalInvestment) * 100.0
        : 0.0;
    final cpa = conversions > 0.0 ? totalInvestment / conversions : 0.0;

    // What-If Scenario
    final improvedOpenRate = inputs.openRate + inputs.whatIfOpenRate;
    final improvedConvRate =
        inputs.conversionRate + inputs.whatIfConversionRate;
    final improvedOpened = inputs.emailsSent * (improvedOpenRate / 100);
    final originalCTOR = emailsOpened > 0 ? clicks / emailsOpened : 0;
    final scenarioClicks = improvedOpened * originalCTOR;
    final scenarioConversions = scenarioClicks * (improvedConvRate / 100);
    final scenarioRevenue = scenarioConversions * inputs.ltv;
    final scenarioProfit = scenarioRevenue - totalInvestment;
    final profitUplift = scenarioProfit - netProfit;

    // A/B Test Uplift
    final revenueA =
        (clicks * (inputs.abConversionA / 100.0)) * valuePerConversion;
    final revenueB =
        (clicks * (inputs.abConversionB / 100.0)) * valuePerConversion;
    final abUplift = (revenueB - revenueA).toDouble();

    // Deliverability Cost
    final deliveredEmails = inputs.emailsSent * (1 - (inputs.bounceRate / 100));
    final valuePerDelivered = deliveredEmails > 0
        ? totalValueLTV / deliveredEmails
        : 0;
    final bouncedEmails = inputs.emailsSent * (inputs.bounceRate / 100);
    final lostRevenue = bouncedEmails * valuePerDelivered;

    return EmailRoiResults(
      platformCosts: platformCosts,
      hrCosts: hrCosts,
      otherCosts: otherCosts,
      acquisitionCost: acquisitionCost,
      emailsOpened: emailsOpened,
      clicks: clicks,
      conversions: conversions,
      unsubscribes: unsubscribes,
      ctor: ctor,
      immediateRevenue: immediateRevenue,
      totalValueLTV: totalValueLTV,
      totalInvestment: totalInvestment,
      netProfit: netProfit,
      overallROI: overallROI,
      cpa: cpa,
      profitUplift: profitUplift,
      abUplift: abUplift,
      lostRevenue: lostRevenue,
    );
  }
}

class EmailMarketingRoiScreen extends ConsumerStatefulWidget {
  const EmailMarketingRoiScreen({super.key});

  @override
  ConsumerState<EmailMarketingRoiScreen> createState() =>
      _EmailMarketingRoiScreenState();
}

class _EmailMarketingRoiScreenState
    extends ConsumerState<EmailMarketingRoiScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final inputs = ref.watch(emailRoiInputsProvider);
    final results = EmailRoiResults.calculate(inputs);
    final currencyFormat = NumberFormat.simpleCurrency(decimalDigits: 0);

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
                Icons.email_outlined,
                color: AppTheme.primaryBlue,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Email ROI',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  'Marketing Intelligence',
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
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.profitGreen.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppTheme.profitGreen.withValues(alpha: 0.2),
              ),
            ),
            child: IconButton(
              icon: const Icon(
                Icons.save_outlined,
                color: AppTheme.profitGreen,
                size: 20,
              ),
              onPressed: () async {
                await ref.read(emailRoiInputsProvider.notifier).saveToStorage();
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Email ROI intelligence saved'),
                    backgroundColor: AppTheme.profitGreen,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
            ),
          ),
          const SizedBox(width: 8),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            child: TabBar(
              controller: _tabController,
              indicator: BoxDecoration(
                color: AppTheme.primaryBlue,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryBlue.withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              labelColor: Colors.white,
              unselectedLabelColor: Colors.white38,
              labelStyle: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
              tabs: const [
                Tab(text: 'Dashboard'),
                Tab(text: 'Inputs'),
                Tab(text: 'Scenarios'),
              ],
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAiCoachForEmailROI(context, ref, inputs, results),
        backgroundColor: AppTheme.primaryBlue,
        icon: const Icon(Icons.psychology, color: Colors.white),
        label: const Text(
          'AI Marketing Coach',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
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
            bottom: 100,
            left: -50,
            child: Container(
              width: 200,
              height: 200,
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
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildDashboardTab(results, currencyFormat),
                _buildInputsTab(inputs),
                _buildScenariosTab(inputs, results, currencyFormat),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDashboardTab(EmailRoiResults results, NumberFormat format) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 140, 20, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hero ROI Card
          _buildHeroRoiCard(results),
          const SizedBox(height: 24),

          // Main KPI Grid
          _buildKpiGrid(results, format),
          const SizedBox(height: 32),

          // Cost Structure Chart
          _buildInvestmentChart(results),
          const SizedBox(height: 32),

          // Deliverability Warning
          if (results.lostRevenue > 0) ...[
            _buildWarningCard(results, format),
            const SizedBox(height: 32),
          ],

          // Detailed Metrics Section
          _buildMetricsSection(results, format),
          const SizedBox(height: 48),
        ],
      ),
    );
  }

  Widget _buildHeroRoiCard(EmailRoiResults results) {
    final isPositive = results.overallROI >= 0;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primaryBlue.withValues(alpha: 0.2),
            AppTheme.accentBlue.withValues(alpha: 0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.primaryBlue.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryBlue.withValues(alpha: 0.1),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'OVERALL EMAIL ROI',
                    style: TextStyle(
                      color: Colors.white54,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Performance Score',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: (isPositive ? AppTheme.profitGreen : AppTheme.lossRed)
                      .withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color:
                        (isPositive ? AppTheme.profitGreen : AppTheme.lossRed)
                            .withValues(alpha: 0.2),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isPositive ? Icons.trending_up : Icons.trending_down,
                      color: isPositive
                          ? AppTheme.profitGreen
                          : AppTheme.lossRed,
                      size: 14,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isPositive ? 'PROFITABLE' : 'LOSS',
                      style: TextStyle(
                        color: isPositive
                            ? AppTheme.profitGreen
                            : AppTheme.lossRed,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            '${results.overallROI.toStringAsFixed(1)}%',
            style: TextStyle(
              fontSize: 48,
              fontWeight: FontWeight.bold,
              color: isPositive ? AppTheme.profitGreen : AppTheme.lossRed,
              letterSpacing: -1,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'FOR EVERY \$1 SPENT, YOU GENERATE \$${(results.totalValueLTV / results.totalInvestment).toStringAsFixed(2)}',
            style: const TextStyle(
              color: Colors.white38,
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKpiGrid(EmailRoiResults results, NumberFormat format) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 1.4,
      children: [
        _buildKpiCard(
          'Total Investment',
          format.format(results.totalInvestment),
          Icons.outbound_outlined,
          AppTheme.lossRed,
          'Total Cost',
        ),
        _buildKpiCard(
          'Total Value (LTV)',
          format.format(results.totalValueLTV),
          Icons.account_balance_wallet_outlined,
          AppTheme.profitGreen,
          'Lifetime Value',
        ),
        _buildKpiCard(
          'Net Profit',
          format.format(results.netProfit),
          Icons.insights,
          Colors.white,
          'Gain/Loss',
        ),
        _buildKpiCard(
          'CPA',
          format.format(results.cpa),
          Icons.person_add_outlined,
          Colors.purple.shade300,
          'Cost Per Acq.',
        ),
      ],
    );
  }

  Widget _buildKpiCard(
    String label,
    String value,
    IconData icon,
    Color color,
    String subLabel,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 16),
              ),
              Text(
                subLabel,
                style: const TextStyle(
                  color: Colors.white24,
                  fontSize: 8,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white54,
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: TextStyle(
                  color: color,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInvestmentChart(EmailRoiResults results) {
    final data = [
      _ChartData('ESP Platform', results.platformCosts, AppTheme.primaryBlue),
      _ChartData('Labor & Agency', results.hrCosts, AppTheme.accentBlue),
      _ChartData('Content & List', results.otherCosts, Colors.purple.shade400),
      _ChartData(
        'Acquisition',
        results.acquisitionCost,
        Colors.orange.shade400,
      ),
    ].where((d) => d.value > 0).toList();

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.02),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.pie_chart_outline, color: Colors.white38, size: 18),
              SizedBox(width: 12),
              Text(
                'Investment Structure',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),
          SizedBox(
            height: 200,
            child: PieChart(
              PieChartData(
                sectionsSpace: 4,
                centerSpaceRadius: 60,
                sections: data.map((d) {
                  return PieChartSectionData(
                    value: d.value,
                    title: '',
                    color: d.color,
                    radius: 20,
                    badgeWidget: null,
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 32),
          ...data.map(
            (d) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: d.color,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      d.label,
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  Text(
                    NumberFormat.simpleCurrency(
                      decimalDigits: 0,
                    ).format(d.value),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
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

  Widget _buildWarningCard(EmailRoiResults results, NumberFormat format) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.lossRed.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.lossRed.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.lossRed.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.warning_amber_rounded,
              color: AppTheme.lossRed,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'DELIVERABILITY LOSS',
                  style: TextStyle(
                    color: AppTheme.lossRed,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'You are losing ${format.format(results.lostRevenue)} in revenue due to bounced emails. Improve list hygiene to recover this.',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricsSection(EmailRoiResults results, NumberFormat format) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(left: 4, bottom: 16),
          child: Text(
            'Campaign Efficiency',
            style: TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        _buildMetricRowPremium(
          'CTOR',
          '${results.ctor.toStringAsFixed(1)}%',
          Icons.mouse_outlined,
          Colors.amber,
        ),
        _buildMetricRowPremium(
          'Email Conversions',
          results.conversions.toStringAsFixed(0),
          Icons.shopping_bag_outlined,
          AppTheme.profitGreen,
        ),
        _buildMetricRowPremium(
          'Total Clicks',
          results.clicks.toStringAsFixed(0),
          Icons.ads_click,
          AppTheme.primaryBlue,
        ),
        _buildMetricRowPremium(
          'Unsubscribe Rate',
          '${(results.unsubscribes / results.emailsOpened * 100).toStringAsFixed(1)}%',
          Icons.person_remove_outlined,
          AppTheme.lossRed,
        ),
        _buildMetricRowPremium(
          'Immediate Revenue',
          format.format(results.immediateRevenue),
          Icons.payments_outlined,
          AppTheme.profitGreen,
        ),
      ],
    );
  }

  Widget _buildMetricRowPremium(
    String label,
    String value,
    IconData icon,
    Color color,
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
          Icon(icon, color: color.withValues(alpha: 0.5), size: 18),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(color: Colors.white70, fontSize: 13),
            ),
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
      ),
    );
  }

  Widget _buildInputsTab(EmailRoiInputs inputs) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 140, 20, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Business Model Selector
          const Text(
            'BUSINESS MODEL',
            style: TextStyle(
              color: Colors.white38,
              fontSize: 10,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildToggleButton(
                  'E-commerce',
                  inputs.businessModel == 'ecommerce',
                  () => ref
                      .read(emailRoiInputsProvider.notifier)
                      .updateField('businessModel', 'ecommerce'),
                  Icons.shopping_cart_outlined,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildToggleButton(
                  'Lead Generation',
                  inputs.businessModel == 'leadgen',
                  () => ref
                      .read(emailRoiInputsProvider.notifier)
                      .updateField('businessModel', 'leadgen'),
                  Icons.people_outline,
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),

          _buildSectionHeaderPremium(
            'Investment Inputs',
            Icons.account_balance_wallet_outlined,
          ),
          const SizedBox(height: 16),
          _buildInputFieldPremium(
            'ESP Monthly Cost',
            inputs.espCost,
            'espCost',
            Icons.cloud_outlined,
          ),
          _buildInputFieldPremium(
            'Strategy & Agency Fees',
            inputs.agencyFees,
            'agencyFees',
            Icons.groups_outlined,
          ),
          _buildInputFieldPremium(
            'Content Creation',
            inputs.contentCost,
            'contentCost',
            Icons.edit_note_outlined,
          ),
          _buildInputFieldPremium(
            'Software/Tools Cost',
            inputs.softwareCost,
            'softwareCost',
            Icons.construction_outlined,
          ),

          const SizedBox(height: 32),
          _buildSectionHeaderPremium(
            'Campaign Metrics',
            Icons.analytics_outlined,
          ),
          const SizedBox(height: 16),
          _buildInputFieldPremium(
            'Volume Sent',
            inputs.emailsSent,
            'emailsSent',
            Icons.send_outlined,
          ),
          _buildInputFieldPremium(
            'Open Rate (%)',
            inputs.openRate,
            'openRate',
            Icons.mail_outline,
          ),
          _buildInputFieldPremium(
            'CTR (%)',
            inputs.ctr,
            'ctr',
            Icons.touch_app_outlined,
          ),
          _buildInputFieldPremium(
            'Conversion Rate (%)',
            inputs.conversionRate,
            'conversionRate',
            Icons.shopping_bag_outlined,
          ),

          const SizedBox(height: 32),
          _buildSectionHeaderPremium(
            'Value Parameters',
            Icons.diamond_outlined,
          ),
          const SizedBox(height: 16),
          _buildInputFieldPremium(
            inputs.businessModel == 'ecommerce'
                ? 'Average Order Value'
                : 'Value Per Lead',
            inputs.businessModel == 'ecommerce'
                ? inputs.aov
                : inputs.valuePerLead,
            inputs.businessModel == 'ecommerce' ? 'aov' : 'valuePerLead',
            Icons.paid_outlined,
          ),
          _buildInputFieldPremium(
            'Customer Lifetime Value',
            inputs.ltv,
            'ltv',
            Icons.stars_outlined,
          ),
          const SizedBox(height: 48),
        ],
      ),
    );
  }

  Widget _buildScenariosTab(
    EmailRoiInputs inputs,
    EmailRoiResults results,
    NumberFormat format,
  ) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 140, 20, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeaderPremium(
            '"What-If" Intelligence',
            Icons.psychology_outlined,
          ),
          const SizedBox(height: 8),
          const Text(
            'Simulate optimization scenarios to see impact on profit.',
            style: TextStyle(color: Colors.white38, fontSize: 12),
          ),
          const SizedBox(height: 32),

          _buildSliderInputPremium(
            'Improve Open Rate',
            inputs.whatIfOpenRate,
            0,
            10,
            'whatIfOpenRate',
            '%',
          ),
          const SizedBox(height: 24),
          _buildSliderInputPremium(
            'Improve Conversion Rate',
            inputs.whatIfConversionRate,
            0,
            5,
            'whatIfConversionRate',
            '%',
          ),

          const SizedBox(height: 32),
          _buildUpliftCard(
            'PROJECTED PROFIT UPLIFT',
            results.profitUplift,
            AppTheme.profitGreen,
            format,
          ),

          const SizedBox(height: 48),
          _buildSectionHeaderPremium(
            'A/B Test Comparison',
            Icons.compare_arrows_outlined,
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildInputFieldPremium(
                  'Conversion A (%)',
                  inputs.abConversionA,
                  'abConversionA',
                  Icons.looks_one_outlined,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildInputFieldPremium(
                  'Conversion B (%)',
                  inputs.abConversionB,
                  'abConversionB',
                  Icons.looks_two_outlined,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildUpliftCard(
            'REVENUE GAIN FROM WINNER',
            results.abUplift,
            Colors.purple.shade400,
            format,
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeaderPremium(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: AppTheme.primaryBlue, size: 16),
        const SizedBox(width: 12),
        Text(
          title.toUpperCase(),
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: Colors.white,
            letterSpacing: 1.2,
          ),
        ),
      ],
    );
  }

  Widget _buildUpliftCard(
    String label,
    double value,
    Color color,
    NumberFormat format,
  ) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: color.withValues(alpha: 0.1)),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 10,
              color: Colors.white54,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            '+${format.format(value)}',
            style: TextStyle(
              fontSize: 32,
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToggleButton(
    String label,
    bool isActive,
    VoidCallback onTap,
    IconData icon,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          gradient: isActive
              ? LinearGradient(
                  colors: [AppTheme.primaryBlue, AppTheme.accentBlue],
                )
              : null,
          color: isActive ? null : Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isActive
                ? AppTheme.primaryBlue
                : Colors.white.withValues(alpha: 0.1),
          ),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: isActive ? Colors.white : Colors.white24,
              size: 20,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                color: isActive ? Colors.white : Colors.white54,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputFieldPremium(
    String label,
    double value,
    String field,
    IconData icon,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 11,
                color: Colors.white38,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          TextFormField(
            initialValue: value.toString(),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
            decoration: InputDecoration(
              prefixIcon: Icon(
                icon,
                color: AppTheme.primaryBlue.withValues(alpha: 0.5),
                size: 18,
              ),
              filled: true,
              fillColor: Colors.white.withValues(alpha: 0.03),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide(
                  color: Colors.white.withValues(alpha: 0.05),
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide(
                  color: Colors.white.withValues(alpha: 0.05),
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(
                  color: AppTheme.primaryBlue,
                  width: 1.5,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 16,
              ),
            ),
            onChanged: (val) {
              final parsed = double.tryParse(val);
              if (parsed != null) {
                ref
                    .read(emailRoiInputsProvider.notifier)
                    .updateField(field, parsed);
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSliderInputPremium(
    String label,
    double value,
    double min,
    double max,
    String field,
    String suffix,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: const TextStyle(fontSize: 13, color: Colors.white70),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                '+${value.toStringAsFixed(1)}$suffix',
                style: const TextStyle(
                  color: AppTheme.primaryBlue,
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        SliderTheme(
          data: SliderTheme.of(context).copyWith(
            trackHeight: 4,
            activeTrackColor: AppTheme.primaryBlue,
            inactiveTrackColor: Colors.white.withValues(alpha: 0.05),
            thumbColor: Colors.white,
            overlayColor: AppTheme.primaryBlue.withValues(alpha: 0.1),
            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 8),
          ),
          child: Slider(
            value: value,
            min: min,
            max: max,
            divisions: ((max - min) * 10).toInt(),
            onChanged: (val) => ref
                .read(emailRoiInputsProvider.notifier)
                .updateField(field, val),
          ),
        ),
      ],
    );
  }

  void _showAiCoachForEmailROI(
    BuildContext context,
    WidgetRef ref,
    EmailRoiInputs inputs,
    EmailRoiResults results,
  ) {
    final contextPrompt =
        '''
You are an expert Email Marketing Strategist. 

CURRENT EMAIL PERFORMANCE:
- Email ROI: ${results.overallROI.toStringAsFixed(1)}%
- Total Investment: \$${results.totalInvestment.toStringAsFixed(0)}
- Lifetime Value Generated: \$${results.totalValueLTV.toStringAsFixed(0)}
- Net Profit: \$${results.netProfit.toStringAsFixed(0)}

METRICS:
- Delivery Volume: ${inputs.emailsSent}
- Open Rate: ${inputs.openRate}%
- CTR: ${inputs.ctr}%
- Conversion Rate: ${inputs.conversionRate}%
- CTOR: ${results.ctor.toStringAsFixed(1)}%
- Bounce Rate: ${inputs.bounceRate}% (Lost Revenue: \$${results.lostRevenue.toStringAsFixed(0)})

Provide actionable email marketing optimization advice focusing on:
1. List segmentation the user should implement
2. Subject line strategies to improve open rates
3. CTA audit (why is CTOR ${results.ctor.toStringAsFixed(1)}%?)
4. Deliverability quick-fixes for the bounce rate
5. Automation sequence recommendations

Be highly strategic, data-driven, and focus on maximizing the LTV:CAC ratio.
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
                          'Email Strategy AI Coach',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Expert Marketing Intelligence',
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
            Expanded(
              child: social_ai.SocialROIAiCoach(
                contextPrompt: contextPrompt,
                state: SocialRoiState(
                  timeframe: 'Monthly',
                  platforms: [
                    SocialPlatformData(
                      id: 'email',
                      name: 'Email Marketing',
                      adSpend: results.platformCosts,
                      contentCost: results.otherCosts,
                      websiteClicks: results.clicks.round(),
                      websiteConversionRate: inputs.conversionRate,
                      aov: inputs.aov,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ChartData {
  final String label;
  final double value;
  final Color color;
  _ChartData(this.label, this.value, this.color);
}
