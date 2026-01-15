import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../core/app_router.dart';
import '../providers/auth_provider.dart';

class AppDrawer extends ConsumerWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final currentRoute = ref.watch(navigationProvider);

    return Drawer(
      backgroundColor: AppTheme.backgroundDark,
      child: Container(
        decoration: BoxDecoration(
          border: Border(
            right: BorderSide(
              color: Colors.white.withValues(alpha: 0.05),
              width: 1,
            ),
          ),
        ),
        child: Column(
          children: [
            _buildHeader(authState),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 12),
                children: [
                  _buildSectionTitle('CORE'),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Dashboard',
                    icon: Icons.dashboard_outlined,
                    route: AppRoute.dashboard,
                    isActive: currentRoute == AppRoute.dashboard,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'History & Backup',
                    icon: Icons.history,
                    route: AppRoute.history,
                    isActive: currentRoute == AppRoute.history,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Notifications',
                    icon: Icons.notifications_none,
                    route: AppRoute.notifications,
                    isActive: currentRoute == AppRoute.notifications,
                  ),

                  const SizedBox(height: 24),
                  _buildSectionTitle('INTELLIGENCE'),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'AI Strategic Coach',
                    icon: Icons.psychology_alt,
                    route: AppRoute.aiCoach,
                    isActive: currentRoute == AppRoute.aiCoach,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Insights Feed',
                    icon: Icons.auto_awesome_motion,
                    route: AppRoute.aiInsights,
                    isActive: currentRoute == AppRoute.aiInsights,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Revenue Explorer',
                    icon: Icons.insights,
                    route: AppRoute.roi,
                    isActive: currentRoute == AppRoute.roi,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Email Analysis',
                    icon: Icons.alternate_email,
                    route: AppRoute.emailRoi,
                    isActive: currentRoute == AppRoute.emailRoi,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Social Intelligence',
                    icon: Icons.share_outlined,
                    route: AppRoute.socialRoi,
                    isActive: currentRoute == AppRoute.socialRoi,
                  ),

                  const SizedBox(height: 24),
                  _buildSectionTitle('OPERATIONS'),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Cash Flow',
                    icon: Icons.account_balance_wallet_outlined,
                    route: AppRoute.cashFlow,
                    isActive: currentRoute == AppRoute.cashFlow,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Entity Consolidation',
                    icon: Icons.layers_outlined,
                    route: AppRoute.consolidation,
                    isActive: currentRoute == AppRoute.consolidation,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Integrations',
                    icon: Icons.hub_outlined,
                    route: AppRoute.integrations,
                    isActive: currentRoute == AppRoute.integrations,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Privacy Policy',
                    icon: Icons.privacy_tip_outlined,
                    route: AppRoute.privacy,
                    isActive: currentRoute == AppRoute.privacy,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Terms of Service',
                    icon: Icons.description_outlined,
                    route: AppRoute.terms,
                    isActive: currentRoute == AppRoute.terms,
                  ),

                  const SizedBox(height: 24),
                  _buildSectionTitle('STRATEGY'),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Scenario Planner',
                    icon: Icons.rocket_launch_outlined,
                    route: AppRoute.planner,
                    isActive: currentRoute == AppRoute.planner,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Strategic Goals',
                    icon: Icons.flag_outlined,
                    route: AppRoute.goals,
                    isActive: currentRoute == AppRoute.goals,
                  ),

                  const SizedBox(height: 24),
                  _buildSectionTitle('ADMINISTRATION'),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Business Profile',
                    icon: Icons.business_outlined,
                    route: AppRoute.businessProfile,
                    isActive: currentRoute == AppRoute.businessProfile,
                  ),
                  _buildDrawerItem(
                    context,
                    ref,
                    title: 'Security & Settings',
                    icon: Icons.settings_outlined,
                    route: AppRoute.settings,
                    isActive: currentRoute == AppRoute.settings,
                  ),
                ],
              ),
            ),
            _buildFooter(context, ref),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(AuthState auth) {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 24),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Colors.white.withValues(alpha: 0.05),
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppTheme.primaryBlue, width: 2),
            ),
            child: CircleAvatar(
              radius: 20,
              backgroundColor: Colors.white12,
              backgroundImage: auth.photoUrl != null
                  ? NetworkImage(auth.photoUrl!)
                  : null,
              child: auth.photoUrl == null
                  ? const Icon(Icons.person, color: Colors.white54)
                  : null,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  auth.displayName ?? 'Guest User',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  auth.email ?? 'Standard License',
                  style: const TextStyle(color: Colors.white38, fontSize: 10),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
      child: Text(
        title,
        style: const TextStyle(
          color: AppTheme.primaryBlue,
          fontSize: 10,
          fontWeight: FontWeight.bold,
          letterSpacing: 2,
        ),
      ),
    );
  }

  Widget _buildDrawerItem(
    BuildContext context,
    WidgetRef ref, {
    required String title,
    required IconData icon,
    required AppRoute route,
    required bool isActive,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            ref.read(navigationProvider.notifier).state = route;
            Navigator.pop(context);
          },
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isActive
                  ? AppTheme.primaryBlue.withValues(alpha: 0.1)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isActive
                    ? AppTheme.primaryBlue.withValues(alpha: 0.2)
                    : Colors.transparent,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  icon,
                  size: 20,
                  color: isActive ? AppTheme.primaryBlue : Colors.white54,
                ),
                const SizedBox(width: 16),
                Text(
                  title,
                  style: TextStyle(
                    color: isActive ? Colors.white : Colors.white,
                    fontSize: 14,
                    fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                  ),
                ),
                if (isActive) ...[
                  const Spacer(),
                  Container(
                    width: 4,
                    height: 4,
                    decoration: const BoxDecoration(
                      color: AppTheme.primaryBlue,
                      shape: BoxShape.circle,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFooter(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(
            color: Colors.white.withValues(alpha: 0.05),
            width: 1,
          ),
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildSmallIconLink(Icons.help_outline, () {
                ref.read(navigationProvider.notifier).state = AppRoute.security;
                Navigator.pop(context);
              }),
              const SizedBox(width: 24),
              _buildSmallIconLink(Icons.history_edu, () {
                ref.read(navigationProvider.notifier).state = AppRoute.story;
                Navigator.pop(context);
              }),
              const SizedBox(width: 24),
              _buildSmallIconLink(Icons.logout, () {
                ref.read(authProvider.notifier).logout();
                ref.read(navigationProvider.notifier).state = AppRoute.login;
              }),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Noble Clarity Engine v2.0.1',
            style: TextStyle(color: Colors.white10, fontSize: 9),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.verified_user_outlined,
                color: Colors.white.withValues(alpha: 0.05),
                size: 8,
              ),
              const SizedBox(width: 4),
              Text(
                'ZERO-RETENTION ARCHITECTURE',
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.05),
                  fontSize: 7,
                  letterSpacing: 1,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSmallIconLink(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Icon(icon, color: Colors.white24, size: 20),
    );
  }
}
