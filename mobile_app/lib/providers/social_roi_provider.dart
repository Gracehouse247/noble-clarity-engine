import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/social_roi_models.dart';

class SocialRoiState {
  final SocialOverheads overheads;
  final BrandEquity brandEquity;
  final List<SocialPlatformData> platforms;
  final String timeframe;

  const SocialRoiState({
    this.overheads = const SocialOverheads(
      teamHours: 80,
      hourlyRate: 25,
      toolCosts: 150,
    ),
    this.brandEquity = const BrandEquity(
      newFollowers: 1200,
      valuePerFollower: 0.25,
      totalEngagements: 5000,
      valuePerEngagement: 0.10,
    ),
    this.platforms = const [],
    this.timeframe = 'Monthly',
  });

  SocialRoiState copyWith({
    SocialOverheads? overheads,
    BrandEquity? brandEquity,
    List<SocialPlatformData>? platforms,
    String? timeframe,
  }) {
    return SocialRoiState(
      overheads: overheads ?? this.overheads,
      brandEquity: brandEquity ?? this.brandEquity,
      platforms: platforms ?? this.platforms,
      timeframe: timeframe ?? this.timeframe,
    );
  }

  // Global Calculations
  double get totalPlatformSpend =>
      platforms.fold(0.0, (sum, p) => sum + p.totalCost);
  double get totalDirectValue =>
      platforms.fold(0.0, (sum, p) => sum + p.totalValue);

  double get totalInvestment => overheads.total + totalPlatformSpend;
  double get totalValueGenerated => totalDirectValue + brandEquity.totalValue;

  double get netProfit => totalValueGenerated - totalInvestment;
  double get socialRoi =>
      totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0.0;
}

class SocialRoiNotifier extends StateNotifier<SocialRoiState> {
  SocialRoiNotifier()
    : super(
        const SocialRoiState(
          platforms: [
            SocialPlatformData(
              id: '1',
              name: 'Facebook',
              adSpend: 500,
              contentCost: 200,
              websiteClicks: 1000,
              websiteConversionRate: 2.5,
              aov: 50,
              leadsGenerated: 50,
              leadToCustomerRate: 10,
              ltv: 300,
            ),
          ],
        ),
      );

  void setTimeframe(String timeframe) {
    state = state.copyWith(timeframe: timeframe);
  }

  void updateOverheads(SocialOverheads overheads) {
    state = state.copyWith(overheads: overheads);
  }

  void updateBrandEquity(BrandEquity equity) {
    state = state.copyWith(brandEquity: equity);
  }

  void addPlatform() {
    final newItem = SocialPlatformData(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: 'Instagram',
    );
    state = state.copyWith(platforms: [...state.platforms, newItem]);
  }

  void removePlatform(String id) {
    state = state.copyWith(
      platforms: state.platforms.where((p) => p.id != id).toList(),
    );
  }

  void updatePlatform(SocialPlatformData platform) {
    state = state.copyWith(
      platforms: state.platforms
          .map((p) => p.id == platform.id ? platform : p)
          .toList(),
    );
  }
}

final socialRoiProvider =
    StateNotifierProvider<SocialRoiNotifier, SocialRoiState>((ref) {
      return SocialRoiNotifier();
    });
