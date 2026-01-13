import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';

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

  void _toggleConnection(String service) {
    setState(() {
      _connectedStatus[service] = !(_connectedStatus[service] ?? false);
    });

    final isConnecting = _connectedStatus[service]!;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          isConnecting ? 'Connected to $service' : 'Disconnected from $service',
        ),
        backgroundColor: isConnecting ? AppTheme.profitGreen : AppTheme.lossRed,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
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
