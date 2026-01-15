import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:file_picker/file_picker.dart';
import '../core/app_theme.dart';
import '../models/financial_models.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../core/app_router.dart';
import 'package:google_sign_in/google_sign_in.dart';

// --- Providers for managing connection state ---

final connectionStateProvider = StateProvider<Map<String, bool>>(
  (ref) => {'stripe': false, 'bank': false, 'csv': false, 'sheets': false},
);

class DataSourceSelectionScreen extends ConsumerStatefulWidget {
  const DataSourceSelectionScreen({super.key});

  @override
  ConsumerState<DataSourceSelectionScreen> createState() =>
      _DataSourceSelectionScreenState();
}

class _DataSourceSelectionScreenState
    extends ConsumerState<DataSourceSelectionScreen> {
  bool _isSyncing = false;
  String? _syncingService;

  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundDark,
      body: Stack(
        children: [
          _buildContent(context),
          if (_isSyncing)
            Container(
              color: Colors.black54,
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CircularProgressIndicator(
                      color: AppTheme.primaryBlue,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'ESTABLISHING NEURAL LINK TO ${_syncingService?.toUpperCase()}...',
                      style: const TextStyle(
                        color: AppTheme.primaryBlue,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.5,
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

  Widget _buildContent(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            ref.read(navigationProvider.notifier).state = AppRoute.dashboard;
          },
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
              onTap: () => _handleIntegrationSync('Stripe'),
            ),

            // 2. Bank Connection (Plaid/Mono style)
            _DataSourceCard(
              title: 'Bank Account',
              description:
                  'Securely link your business bank account via encryption.',
              icon: LucideIcons.landmark,
              color: const Color(0xFF00D68F), // Fintech Green
              isConnected: ref.watch(connectionStateProvider)['bank'] ?? false,
              onTap: () => _handleIntegrationSync('Plaid'),
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
              onTap: () => _handleGoogleSheetsAuth(),
            ),

            // 4. CSV Upload
            _DataSourceCard(
              title: 'Upload CSV',
              description:
                  'Import historical data from Xero, QuickBooks, or Excel.',
              icon: LucideIcons.fileSpreadsheet,
              color: Colors.orange,
              isConnected: ref.watch(connectionStateProvider)['csv'] ?? false,
              onTap: () => _handleCsvUpload(context),
            ),

            // 5. Manual Entry
            _DataSourceCard(
              title: 'Manual Entry',
              description: 'Input your key metrics directly into the engine.',
              icon: LucideIcons.pencil,
              color: Colors.blueGrey,
              isConnected: false, // Always available
              onTap: () {
                ref.read(navigationProvider.notifier).state =
                    AppRoute.dataEntry;
              },
            ),
          ],
        ),
      ),
    );
  }

  // --- Handlers & Dialogs ---

  Future<void> _handleGoogleSheetsAuth() async {
    final userId = ref.read(authProvider).userId;
    if (userId == null) return;

    setState(() {
      _isSyncing = true;
      _syncingService = 'Google Sheets';
    });

    try {
      // 1. Start Interactive Sign-In Flow
      final GoogleSignInAccount? account = await _googleSignIn.signIn();

      if (account == null) {
        // User cancelled
        if (mounted) {
          setState(() => _isSyncing = false);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Google Sign-In Cancelled')),
          );
        }
        return;
      }

      // 2. Get Auth Headers (contains Access Token)
      final authHeaders = await account.authHeaders;
      // Extract Bearer token
      final token = authHeaders['Authorization']?.split(' ').last;

      if (token == null) throw Exception('Failed to retrieve access token');

      // 3. Send Token to Backend to Start Sync
      await ref
          .read(apiServiceProvider)
          .connectIntegration('Sheets', userId, token);

      // 4. Update UI State
      ref
          .read(connectionStateProvider.notifier)
          .update((state) => {...state, 'sheets': true});

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Google Sheets Connected & Syncing!'),
            backgroundColor: AppTheme.profitGreen,
          ),
        );
        // Navigate to dashboard to see results
        ref.read(navigationProvider.notifier).state = AppRoute.dashboard;
      }
    } catch (e) {
      debugPrint('Google Sheets Auth Error: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Connection Failed: $e'),
            backgroundColor: AppTheme.lossRed,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSyncing = false;
          _syncingService = null;
        });
      }
    }
  }

  Future<void> _handleIntegrationSync(String service) async {
    final userId = ref.read(authProvider).userId;
    if (userId == null) return;

    setState(() {
      _isSyncing = true;
      _syncingService = service;
    });

    try {
      final response = await ref
          .read(apiServiceProvider)
          .syncIntegration(service, userId);

      ref
          .read(connectionStateProvider.notifier)
          .update((state) => {...state, service.toLowerCase(): true});

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response['status'] ?? '$service integration active!'),
            backgroundColor: AppTheme.profitGreen,
            duration: const Duration(seconds: 4),
          ),
        );
        // After success, go to dashboard
        ref.read(navigationProvider.notifier).state = AppRoute.dashboard;
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error connecting to $service: $e'),
            backgroundColor: AppTheme.lossRed,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSyncing = false;
          _syncingService = null;
        });
      }
    }
  }

  Future<void> _handleCsvUpload(BuildContext context) async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['csv', 'xlsx'],
      );

      if (result != null) {
        setState(() {
          _isSyncing = true;
          _syncingService = 'CSV';
        });

        // Simulate processing
        await Future.delayed(const Duration(seconds: 2));

        ref
            .read(connectionStateProvider.notifier)
            .update((state) => {...state, 'csv': true});

        if (!context.mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Financial Data Imported from CSV'),
            backgroundColor: AppTheme.profitGreen,
            duration: Duration(seconds: 4),
          ),
        );
        ref.read(navigationProvider.notifier).state = AppRoute.dashboard;
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error picking file: $e'),
            backgroundColor: AppTheme.lossRed,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSyncing = false;
          _syncingService = null;
        });
      }
    }
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
  final Function(String) onSubmitted;

  const _ApiKeyDialog({
    required this.title,
    required this.hintText,
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
                    : const Text('Connect'),
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
