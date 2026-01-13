import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../models/financial_models.dart';
import '../providers/multi_tenant_provider.dart';

class DataEntryScreen extends ConsumerStatefulWidget {
  const DataEntryScreen({super.key});

  @override
  ConsumerState<DataEntryScreen> createState() => _DataEntryScreenState();
}

class _DataEntryScreenState extends ConsumerState<DataEntryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _formKey = GlobalKey<FormState>();

  // Manual Form Controllers
  final _revenueController = TextEditingController();
  final _cogsController = TextEditingController();
  final _opexController = TextEditingController();
  final _assetsController = TextEditingController();
  final _liabilitiesController = TextEditingController();
  final _leadsController = TextEditingController();
  final _conversionsController = TextEditingController();
  final _marketingController = TextEditingController();

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
      _revenueController.text = data.revenue.toString();
      _cogsController.text = data.cogs.toString();
      _opexController.text = data.operatingExpenses.toString();
      _assetsController.text = data.currentAssets.toString();
      _liabilitiesController.text = data.currentLiabilities.toString();
      _leadsController.text = data.leadsGenerated.toString();
      _conversionsController.text = data.conversions.toString();
      _marketingController.text = data.marketingSpend.toString();
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
    super.dispose();
  }

  void _saveData() {
    if (_formKey.currentState!.validate()) {
      final activeId = ref.read(activeProfileIdProvider);
      final currentData = ref.read(profilesDataProvider)[activeId]?.current;

      final newData = FinancialData(
        revenue: double.tryParse(_revenueController.text) ?? 0.0,
        cogs: double.tryParse(_cogsController.text) ?? 0.0,
        operatingExpenses: double.tryParse(_opexController.text) ?? 0.0,
        currentAssets: double.tryParse(_assetsController.text) ?? 0.0,
        currentLiabilities: double.tryParse(_liabilitiesController.text) ?? 0.0,
        leadsGenerated: int.tryParse(_leadsController.text) ?? 0,
        conversions: int.tryParse(_conversionsController.text) ?? 0,
        marketingSpend: double.tryParse(_marketingController.text) ?? 0.0,
        industry: currentData?.industry ?? 'Technology',
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
        ),
      );

      // Optionally pop if this was opened as a modal or dedicated entry screen from wizard
      // Navigator.pop(context);
    }
  }

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature integration coming soon!'),
        backgroundColor: AppTheme.primaryBlue,
        duration: const Duration(seconds: 1),
      ),
    );
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

          // Google Sheets
          _buildIntegrationCard(
            title: 'Google Sheets',
            description: 'Sync financial models securely.',
            icon: Icons.table_chart,
            color: const Color(0xFF0F9D58),
            onTap: () => _showComingSoon('Google Sheets'),
          ),

          // CSV Import
          _buildIntegrationCard(
            title: 'Import CSV',
            description: 'Upload exported financial data.',
            icon: Icons.upload_file,
            color: Colors.orange,
            onTap: () => _showComingSoon('CSV Import'),
          ),

          // Stripe
          _buildIntegrationCard(
            title: 'Stripe',
            description: 'Real-time revenue & churn metrics.',
            icon: Icons.payment,
            color: const Color(0xFF635BFF),
            onTap: () => _showComingSoon('Stripe'),
          ),

          // Plaid
          _buildIntegrationCard(
            title: 'Plaid',
            description: 'Secure bank account simplified.',
            icon: Icons.account_balance,
            color: Colors.black, // Plaid branding often black/white
            onTap: () => _showComingSoon('Plaid'),
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
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.03),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 28),
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
  }) {
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
            keyboardType: TextInputType.number,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              prefixIcon: Icon(icon, color: AppTheme.primaryBlue, size: 20),
              prefixText: prefix,
              prefixStyle: const TextStyle(color: AppTheme.primaryBlue),
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
              if (double.tryParse(value) == null) {
                return 'Please enter a valid number';
              }
              return null;
            },
          ),
        ],
      ),
    );
  }
}
