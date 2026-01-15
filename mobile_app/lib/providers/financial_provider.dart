import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/financial_models.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';
import 'multi_tenant_provider.dart';

final currentUserIdProvider = StateProvider<String>(
  (ref) => ref.watch(authProvider).userId ?? 'guest',
);

// This provider now acts as a shortcut to the active profile's current data
final financialDataProvider = Provider<AsyncValue<FinancialData>>((ref) {
  final activeId = ref.watch(activeProfileIdProvider);
  final profilesData = ref.watch(profilesDataProvider);
  final authState = ref.watch(authProvider);

  if (!authState.isAuthenticated) {
    return const AsyncValue.error('Authentication required', StackTrace.empty);
  }

  final data = profilesData[activeId]?.current;

  if (data != null) {
    return AsyncValue.data(data);
  }

  // If data is missing locally, we fall back to the async fetch
  return ref.watch(_fetchActiveDataProvider);
});

final _fetchActiveDataProvider = FutureProvider<FinancialData>((ref) async {
  final apiService = ref.watch(apiServiceProvider);
  final authState = ref.watch(authProvider);
  final activeId = ref.watch(activeProfileIdProvider);
  final userId = authState.userId;

  if (userId == null) {
    return const FinancialData(
      revenue: 0,
      cogs: 0,
      operatingExpenses: 0,
      currentAssets: 0,
      currentLiabilities: 0,
      leadsGenerated: 0,
      conversions: 0,
      marketingSpend: 0,
      industry: 'SaaS',
      date: '',
    );
  }

  try {
    final data = await apiService.getFinancialData(userId);

    // Side effect: seed the profiles data map with the fetched data
    final notifier = ref.read(profilesDataProvider.notifier);
    notifier.updateData(activeId, data);
    notifier.fetchGoals(activeId);

    return data;
  } catch (e) {
    // If API fails, return empty data for new users
    // This prevents error state and allows auto-redirect to DataEntryScreen
    debugPrint('Failed to fetch financial data: $e. Returning empty state.');
    return const FinancialData(
      revenue: 0,
      cogs: 0,
      operatingExpenses: 0,
      currentAssets: 0,
      currentLiabilities: 0,
      leadsGenerated: 0,
      conversions: 0,
      marketingSpend: 0,
      industry: 'SaaS',
      date: '',
    );
  }
});

// UI State Providers
final kpiVisibilityProvider = StateProvider<bool>((ref) => true);
final selectedTimeScaleProvider = StateProvider<String>((ref) => 'Monthly');
