import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../main.dart';
import '../widgets/app_drawer.dart';
import '../core/app_theme.dart';
import 'dashboard_home.dart';
import 'roi_intelligence_screen.dart';
import 'email_roi_screen.dart';
import 'social_roi_screen.dart';
import 'scenario_planner_screen.dart';
import 'goals_screen.dart';
import 'cash_flow_management_screen.dart';
import 'consolidation_screen.dart';
import 'data_entry_screen.dart';
import 'integrations_screen.dart';
import 'business_profile_screen.dart';
import 'history_screen.dart';
import 'settings_screen.dart';
import 'notifications_screen.dart';
import 'legal_pages.dart';
import '../widgets/shared_bottom_nav.dart';
import '../widgets/shared_ai_fab.dart';

class MainScreenShell extends ConsumerWidget {
  final AppRoute route;
  const MainScreenShell({super.key, required this.route});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundDark,
      drawer: const AppDrawer(),
      appBar: _buildAppBar(context, ref),
      body: _getTargetScreen(route),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: const SharedAiFab(),
      bottomNavigationBar: _shouldShowBottomNav(route)
          ? const SharedBottomNav()
          : null,
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context, WidgetRef ref) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true,
      leading: Builder(
        builder: (context) {
          return IconButton(
            icon: const Icon(Icons.menu_open, color: AppTheme.primaryBlue),
            onPressed: () => Scaffold.of(context).openDrawer(),
          );
        },
      ),
      title: Text(
        _getRouteTitle(route).toUpperCase(),
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          letterSpacing: 2,
          color: Colors.white70,
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_none, color: Colors.white70),
          onPressed: () {
            ref.read(navigationProvider.notifier).state =
                AppRoute.notifications;
          },
        ),
      ],
    );
  }

  String _getRouteTitle(AppRoute route) {
    switch (route) {
      case AppRoute.dashboard:
        return 'Control Center';
      case AppRoute.roi:
        return 'ROI Intelligence';
      case AppRoute.emailRoi:
        return 'Email Analytics';
      case AppRoute.socialRoi:
        return 'Social Metrics';
      case AppRoute.planner:
        return 'Strategic Lab';
      case AppRoute.goals:
        return 'Business Goals';
      case AppRoute.cashFlow:
        return 'Cash Flow';
      case AppRoute.consolidation:
        return 'Consolidation';
      case AppRoute.dataEntry:
        return 'Data Entry';
      case AppRoute.integrations:
        return 'Integrations';
      case AppRoute.businessProfile:
        return 'Business Profile';
      case AppRoute.history:
        return 'History & Backup';
      case AppRoute.settings:
        return 'Security & Settings';
      case AppRoute.notifications:
        return 'Notifications';
      case AppRoute.story:
        return 'Our Story';
      case AppRoute.security:
        return 'Security';
      case AppRoute.terms:
        return 'Terms of Service';
      case AppRoute.privacy:
        return 'Privacy Policy';
      default:
        return 'Noble Clarity';
    }
  }

  bool _shouldShowBottomNav(AppRoute route) {
    return [
      AppRoute.dashboard,
      AppRoute.roi,
      AppRoute.planner,
      AppRoute.goals,
      AppRoute.settings,
    ].contains(route);
  }

  Widget _getTargetScreen(AppRoute route) {
    switch (route) {
      case AppRoute.dashboard:
        return const DashboardHome();
      case AppRoute.roi:
        return const RoiIntelligenceScreen();
      case AppRoute.emailRoi:
        return const EmailMarketingRoiScreen();
      case AppRoute.socialRoi:
        return const SocialMediaRoiScreen();
      case AppRoute.planner:
        return const ScenarioPlannerScreen();
      case AppRoute.goals:
        return const GoalsScreen();
      case AppRoute.cashFlow:
        return const CashFlowManagementScreen();
      case AppRoute.consolidation:
        return const ConsolidationScreen();
      case AppRoute.dataEntry:
        return const DataEntryScreen();
      case AppRoute.integrations:
        return const IntegrationsScreen();
      case AppRoute.businessProfile:
        return const BusinessProfileScreen();
      case AppRoute.history:
        return const HistoryScreen();
      case AppRoute.settings:
        return const SettingsScreen();
      case AppRoute.notifications:
        return const NotificationsScreen();
      case AppRoute.story:
        return const OurStoryScreen();
      case AppRoute.security:
        return const SecurityScreen();
      case AppRoute.terms:
        return const TermsOfServiceScreen();
      case AppRoute.privacy:
        return const PrivacyPolicyScreen();
      default:
        return const DashboardHome();
    }
  }
}
