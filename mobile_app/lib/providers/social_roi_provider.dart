import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/social_roi_models.dart';

// Redundant SocialRoiState removed (it is now in social_roi_models.dart)

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
      name: 'New Platform',
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

  // Load comprehensive demo data
  void loadDemoData() {
    state = SocialRoiState(
      overheads: const SocialOverheads(
        teamHours: 120,
        hourlyRate: 35,
        toolCosts: 299,
      ),
      brandEquity: const BrandEquity(
        newFollowers: 2500,
        valuePerFollower: 0.50,
        totalEngagements: 15000,
        valuePerEngagement: 0.15,
      ),
      platforms: [
        const SocialPlatformData(
          id: 'demo_fb',
          name: 'Facebook Ads',
          adSpend: 1200,
          contentCost: 300,
          influencerCost: 0,
          websiteClicks: 2400,
          websiteConversionRate: 3.2,
          aov: 75,
          leadsGenerated: 85,
          leadToCustomerRate: 12,
          ltv: 450,
        ),
        const SocialPlatformData(
          id: 'demo_ig',
          name: 'Instagram Ads',
          adSpend: 800,
          contentCost: 400,
          influencerCost: 500,
          websiteClicks: 1800,
          websiteConversionRate: 2.8,
          aov: 65,
          leadsGenerated: 120,
          leadToCustomerRate: 8,
          ltv: 380,
        ),
        const SocialPlatformData(
          id: 'demo_li',
          name: 'LinkedIn Ads',
          adSpend: 1500,
          contentCost: 200,
          influencerCost: 0,
          websiteClicks: 800,
          websiteConversionRate: 5.5,
          aov: 250,
          leadsGenerated: 65,
          leadToCustomerRate: 18,
          ltv: 1200,
        ),
        const SocialPlatformData(
          id: 'demo_tt',
          name: 'TikTok Ads',
          adSpend: 600,
          contentCost: 350,
          influencerCost: 800,
          websiteClicks: 3200,
          websiteConversionRate: 1.8,
          aov: 45,
          leadsGenerated: 95,
          leadToCustomerRate: 6,
          ltv: 280,
        ),
      ],
      timeframe: state.timeframe,
    );
  }

  // Import from connected platforms (simulated for now)
  void importFromConnectedPlatforms(Map<String, bool> connectedPlatforms) {
    final List<SocialPlatformData> importedPlatforms = [];

    // Simulate importing data from connected platforms
    if (connectedPlatforms['Meta Ads'] == true ||
        connectedPlatforms['Facebook'] == true) {
      importedPlatforms.add(
        const SocialPlatformData(
          id: 'import_meta',
          name: 'Meta Ads (Facebook + Instagram)',
          adSpend: 2000,
          contentCost: 500,
          websiteClicks: 4200,
          websiteConversionRate: 3.0,
          aov: 70,
          leadsGenerated: 150,
          leadToCustomerRate: 10,
          ltv: 400,
        ),
      );
    }

    if (connectedPlatforms['LinkedIn Ads'] == true) {
      importedPlatforms.add(
        const SocialPlatformData(
          id: 'import_linkedin',
          name: 'LinkedIn Ads',
          adSpend: 1500,
          contentCost: 200,
          websiteClicks: 800,
          websiteConversionRate: 5.5,
          aov: 250,
          leadsGenerated: 65,
          leadToCustomerRate: 18,
          ltv: 1200,
        ),
      );
    }

    if (connectedPlatforms['TikTok Ads'] == true) {
      importedPlatforms.add(
        const SocialPlatformData(
          id: 'import_tiktok',
          name: 'TikTok Ads',
          adSpend: 600,
          contentCost: 350,
          websiteClicks: 3200,
          websiteConversionRate: 1.8,
          aov: 45,
          leadsGenerated: 95,
          leadToCustomerRate: 6,
          ltv: 280,
        ),
      );
    }

    if (importedPlatforms.isNotEmpty) {
      state = state.copyWith(
        platforms: [...state.platforms, ...importedPlatforms],
      );
    }
  }

  void clearAllPlatforms() {
    state = state.copyWith(platforms: []);
  }
}

final socialRoiProvider =
    StateNotifierProvider<SocialRoiNotifier, SocialRoiState>((ref) {
      return SocialRoiNotifier();
    });
