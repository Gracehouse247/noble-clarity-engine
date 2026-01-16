import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/financial_models.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';
import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

// --- Profiles List ---
class ProfilesNotifier extends StateNotifier<List<BusinessProfile>> {
  ProfilesNotifier() : super([]) {
    _loadFromPrefs();
  }

  Future<void> _loadFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonStr = prefs.getString('business_profiles');
      if (jsonStr != null) {
        final List<dynamic> list = jsonDecode(jsonStr);
        state = list.map((item) => BusinessProfile.fromJson(item)).toList();
      } else {
        // Seed with one if empty
        state = [
          const BusinessProfile(
            id: 'main_123',
            name: 'Main Business',
            industry: 'SaaS',
          ),
        ];
        _saveToPrefs();
      }
    } catch (e) {
      debugPrint('Error loading profiles from prefs: $e');
    }
  }

  Future<void> _saveToPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonStr = jsonEncode(state.map((p) => p.toJson()).toList());
      await prefs.setString('business_profiles', jsonStr);
    } catch (e) {
      debugPrint('Error saving profiles to prefs: $e');
    }
  }

  void addProfile(String name, String industry) {
    final newId = 'profile_${DateTime.now().millisecondsSinceEpoch}';
    state = [
      ...state,
      BusinessProfile(id: newId, name: name, industry: industry),
    ];
    _saveToPrefs();
  }

  void deleteProfile(String id) {
    if (state.length <= 1) return;
    state = state.where((p) => p.id != id).toList();
    _saveToPrefs();
  }

  void updateProfile(BusinessProfile updatedProfile) {
    state = [
      for (final profile in state)
        if (profile.id == updatedProfile.id) updatedProfile else profile,
    ];
    _saveToPrefs();
  }
}

final profilesProvider =
    StateNotifierProvider<ProfilesNotifier, List<BusinessProfile>>((ref) {
      return ProfilesNotifier();
    });

// --- Active Profile ID ---
final activeProfileIdProvider = StateProvider<String>((ref) {
  final profiles = ref.watch(profilesProvider);
  return profiles.isNotEmpty ? profiles.first.id : '';
});

// --- Profiles Data ---
class ProfilesDataNotifier extends StateNotifier<Map<String, ProfileData>> {
  final Ref ref;
  ProfilesDataNotifier(this.ref) : super({}) {
    _loadFromPrefs();
  }

  Future<void> _loadFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys().where((k) => k.startsWith('profile_data_'));

      final Map<String, ProfileData> loaded = {};

      for (final key in keys) {
        final profileId = key.replaceFirst('profile_data_', '');
        final jsonStr = prefs.getString(key);
        if (jsonStr != null) {
          try {
            loaded[profileId] = ProfileData.fromJson(jsonDecode(jsonStr));
          } catch (e) {
            debugPrint('Error parsing profile data for $profileId: $e');
          }
        }
      }

