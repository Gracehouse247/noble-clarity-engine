import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

@immutable
class BusinessSettings {
  final String name;
  final String industry;
  final String stage;
  final String targetMetric;
  final String businessSize;
  final String foundingDate;
  final String currency;

  const BusinessSettings({
    this.name = 'My Business',
    this.industry = 'SaaS',
    this.stage = 'Seed',
    this.targetMetric = 'Runway',
    this.businessSize = '1-10 Employees',
    this.foundingDate = '',
    this.currency = 'USD',
  });

  factory BusinessSettings.fromJson(Map<String, dynamic> json) {
    return BusinessSettings(
      name: json['name'] ?? 'My Business',
      industry: json['industry'] ?? 'SaaS',
      stage: json['stage'] ?? 'Seed',
      targetMetric: json['targetMetric'] ?? 'Runway',
      businessSize: json['businessSize'] ?? '1-10 Employees',
      foundingDate: json['foundingDate'] ?? '',
      currency: json['currency'] ?? 'USD',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'industry': industry,
      'stage': stage,
      'targetMetric': targetMetric,
      'businessSize': businessSize,
      'foundingDate': foundingDate,
      'currency': currency,
    };
  }

  BusinessSettings copyWith({
    String? name,
    String? industry,
    String? stage,
    String? targetMetric,
    String? businessSize,
    String? foundingDate,
    String? currency,
  }) {
    return BusinessSettings(
      name: name ?? this.name,
      industry: industry ?? this.industry,
      stage: stage ?? this.stage,
      targetMetric: targetMetric ?? this.targetMetric,
      businessSize: businessSize ?? this.businessSize,
      foundingDate: foundingDate ?? this.foundingDate,
      currency: currency ?? this.currency,
    );
  }
}

class BusinessProfileNotifier extends StateNotifier<BusinessSettings> {
  final Ref ref;
  BusinessProfileNotifier(this.ref) : super(const BusinessSettings()) {
    _init();
  }

  void _init() {
    // Sync with auth state
    ref.listen(authProvider, (previous, next) {
      if (next.isAuthenticated && previous?.userId != next.userId) {
        fetchProfile();
      }
    });
  }

  Future<void> fetchProfile() async {
    final userId = ref.read(authProvider).userId;
    if (userId == null) return;

    try {
      final data = await ref.read(apiServiceProvider).getProfile(userId);
      if (data.isNotEmpty) {
        state = BusinessSettings.fromJson(data);
      }
    } catch (e) {
      debugPrint('Error fetching profile: $e');
    }
  }

  Future<void> _sync() async {
    final userId = ref.read(authProvider).userId;
    if (userId == null) return;
    try {
      await ref.read(apiServiceProvider).saveProfile(userId, state.toJson());
    } catch (e) {
      debugPrint('Error syncing profile: $e');
    }
  }

  void updateName(String name) {
    state = state.copyWith(name: name);
    _sync();
  }

  void updateIndustry(String industry) {
    state = state.copyWith(industry: industry);
    _sync();
  }

  void updateStage(String stage) {
    state = state.copyWith(stage: stage);
    _sync();
  }

  void updateTargetMetric(String metric) {
    state = state.copyWith(targetMetric: metric);
    _sync();
  }

  void updateBusinessSize(String size) {
    state = state.copyWith(businessSize: size);
    _sync();
  }

  void updateFoundingDate(String date) {
    state = state.copyWith(foundingDate: date);
    _sync();
  }

  void updateCurrency(String currency) {
    state = state.copyWith(currency: currency);
    _sync();
  }
}

final businessProfileProvider =
    StateNotifierProvider<BusinessProfileNotifier, BusinessSettings>((ref) {
      return BusinessProfileNotifier(ref);
    });
