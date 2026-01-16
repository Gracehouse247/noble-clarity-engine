import 'package:flutter_riverpod/flutter_riverpod.dart';

class ConnectedPlatformsNotifier extends StateNotifier<Map<String, bool>> {
  ConnectedPlatformsNotifier()
    : super({
        'Stripe': true,
        'PayPal': false,
        'QuickBooks': false,
        'Xero': false,
        'Google Ads': true,
        'Meta Ads': false,
        'Instagram Ads': false,
        'LinkedIn Ads': false,
        'TikTok Ads': false,
        'Mailchimp': false,
        'HubSpot': false,
      });

  void togglePlatform(String platform) {
    state = {...state, platform: !(state[platform] ?? false)};
  }

  void setConnected(String platform, bool isConnected) {
    state = {...state, platform: isConnected};
  }

  bool isConnected(String platform) {
    return state[platform] ?? false;
  }
}

final connectedPlatformsProvider =
    StateNotifierProvider<ConnectedPlatformsNotifier, Map<String, bool>>((ref) {
      return ConnectedPlatformsNotifier();
    });
