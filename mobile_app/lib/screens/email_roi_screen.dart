import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../core/app_theme.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

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
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Email Marketing ROI',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.save, color: AppTheme.primaryBlue),
            onPressed: () async {
              await ref.read(emailRoiInputsProvider.notifier).saveToStorage();
              if (!context.mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Email ROI data saved'),
                  backgroundColor: AppTheme.profitGreen,
                ),
              );
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.primaryBlue,
          labelColor: AppTheme.primaryBlue,
          unselectedLabelColor: Colors.white54,
          tabs: const [
            Tab(text: 'Dashboard'),
            Tab(text: 'Inputs'),
            Tab(text: 'Scenarios'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDashboardTab(results, currencyFormat),
          _buildInputsTab(inputs),
          _buildScenariosTab(inputs, results, currencyFormat),
        ],
      ),
    );
  }

  Widget _buildDashboardTab(EmailRoiResults results, NumberFormat format) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // KPI Cards
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.5,
            children: [
              _buildKpiCard(
                'Total Investment',
                format.format(results.totalInvestment),
                Icons.attach_money,
                Colors.red.shade400,
              ),
              _buildKpiCard(
                'Total Value (LTV)',
                format.format(results.totalValueLTV),
                Icons.trending_up,
                AppTheme.profitGreen,
              ),
              _buildKpiCard(
                'Net Profit',
                format.format(results.netProfit),
                Icons.account_balance_wallet,
                results.netProfit >= 0 ? Colors.white : Colors.red.shade400,
              ),
              _buildKpiCard(
                'Email ROI',
                '${results.overallROI.toStringAsFixed(1)}%',
                Icons.percent,
                AppTheme.primaryBlue,
              ),
              _buildKpiCard(
                'CPA',
                format.format(results.cpa),
                Icons.person,
                Colors.purple.shade400,
              ),
              _buildKpiCard(
                'CTOR',
                '${results.ctor.toStringAsFixed(1)}%',
                Icons.mouse,
                Colors.amber.shade400,
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Investment Breakdown Chart
          _buildInvestmentChart(results),
          const SizedBox(height: 24),

          // Campaign Metrics
          _buildMetricsSection(results, format),
        ],
      ),
    );
  }

  Widget _buildKpiCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    fontSize: 10,
                    color: Colors.white54,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Icon(icon, color: color.withValues(alpha: 0.3), size: 20),
            ],
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInvestmentChart(EmailRoiResults results) {
    final data = [
      _ChartData('Platform', results.platformCosts, AppTheme.primaryBlue),
      _ChartData('Labor/Agency', results.hrCosts, Colors.red.shade400),
      _ChartData('Content/List', results.otherCosts, Colors.orange.shade400),
      _ChartData(
        'Acquisition',
        results.acquisitionCost,
        Colors.purple.shade400,
      ),
    ].where((d) => d.value > 0).toList();

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Cost Structure',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 200,
            child: PieChart(
              PieChartData(
                sectionsSpace: 2,
                centerSpaceRadius: 50,
                sections: data.map((d) {
                  return PieChartSectionData(
                    value: d.value,
                    title: '',
                    color: d.color,
                    radius: 50,
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 16),
          ...data.map(
            (d) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: d.color,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      d.label,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  Text(
                    '\$${d.value.toStringAsFixed(0)}',
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

  Widget _buildMetricsSection(EmailRoiResults results, NumberFormat format) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Campaign Metrics',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 16),
          _buildMetricRow(
            'Emails Opened',
            results.emailsOpened.toStringAsFixed(0),
          ),
          _buildMetricRow('Clicks', results.clicks.toStringAsFixed(0)),
          _buildMetricRow(
            'Conversions',
            results.conversions.toStringAsFixed(0),
          ),
          _buildMetricRow(
            'Unsubscribes',
            results.unsubscribes.toStringAsFixed(0),
          ),
          _buildMetricRow(
            'Immediate Revenue',
            format.format(results.immediateRevenue),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.white54, fontSize: 12),
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
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Business Model Toggle
          Row(
            children: [
              Expanded(
                child: _buildToggleButton(
                  'E-commerce',
                  inputs.businessModel == 'ecommerce',
                  () => ref
                      .read(emailRoiInputsProvider.notifier)
                      .updateField('businessModel', 'ecommerce'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildToggleButton(
                  'Lead Gen',
                  inputs.businessModel == 'leadgen',
                  () => ref
                      .read(emailRoiInputsProvider.notifier)
                      .updateField('businessModel', 'leadgen'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          _buildSectionHeader('Investment Inputs'),
          _buildInputField('ESP Cost (\$)', inputs.espCost, 'espCost'),
          _buildInputField(
            'Software Cost (\$)',
            inputs.softwareCost,
            'softwareCost',
          ),
          _buildInputField('Team Hours', inputs.teamHours, 'teamHours'),
          _buildInputField('Hourly Rate (\$)', inputs.hourlyRate, 'hourlyRate'),
          _buildInputField('Agency Fees (\$)', inputs.agencyFees, 'agencyFees'),
          _buildInputField(
            'Content Cost (\$)',
            inputs.contentCost,
            'contentCost',
          ),
          _buildInputField('List Cost (\$)', inputs.listCost, 'listCost'),

          const SizedBox(height: 24),
          _buildSectionHeader('Campaign Metrics'),
          _buildInputField('Emails Sent', inputs.emailsSent, 'emailsSent'),
          _buildInputField('Open Rate (%)', inputs.openRate, 'openRate'),
          _buildInputField('CTR (%)', inputs.ctr, 'ctr'),
          _buildInputField(
            'Conversion Rate (%)',
            inputs.conversionRate,
            'conversionRate',
          ),
          _buildInputField(
            'Unsubscribe Rate (%)',
            inputs.unsubscribeRate,
            'unsubscribeRate',
          ),

          const SizedBox(height: 24),
          _buildSectionHeader('Value Metrics'),
          _buildInputField(
            inputs.businessModel == 'ecommerce'
                ? 'AOV (\$)'
                : 'Value/Lead (\$)',
            inputs.businessModel == 'ecommerce'
                ? inputs.aov
                : inputs.valuePerLead,
            inputs.businessModel == 'ecommerce' ? 'aov' : 'valuePerLead',
          ),
          _buildInputField('Customer LTV (\$)', inputs.ltv, 'ltv'),
          _buildInputField(
            'Subscriber Acquisition Cost (\$)',
            inputs.subscriberAcquisitionCost,
            'subscriberAcquisitionCost',
          ),
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
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeader('"What-If" Planner'),
          const SizedBox(height: 16),
          _buildSliderInput(
            'Improve Open Rate',
            inputs.whatIfOpenRate,
            0,
            10,
            'whatIfOpenRate',
            suffix: '%',
          ),
          const SizedBox(height: 16),
          _buildSliderInput(
            'Improve Conversion Rate',
            inputs.whatIfConversionRate,
            0,
            5,
            'whatIfConversionRate',
            suffix: '%',
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.profitGreen.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: AppTheme.profitGreen.withValues(alpha: 0.3),
              ),
            ),
            child: Column(
              children: [
                const Text(
                  'POTENTIAL ADDITIONAL PROFIT',
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.white54,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '+${format.format(results.profitUplift)}',
                  style: const TextStyle(
                    fontSize: 24,
                    color: AppTheme.profitGreen,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),
          _buildSectionHeader('A/B Test Uplift'),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildInputField(
                  'Conv A (%)',
                  inputs.abConversionA,
                  'abConversionA',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildInputField(
                  'Conv B (%)',
                  inputs.abConversionB,
                  'abConversionB',
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.purple.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.purple.withValues(alpha: 0.3)),
            ),
            child: Column(
              children: [
                const Text(
                  'PROJECTED REVENUE GAIN',
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.white54,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '+${format.format(results.abUplift)}',
                  style: TextStyle(
                    fontSize: 24,
                    color: Colors.purple.shade400,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),
          _buildSectionHeader('Deliverability Loss'),
          const SizedBox(height: 16),
          _buildInputField('Bounce Rate (%)', inputs.bounceRate, 'bounceRate'),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.red.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
            ),
            child: Column(
              children: [
                const Text(
                  'ESTIMATED LOST REVENUE',
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.white54,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  format.format(results.lostRevenue),
                  style: TextStyle(
                    fontSize: 24,
                    color: Colors.red.shade400,
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

  Widget _buildSectionHeader(String title) {
    return Text(
      title.toUpperCase(),
      style: const TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.bold,
        color: Colors.white38,
        letterSpacing: 1.5,
      ),
    );
  }

  Widget _buildToggleButton(String label, bool isActive, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isActive
              ? AppTheme.primaryBlue
              : Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isActive
                ? AppTheme.primaryBlue
                : Colors.white.withValues(alpha: 0.1),
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: isActive ? Colors.white : Colors.white54,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField(String label, double value, String field) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.white70,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          TextFormField(
            initialValue: value.toString(),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            style: const TextStyle(color: Colors.white),
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
                borderSide: const BorderSide(color: AppTheme.primaryBlue),
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

  Widget _buildSliderInput(
    String label,
    double value,
    double min,
    double max,
    String field, {
    String suffix = '',
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: const TextStyle(fontSize: 12, color: Colors.white70),
            ),
            Text(
              '+${value.toStringAsFixed(1)}$suffix',
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.primaryBlue,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        Slider(
          value: value,
          min: min,
          max: max,
          divisions: ((max - min) * 10).toInt(),
          activeColor: AppTheme.primaryBlue,
          inactiveColor: Colors.white.withValues(alpha: 0.1),
          onChanged: (val) {
            ref.read(emailRoiInputsProvider.notifier).updateField(field, val);
          },
        ),
      ],
    );
  }
}

class _ChartData {
  final String label;
  final double value;
  final Color color;

  _ChartData(this.label, this.value, this.color);
}
