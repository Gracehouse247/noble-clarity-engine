import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../models/financial_models.dart';
import '../providers/multi_tenant_provider.dart';
import '../providers/financial_provider.dart';

class GoalsScreen extends ConsumerWidget {
  const GoalsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profilesData = ref.watch(profilesDataProvider);
    final activeId = ref.watch(activeProfileIdProvider);
    final activeProfile = profilesData[activeId];
    final goals = activeProfile?.goals ?? [];

    // Fetch real financial data for scoring
    final financialDataAsync = ref.watch(financialDataProvider);

    return Scaffold(
      backgroundColor: const Color(0xFF0F1116), // Deep Space Black
      body: financialDataAsync.when(
        data: (data) => _buildBody(context, ref, activeId, goals, data),
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppTheme.primaryBlue),
        ),
        error: (err, stack) => _buildErrorState(err.toString()),
      ),
    );
  }

  Widget _buildBody(
    BuildContext context,
    WidgetRef ref,
    String activeId,
    List<FinancialGoal> goals,
    FinancialData data,
  ) {
    // Calculate Series A Readiness Score (Real Algo)
    double readinessScore = _calculateReadinessScore(data);

    // Derived Achievements
    final hasRevenue = data.revenue >= 10000;
    final isProfitable =
        (data.revenue - data.cogs - data.operatingExpenses) > 0;
    final hasRunway =
        (data.currentAssets /
            (data.operatingExpenses > 0 ? data.operatingExpenses : 1)) >=
        12;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'MISSION CONTROL',
            style: TextStyle(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.w900,
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Series A Readiness Status',
            style: TextStyle(color: Colors.white.withValues(alpha: 0.5)),
          ),
          const SizedBox(height: 32),

          // 1. Interactive Progress Dial
          Center(
            child: Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  height: 200,
                  width: 200,
                  child: CircularProgressIndicator(
                    value: readinessScore,
                    strokeWidth: 15,
                    backgroundColor: Colors.white12,
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      AppTheme.profitGreen,
                    ),
                    strokeCap: StrokeCap.round,
                  ),
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '${(readinessScore * 100).toInt()}%',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Text(
                      'READY',
                      style: TextStyle(
                        color: AppTheme.profitGreen,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 48),

          // 2. Badges Grid
          const Text(
            'ACHIEVEMENTS',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 14,
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 16),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 3,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            children: [
              _buildBadge('First \$10k', Icons.monetization_on, hasRevenue),
              _buildBadge('Profitability', Icons.trending_up, isProfitable),
              _buildBadge('12mo Runway', Icons.timer, hasRunway),
              _buildBadge('Global', Icons.public, false),
              _buildBadge('Unicorn', Icons.auto_awesome, false),
              _buildBadge('IPO', Icons.domain, false),
            ],
          ),

          const SizedBox(height: 48),

          // 3. Active Objectives List (Old Goals)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'ACTIVE OBJECTIVES',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
              IconButton(
                icon: const Icon(
                  Icons.add_circle_outline,
                  color: AppTheme.primaryBlue,
                ),
                onPressed: () => _showAddGoalModal(context, ref, activeId),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (goals.isEmpty)
            _buildEmptyState()
          else
            ...goals.map(
              (goal) => _buildGoalCard(context, ref, activeId, goal),
            ),

          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _buildBadge(String label, IconData icon, bool unlocked) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: unlocked
                ? AppTheme.profitGreen.withValues(alpha: 0.1)
                : Colors.white.withValues(alpha: 0.05),
            border: Border.all(
              color: unlocked ? AppTheme.profitGreen : Colors.white10,
              width: 2,
            ),
            boxShadow: unlocked
                ? [
                    BoxShadow(
                      color: AppTheme.profitGreen.withValues(alpha: 0.3),
                      blurRadius: 12,
                      spreadRadius: 2,
                    ),
                  ]
                : [],
          ),
          child: Icon(
            icon,
            color: unlocked ? AppTheme.profitGreen : Colors.white24,
            size: 24,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: unlocked ? Colors.white : Colors.white38,
            fontSize: 10,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: const Center(
        child: Column(
          children: [
            Icon(Icons.flag_outlined, size: 48, color: Colors.white24),
            SizedBox(height: 16),
            Text(
              "No Active Mission Objectives",
              style: TextStyle(color: Colors.white54),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGoalCard(
    BuildContext context,
    WidgetRef ref,
    String profileId,
    FinancialGoal goal,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E2C),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: goal.achieved
              ? AppTheme.profitGreen.withValues(alpha: 0.2)
              : Colors.white.withValues(alpha: 0.05),
        ),
      ),
      child: Row(
        children: [
          Checkbox(
            value: goal.achieved,
            activeColor: AppTheme.profitGreen,
            checkColor: Colors.black,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(4),
            ),
            onChanged: (val) {
              final updated = goal.copyWith(achieved: val ?? false);
              ref
                  .read(profilesDataProvider.notifier)
                  .updateGoal(profileId, updated);
            },
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  goal.name,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    decoration: goal.achieved
                        ? TextDecoration.lineThrough
                        : null,
                  ),
                ),
                Text(
                  '${goal.metric.toUpperCase()} â€¢ ${goal.deadline}',
                  style: const TextStyle(color: Colors.white54, fontSize: 11),
                ),
              ],
            ),
          ),
          Text(
            goal.targetValue.toInt().toString(),
            style: const TextStyle(
              color: AppTheme.profitGreen,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(
              Icons.delete_outline,
              color: Colors.white24,
              size: 20,
            ),
            onPressed: () {
              ref
                  .read(profilesDataProvider.notifier)
                  .deleteGoal(profileId, goal.id);
            },
          ),
        ],
      ),
    );
  }

  void _showAddGoalModal(
    BuildContext context,
    WidgetRef ref,
    String profileId,
  ) {
    final nameController = TextEditingController();
    final targetController = TextEditingController();
    String selectedMetric = 'Revenue';

    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF13151F),
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 24,
          right: 24,
          top: 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'NEW OBJECTIVE',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: nameController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: 'Objective Name',
                labelStyle: TextStyle(color: Colors.white54),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white10),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: targetController,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(
                      labelText: 'Target Value',
                      labelStyle: TextStyle(color: Colors.white54),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                DropdownButton<String>(
                  value: selectedMetric,
                  dropdownColor: const Color(0xFF13151F),
                  style: const TextStyle(color: AppTheme.primaryBlue),
                  items: ['Revenue', 'Burn', 'Users', 'Runway'].map((m) {
                    return DropdownMenuItem(value: m, child: Text(m));
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) selectedMetric = val;
                  },
                ),
              ],
            ),
            const SizedBox(height: 32),
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
                  if (nameController.text.isNotEmpty) {
                    final goal = FinancialGoal(
                      id: '',
                      name: nameController.text,
                      metric: selectedMetric,
                      targetValue:
                          double.tryParse(targetController.text) ?? 1000,
                      deadline: 'Q1 2026',
                    );
                    ref
                        .read(profilesDataProvider.notifier)
                        .addGoal(profileId, goal);
                    Navigator.pop(context);
                  }
                },
                child: const Text('ENGAGE MISSION'),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  // --- Helpers ---

  double _calculateReadinessScore(FinancialData data) {
    double score = 0.0;

    // 1. ARR Scoring (Target: $1M+ for 40 points)
    final arr = data.arr;
    if (arr >= 1000000) {
      score += 0.40;
    } else {
      score += (arr / 1000000) * 0.40;
    }

    // 2. Runway Scoring (Target: 18+ months for 30 points)
    final runway = data.operatingExpenses > 0
        ? (data.currentAssets / data.operatingExpenses)
        : 24.0;
    if (runway >= 18) {
      score += 0.30;
    } else {
      score += (runway / 18) * 0.30;
    }

    // 3. Gross Margin Scoring (Target: 70%+ for 30 points)
    final grossMargin = data.revenue > 0
        ? ((data.revenue - data.cogs) / data.revenue)
        : 0.0;
    if (grossMargin >= 0.70) {
      score += 0.30;
    } else {
      score += (grossMargin / 0.70) * 0.30;
    }

    return score.clamp(0.01, 0.99); // Scale 0-1
  }

  Widget _buildErrorState(String error) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, color: Colors.redAccent, size: 48),
            const SizedBox(height: 16),
            Text(
              "Readiness Calculation Failed",
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.7),
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              error,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.white38, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}
