import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_router.dart';
import '../providers/financial_provider.dart';
import '../providers/integrations_provider.dart';
import '../models/financial_models.dart';
import '../providers/onboarding_provider.dart';

/// Smart routing service that determines the best screen for a user
/// based on their data status and onboarding progress
class SmartRoutingService {
  final Ref ref;

  SmartRoutingService(this.ref);

  /// Determines the appropriate route for a user after login
  Future<AppRoute> getPostLoginRoute() async {
    try {
      // Check if user has financial data
      final financialDataAsync = ref.read(financialDataProvider);

      return financialDataAsync.when(
        data: (financialData) {
          // Check if user has meaningful data
          if (_hasFinancialData(financialData)) {
            // User has data → Go to Dashboard
            return AppRoute.dashboard;
          } else {
            // Check if user has connected integrations
            final connectedPlatforms = ref.read(connectedPlatformsProvider);
            final hasConnections = connectedPlatforms.values.any(
              (isConnected) => isConnected,
            );

            if (hasConnections) {
              // Has integrations but no data yet → Trigger sync, then dashboard
              return AppRoute.dashboard;
            } else {
              // No data, no integrations → Data Entry/Connect screen
              return AppRoute.dataConnect;
            }
          }
        },
        loading: () => AppRoute.dashboard, // Default to dashboard while loading
        error: (_, __) => AppRoute.dataConnect, // On error, go to data entry
      );
    } catch (e) {
      // Fallback to data connect screen
      return AppRoute.dataConnect;
    }
  }

  /// Checks if financial data has meaningful values
  bool _hasFinancialData(FinancialData data) {
    // Consider data "meaningful" if any of these are non-zero
    return data.revenue > 0 ||
        data.operatingExpenses > 0 ||
        data.marketingSpend > 0 ||
        data.leadsGenerated > 0 ||
        data.conversions > 0;
  }

  /// Determines if user should see onboarding
  bool shouldShowOnboarding() {
    // Check if user has completed onboarding
    final isCompleted = ref.read(onboardingProvider);
    return !isCompleted;
  }

  /// Gets the best "home" screen for a user based on their usage pattern
  AppRoute getHomeScreen() {
    final financialDataAsync = ref.read(financialDataProvider);

    return financialDataAsync.when(
      data: (data) {
        if (_hasFinancialData(data)) {
          // User has data → Dashboard is home
          return AppRoute.dashboard;
        } else {
          // No data → Data Connect is home
          return AppRoute.dataConnect;
        }
      },
      loading: () => AppRoute.dashboard,
      error: (_, __) => AppRoute.dataConnect,
    );
  }
}

/// Provider for smart routing service
final smartRoutingServiceProvider = Provider<SmartRoutingService>((ref) {
  return SmartRoutingService(ref);
});