      if (loaded.isNotEmpty) {
        state = loaded;
      }
    } catch (e) {
      debugPrint('Error loading profile data from prefs: $e');
    }
  }

  Future<void> _saveToPrefs(String profileId, ProfileData data) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(
        'profile_data_$profileId',
        jsonEncode(data.toJson()),
      );
    } catch (e) {
      debugPrint('Error saving profile data to prefs: $e');
    }
  }

  void updateData(String profileId, FinancialData data) {
    ProfileData newData;
    final existing = state[profileId];
    if (existing == null) {
      newData = ProfileData(current: data);
    } else {
      newData = ProfileData(
        current: data,
        history: existing.history,
        goals: existing.goals,
      );
    }

    state = {...state, profileId: newData};
    _saveToPrefs(profileId, newData);
  }

  // --- GOALS API SYNC ---

  Future<void> fetchGoals(String profileId) async {
    final userId = ref.read(authProvider).userId;
    if (userId == null) return;

    final goals = await ref.read(apiServiceProvider).getGoals(userId);
    final existing = state[profileId];
    if (existing != null) {
      final newData = ProfileData(
        current: existing.current,
        history: existing.history,
        goals: goals,
      );
      state = {...state, profileId: newData};
      _saveToPrefs(profileId, newData);
    }
  }

  Future<void> addGoal(String profileId, FinancialGoal goal) async {
    final userId = ref.read(authProvider).userId;
    if (userId == null) return;

    try {
      final newGoal = await ref.read(apiServiceProvider).addGoal(userId, goal);
      final existing = state[profileId];
      if (existing != null) {
        final newData = ProfileData(
          current: existing.current,
          history: existing.history,
          goals: [...existing.goals, newGoal],
        );
        state = {...state, profileId: newData};
        _saveToPrefs(profileId, newData);
      }
    } catch (e) {
      debugPrint('Error adding goal: $e');
    }
  }

  Future<void> updateGoal(String profileId, FinancialGoal goal) async {
    final userId = ref.read(authProvider).userId;
    if (userId == null || goal.id.isEmpty) return;

    try {
      final updated = await ref
          .read(apiServiceProvider)
          .updateGoal(userId, goal.id, goal);
      final existing = state[profileId];
      if (existing != null) {
        final newData = ProfileData(
          current: existing.current,
          history: existing.history,
          goals: existing.goals
              .map((g) => g.id == goal.id ? updated : g)
              .toList(),
        );
        state = {...state, profileId: newData};
        _saveToPrefs(profileId, newData);
      }
    } catch (e) {
      debugPrint('Error updating goal: $e');
    }
  }

  Future<void> deleteGoal(String profileId, String goalId) async {
    final userId = ref.read(authProvider).userId;
    if (userId == null) return;

    try {
      await ref.read(apiServiceProvider).deleteGoal(userId, goalId);
      final existing = state[profileId];
      if (existing != null) {
        final newData = ProfileData(
          current: existing.current,
          history: existing.history,
          goals: existing.goals.where((g) => g.id != goalId).toList(),
        );
        state = {...state, profileId: newData};
        _saveToPrefs(profileId, newData);
      }
    } catch (e) {
      debugPrint('Error deleting goal: $e');
    }
  }

  void saveSnapshot(String profileId) {
    final existing = state[profileId];
    if (existing == null) return;

    final snapshot = existing.current.copyWith(
      date: DateTime.now().toIso8601String(),
    );

    final newData = ProfileData(
      current: existing.current,
      history: [...existing.history, snapshot],
      goals: existing.goals,
    );

    state = {...state, profileId: newData};
    _saveToPrefs(profileId, newData);
  }

  void updateManualData(String profileId, FinancialData newData) {
    ProfileData updatedProfileData;
    final existing = state[profileId];

    if (existing == null) {
      updatedProfileData = ProfileData(current: newData);
    } else {
      updatedProfileData = ProfileData(
        current: newData,
        history: existing.history,
        goals: existing.goals,
      );
    }

    state = {...state, profileId: updatedProfileData};
    _saveToPrefs(profileId, updatedProfileData);
  }

  void clearHistory(String profileId) {
    final existing = state[profileId];
    if (existing == null) return;

    final newData = ProfileData(
      current: existing.current,
      history: [],
      goals: existing.goals,
    );

    state = {...state, profileId: newData};
    _saveToPrefs(profileId, newData);
  }

  Future<void> loadDemoData() async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));

    final activeId = ref.read(activeProfileIdProvider);
    if (activeId.isEmpty) return;

    // Check if we already have data, if so, don't overwrite with demo data unless forced
    // For now, we'll assume loadDemoData is an explicit action or only for fresh/empty states
    /* 
    if (state[activeId]?.current.revenue != 0) {
       return; 
    } 
    */

    final demoData = FinancialData(
      revenue: 1500000,
      cogs: 600000,
      operatingExpenses: 450000,
      currentAssets: 1200000,
      currentLiabilities: 300000,
      leadsGenerated: 12500,
      conversions: 850,
      marketingSpend: 150000,
      industry: 'Technology',
      mrr: 125000,
      arr: 1500000,
      benchmark: const BenchmarkData(
        avgRevenue: 1200000,
        avgNetMargin: 12.0,
        avgBurnRate: 100000,
        cohortName: 'SaaS \$1M-\$5M ARR',
        top10Revenue: 2000000,
      ),
    );

    updateManualData(activeId, demoData);
  }
}

final profilesDataProvider =
    StateNotifierProvider<ProfilesDataNotifier, Map<String, ProfileData>>((
      ref,
    ) {
      return ProfilesDataNotifier(ref);
    });

// --- Selectors ---
final activeProfileProvider = Provider<BusinessProfile?>((ref) {
  final profiles = ref.watch(profilesProvider);
  final activeId = ref.watch(activeProfileIdProvider);
  return profiles.where((p) => p.id == activeId).firstOrNull;
});

final activeProfileDataProvider = Provider<ProfileData?>((ref) {
  final dataMap = ref.watch(profilesDataProvider);
  final activeId = ref.watch(activeProfileIdProvider);
  return dataMap[activeId];
});

// --- Consolidation provider ---
final consolidatedDataProvider = Provider<FinancialData?>((ref) {
  final profilesData = ref.watch(profilesDataProvider);
  if (profilesData.isEmpty) return null;

  double totalRevenue = 0;
  double totalExpenses = 0;
  double totalAssets = 0;
  double totalCl = 0;
  int totalLeads = 0;
  int totalConversions = 0;
  double totalMarketing = 0;

  for (final data in profilesData.values) {
    totalRevenue += data.current.revenue;
    totalExpenses += data.current.operatingExpenses;
    totalAssets += data.current.currentAssets;
    totalCl += data.current.currentLiabilities;
    totalLeads += data.current.leadsGenerated;
    totalConversions += data.current.conversions;
    totalMarketing += data.current.marketingSpend;
  }

  return FinancialData(
    revenue: totalRevenue,
    cogs: totalRevenue * 0.15,
    operatingExpenses: totalExpenses,
    currentAssets: totalAssets,
    currentLiabilities: totalCl,
    leadsGenerated: totalLeads,
    conversions: totalConversions,
    marketingSpend: totalMarketing,
    industry: 'Consolidated',
  );
});
