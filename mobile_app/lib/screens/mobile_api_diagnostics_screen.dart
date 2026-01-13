import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';
import '../core/api_config.dart';
import '../providers/financial_provider.dart';

/// Mobile API Diagnostics Screen
/// Tests all API endpoints and features to ensure mobile optimization is working
class MobileApiDiagnosticsScreen extends ConsumerStatefulWidget {
  const MobileApiDiagnosticsScreen({super.key});

  @override
  ConsumerState<MobileApiDiagnosticsScreen> createState() =>
      _MobileApiDiagnosticsScreenState();
}

class _MobileApiDiagnosticsScreenState
    extends ConsumerState<MobileApiDiagnosticsScreen> {
  final Map<String, TestResult> _testResults = {};
  bool _isRunning = false;

  @override
  void initState() {
    super.initState();
    _runAllTests();
  }

  Future<void> _runAllTests() async {
    setState(() {
      _isRunning = true;
      _testResults.clear();
    });

    await _testServerHealth();
    await _testDashboardData();
    await _testAiInsights();
    await _testTTS();
    await _testGoals();
    await _testProfile();

    setState(() => _isRunning = false);
  }

  Future<void> _testServerHealth() async {
    final testName = 'Server Health Check';
    try {
      final apiService = ref.read(apiServiceProvider);
      final response = await apiService.dio.get(ApiConfig.systemStatus);

      if (response.statusCode == 200 && response.data['status'] == 'online') {
        _updateTest(
          testName,
          true,
          'Server online. Features: ${response.data['features']}',
        );
      } else {
        _updateTest(testName, false, 'Server returned: ${response.statusCode}');
      }
    } catch (e) {
      _updateTest(testName, false, 'Error: $e');
    }
  }

  Future<void> _testDashboardData() async {
    final testName = 'Dashboard Data';
    try {
      final apiService = ref.read(apiServiceProvider);
      final data = await apiService.getFinancialData('test_user');

      if (data.revenue > 0) {
        _updateTest(
          testName,
          true,
          'Loaded data: Revenue \$${data.revenue.toStringAsFixed(0)}',
        );
      } else {
        _updateTest(testName, false, 'No revenue data');
      }
    } catch (e) {
      _updateTest(testName, false, 'Error: $e');
    }
  }

  Future<void> _testAiInsights() async {
    final testName = 'AI Insights';
    try {
      final apiService = ref.read(apiServiceProvider);
      final financialDataAsync = ref.read(financialDataProvider);

      await financialDataAsync.when(
        data: (financialData) async {
          final response = await apiService.getAiFinancialInsights(
            financialData,
            question: 'Quick test: What is my net margin?',
          );

          if (response.isNotEmpty && !response.contains('Error')) {
            _updateTest(
              testName,
              true,
              'AI responded: ${response.substring(0, response.length > 100 ? 100 : response.length)}...',
            );
          } else {
            _updateTest(testName, false, 'AI returned empty or error');
          }
        },
        loading: () async {
          _updateTest(testName, false, 'Financial data still loading');
        },
        error: (error, stack) async {
          _updateTest(testName, false, 'Error: $error');
        },
      );
    } catch (e) {
      _updateTest(testName, false, 'Error: $e');
    }
  }

  Future<void> _testTTS() async {
    final testName = 'Text-to-Speech';
    try {
      final apiService = ref.read(apiServiceProvider);
      final audioData = await apiService.getTtsAudio('Test audio generation');

      if (audioData.isNotEmpty) {
        _updateTest(
          testName,
          true,
          'TTS generated audio (${audioData.length} bytes)',
        );
      } else {
        _updateTest(testName, false, 'No audio data received');
      }
    } catch (e) {
      _updateTest(testName, false, 'Error: $e');
    }
  }

  Future<void> _testGoals() async {
    final testName = 'Goals API';
    try {
      final apiService = ref.read(apiServiceProvider);
      final goals = await apiService.getGoals('test_user');

      _updateTest(testName, true, 'Loaded ${goals.length} goals');
    } catch (e) {
      _updateTest(testName, false, 'Error: $e');
    }
  }

  Future<void> _testProfile() async {
    final testName = 'Profile API';
    try {
      final apiService = ref.read(apiServiceProvider);
      final profile = await apiService.getProfile('test_user');

      if (profile.isNotEmpty) {
        _updateTest(testName, true, 'Profile loaded: ${profile['name']}');
      } else {
        _updateTest(testName, false, 'Empty profile');
      }
    } catch (e) {
      _updateTest(testName, false, 'Error: $e');
    }
  }

  void _updateTest(String name, bool success, String message) {
    setState(() {
      _testResults[name] = TestResult(
        name: name,
        success: success,
        message: message,
        timestamp: DateTime.now(),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F1116),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13151F),
        title: const Text('Mobile API Diagnostics'),
        actions: [
          IconButton(
            icon: const Icon(Icons.bug_report, color: Colors.red),
            tooltip: 'Force Crash (Test)',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Forcing crash in 1 second...')),
              );
              Future.delayed(const Duration(seconds: 1), () {
                throw Exception(
                  'Noble Clarity Test Crash from Diagnostics Screen',
                );
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _isRunning ? null : _runAllTests,
          ),
        ],
      ),
      body: Column(
        children: [
          // Configuration Info
          Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E232D),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Configuration',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                _buildConfigRow('Base URL', ApiConfig.baseUrl),
                _buildConfigRow(
                  'Connect Timeout',
                  '${ApiConfig.connectTimeout.inSeconds}s',
                ),
                _buildConfigRow(
                  'Receive Timeout',
                  '${ApiConfig.receiveTimeout.inSeconds}s',
                ),
                _buildConfigRow(
                  'Offline Mode',
                  ApiConfig.enableOfflineMode ? 'Enabled' : 'Disabled',
                ),
                _buildConfigRow(
                  'Compression',
                  ApiConfig.enableRequestCompression ? 'Enabled' : 'Disabled',
                ),
              ],
            ),
          ),

          // Test Results
          Expanded(
            child: _isRunning && _testResults.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(color: Colors.blue),
                        SizedBox(height: 16),
                        Text(
                          'Running diagnostics...',
                          style: TextStyle(color: Colors.white70),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _testResults.length,
                    itemBuilder: (context, index) {
                      final result = _testResults.values.elementAt(index);
                      return _buildTestResultCard(result);
                    },
                  ),
          ),

          // Summary
          if (_testResults.isNotEmpty && !_isRunning)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF13151F),
                border: Border(
                  top: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildSummaryItem(
                    'Passed',
                    _testResults.values.where((r) => r.success).length,
                    Colors.green,
                  ),
                  _buildSummaryItem(
                    'Failed',
                    _testResults.values.where((r) => !r.success).length,
                    Colors.red,
                  ),
                  _buildSummaryItem('Total', _testResults.length, Colors.blue),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildConfigRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Text(
            '$label: ',
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTestResultCard(TestResult result) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E232D),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: result.success
              ? Colors.green.withValues(alpha: 0.3)
              : Colors.red.withValues(alpha: 0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                result.success ? Icons.check_circle : Icons.error,
                color: result.success ? Colors.green : Colors.red,
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  result.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                '${result.timestamp.hour}:${result.timestamp.minute.toString().padLeft(2, '0')}',
                style: const TextStyle(color: Colors.white38, fontSize: 10),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            result.message,
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryItem(String label, int count, Color color) {
    return Column(
      children: [
        Text(
          count.toString(),
          style: TextStyle(
            color: color,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 12),
        ),
      ],
    );
  }
}

class TestResult {
  final String name;
  final bool success;
  final String message;
  final DateTime timestamp;

  TestResult({
    required this.name,
    required this.success,
    required this.message,
    required this.timestamp,
  });
}
