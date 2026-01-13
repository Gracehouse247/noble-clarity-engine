import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:file_picker/file_picker.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/app_theme.dart';
import '../models/financial_models.dart';

// --- Providers for managing connection state ---

final connectionStateProvider = StateProvider<Map<String, bool>>(
  (ref) => {'stripe': false, 'bank': false, 'csv': false, 'sheets': false},
);

class DataSourceSelectionScreen extends ConsumerWidget {
  const DataSourceSelectionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundDark,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Connect Data Pipeline',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select a Data Source',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Connect your real financial data to power the Noble Clarity Engine.',
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.7),
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 32),

            // 1. Stripe Connection
            _DataSourceCard(
              title: 'Stripe',
              description:
                  'Connect your Stripe account for real-time revenue intelligence.',
              icon: LucideIcons.creditCard,
              color: const Color(0xFF635BFF), // Stripe Blurple
              isConnected:
                  ref.watch(connectionStateProvider)['stripe'] ?? false,
              onTap: () => _showStripeDialog(context, ref),
            ),

            // 2. Bank Connection (Plaid/Mono style)
            _DataSourceCard(
              title: 'Bank Account',
              description:
                  'Securely link your business bank account via encryption.',
              icon: LucideIcons.landmark,
              color: const Color(0xFF00D68F), // Fintech Green
              isConnected: ref.watch(connectionStateProvider)['bank'] ?? false,
              onTap: () => _showBankDialog(context, ref),
            ),

            // 3. Google Sheets
            _DataSourceCard(
              title: 'Google Sheets',
              description:
                  'Sync with your existing financial tracking spreadsheets.',
              icon: LucideIcons.table,
              color: const Color(0xFF0F9D58), // Google Sheets Green
              isConnected:
                  ref.watch(connectionStateProvider)['sheets'] ?? false,
              onTap: () => _showSheetsDialog(context, ref),
            ),

            // 4. CSV Upload
            _DataSourceCard(
              title: 'Upload CSV',
              description:
                  'Import historical data from Xero, QuickBooks, or Excel.',
              icon: LucideIcons.fileSpreadsheet,
              color: Colors.orange,
              isConnected: ref.watch(connectionStateProvider)['csv'] ?? false,
              onTap: () => _handleCsvUpload(context, ref),
            ),

            // 5. Manual Entry
            _DataSourceCard(
              title: 'Manual Entry',
              description: 'Input your key metrics directly into the engine.',
              icon: LucideIcons.pencil,
              color: Colors.blueGrey,
              isConnected: false, // Always available
              onTap: () => _showManualEntryDialog(context, ref),
            ),
          ],
        ),
      ),
    );
  }

  // --- Handlers & Dialogs ---

  void _showStripeDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => _ApiKeyDialog(
        title: 'Connect Stripe',
        hintText: 'Enter Stripe Live Secret Key (sk_live_...)',
        onSubmitted: (key) async {
          // In a real app, send to backend. For now, simulate success.
          await Future.delayed(const Duration(seconds: 2));
          ref
              .read(connectionStateProvider.notifier)
              .update((state) => {...state, 'stripe': true});
          if (context.mounted) Navigator.pop(ctx);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Stripe Connected Successfully!'),
              backgroundColor: Colors.green,
            ),
          );
        },
      ),
    );
  }

  void _showBankDialog(BuildContext context, WidgetRef ref) {
    // Simulating Plaid Link Flow
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => Container(
        height: MediaQuery.of(context).size.height * 0.8,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            const SizedBox(height: 20),
            const Text(
              'Secure Bank Link',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: ListView(
                children: [
                  ListTile(
                    leading: const Icon(
                      Icons.account_balance,
                      color: Colors.blue,
                    ),
                    title: const Text(
                      'Chase Bank',
                      style: TextStyle(color: Colors.black),
                    ),
                    onTap: () => _simulateBankConnect(context, ref, 'Chase'),
                  ),
                  ListTile(
                    leading: const Icon(
                      Icons.account_balance,
                      color: Colors.red,
                    ),
                    title: const Text(
                      'Bank of America',
                      style: TextStyle(color: Colors.black),
                    ),
                    onTap: () => _simulateBankConnect(context, ref, 'BoA'),
                  ),
                  ListTile(
                    leading: const Icon(
                      Icons.account_balance,
                      color: Colors.purple,
                    ),
                    title: const Text(
                      'Mercury',
                      style: TextStyle(color: Colors.black),
                    ),
                    onTap: () => _simulateBankConnect(context, ref, 'Mercury'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _simulateBankConnect(
    BuildContext context,
    WidgetRef ref,
    String bankName,
  ) async {
    Navigator.pop(context); // Close sheet
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Connecting to $bankName...'),
        duration: const Duration(seconds: 1),
      ),
    );
    await Future.delayed(const Duration(seconds: 2));
    ref
        .read(connectionStateProvider.notifier)
        .update((state) => {...state, 'bank': true});
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('$bankName Connected!'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  void _showSheetsDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => _ApiKeyDialog(
        title: 'Connect Google Sheets',
        hintText: 'Paste Google Sheet Shareable Link',
        buttonText: 'Sync Sheet',
        onSubmitted: (url) async {
          final uri = Uri.parse(url);
          if (await canLaunchUrl(uri)) {
            // Emulate auth flow
            await launchUrl(uri);
          }
          ref
              .read(connectionStateProvider.notifier)
              .update((state) => {...state, 'sheets': true});
          if (context.mounted) Navigator.pop(ctx);
        },
      ),
    );
  }

  Future<void> _handleCsvUpload(BuildContext context, WidgetRef ref) async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['csv', 'xlsx'],
      );

      if (result != null) {
        // PlatformFile file = result.files.first;
        // In real app: upload file.bytes to backend
        ref
            .read(connectionStateProvider.notifier)
            .update((state) => {...state, 'csv': true});
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Financial Data Imported from CSV'),
            backgroundColor: Colors.green,
          ),
        );
        // Simulate data injection (optional: update provider with mock parsed data)
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error picking file: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showManualEntryDialog(BuildContext context, WidgetRef ref) {
    showDialog(context: context, builder: (ctx) => const _ManualEntryForm());
  }
}

// --- Reusable Components ---

class _DataSourceCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final Color color;
  final bool isConnected;
  final VoidCallback onTap;

  const _DataSourceCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
    required this.isConnected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isConnected
              ? Colors.green.withValues(alpha: 0.5)
              : Colors.white.withValues(alpha: 0.1),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            title,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          if (isConnected) ...[
                            const SizedBox(width: 8),
                            const Icon(
                              Icons.check_circle,
                              color: Colors.green,
                              size: 16,
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        description,
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.6),
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.chevron_right,
                  color: Colors.white.withValues(alpha: 0.3),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ApiKeyDialog extends StatefulWidget {
  final String title;
  final String hintText;
  final String buttonText;
  final Function(String) onSubmitted;

  const _ApiKeyDialog({
    required this.title,
    required this.hintText,
    this.buttonText = 'Connect',
    required this.onSubmitted,
  });

  @override
  State<_ApiKeyDialog> createState() => _ApiKeyDialogState();
}

class _ApiKeyDialogState extends State<_ApiKeyDialog> {
  final _controller = TextEditingController();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF1E222D),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _controller,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: widget.hintText,
                hintStyle: TextStyle(
                  color: Colors.white.withValues(alpha: 0.3),
                ),
                filled: true,
                fillColor: Colors.black.withValues(alpha: 0.3),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : () async {
                        setState(() => _isLoading = true);
                        await widget.onSubmitted(_controller.text);
                        setState(() => _isLoading = false);
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryBlue,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : Text(widget.buttonText),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ManualEntryForm extends ConsumerStatefulWidget {
  const _ManualEntryForm();

  @override
  ConsumerState<_ManualEntryForm> createState() => _ManualEntryFormState();
}

class _ManualEntryFormState extends ConsumerState<_ManualEntryForm> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final _revenueCtrl = TextEditingController();
  final _cogsCtrl = TextEditingController();
  final _opexCtrl = TextEditingController();
  final _cashCtrl = TextEditingController();

  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF1E222D),
      insetPadding: const EdgeInsets.all(10), // Wider dialog
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Update Financial Metrics",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                "Enter your latest monthly numbers.",
                style: TextStyle(color: Colors.white54, fontSize: 12),
              ),
              const SizedBox(height: 20),

              _buildInput("Monthly Revenue (\$)", _revenueCtrl),
              const SizedBox(height: 12),
              _buildInput("Cost of Goods Sold (COGS) (\$)", _cogsCtrl),
              const SizedBox(height: 12),
              _buildInput("Operating Expenses (OpEx) (\$)", _opexCtrl),
              const SizedBox(height: 12),
              _buildInput("Current Cash / Assets (\$)", _cashCtrl),

              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text(
                      "Cancel",
                      style: TextStyle(color: Colors.white54),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _isLoading ? null : _saveData,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryBlue,
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const Text("Save Data"),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInput(String label, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: TextInputType.number,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            isDense: true,
            filled: true,
            fillColor: Colors.black.withValues(alpha: 0.3),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide.none,
            ),
          ),
          validator: (v) => v!.isEmpty ? "Required" : null,
        ),
      ],
    );
  }

  Future<void> _saveData() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      // Create new FinancialData object
      final newData = FinancialData(
        revenue: double.parse(_revenueCtrl.text),
        cogs: double.parse(_cogsCtrl.text),
        operatingExpenses: double.parse(_opexCtrl.text),
        currentAssets: double.parse(_cashCtrl.text),

        // Default values for fields not manually entered yet
        currentLiabilities: 0,
        leadsGenerated: 0,
        conversions: 0,
        marketingSpend: 0,
        industry: 'SaaS',
        date: DateTime.now().toIso8601String().split('T')[0],
      );

      // In real app: Send to API
      // For now: specific to this session, we might want to update a provider
      // But since we don't have a writable provider that persists globally easily without API,
      // We will pretend to save and show success.

      await Future.delayed(const Duration(seconds: 1)); // Sim network

      debugPrint('Saving Manual Data: ${newData.toJson()}');

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Financial Metrics Updated'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }
}
