import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/notification_model.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'financial_provider.dart';
import 'auth_provider.dart';
import '../services/api_service.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'dart:io';

class NotificationNotifier extends StateNotifier<List<AppNotification>> {
  final Ref ref;

  NotificationNotifier(this.ref) : super([]) {
    _init();

    // Listen to financial data changes to trigger alerts
    ref.listen(financialDataProvider, (previous, next) {
      next.whenData((data) {
        _checkFinancialAnomalies(data);
        _checkMilestones(data);
      });
    });

    // Listen to Auth state to register device when logged in
    ref.listen(authProvider, (previous, next) {
      if (next.isAuthenticated && previous?.userId != next.userId) {
        _registerDevice(next.userId!);
      }
    });
  }

  Future<void> _init() async {
    final prefs = await SharedPreferences.getInstance();

    // Load milestones
    final savedMilestones = prefs.getStringList('achieved_milestones') ?? [];
    _achievedMilestones.addAll(savedMilestones);

    _generateWelcomeNotification(prefs);
  }

  void _generateWelcomeNotification(SharedPreferences prefs) {
    // Only show welcome once
    final hasSeenWelcome = prefs.getBool('has_seen_welcome') ?? false;

    if (!hasSeenWelcome) {
      _addNotification(
        AppNotification(
          id: 'welcome_${DateTime.now().millisecondsSinceEpoch}',
          title: 'Welcome to Noble Clarity',
          message:
              'Your financial intelligence engine is ready. Connect your data sources to unlock AI-powered insights.',
          timestamp: DateTime.now(),
          type: NotificationType.system,
        ),
      );
      prefs.setBool('has_seen_welcome', true);
    }
  }

  void _checkFinancialAnomalies(dynamic data) {
    // Cash runway alert
    final runway = data.operatingExpenses > 0
        ? (data.currentAssets / data.operatingExpenses)
        : 999.0;

    if (runway < 6 && runway > 0) {
      _addNotification(
        AppNotification(
          id: 'runway_alert_${DateTime.now().day}',
          title: 'Cash Flow Alert',
          message:
              'Warning: Your estimated runway is ${runway.toStringAsFixed(1)} months. Consider reducing burn rate or raising capital.',
          timestamp: DateTime.now(),
          type: NotificationType.alert,
          priority: NotificationPriority.high,
        ),
      );
    }

    // Profit margin check
    final grossMargin = data.revenue > 0
        ? ((data.revenue - data.cogs) / data.revenue) * 100
        : 0.0;

    if (grossMargin < 15 && data.revenue > 0) {
      _addNotification(
        AppNotification(
          id: 'margin_alert_${DateTime.now().day}',
          title: 'Low Margin Warning',
          message:
              'Your gross margin is ${grossMargin.toStringAsFixed(1)}%. Industry standard is 70%+ for SaaS. Review your COGS.',
          timestamp: DateTime.now(),
          type: NotificationType.alert,
          priority: NotificationPriority.medium,
        ),
      );
    }

    // High CAC warning
    if (data.marketingSpend > 0 && data.conversions > 0) {
      final cac = data.marketingSpend / data.conversions;
      if (cac > 500) {
        _addNotification(
          AppNotification(
            id: 'cac_alert_${DateTime.now().day}',
            title: 'High Customer Acquisition Cost',
            message:
                'Your CAC is \$${cac.toStringAsFixed(0)}. Consider optimizing your marketing funnel.',
            timestamp: DateTime.now(),
            type: NotificationType.insight,
            priority: NotificationPriority.medium,
          ),
        );
      }
    }
  }

  void _checkMilestones(dynamic data) {
    // Revenue milestones
    if (data.revenue >= 1000000 && !_hasMilestone('revenue_1m')) {
      _addNotification(
        AppNotification(
          id: 'milestone_revenue_1m',
          title: '🎉 Milestone Achieved!',
          message:
              'Congratulations! You\'ve reached \$1M in revenue. You\'re in the top 5% of startups.',
          timestamp: DateTime.now(),
          type: NotificationType.insight,
          priority: NotificationPriority.high,
        ),
      );
      _markMilestone('revenue_1m');
    }

    // Profitability milestone
    final netProfit = data.revenue - data.cogs - data.operatingExpenses;
    final margin = data.revenue > 0 ? (netProfit / data.revenue) * 100 : 0.0;

    if (margin > 20 && !_hasMilestone('margin_20')) {
      _addNotification(
        AppNotification(
          id: 'milestone_margin_20',
          title: '🎯 Profitability Milestone',
          message:
              'Amazing! You\'ve achieved 20%+ net margin. This is Series A ready profitability.',
          timestamp: DateTime.now(),
          type: NotificationType.insight,
          priority: NotificationPriority.high,
        ),
      );
      _markMilestone('margin_20');
    }

    // Efficiency milestone
    if (data.conversions > 100 && !_hasMilestone('conversions_100')) {
      _addNotification(
        AppNotification(
          id: 'milestone_conversions_100',
          title: '📈 Growth Milestone',
          message:
              'You\'ve reached 100 conversions! Your marketing engine is gaining traction.',
          timestamp: DateTime.now(),
          type: NotificationType.insight,
          priority: NotificationPriority.medium,
        ),
      );
      _markMilestone('conversions_100');
    }
  }

  // Track milestones to avoid duplicate notifications
  final Set<String> _achievedMilestones = {};

  bool _hasMilestone(String milestone) {
    return _achievedMilestones.contains(milestone);
  }

  void _markMilestone(String milestone) async {
    _achievedMilestones.add(milestone);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(
      'achieved_milestones',
      _achievedMilestones.toList(),
    );
  }

  void _addNotification(AppNotification notification) {
    // Prevent duplicate alerts for same hour/type
    if (state.any(
      (n) =>
          n.title == notification.title &&
          n.timestamp.difference(notification.timestamp).inHours.abs() < 1,
    )) {
      return;
    }
    state = [notification, ...state];
  }

  void markAsRead(String id) {
    state = [
      for (final n in state)
        if (n.id == id) n.copyWith(isRead: true) else n,
    ];
  }

  void markAllAsRead() {
    state = [for (final n in state) n.copyWith(isRead: true)];
  }

  void clearAll() {
    state = [];
  }

  // --- PUSH NOTIFICATION REGISTRATION ---

  Future<void> _registerDevice(String userId) async {
    try {
      final messaging = FirebaseMessaging.instance;

      // Request permissions (especially for iOS)
      final settings = await messaging.requestPermission(
        alert: true,
        badge: true,
        provisional: false,
        sound: true,
      );

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        final token = await messaging.getToken();
        if (token != null) {
          debugPrint('FCM Token generated: $token');
          final platform = Platform.isAndroid ? 'android' : 'ios';
          await ref
              .read(apiServiceProvider)
              .registerDevice(userId, token, platform);
        }
      }
    } catch (e) {
      debugPrint('Error during push registration: $e');
    }
  }
}

final notificationProvider =
    StateNotifierProvider<NotificationNotifier, List<AppNotification>>((ref) {
      return NotificationNotifier(ref);
    });

final unreadNotificationCountProvider = Provider<int>((ref) {
  return ref.watch(notificationProvider).where((n) => !n.isRead).length;
});
