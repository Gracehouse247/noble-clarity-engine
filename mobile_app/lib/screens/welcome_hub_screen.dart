import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../core/app_router.dart';

class WelcomeHubScreen extends ConsumerWidget {
  const WelcomeHubScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundDark,
      body: Stack(
        children: [
          // Ambient backgrounds
          Positioned(
            top: -100,
            right: -50,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.primaryBlue.withValues(alpha: 0.1),
              ),
            ),
          ),

          SafeArea(
            child: CustomScrollView(
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 32,
                  ),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Header Section
                      Center(
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.05),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.1),
                            ),
                          ),
                          child: Image.asset(
                            'assets/images/logo_icon.png',
                            height: 60,
                            fit: BoxFit.contain,
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),
                      const Text(
                        'Welcome to\nNoble Clarity Engine!',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -1,
                          height: 1.1,
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Unlock predictive business insights with crystalline precision.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.white54,
                          height: 1.4,
                        ),
                      ),

                      const SizedBox(height: 48),
                      const Text(
                        'ELEVATE YOUR INTELLIGENCE',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryBlue,
                          letterSpacing: 2,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Feature Grid/List
                      _buildFeatureItem(
                        icon: Icons.auto_awesome_outlined,
                        title: 'Growth Engine',
                        description:
                            'Powerful tools designed to accelerate decision making. From AI-driven coaching to intricate scenario planning.',
                        onTap: () {
                          ref.read(navigationProvider.notifier).state =
                              AppRoute.planner;
                        },
                      ),
                      _buildFeatureItem(
                        icon: Icons.analytics_outlined,
                        title: 'Real-time Visibility',
                        description:
                            'Monitor key performance indicators with vector precision. Unified Data: Consolidate multiple streams into a single source of truth.',
                        onTap: () {
                          ref.read(navigationProvider.notifier).state =
                              AppRoute.dataConnect;
                        },
                      ),
                      _buildFeatureItem(
                        icon: Icons.shield_outlined,
                        title: 'Bank-Grade Security',
                        description:
                            'SOC2 Type II Certified. End-to-end encryption for all financial data.',
                        onTap: () {
                          ref.read(navigationProvider.notifier).state =
                              AppRoute.security;
                        },
                      ),

                      const SizedBox(height: 32),

                      // Docs Link
                      TextButton(
                        onPressed: () {},
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Visit our docs to learn more',
                              style: TextStyle(
                                color: AppTheme.primaryBlue,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(width: 8),
                            Icon(
                              Icons.arrow_forward,
                              size: 16,
                              color: AppTheme.primaryBlue,
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 48),

                      // Privacy & Legal Footer
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.03),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.05),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Privacy & Quality Assurance',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: Colors.white70,
                              ),
                            ),
                            const SizedBox(height: 12),
                            const Text(
                              'To help with quality, safety, and to improve our products, human reviewers may read, annotate, and process that data. Noble World takes steps to protect your privacy as part of this process, including disconnecting the data from your Noble Clarity Engine Account or API key before reviewers review or annotate it.',
                              style: TextStyle(
                                fontSize: 11,
                                color: Colors.white38,
                                height: 1.5,
                              ),
                            ),
                            const SizedBox(height: 24),
                            const Divider(color: Colors.white10),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                TextButton(
                                  onPressed: () {
                                    ref
                                            .read(navigationProvider.notifier)
                                            .state =
                                        AppRoute.settings;
                                  },
                                  child: const Text(
                                    'Privacy Settings',
                                    style: TextStyle(
                                      color: Colors.white24,
                                      fontSize: 10,
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                ),
                                const Text(
                                  ' | ',
                                  style: TextStyle(color: Colors.white10),
                                ),
                                const Text(
                                  '© 2026 The Noble\'s Technology Services',
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: Colors.white24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 100), // Space for bottom button
                    ]),
                  ),
                ),
              ],
            ),
          ),

          // Fixed Bottom Action Button
          Positioned(
            bottom: 32,
            left: 24,
            right: 24,
            child: SizedBox(
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  ref.read(navigationProvider.notifier).state =
                      AppRoute.dashboard;
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryBlue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 8,
                  shadowColor: AppTheme.primaryBlue.withValues(alpha: 0.4),
                ),
                child: const Text(
                  'CONTINUE TO DASHBOARD',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureItem({
    required IconData icon,
    required String title,
    required String description,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.primaryBlue.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: AppTheme.primaryBlue, size: 24),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Colors.white54,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 12),
                InkWell(
                  onTap: onTap,
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Learn more',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.primaryBlue,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(width: 4),
                      Icon(
                        Icons.arrow_forward,
                        size: 12,
                        color: AppTheme.primaryBlue,
                      ),
                    ],
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
