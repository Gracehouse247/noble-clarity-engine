import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../core/app_theme.dart';
import '../providers/financial_provider.dart';
import '../services/api_service.dart';

class ScenarioPlannerScreen extends ConsumerStatefulWidget {
  const ScenarioPlannerScreen({super.key});

  @override
  ConsumerState<ScenarioPlannerScreen> createState() =>
      _ScenarioPlannerScreenState();
}

class _ScenarioPlannerScreenState extends ConsumerState<ScenarioPlannerScreen> {
  double _marketingSpend = 45000;
  double _newHires = 3;
  double _pricingAdjustment = 0; // % change
  bool _isSimulating = false;
  String? _aiVerdict;

  Future<void> _runAiSimulation() async {
    final financialDataAsync = ref.read(financialDataProvider);
    if (financialDataAsync.value == null) return;

    setState(() {
      _isSimulating = true;
      _aiVerdict = null;
    });

    try {
      final apiService = ref.read(apiServiceProvider);
      final currentData = financialDataAsync.value!;

      final prompt =
          """
      Analyze this what-if scenario:
      - Increase Marketing Spend to \$${_marketingSpend.toInt()} (Current: \$${currentData.marketingSpend.toInt()})
      - Hire ${_newHires.toInt()} additional engineers (Est. \$8k/mo each)
      - Adjust Pricing by ${_pricingAdjustment.toInt()}%
      
      Current Runway: ${(currentData.currentAssets / currentData.operatingExpenses).toStringAsFixed(1)} months.
      Current Revenue: \$${currentData.revenue.toInt()}.
      
      Provide a brief tactical verdict (max 3 sentences) on whether this scenario is 'VIABLE', 'RISKY', or 'FATAL' and why.
      """;

      final verdict = await apiService.getAiFinancialInsights(
        currentData,
        question: prompt,
      );

      if (mounted) {
        setState(() {
          _aiVerdict = verdict;
          _isSimulating = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _aiVerdict = "Unable to reach tactical engine. Error: $e";
          _isSimulating = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ref
        .watch(financialDataProvider)
        .when(
          data: (data) => _buildContent(context, data),
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, stack) => Center(child: Text('Error: $err')),
        );
  }

  Widget _buildContent(BuildContext context, dynamic data) {
    // Model variables
    final hiringCost = _newHires * 8000; // Est monthly cost per hire
    final totalNewMonthlyBurn = _marketingSpend + hiringCost;
    final baseBurn = data.operatingExpenses;
    final projectedMonthlyBurn =
        baseBurn + (totalNewMonthlyBurn - data.marketingSpend);

    // Rough revenue lift model: 1.5x return on ad spend Increase + 5% per hire efficiency
    final marketingLift = (_marketingSpend - data.marketingSpend) * 1.5;
    final hireEfficiencyLift = data.revenue * (_newHires * 0.05);
    final pricingLift = data.revenue * (_pricingAdjustment / 100);
    final projectedRevenue =
        data.revenue + marketingLift + hireEfficiencyLift + pricingLift;

    final projectedRunway =
        data.currentAssets /
        (projectedMonthlyBurn > 0 ? projectedMonthlyBurn : 1);
    final isViable = projectedRunway > 4; // Arbitrary 4 month safety limit

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.primaryBlue.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(4),
              border: Border.all(
                color: AppTheme.primaryBlue.withValues(alpha: 0.2),
              ),
            ),
            child: const Text(
              'ACTIVE SCENARIO',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryBlue,
              ),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Q4 Expansion',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const Text(
            'Projecting impact of aggressive hiring vs. runway.',
            style: TextStyle(fontSize: 14, color: Colors.white54),
          ),

          const SizedBox(height: 32),

          // Simulation Chart
          Container(
            height: 250,
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF13151F).withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'PROJECTED CASH RUNWAY',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.white24,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      '${projectedRunway.toStringAsFixed(1)} Mo.',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Icon(
                      isViable ? Icons.trending_up : Icons.trending_down,
                      size: 16,
                      color: isViable ? AppTheme.profitGreen : AppTheme.lossRed,
                    ),
                    Text(
                      isViable ? 'VIABLE' : 'RISKY',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isViable
                            ? AppTheme.profitGreen
                            : AppTheme.lossRed,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Expanded(
                  child: LineChart(
                    LineChartData(
                      gridData: const FlGridData(show: false),
                      titlesData: const FlTitlesData(show: false),
                      borderData: FlBorderData(show: false),
                      lineBarsData: [
                        LineChartBarData(
                          spots: [
                            FlSpot(0, data.currentAssets / 100000),
                            FlSpot(
                              3,
                              (data.currentAssets -
                                      (projectedMonthlyBurn * 3) +
                                      (projectedRevenue * 0.5)) /
                                  100000,
                            ),
                            FlSpot(
                              6,
                              (data.currentAssets -
                                      (projectedMonthlyBurn * 6) +
                                      (projectedRevenue * 1.5)) /
                                  100000,
                            ),
                            FlSpot(
                              9,
                              (data.currentAssets -
                                      (projectedMonthlyBurn * 9) +
                                      (projectedRevenue * 3)) /
                                  100000,
                            ),
                          ],
                          isCurved: true,
                          color: isViable
                              ? AppTheme.primaryBlue
                              : AppTheme.lossRed,
                          barWidth: 4,
                          dotData: const FlDotData(show: false),
                          belowBarData: BarAreaData(
                            show: true,
                            color:
                                (isViable
                                        ? AppTheme.primaryBlue
                                        : AppTheme.lossRed)
                                    .withValues(alpha: 0.1),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Controls Panel
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF13151F).withValues(alpha: 0.6),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.tune, size: 18, color: AppTheme.primaryBlue),
                        const SizedBox(width: 8),
                        const Text(
                          'VARIABLES',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                      ],
                    ),
                    const Text(
                      'Auto-Save On',
                      style: TextStyle(fontSize: 10, color: Colors.white24),
                    ),
                  ],
                ),
                const Divider(height: 32, color: Colors.white10),

                // Marketing Spend Slider
                _buildSlider(
                  label: 'MARKETING SPEND',
                  value: _marketingSpend,
                  min: 0,
                  max: 200000,
                  displayValue:
                      '\$${_marketingSpend.toInt().toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                  onChanged: (val) => setState(() => _marketingSpend = val),
                ),

                const SizedBox(height: 24),

                // New Hires Slider
                _buildSlider(
                  label: 'NEW HIRES (ENG)',
                  value: _newHires,
                  min: 0,
                  max: 20,
                  displayValue: '+${_newHires.toInt()}',
                  onChanged: (val) => setState(() => _newHires = val),
                ),

                const SizedBox(height: 24),

                // Pricing Slider
                _buildSlider(
                  label: 'PRICING ADJUSTMENT',
                  value: _pricingAdjustment,
                  min: -50,
                  max: 100,
                  displayValue: '${_pricingAdjustment.toInt()}%',
                  onChanged: (val) => setState(() => _pricingAdjustment = val),
                ),

                const SizedBox(height: 32),

                // Simulation Button
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton(
                    onPressed: _isSimulating ? null : _runAiSimulation,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      padding: EdgeInsets.zero,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ).copyWith(elevation: ButtonStyleButton.allOrNull(0)),
                    child: Ink(
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [AppTheme.primaryBlue, AppTheme.aiPurple],
                        ),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Container(
                        alignment: Alignment.center,
                        child: _isSimulating
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Text(
                                'PREDICT FUTURE IMPACT',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  letterSpacing: 1,
                                ),
                              ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Impact Message / AI Verdict
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: (isViable ? AppTheme.profitGreen : AppTheme.lossRed)
                  .withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: IntrinsicHeight(
              child: Row(
                children: [
                  Container(
                    width: 4,
                    decoration: BoxDecoration(
                      color: isViable ? AppTheme.profitGreen : AppTheme.lossRed,
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(16),
                        bottomLeft: Radius.circular(16),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            isViable
                                ? Icons.check_circle
                                : Icons.warning_rounded,
                            color: isViable
                                ? AppTheme.profitGreen
                                : AppTheme.lossRed,
                            size: 24,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      _aiVerdict != null
                                          ? 'AI STRATEGIC VERDICT'
                                          : 'STRATEGIC ENGINE',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 6,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        color:
                                            (isViable
                                                    ? AppTheme.profitGreen
                                                    : AppTheme.lossRed)
                                                .withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: Text(
                                        isViable ? 'VIABLE' : 'RISKY',
                                        style: TextStyle(
                                          color: isViable
                                              ? AppTheme.profitGreen
                                              : AppTheme.lossRed,
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  _aiVerdict ??
                                      'Run the AI simulation to get a deep strategic analysis of your custom scenario.',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.white.withValues(alpha: 0.8),
                                    height: 1.4,
                                  ),
                                ),
                                if (_aiVerdict == null) ...[
                                  const SizedBox(height: 8),
                                  Text(
                                    'Projected Runway: ${projectedRunway.toStringAsFixed(1)} months.',
                                    style: const TextStyle(
                                      fontSize: 11,
                                      color: Colors.white38,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildSlider({
    required String label,
    required double value,
    required double min,
    required double max,
    required String displayValue,
    required Function(double) onChanged,
  }) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: Colors.white54,
              ),
            ),
            Text(
              displayValue,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SliderTheme(
          data: SliderTheme.of(context).copyWith(
            activeTrackColor: AppTheme.primaryBlue,
            inactiveTrackColor: Colors.white.withValues(alpha: 0.05),
            thumbColor: Colors.white,
            overlayColor: AppTheme.primaryBlue.withValues(alpha: 0.2),
            trackHeight: 4,
          ),
          child: Slider(value: value, min: min, max: max, onChanged: onChanged),
        ),
      ],
    );
  }
}
