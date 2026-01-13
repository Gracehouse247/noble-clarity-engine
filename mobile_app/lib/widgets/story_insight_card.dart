import 'package:flutter/material.dart';
import '../core/app_theme.dart';
import '../screens/ai_insights_feed.dart'; // Import for InsightType

class StoryInsightCard extends StatelessWidget {
  final InsightCardData data;
  final VoidCallback? onAction;

  const StoryInsightCard({super.key, required this.data, this.onAction});

  @override
  Widget build(BuildContext context) {
    Color color;
    IconData icon;

    switch (data.type) {
      case InsightType.critical:
        color = Colors.redAccent;
        icon = Icons.warning_amber_rounded;
        break;
      case InsightType.opportunity:
        color = AppTheme.profitGreen;
        icon = Icons.auto_graph_rounded;
        break;
      case InsightType.info:
        color = AppTheme.primaryBlue;
        icon = Icons.info_outline_rounded;
        break;
    }

    return Container(
      decoration: BoxDecoration(
        color: AppTheme.backgroundDark,
        // Gradient background to make it immersive
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            color.withValues(alpha: 0.15),
            AppTheme.backgroundDark,
            AppTheme.backgroundDark,
          ],
        ),
      ),
      child: Stack(
        children: [
          // Background Elements (Abstract Shapes)
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: color.withValues(alpha: 0.1),
                boxShadow: [
                  BoxShadow(
                    color: color.withValues(alpha: 0.2),
                    blurRadius: 100,
                    spreadRadius: 20,
                  ),
                ],
              ),
            ),
          ),

          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Bar
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: color.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: color.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(icon, size: 16, color: color),
                            const SizedBox(width: 8),
                            Text(
                              data.title.toUpperCase(),
                              style: TextStyle(
                                color: color,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      // Share/Star actions can go here
                      IconButton(
                        icon: const Icon(
                          Icons.share_outlined,
                          color: Colors.white54,
                        ),
                        onPressed: () {},
                      ),
                    ],
                  ),

                  const Spacer(),

                  // Big Metric / Centerpiece (Simulated)
                  Center(
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.3),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: color.withValues(alpha: 0.5),
                          width: 2,
                        ),
                      ),
                      child: Icon(icon, size: 64, color: color),
                    ),
                  ),

                  const Spacer(),

                  // Narrative Content
                  Text(
                    data.type == InsightType.opportunity
                        ? "Growth Unlocked! 🚀"
                        : "Attention Needed",
                    style: TextStyle(
                      color: color,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    data.description,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 28, // TikTok style functionality, big text
                      fontWeight: FontWeight.w600,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Context/Why
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.05),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.lightbulb_outline,
                          color: Colors.amber,
                          size: 20,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            "This puts you in the top 10% of your cohort. Keep pushing!", // Dynamic in real app
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.7),
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Action Button
                  if (data.actionLabel != null)
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: onAction,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: color,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 10,
                          shadowColor: color.withValues(alpha: 0.5),
                        ),
                        child: Text(
                          data.actionLabel!,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),

                  const SizedBox(height: 16),

                  // "Ask Clarity" link
                  Center(
                    child: TextButton.icon(
                      onPressed: () {}, // Handled by parent
                      icon: const Icon(
                        Icons.mic_none,
                        size: 16,
                        color: Colors.white54,
                      ),
                      label: const Text(
                        "Ask Clarity about this",
                        style: TextStyle(color: Colors.white54),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
