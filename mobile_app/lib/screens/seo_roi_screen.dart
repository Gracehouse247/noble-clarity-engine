import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:glassmorphism_ui/glassmorphism_ui.dart';
import 'package:intl/intl.dart';
import '../core/app_theme.dart';
import '../widgets/seo_ai_coach.dart';

class SeoRoiScreen extends ConsumerStatefulWidget {
  const SeoRoiScreen({super.key});

  @override
  ConsumerState<SeoRoiScreen> createState() => _SeoRoiScreenState();
}

class _SeoRoiScreenState extends ConsumerState<SeoRoiScreen> {
  // Calculator States
  final TextEditingController _trafficController = TextEditingController(
    text: '42500',
  );
  final TextEditingController _convController = TextEditingController(
    text: '2.4',
  );
  final TextEditingController _valueController = TextEditingController(
    text: '8.40',
  );
  final TextEditingController _costController = TextEditingController(
    text: '2500',
  );

  double _calculatedRoi = 8.2;
  double _potentialRevenue = 8568;

  @override
  void initState() {
    super.initState();
    _calculateMetrics();
  }

  void _calculateMetrics() {
    final traffic = double.tryParse(_trafficController.text) ?? 0;
    final conv = (double.tryParse(_convController.text) ?? 0) / 100;
    final value = double.tryParse(_valueController.text) ?? 0;
    final cost = double.tryParse(_costController.text) ?? 1;

    setState(() {
      _potentialRevenue = traffic * conv * value;
      _calculatedRoi = cost > 0 ? _potentialRevenue / cost : 0;
    });
  }

