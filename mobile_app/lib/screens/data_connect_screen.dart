import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../main.dart';
import '../providers/multi_tenant_provider.dart';

class DataConnectScreen extends ConsumerStatefulWidget {
  const DataConnectScreen({super.key});

  @override
  ConsumerState<DataConnectScreen> createState() => _DataConnectScreenState();
}

class _DataConnectScreenState extends ConsumerState<DataConnectScreen> {
  bool _isLoading = false;

  Future<void> _handleDemoData() async {
    setState(() => _isLoading = true);

    // Simulate loading and inject demo data
    try {
      await ref.read(profilesDataProvider.notifier).loadDemoData();
      if (!mounted) return;
      ref.read(navigationProvider.notifier).state = AppRoute.dashboard;
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error loading demo data: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundDark,
      body: Stack(
        children: [
          // Background Ambience
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 400,
              height: 400,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.primaryBlue.withValues(alpha: 0.1),
              ),
            ),
          ),

          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 20),
                  // Header
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.05),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.1),
                          ),
                        ),
                        child: const Icon(
                          Icons.assessment_outlined,
                          color: AppTheme.primaryBlue,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Text(
                        'Power Your Engine',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),
                  const Text(
                    'Connect a data source to instantly unlock financial foresight. Choose how you want to begin.',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white54,
                      height: 1.5,
                    ),
                  ),

                  const SizedBox(height: 48),

                  // Option 1: Demo Data
                  _buildOptionCard(
                    title: 'Use Demo Data',
                    description:
                        'Instantly populate the dashboard with sample financial data to explore features.',
                    icon: Icons.auto_awesome,
                    isHighlight: true,
                    onTap: _handleDemoData,
                  ),

                  const SizedBox(height: 20),

                  // Option 2: Connect Real Data (Imports)
                  _buildOptionCard(
                    title: 'Connect Real Data',
                    description:
                        'Import from CSV, Excel, Google Sheets, or connect via Stripe/Plaid.',
                    icon: Icons.cloud_upload_outlined,
                    isHighlight: false,
                    onTap: () {
                      ref.read(navigationProvider.notifier).state =
                          AppRoute.dataEntry;
                    },
                  ),

                  const Spacer(),

                  // Skip Option
                  Center(
                    child: TextButton(
                      onPressed: () {
                        ref.read(navigationProvider.notifier).state =
                            AppRoute.dashboard;
                      },
                      child: const Text(
                        'Skip for now (Start Empty)',
                        style: TextStyle(color: Colors.white38, fontSize: 14),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),

          // Loading Overlay
          if (_isLoading)
            Container(
              color: Colors.black54,
              child: const Center(
                child: CircularProgressIndicator(color: AppTheme.primaryBlue),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildOptionCard({
    required String title,
    required String description,
    required IconData icon,
    required bool isHighlight,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: isHighlight
              ? AppTheme.primaryBlue.withValues(alpha: 0.1)
              : Colors.white.withValues(alpha: 0.03),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isHighlight
                ? AppTheme.primaryBlue.withValues(alpha: 0.5)
                : Colors.white.withValues(alpha: 0.08),
            width: isHighlight ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isHighlight
                    ? AppTheme.primaryBlue
                    : Colors.white.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                icon,
                color: isHighlight ? Colors.white : Colors.white70,
                size: 24,
              ),
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
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.white.withValues(alpha: 0.5),
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Icon(
              Icons.arrow_forward_ios,
              size: 16,
              color: Colors.white.withValues(alpha: 0.3),
            ),
          ],
        ),
      ),
    );
  }
}
