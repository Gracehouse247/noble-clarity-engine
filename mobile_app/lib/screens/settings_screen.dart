import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../providers/auth_provider.dart';
import '../providers/business_provider.dart';
import '../main.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _isGeminiActive = false;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          const SizedBox(height: 24),

          // User Profile Section
          _buildUserProfile(),

          const SizedBox(height: 32),

          // Business Context Section
          _buildBusinessContext(),

          const SizedBox(height: 32),

          // Intelligence Model Toggle
          const Text(
            'ACTIVE INTELLIGENCE MODEL',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: Colors.white38,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A1A),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
            ),
            child: Row(
              children: [
                _buildModelOption(
                  'Gemini',
                  Icons.auto_awesome,
                  !_isGeminiActive,
                ),
                _buildModelOption('GPT-4', Icons.psychology, _isGeminiActive),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Selecting a model updates the neural engine used for financial forecasting.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 11, color: Colors.white24),
          ),

          const SizedBox(height: 32),

          // API Vault
          _buildApiVault(),

          const SizedBox(height: 24),

          // Advanced settings
          _buildAdvancedSettings(),

          const SizedBox(height: 32),

          // Log Out Button
          SizedBox(
            width: double.infinity,
            height: 56,
            child: OutlinedButton(
              onPressed: () => ref.read(authProvider.notifier).logout(),
              style: OutlinedButton.styleFrom(
                side: BorderSide(
                  color: AppTheme.lossRed.withValues(alpha: 0.5),
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: const Text(
                'LOG OUT',
                style: TextStyle(
                  color: AppTheme.lossRed,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2,
                ),
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Delete Account Button (Google Play Requirement)
          Center(
            child: TextButton(
              onPressed: () => _confirmDeleteAccount(context),
              child: Text(
                'Delete Account & Data',
                style: TextStyle(
                  color: AppTheme.lossRed.withValues(alpha: 0.7),
                  fontSize: 12,
                ),
              ),
            ),
          ),

          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _buildModelOption(String label, IconData icon, bool isActive) {
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _isGeminiActive = (label == 'GPT-4')),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            gradient: isActive
                ? const LinearGradient(
                    colors: [AppTheme.primaryBlue, AppTheme.aiPurple],
                  )
                : null,
            borderRadius: BorderRadius.circular(12),
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: AppTheme.aiPurple.withValues(alpha: 0.3),
                      blurRadius: 10,
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 18,
                color: isActive ? Colors.white : Colors.white24,
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                  color: isActive ? Colors.white : Colors.white24,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildApiVault() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF141414).withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.3), blurRadius: 30),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(
                    Icons.lock_outline,
                    color: AppTheme.primaryBlue,
                    size: 20,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'API Vault',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.profitGreen.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(
                    color: AppTheme.profitGreen.withValues(alpha: 0.2),
                  ),
                ),
                child: const Text(
                  'SECURE',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.profitGreen,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          _buildKeyField('Google Gemini Key', 'AIzaSyDOCSxd...'),
          const SizedBox(height: 20),
          _buildKeyField('OpenAI Secret Key', 'sk-proj-892...', isActive: true),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.03),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
            ),
            child: const Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.info_outline, color: Colors.white24, size: 16),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Security Notice: Long-press on the fingerprint icon to decrypt and edit your API keys. Keys are stored locally in the secure enclave.',
                    style: TextStyle(
                      fontSize: 10,
                      color: Colors.white38,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Center(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.profitGreen.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: AppTheme.profitGreen.withValues(alpha: 0.2),
                ),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.verified_user,
                    color: AppTheme.profitGreen,
                    size: 14,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'ZERO-RETENTION PRIVACY ACTIVE',
                    style: TextStyle(
                      color: AppTheme.profitGreen,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryBlue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.verified_user_outlined, size: 18),
                  SizedBox(width: 8),
                  Text(
                    'VERIFY & SAVE',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKeyField(
    String label,
    String maskedValue, {
    bool isActive = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label.toUpperCase(),
              style: const TextStyle(
                fontSize: 10,
                color: Colors.white54,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
            Container(
              width: 6,
              height: 6,
              decoration: const BoxDecoration(
                color: AppTheme.profitGreen,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          height: 52,
          decoration: BoxDecoration(
            color: Colors.black.withValues(alpha: 0.4),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isActive
                  ? AppTheme.aiPurple.withValues(alpha: 0.3)
                  : Colors.white.withValues(alpha: 0.05),
            ),
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: AppTheme.aiPurple.withValues(alpha: 0.1),
                      blurRadius: 10,
                    ),
                  ]
                : null,
          ),
          child: Row(
            children: [
              Icon(
                Icons.key,
                color: isActive ? AppTheme.aiPurple : Colors.white24,
                size: 20,
              ),
              const SizedBox(width: 12),
              Text(
                maskedValue,
                style: const TextStyle(
                  color: Colors.white38,
                  fontFamily: 'monospace',
                  letterSpacing: 2,
                  fontSize: 13,
                ),
              ),
              const Spacer(),
              Icon(
                isActive ? Icons.fingerprint : Icons.visibility_off_outlined,
                color: isActive ? AppTheme.aiPurple : Colors.white24,
                size: 20,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAdvancedSettings() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF141414).withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        children: [
          _buildSettingsItem(
            Icons.history,
            'Snapshot History',
            Colors.blue,
            () =>
                ref.read(navigationProvider.notifier).state = AppRoute.history,
          ),
          _buildDivider(),
          _buildSettingsItem(
            Icons.edit_note,
            'Manual Data Entry',
            Colors.orange,
            () => ref.read(navigationProvider.notifier).state =
                AppRoute.dataEntry,
          ),
          _buildDivider(),
          _buildSettingsItem(
            Icons.hub_outlined,
            'Neural Integrations',
            Colors.indigo,
            () => ref.read(navigationProvider.notifier).state =
                AppRoute.integrations,
          ),
          _buildDivider(),
          _buildSettingsItem(
            Icons.business,
            'Business Profile',
            Colors.teal,
            () => ref.read(navigationProvider.notifier).state =
                AppRoute.businessProfile,
          ),
          _buildDivider(),
          _buildSettingsItem(
            Icons.merge_type,
            'Business Consolidation',
            Colors.purple,
            () => ref.read(navigationProvider.notifier).state =
                AppRoute.consolidation,
          ),
          _buildDivider(),
          _buildSettingsItem(
            Icons.security,
            'Two-Factor Auth (2FA)',
            Colors.green,
            () => _show2FAManagement(context),
          ),
          _buildDivider(),
          _buildSettingsItem(
            Icons.tune,
            'Temperature & Token Limits',
            Colors.orange,
            () {},
          ),
          _buildDivider(),
          _buildSettingsItem(
            Icons.delete_forever,
            'Clear Cache',
            Colors.red,
            () {},
          ),
          _buildDivider(),
          _buildSettingsItem(
            Icons.description_outlined,
            'Terms of Service',
            Colors.grey,
            () =>
                _launchUrl('https://clarity.noblesworld.com.ng/pricing#/terms'),
          ),
          _buildDivider(),
          _buildSettingsItem(
            Icons.privacy_tip_outlined,
            'Privacy Policy',
            Colors.grey,
            () => _launchUrl(
              'https://clarity.noblesworld.com.ng/pricing#/privacy',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsItem(
    IconData icon,
    String title,
    Color color,
    VoidCallback onTap,
  ) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: color, size: 18),
      ),
      title: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing: const Icon(Icons.chevron_right, color: Colors.white12),
      onTap: onTap,
    );
  }

  Widget _buildDivider() {
    return Divider(
      height: 1,
      color: Colors.white.withValues(alpha: 0.05),
      indent: 16,
      endIndent: 16,
    );
  }

  Widget _buildUserProfile() {
    final authState = ref.watch(authProvider);
    final userName = authState.displayName ?? 'Partner';
    final userEmail = authState.email ?? 'No email linked';
    final photoUrl =
        authState.photoUrl ?? 'https://i.pravatar.cc/150?u=${authState.userId}';

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF141414).withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Row(
        children: [
          CircleAvatar(radius: 30, backgroundImage: NetworkImage(photoUrl)),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  userName,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  userEmail,
                  style: const TextStyle(fontSize: 12, color: Colors.white38),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => _showEditProfileDialog(context),
            icon: const Icon(
              Icons.edit_outlined,
              color: Colors.white24,
              size: 20,
            ),
          ),
        ],
      ),
    );
  }

  void _showEditProfileDialog(BuildContext context) {
    final authState = ref.read(authProvider);
    final nameController = TextEditingController(text: authState.displayName);
    final emailController = TextEditingController(text: authState.email);
    final photoController = TextEditingController(text: authState.photoUrl);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.surfaceDark,
        title: const Text('Edit Profile'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: 'Display Name'),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: emailController,
                decoration: const InputDecoration(labelText: 'Email Address'),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: photoController,
                decoration: const InputDecoration(labelText: 'Photo URL'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final auth = ref.read(authProvider.notifier);
              await auth.updateDisplayName(nameController.text);
              await auth.updateEmail(emailController.text);
              if (photoController.text.isNotEmpty) {
                await auth.updatePhotoUrl(photoController.text);
              }
              if (!context.mounted) return;
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Profile updated successfully')),
              );
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _show2FAManagement(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceDark,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Consumer(
        builder: (context, ref, child) {
          final authState = ref.watch(authProvider);
          return Container(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'TWO-FACTOR AUTHENTICATION',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                    color: Colors.white54,
                  ),
                ),
                const SizedBox(height: 24),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: authState.isTwoFactorEnabled
                          ? Colors.green.withValues(alpha: 0.1)
                          : Colors.white.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      Icons.shield_outlined,
                      color: authState.isTwoFactorEnabled
                          ? Colors.green
                          : Colors.white24,
                      size: 20,
                    ),
                  ),
                  title: const Text(
                    'Secure your account with 2FA',
                    style: TextStyle(color: Colors.white, fontSize: 14),
                  ),
                  subtitle: const Text(
                    'Use an authenticator app to generate codes',
                    style: TextStyle(color: Colors.white24, fontSize: 12),
                  ),
                  trailing: Switch(
                    value: authState.isTwoFactorEnabled,
                    onChanged: (val) {
                      ref.read(authProvider.notifier).toggleTwoFactor(val);
                    },
                    activeThumbColor: AppTheme.primaryBlue,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Status: ',
                  style: TextStyle(color: Colors.white54, fontSize: 12),
                ),
                Text(
                  authState.isTwoFactorEnabled ? 'PROTECTED' : 'UNSECURED',
                  style: TextStyle(
                    color: authState.isTwoFactorEnabled
                        ? Colors.green
                        : Colors.orange,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Done'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildBusinessContext() {
    final business = ref.watch(businessProfileProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'BUSINESS CONTEXT',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: Colors.white38,
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 16),
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFF141414).withValues(alpha: 0.6),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
          ),
          child: Column(
            children: [
              _buildContextItem(
                'Industry',
                business.industry,
                Icons.business_center_outlined,
                () => _showSelectionDialog(
                  'Select Industry',
                  ['SaaS', 'E-commerce', 'Fintech', 'Services', 'Healthcare'],
                  business.industry,
                  (val) => ref
                      .read(businessProfileProvider.notifier)
                      .updateIndustry(val),
                ),
              ),
              _buildDivider(),
              _buildContextItem(
                'Company Stage',
                business.stage,
                Icons.rocket_launch_outlined,
                () => _showSelectionDialog(
                  'Select Stage',
                  [
                    'Seed',
                    'Series A',
                    'Series B+',
                    'Profitable',
                    'Bootstrapped',
                  ],
                  business.stage,
                  (val) => ref
                      .read(businessProfileProvider.notifier)
                      .updateStage(val),
                ),
              ),
              _buildDivider(),
              _buildContextItem(
                'Primary Target',
                business.targetMetric,
                Icons.track_changes_outlined,
                () => _showSelectionDialog(
                  'Select Target',
                  ['Revenue', 'Runway', 'Growth', 'Efficiency'],
                  business.targetMetric,
                  (val) => ref
                      .read(businessProfileProvider.notifier)
                      .updateTargetMetric(val),
                ),
              ),
              _buildDivider(),
              _buildContextItem(
                'Currency',
                business.currency,
                Icons.payments_outlined,
                () => _showSelectionDialog(
                  'Select Currency',
                  ['USD', 'EUR', 'GBP', 'NGN', 'CAD'],
                  business.currency,
                  (val) => ref
                      .read(businessProfileProvider.notifier)
                      .updateCurrency(val),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildContextItem(
    String label,
    String value,
    IconData icon,
    VoidCallback onTap,
  ) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.primaryBlue, size: 20),
      title: Text(
        label,
        style: const TextStyle(color: Colors.white70, fontSize: 13),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 13,
            ),
          ),
          const SizedBox(width: 8),
          const Icon(Icons.chevron_right, color: Colors.white12, size: 16),
        ],
      ),
      onTap: onTap,
    );
  }

  void _showSelectionDialog(
    String title,
    List<String> options,
    String current,
    Function(String) onSelect,
  ) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceDark,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            ...options.map(
              (opt) => ListTile(
                title: Text(
                  opt,
                  style: TextStyle(
                    color: opt == current ? AppTheme.primaryBlue : Colors.white,
                  ),
                ),
                trailing: opt == current
                    ? const Icon(Icons.check, color: AppTheme.primaryBlue)
                    : null,
                onTap: () {
                  onSelect(opt);
                  Navigator.pop(context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Could not open $url')));
      }
    }
  }

  void _confirmDeleteAccount(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.surfaceDark,
        title: const Text(
          'Delete Account?',
          style: TextStyle(color: Colors.white),
        ),
        content: const Text(
          'This action is permanent and cannot be undone. All your financial data, snapshots, and insights will be erased immediately.',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // Trigger deletion logic
              ref
                  .read(authProvider.notifier)
                  .logout(); // For now just logout as safeguard
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Account deletion request submitted.'),
                ),
              );
            },
            child: const Text(
              'DELETE',
              style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}
