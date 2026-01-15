import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/app_theme.dart';
import 'voice_assistant_sheet.dart';
import '../core/app_router.dart'; // Import for navigationProvider

class SharedAiFab extends ConsumerWidget {
  const SharedAiFab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SizedBox(
      height: 68.0,
      width: 68.0,
      child: FittedBox(
        child: GestureDetector(
          onLongPress: () {
            showModalBottomSheet(
              context: context,
              isScrollControlled: true,
              backgroundColor: Colors.transparent,
              builder: (context) => const VoiceAssistantSheet(),
            );
          },
          child: FloatingActionButton(
            heroTag: 'ai_coach_fab_global',
            onPressed: () {
              ref.read(navigationProvider.notifier).state = AppRoute.aiCoach;
            },
            tooltip: 'Tap for Insights, Hold to Talk',
            backgroundColor: Colors.transparent,
            elevation: 0,
            child: Container(
              height: 60,
              width: 60,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [AppTheme.primaryBlue, AppTheme.aiPurple],
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.aiPurple.withValues(alpha: 0.4),
                    blurRadius: 20,
                    spreadRadius: 2,
                  ),
                ],
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.2),
                  width: 2,
                ),
              ),
              child: const Icon(
                Icons.psychology_alt,
                color: Colors.white,
                size: 32,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
