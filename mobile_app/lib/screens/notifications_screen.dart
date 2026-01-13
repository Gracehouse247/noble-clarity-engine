import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import '../providers/notification_provider.dart';
import '../models/notification_model.dart';
import 'package:intl/intl.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifications = ref.watch(notificationProvider);

    return notifications.isEmpty
        ? _buildEmptyState()
        : ListView.builder(
            padding: const EdgeInsets.all(20),
            itemCount: notifications.length,
            itemBuilder: (context, index) {
              return _buildNotificationItem(context, ref, notifications[index]);
            },
          );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_off_outlined,
            size: 64,
            color: Colors.white10,
          ),
          const SizedBox(height: 16),
          const Text(
            'All caught up!',
            style: TextStyle(color: Colors.white38, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationItem(
    BuildContext context,
    WidgetRef ref,
    AppNotification notification,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: notification.isRead
            ? Colors.transparent
            : Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: notification.isRead
              ? Colors.white.withValues(alpha: 0.05)
              : AppTheme.primaryBlue.withValues(alpha: 0.2),
        ),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: _buildIcon(notification),
        title: Text(
          notification.title,
          style: TextStyle(
            color: Colors.white,
            fontWeight: notification.isRead
                ? FontWeight.normal
                : FontWeight.bold,
            fontSize: 14,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              notification.message,
              style: const TextStyle(color: Colors.white54, fontSize: 12),
            ),
            const SizedBox(height: 8),
            Text(
              DateFormat.jm().add_MMMd().format(notification.timestamp),
              style: const TextStyle(color: Colors.white24, fontSize: 10),
            ),
          ],
        ),
        onTap: () {
          ref.read(notificationProvider.notifier).markAsRead(notification.id);
        },
      ),
    );
  }

  Widget _buildIcon(AppNotification notification) {
    IconData icon;
    Color color;

    switch (notification.type) {
      case NotificationType.alert:
        icon = Icons.warning_amber_rounded;
        color = AppTheme.lossRed;
        break;
      case NotificationType.insight:
        icon = Icons.auto_awesome;
        color = AppTheme.aiPurple;
        break;
      case NotificationType.success:
        icon = Icons.check_circle_outline;
        color = AppTheme.profitGreen;
        break;
      case NotificationType.system:
        icon = Icons.notifications_none;
        color = AppTheme.primaryBlue;
        break;
    }

    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: color, size: 20),
    );
  }
}
