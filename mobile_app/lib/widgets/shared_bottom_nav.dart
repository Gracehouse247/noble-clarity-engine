import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../main.dart';
import '../core/app_theme.dart';

class SharedBottomNav extends ConsumerWidget {
  const SharedBottomNav({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentRoute = ref.watch(navigationProvider);

    int currentIndex = 0;
    if (currentRoute == AppRoute.planner) currentIndex = 1;
    if (currentRoute == AppRoute.roi) currentIndex = 2;
    if (currentRoute == AppRoute.goals) currentIndex = 3;
    if (currentRoute == AppRoute.settings) currentIndex = 4;

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF13151F).withValues(alpha: 0.95),
        border: Border(
          top: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
        ),
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (index) {
          final routes = [
            AppRoute.dashboard,
            AppRoute.planner,
            AppRoute.roi,
            AppRoute.goals,
            AppRoute.settings,
          ];
          ref.read(navigationProvider.notifier).state = routes[index];
        },
        backgroundColor: Colors.transparent,
        selectedItemColor: AppTheme.primaryBlue,
        unselectedItemColor: Colors.white24,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: const TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
        unselectedLabelStyle: const TextStyle(fontSize: 10),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.science_outlined),
            activeIcon: Icon(Icons.science),
            label: 'Lab',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.monetization_on_outlined),
            activeIcon: Icon(Icons.monetization_on),
            label: 'ROI',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.flag_outlined),
            activeIcon: Icon(Icons.flag),
            label: 'Goals',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            activeIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