  void _showAiCoachForSEO(BuildContext context) {
    final traffic = double.tryParse(_trafficController.text) ?? 0;
    final conv = double.tryParse(_convController.text) ?? 0;
    final value = double.tryParse(_valueController.text) ?? 0;
    final cost = double.tryParse(_costController.text) ?? 1;

    final data = SeoMetricData(
      traffic: traffic,
      conversionRate: conv,
      valuePerLead: value,
      monthlyCost: cost,
      potentialRevenue: _potentialRevenue,
      roi: _calculatedRoi,
    );

    const contextPrompt = '''
You are an expert SEO Strategist and Digital Marketing Coach with 25 years of experience.
Your goal is to analyze the user's SEO performance metrics and provide high-level strategic advice to improve their organic visibility, conversion rates, and overall ROI.

Understand the following context:
- "Conversion Rate" refers to Traffic-to-Lead conversion.
- "Value per Lead" is the estimated monetary value of a qualified lead.
- "SaaS" or "B2B" strategies often apply here.

Your advice should be:
1. Data-driven: Reference the user's specific numbers (ROI, Traffic, etc.).
2. Actionable: Suggest concrete steps (e.g., "Improve page speed", "Target long-tail keywords").
3. Strategic: Focus on high-impact changes (e.g., "Increasing conversion by 0.5% yields \$X more").

When answering:
- Keep responses concise and easy to read on mobile.
- Use bullet points for lists.
- Be encouraging but realistic.
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
                      Icons.manage_search,
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
                          'AI SEO Coach',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Expert Search Strategy Analysis',
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
              child: SeoAiCoach(contextPrompt: contextPrompt, data: data),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0E1A), // Consistent background
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAiCoachForSEO(context),
        backgroundColor: AppTheme.primaryBlue,
        icon: const Icon(Icons.psychology, color: Colors.white),
        label: const Text(
          'AI SEO Coach',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: Stack(
        children: [
          // Background Aesthetic Glows
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.primaryBlue.withValues(alpha: 0.15),
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
                color: Colors.purple.withValues(alpha: 0.1),
              ),
            ),
          ),

          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              _buildSliverAppBar(context),
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    const SizedBox(height: 10),
                    _buildMainKpiCard(),
                    const SizedBox(height: 16), // Consistent spacing
                    _buildSectionHeader('SEO PERFORMANCE CALCULATOR'),
                    const SizedBox(height: 16),
                    _buildCalculatorCard(),
                    const SizedBox(height: 16), // Consistent spacing
                    _buildSectionHeader('TOP PERFORMING KEYWORDS'),
                    const SizedBox(height: 16),
                    _buildKeywordList(),
                    const SizedBox(height: 16), // Consistent spacing
                    _buildDomainAuthorityCard(),
                    const SizedBox(height: 32),
                    _buildLogicExplainer(),
                    const SizedBox(height: 120),
                  ]),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar(BuildContext context) {
    return SliverAppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      expandedHeight: 100,
      floating: true,
      pinned: true,
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
      flexibleSpace: FlexibleSpaceBar(
        titlePadding: const EdgeInsets.only(left: 60, bottom: 16),
        centerTitle: false,
        title: const Text(
          'SEO Intelligence',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w900,
            letterSpacing: -0.5,
            fontSize: 20,
          ),
        ),
      ),
    );
  }

  Widget _buildMainKpiCard() {
    final isPositive = _calculatedRoi > 1.0;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withValues(alpha: 0.08),
            Colors.white.withValues(alpha: 0.03),
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _buildQuickStat(
            'Organic Traffic',
            NumberFormat.compact().format(
              double.parse(_trafficController.text),
            ),
          ),
          _buildDivider(),
          _buildQuickStat(
            'Monthly Value',
            '\$${NumberFormat.compact().format(_potentialRevenue)}',
          ),
          _buildDivider(),
          _buildQuickStat(
            'SEO ROI',
            '${_calculatedRoi.toStringAsFixed(1)}x',
            color: isPositive ? AppTheme.profitGreen : AppTheme.lossRed,
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 40,
      width: 1,
      color: Colors.white.withValues(alpha: 0.1),
    );
  }

  Widget _buildQuickStat(String label, String value, {Color? color}) {
    return Column(
      children: [
        Text(
          label.toUpperCase(),
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.5),
            fontSize: 9,
            fontWeight: FontWeight.w800,
            letterSpacing: 1,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            color: color ?? Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.w900,
            letterSpacing: -0.5,
          ),
        ),
      ],
    );
  }

  Widget _buildCalculatorCard() {
    return GlassContainer(
      blur: 15,
      opacity: 0.05,
      borderRadius: BorderRadius.circular(24),
      border: Border.fromBorderSide(
        BorderSide(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _buildCalcInput(
              'Estimated Monthly Traffic',
              _trafficController,
              Icons.trending_up,
              'users',
            ),
            const SizedBox(height: 16),
            _buildCalcInput(
              'Traffic-to-Lead Conv. %',
              _convController,
              Icons.ads_click,
              '%',
            ),
            const SizedBox(height: 16),
            _buildCalcInput(
              'Average Value per Lead',
              _valueController,
              Icons.payments,
              '\$',
            ),
            const SizedBox(height: 16),
            _buildCalcInput(
              'Monthly SEO Cost',
              _costController,
              Icons.savings,
              '\$',
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.primaryBlue.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                ),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.auto_awesome,
                    color: AppTheme.primaryBlue,
                    size: 20,
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'AI Insight: Reducing conversion friction by 0.5% would yield an extra \$1.2k/mo.',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCalcInput(
    String label,
    TextEditingController controller,
    IconData icon,
    String suffix,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white54, fontSize: 12),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          onChanged: (_) => _calculateMetrics(),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: AppTheme.primaryBlue, size: 18),
            suffixText: suffix,
            suffixStyle: const TextStyle(color: Colors.white30),
            filled: true,
            fillColor: Colors.white.withValues(alpha: 0.03),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
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
        ),
      ],
    );
  }

  Widget _buildKeywordList() {
    final keywords = [
      {'text': 'Financial Intelligence', 'pos': '#1', 'trend': '+12%'},
      {'text': 'SaaS ROI Calculator', 'pos': '#3', 'trend': '+5%'},
      {'text': 'Noble Clarity Engine', 'pos': '#1', 'trend': '0%'},
      {'text': 'Predictive Analytics SME', 'pos': '#12', 'trend': '+18%'},
    ];

    return Column(
      children: keywords.map((k) {
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.02),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withValues(alpha: 0.04)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.05),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.tag,
                  color: AppTheme.primaryBlue,
                  size: 16,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      k['text']!,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Search Position: ${k['pos']}',
                      style: const TextStyle(
                        color: Colors.white38,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                k['trend']!,
                style: TextStyle(
                  color: k['trend']!.contains('+')
                      ? AppTheme.profitGreen
                      : Colors.white24,
                  fontWeight: FontWeight.w900,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildDomainAuthorityCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryBlue.withValues(alpha: 0.15),
            Colors.purple.withValues(alpha: 0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppTheme.primaryBlue.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Domain Authority',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                  fontSize: 18,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.profitGreen.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'HEALTHY',
                  style: TextStyle(
                    color: AppTheme.profitGreen,
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Your site authority has increased by 4 points since last month, placing you in the top 15% of your industry peer group.',
            style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.5),
          ),
          const SizedBox(height: 24),
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 100,
                height: 100,
                child: CircularProgressIndicator(
                  value: 0.42,
                  strokeWidth: 10,
                  color: AppTheme.primaryBlue,
                  backgroundColor: Colors.white.withValues(alpha: 0.05),
                  strokeCap: StrokeCap.round,
                ),
              ),
              const Column(
                children: [
                  Text(
                    '42',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  Text(
                    'SCORE',
                    style: TextStyle(color: Colors.white30, fontSize: 10),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.w900,
        color: Colors.white.withValues(alpha: 0.4),
        letterSpacing: 2,
      ),
    );
  }

  Widget _buildLogicExplainer() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.info_outline, color: Colors.white30, size: 18),
              SizedBox(width: 12),
              Text(
                'Intelligence Dashboard Logic',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildLogicStep(
            '1',
            'Traffic Retrieval',
            'We cross-reference keywords with search volume data to estimate monthly organic reach.',
          ),
          _buildLogicStep(
            '2',
            'Conversion Valuation',
            'Using your traffic-to-lead ratios, we calculate the specific monetary value each organic visitor brings to your business.',
          ),
          _buildLogicStep(
            '3',
            'ROI Formulation',
            'ROI is the ratio of Projected Value over Operational SEO Cost. A score > 3.0x is considered high-performance.',
          ),
        ],
      ),
    );
  }

  Widget _buildLogicStep(String num, String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            num,
            style: const TextStyle(
              color: AppTheme.primaryBlue,
              fontWeight: FontWeight.w900,
              fontSize: 20,
            ),
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
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  desc,
                  style: const TextStyle(
                    color: Colors.white54,
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
}
