import 'package:flutter/foundation.dart';

enum NotificationType { alert, insight, system, success }

enum NotificationPriority { low, medium, high }

@immutable
class AppNotification {
  final String id;
  final String title;
  final String message;
  final DateTime timestamp;
  final NotificationType type;
  final NotificationPriority priority;
  final bool isRead;
  final Map<String, dynamic>? metadata;

  const AppNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.timestamp,
    this.type = NotificationType.system,
    this.priority = NotificationPriority.low,
    this.isRead = false,
    this.metadata,
  });

  AppNotification copyWith({bool? isRead}) {
    return AppNotification(
      id: id,
      title: title,
      message: message,
      timestamp: timestamp,
      type: type,
      priority: priority,
      isRead: isRead ?? this.isRead,
      metadata: metadata,
    );
  }
}
