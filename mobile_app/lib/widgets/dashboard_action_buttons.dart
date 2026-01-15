import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../core/app_router.dart';
import '../providers/multi_tenant_provider.dart';
import '../screens/data_source_selection_screen.dart';

class DashboardActionButtons extends ConsumerWidget {
  const DashboardActionButtons({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Row(
        children: [
          _buildActionItem(
            context,
            'Business Profile',
            Icons.account_balance_outlined,
            const Color(0xFF259df4),
            () => ref.read(navigationProvider.notifier).state =
                AppRoute.businessProfile,
          ),
          const SizedBox(width: 12),
          _buildActionItem(
            context,
            'Cash Flow',
            Icons.account_balance_wallet_outlined,
            const Color(0xFF25f478),
            () =>
                ref.read(navigationProvider.notifier).state = AppRoute.cashFlow,
          ),
          const SizedBox(width: 12),
          _buildActionItem(
            context,
            'Connect Data',
            Icons.link,
            const Color(0xFFF4A125),
            () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const DataSourceSelectionScreen(),
              ),
            ),
          ),
          const SizedBox(width: 12),
          _buildActionItem(
            context,
            'Integrations',
            Icons.hub_outlined,
            const Color(0xFFf4a261),
            () => ref.read(navigationProvider.notifier).state =
                AppRoute.integrations,
          ),
          const SizedBox(width: 12),
          _buildActionItem(
            context,
            'Update Data',
            Icons.edit_note,
            const Color(0xFFe76f51),
            () => ref.read(navigationProvider.notifier).state =
                AppRoute.dataEntry,
          ),
          const SizedBox(width: 12),
          _buildActionItem(
            context,
            'Analyze Trends',
            Icons.description_outlined,
            Colors.orange,
            () => ref.read(navigationProvider.notifier).state = AppRoute.roi,
          ),
          const SizedBox(width: 12),
          _buildActionItem(
            context,
            'Save Snapshot',
            Icons.camera_alt_outlined,
            Colors.purpleAccent,
            () {
              final activeId = ref.read(activeProfileIdProvider);
              ref.read(profilesDataProvider.notifier).saveSnapshot(activeId);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Financial snapshot saved to history!'),
                  backgroundColor: AppTheme.profitGreen,
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildActionItem(
    BuildContext context,
    String label,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
