import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../core/app_router.dart';
import '../models/financial_models.dart';
import '../providers/multi_tenant_provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import 'package:file_picker/file_picker.dart';
import '../services/csv_parsing_service.dart';

class DataEntryScreen extends ConsumerStatefulWidget {
  const DataEntryScreen({super.key});

  @override
  ConsumerState<DataEntryScreen> createState() => _DataEntryScreenState();
}

class _DataEntryScreenState extends ConsumerState<DataEntryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _formKey = GlobalKey<FormState>();
  bool _isSyncing = false;
  String? _syncingService;

  // Manual Form Controllers
  final _revenueController = TextEditingController();
  final _cogsController = TextEditingController();
  final _opexController = TextEditingController();
  final _assetsController = TextEditingController();
  final _liabilitiesController = TextEditingController();
  final _leadsController = TextEditingController();
  final _conversionsController = TextEditingController();
  final _marketingController = TextEditingController();

  // General & Metadata
  final _periodController = TextEditingController();
  final _industryController = TextEditingController();
  String _selectedCurrency = 'USD';

  final List<String> _currencies = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD'];
  final List<String> _industries = [
    'Technology',
    'SaaS',
    'E-commerce',
    'Retail',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Other',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadCurrentData();
  }

  void _loadCurrentData() {
    final activeId = ref.read(activeProfileIdProvider);
    final data = ref.read(profilesDataProvider)[activeId]?.current;

    if (data != null) {
      _periodController.text = data.date;
      _industryController.text = data.industry;
      _revenueController.text = data.revenue.toString();
      _cogsController.text = data.cogs.toString();
      _opexController.text = data.operatingExpenses.toString();
      _assetsController.text = data.currentAssets.toString();
      _liabilitiesController.text = data.currentLiabilities.toString();
      _leadsController.text = data.leadsGenerated.toString();
      _conversionsController.text = data.conversions.toString();
      _marketingController.text = data.marketingSpend.toString();
    }

    // Load Currency from Profile
    final activeProfile = ref.read(activeProfileProvider);
    if (activeProfile != null) {
      _selectedCurrency = activeProfile.currency;
      if (!_currencies.contains(_selectedCurrency)) {
        _currencies.add(_selectedCurrency);
      }
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    _revenueController.dispose();
    _cogsController.dispose();
    _opexController.dispose();
    _assetsController.dispose();
    _liabilitiesController.dispose();
    _leadsController.dispose();
    _conversionsController.dispose();
    _marketingController.dispose();
    _periodController.dispose();
    _industryController.dispose();
    super.dispose();
  }

  void _saveData() {
    if (_formKey.currentState!.validate()) {
      final activeId = ref.read(activeProfileIdProvider);
      final currentData = ref.read(profilesDataProvider)[activeId]?.current;

      // Update Profile Currency
      final activeProfile = ref.read(activeProfileProvider);
      if (activeProfile != null &&
          activeProfile.currency != _selectedCurrency) {
        ref
            .read(profilesProvider.notifier)
            .updateProfile(activeProfile.copyWith(currency: _selectedCurrency));
      }

      final newData = FinancialData(
        revenue: double.tryParse(_revenueController.text) ?? 0.0,
        cogs: double.tryParse(_cogsController.text) ?? 0.0,
        operatingExpenses: double.tryParse(_opexController.text) ?? 0.0,
        currentAssets: double.tryParse(_assetsController.text) ?? 0.0,
        currentLiabilities: double.tryParse(_liabilitiesController.text) ?? 0.0,
        leadsGenerated: int.tryParse(_leadsController.text) ?? 0,
        conversions: int.tryParse(_conversionsController.text) ?? 0,
        marketingSpend: double.tryParse(_marketingController.text) ?? 0.0,
        industry: _industryController.text.isNotEmpty
            ? _industryController.text
            : (currentData?.industry ?? 'Technology'),
        date: _periodController.text,
        mrr: (double.tryParse(_revenueController.text) ?? 0.0) / 12,
        arr: double.tryParse(_revenueController.text) ?? 0.0,
      );

      ref
          .read(profilesDataProvider.notifier)
          .updateManualData(activeId, newData);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Financial data updated successfully'),
          backgroundColor: AppTheme.profitGreen,
          duration: Duration(seconds: 4),
        ),
      );

      // Redirect to dashboard after update
      ref.read(navigationProvider.notifier).state = AppRoute.dashboard;
    }
  }

  Future<void> _handleIntegrationSync(String service) async {
    final userId = ref.read(authProvider).userId;
    if (userId == null) return;

    // Special handling for Google Sheets (REAL OAUTH)
    if (service == 'sheets') {
      try {
        setState(() {
          _isSyncing = true;
          _syncingService = 'Google Sheets';
        });

        final token = await ref
            .read(authProvider.notifier)
            .signInWithSheetsScopes();
        if (token != null) {
          // Send token to backend
          await ref
              .read(apiServiceProvider)
              .connectIntegration('sheets', userId, token);

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Google Sheets connected successfully!'),
                backgroundColor: AppTheme.profitGreen,
              ),
            );
          }
        }
        return;
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Google Sheets connection failed: $e'),
              backgroundColor: AppTheme.lossRed,
            ),
          );
        }
        return;
      } finally {
        if (mounted) {
          setState(() {
            _isSyncing = false;
            _syncingService = null;
          });
        }
      }
    }

    // Special handling for Stripe/Plaid (Simulated Secure Connection UI)
    if (service == 'stripe' || service == 'plaid') {
      _showSecureConnectionDialog(service);
      return;
    }

    setState(() {
      _isSyncing = true;
      _syncingService = service;
    });

    try {
      final response = await ref
          .read(apiServiceProvider)
          .syncIntegration(service, userId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response['status'] ?? '$service integration active!'),
            backgroundColor: AppTheme.profitGreen,
            duration: const Duration(seconds: 4),
          ),
        );
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

  void _showSecureConnectionDialog(String service) {
    final isStripe = service == 'stripe';
    final color = isStripe ? const Color(0xFF635BFF) : Colors.black;
    final icon = isStripe ? Icons.payment : Icons.account_balance;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        bool isConnecting = false;
        return StatefulBuilder(
          builder: (context, setModalState) {
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
                      color: color.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, color: color, size: 40),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Connect ${service.substring(0, 1).toUpperCase()}${service.substring(1)}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    isStripe
                        ? 'Link your account to sync revenue & churn data.'
                        : 'Securely aggregate your bank transaction data.',
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
                              // Simulate link establishment
                              await Future.delayed(const Duration(seconds: 2));
                              if (context.mounted) {
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      '${service.toUpperCase()} linked successfully!',
                                    ),
                                    backgroundColor: AppTheme.profitGreen,
                                  ),
                                );
                              }
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: color == Colors.black
                            ? AppTheme.primaryBlue
                            : color,
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
        );
      },
    );
  }

  Future<void> _handleCsvImport() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['csv'],
      );

      if (result != null && result.files.single.path != null) {
        setState(() {
          _isSyncing = true;
          _syncingService = 'CSV';
        });

        final csvService = CsvParsingService();
        final parsedData = await csvService.parseFinancialCsv(
          result.files.single.path!,
        );

        if (parsedData != null) {
          final activeId = ref.read(activeProfileIdProvider);
          ref
              .read(profilesDataProvider.notifier)
              .updateManualData(activeId, parsedData);

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Financial Data Imported Successfully'),
                backgroundColor: AppTheme.profitGreen,
                duration: Duration(seconds: 4),
              ),
            );
            ref.read(navigationProvider.notifier).state = AppRoute.dashboard;
          }
        } else {
          throw Exception(
            'Could not parse CSV format. Please ensure headers match industry standards.',
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
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

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Custom Tab Bar
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          color: Colors.white.withValues(alpha: 0.02),
          child: Container(
            height: 48,
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
            ),
            child: TabBar(
              controller: _tabController,
              indicator: BoxDecoration(
                color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppTheme.primaryBlue.withValues(alpha: 0.5),
                ),
              ),
              labelColor: AppTheme.primaryBlue,
              unselectedLabelColor: Colors.white54,
              labelStyle: const TextStyle(fontWeight: FontWeight.bold),
              indicatorSize: TabBarIndicatorSize.tab,
              dividerColor: Colors.transparent,
              tabs: const [
                Tab(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.hub, size: 18),
                      SizedBox(width: 8),
                      Text('Integrations'),
                    ],
                  ),
                ),
                Tab(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.edit_note, size: 18),
                      SizedBox(width: 8),
                      Text('Manual Entry'),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              // Tab 1: Integrations (Smart Connectors)
              _buildIntegrationsTab(),

              // Tab 2: Manual Data EntryForm
              _buildManualEntryTab(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildIntegrationsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Connect Data Sources',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'Automate your financial intelligence by connecting your existing tools.',
            style: TextStyle(color: Colors.white54, fontSize: 14),
          ),
          const SizedBox(height: 32),
          if (_isSyncing)
            Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                children: [
                  LinearProgressIndicator(
                    backgroundColor: Colors.white.withValues(alpha: 0.05),
                    color: AppTheme.primaryBlue,
                    minHeight: 2,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'establishing neural link to ${_syncingService ?? "service"}...'
                        .toLowerCase(),
                    style: const TextStyle(
                      color: Colors.white24,
                      fontSize: 10,
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
            ),

          // Google Sheets
          _buildIntegrationCard(
            title: 'Google Sheets',
            description: 'Sync financial models securely.',
            icon: Icons.table_chart,
            color: const Color(0xFF0F9D58),
            onTap: () => _handleIntegrationSync('sheets'),
            isLoading: _isSyncing && _syncingService == 'sheets',
          ),

          // CSV Import
          _buildIntegrationCard(
            title: 'Import CSV',
            description: 'Upload exported financial data.',
            icon: Icons.upload_file,
            color: Colors.orange,
            onTap: _handleCsvImport,
            isLoading: _isSyncing && _syncingService == 'CSV',
          ),

          // Stripe
          _buildIntegrationCard(
            title: 'Stripe',
            description: 'Real-time revenue & churn metrics.',
            icon: Icons.payment,
            color: const Color(0xFF635BFF),
            onTap: () => _handleIntegrationSync('stripe'),
            isLoading: _isSyncing && _syncingService == 'stripe',
          ),

          // Plaid
          _buildIntegrationCard(
            title: 'Plaid',
            description: 'Secure bank account simplified.',
            icon: Icons.account_balance,
            color: Colors.black, // Plaid branding often black/white
            onTap: () => _handleIntegrationSync('plaid'),
            isLoading: _isSyncing && _syncingService == 'plaid',
          ),
        ],
      ),
    );
  }

  Widget _buildIntegrationCard({
    required String title,
    required String description,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
    bool isLoading = false,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: _isSyncing ? null : onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.03),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isLoading
                  ? AppTheme.primaryBlue.withValues(alpha: 0.3)
                  : Colors.white.withValues(alpha: 0.08),
            ),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: isLoading
                    ? const SizedBox(
                        width: 28,
                        height: 28,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: AppTheme.primaryBlue,
                        ),
                      )
                    : Icon(icon, color: color, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      description,
                      style: const TextStyle(
                        color: Colors.white38,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: Colors.white30,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildManualEntryTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionHeader('GENERAL & METADATA'),
            const SizedBox(height: 16),
            _buildInputField(
              'Reporting Period',
              _periodController,
              Icons.calendar_today_outlined,
              hintText: 'e.g., Q1 2026',
            ),
            _buildDropdownField(
              label: 'Industry Sector',
              value: _industryController.text.isNotEmpty
                  ? _industryController.text
                  : _industries.first,
              items: _industries,
              onChanged: (val) {
                if (val != null) {
                  setState(() {
                    _industryController.text = val;
                  });
                }
              },
              icon: Icons.business_outlined,
            ),
            _buildDropdownField(
              label: 'Currency',
              value: _selectedCurrency,
              items: _currencies,
              onChanged: (val) {
                if (val != null) {
                  setState(() {
                    _selectedCurrency = val;
                  });
                }
              },
              icon: Icons.attach_money,
            ),

            const SizedBox(height: 32),
            _buildSectionHeader('FINANCIAL STACK'),
            const SizedBox(height: 16),
            _buildInputField(
              'Annual Revenue',
              _revenueController,
              Icons.payments_outlined,
              prefix: '\$',
            ),
            _buildInputField(
              'Cost of Goods Sold (COGS)',
              _cogsController,
              Icons.shopping_cart_outlined,
              prefix: '\$',
            ),
            _buildInputField(
              'Operating Expenses',
              _opexController,
              Icons.account_balance_wallet_outlined,
              prefix: '\$',
            ),

            const SizedBox(height: 32),
            _buildSectionHeader('BALANCE SHEET'),
            const SizedBox(height: 16),
            _buildInputField(
              'Current Assets',
              _assetsController,
              Icons.account_balance_outlined,
              prefix: '\$',
            ),
            _buildInputField(
              'Current Liabilities',
              _liabilitiesController,
              Icons.gavel_outlined,
              prefix: '\$',
            ),

            const SizedBox(height: 32),
            _buildSectionHeader('MARKETING STACK'),
            const SizedBox(height: 16),
            _buildInputField(
              'Total Leads Generated',
              _leadsController,
              Icons.people_outline,
            ),
            _buildInputField(
              'Total Conversions',
              _conversionsController,
              Icons.ads_click_outlined,
            ),
            _buildInputField(
              'Marketing Spend',
              _marketingController,
              Icons.campaign_outlined,
              prefix: '\$',
            ),

            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _saveData,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryBlue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'UPDATE ENGINE DATA',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.bold,
        color: Colors.white.withValues(alpha: 0.4),
        letterSpacing: 2,
      ),
    );
  }

  Widget _buildInputField(
    String label,
    TextEditingController controller,
    IconData icon, {
    String? prefix,
    String? hintText,
  }) {
    // If controller is _periodController, we might want text input type
    final isNumeric = controller != _periodController;

    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.white70,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          TextFormField(
            controller: controller,
            keyboardType: isNumeric ? TextInputType.number : TextInputType.text,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              prefixIcon: Icon(icon, color: AppTheme.primaryBlue, size: 20),
              prefixText: prefix,
              prefixStyle: const TextStyle(color: AppTheme.primaryBlue),
              hintText: hintText,
              hintStyle: TextStyle(
                color: Colors.white.withValues(alpha: 0.3),
                fontSize: 12,
              ),
              filled: true,
              fillColor: Colors.white.withValues(alpha: 0.05),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: Colors.white.withValues(alpha: 0.1),
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: Colors.white.withValues(alpha: 0.1),
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppTheme.primaryBlue),
              ),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) return 'Please enter a value';
              if (isNumeric && double.tryParse(value) == null) {
                return 'Please enter a valid number';
              }
              return null;
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDropdownField({
    required String label,
    required String value,
    required List<String> items,
    required Function(String?) onChanged,
    required IconData icon,
  }) {
    // Ensure value is in items, otherwise fallback
    final safeValue = items.contains(value) ? value : items.first;

    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.white70,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            initialValue: safeValue,
            onChanged: onChanged,
            style: const TextStyle(color: Colors.white),
            dropdownColor: const Color(0xFF1E293B), // Slate-800 approx
            icon: const Icon(Icons.arrow_drop_down, color: Colors.white54),
            decoration: InputDecoration(
              prefixIcon: Icon(icon, color: AppTheme.primaryBlue, size: 20),
              filled: true,
              fillColor: Colors.white.withValues(alpha: 0.05),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: Colors.white.withValues(alpha: 0.1),
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: Colors.white.withValues(alpha: 0.1),
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppTheme.primaryBlue),
              ),
            ),
            items: items.map<DropdownMenuItem<String>>((String value) {
              return DropdownMenuItem<String>(value: value, child: Text(value));
            }).toList(),
          ),
        ],
      ),
    );
  }
}
