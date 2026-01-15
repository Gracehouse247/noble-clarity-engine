import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';

import '../providers/auth_provider.dart';
import '../services/api_service.dart';

class IntegrationsScreen extends ConsumerStatefulWidget {
  const IntegrationsScreen({super.key});

  @override
  ConsumerState<IntegrationsScreen> createState() => _IntegrationsScreenState();
}

class _IntegrationsScreenState extends ConsumerState<IntegrationsScreen> {
  final Map<String, bool> _connectedStatus = {
    'Stripe': true,
    'PayPal': false,
    'QuickBooks': false,
    'Xero': false,
    'Google Ads': true,
    'Meta Ads': false,
    'Mailchimp': false,
    'HubSpot': false,
  };

  bool _isSyncing = false;

  Future<void> _toggleConnection(String service) async {
    final userId = ref.read(authProvider).userId ?? 'guest';
    final apiService = ref.read(apiServiceProvider);

    if (_connectedStatus[service] == true) {
      // Simulation: disconnect
      setState(() {
        _connectedStatus[service] = false;
      });
      return;
    }

    // Show simulated connection dialog for most services
    _showSecureConnectionDialog(service);
  }

  void _showSecureConnectionDialog(String service) {
    Color brandColor = AppTheme.primaryBlue;
    IconData brandIcon = Icons.extension;

    // Map typical brand colors/icons for better UI
    if (service == 'Stripe') {
      brandColor = const Color(0xFF635BFF);
      brandIcon = Icons.payments_outlined;
    } else if (service == 'PayPal') {
      brandColor = const Color(0xFF003087);
      brandIcon = Icons.account_balance_wallet_outlined;
    } else if (service == 'QuickBooks' || service == 'HubSpot') {
      brandColor = const Color(0xFFFF7A59);
      brandIcon = Icons.hub_outlined;
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) {
          bool isConnecting = false;

          return AlertDialog(
            backgroundColor: const Color(0xFF0F172A),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: brandColor.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(brandIcon, color: brandColor, size: 40),
                ),
                const SizedBox(height: 24),
                Text(
                  'Connect $service',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Establish a secure link to ingest your $service data into the Noble Clarity Engine.',
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.white54, fontSize: 14),
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: isConnecting
                        ? null
                        : () async {
                            setModalState(() => isConnecting = true);
                            await Future.delayed(const Duration(seconds: 2));
                            if (mounted) {
                              setState(() {
                                _connectedStatus[service] = true;
                              });
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    '$service linked successfully!',
                                  ),
                                  backgroundColor: AppTheme.profitGreen,
                                ),
                              );
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: brandColor,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: isConnecting
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : Text('ESTABLISH SECURE LINK'),
                  ),
                ),
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'Cancel',
                    style: TextStyle(color: Colors.white38),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: _isSyncing
              ? const LinearProgressIndicator(
                  backgroundColor: Colors.transparent,
                  color: AppTheme.primaryBlue,
                  minHeight: 2,
                )
              : const SizedBox(height: 2),
        ),
        SliverPadding(
          padding: const EdgeInsets.all(24),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              _buildSectionHeader('FINANCIAL STACKS', 'Revenue & Accounting'),
              const SizedBox(height: 16),
              _buildIntegrationCard(
                'Stripe',
                'Payment processing and subscription billing.',
                Icons.payments_outlined,
                const Color(0xFF635BFF),
              ),
              _buildIntegrationCard(
                'PayPal',
                'Global checkout and merchant services.',
                Icons.account_balance_wallet_outlined,
                const Color(0xFF003087),
              ),
              _buildIntegrationCard(
                'QuickBooks',
                'Advanced accounting and tax management.',
                Icons.description_outlined,
                const Color(0xFF2CA01C),
              ),
              _buildIntegrationCard(
                'Xero',
                'Cloud-based accounting for small business.',
                Icons.cloud_outlined,
                const Color(0xFF13B5EA),
              ),

              const SizedBox(height: 40),
              _buildSectionHeader('MARKETING STACKS', 'Growth & Acquisition'),
              const SizedBox(height: 16),
              _buildIntegrationCard(
                'Google Ads',
                'Search and display advertising metrics.',
                Icons.ads_click_outlined,
                const Color(0xFF4285F4),
              ),
              _buildIntegrationCard(
                'Meta Ads',
                'Social media acquisition and retargeting.',
                Icons.facebook_outlined,
                const Color(0xFF0668E1),
              ),
              _buildIntegrationCard(
                'Mailchimp',
                'Email marketing and automation cycles.',
                Icons.email_outlined,
                const Color(0xFFFFE01B),
              ),
              _buildIntegrationCard(
                'HubSpot',
                'CRM and inbound marketing automation.',
                Icons.hub_outlined,
                const Color(0xFFFF7A59),
              ),
              const SizedBox(height: 100),
            ]),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title, String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryBlue,
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: Colors.white.withValues(alpha: 0.8),
          ),
        ),
      ],
    );
  }

  Widget _buildIntegrationCard(
    String name,
    String description,
    IconData icon,
    Color brandColor,
  ) {
    final isConnected = _connectedStatus[name] ?? false;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isConnected
              ? AppTheme.primaryBlue.withValues(alpha: 0.3)
              : Colors.white.withValues(alpha: 0.05),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: brandColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: brandColor, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.white.withValues(alpha: 0.4),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          TextButton(
            onPressed: () => _toggleConnection(name),
            style: TextButton.styleFrom(
              backgroundColor: isConnected
                  ? AppTheme.primaryBlue.withValues(alpha: 0.1)
                  : Colors.white.withValues(alpha: 0.05),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            ),
            child: Text(
              isConnected ? 'CONNECTED' : 'CONNECT',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: isConnected ? AppTheme.primaryBlue : Colors.white70,
                letterSpacing: 1,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
