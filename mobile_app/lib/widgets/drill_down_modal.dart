import 'package:flutter/material.dart';
import '../core/app_theme.dart';

class DrillDownModal extends StatelessWidget {
  final String title;
  final List<DrillDownItem> items;
  final VoidCallback? onExplainPressed;

  const DrillDownModal({
    super.key,
    required this.title,
    required this.items,
    this.onExplainPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E2C),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (onExplainPressed != null)
                TextButton.icon(
                  onPressed: onExplainPressed,
                  icon: const Icon(
                    Icons.auto_awesome,
                    color: AppTheme.primaryBlue,
                    size: 16,
                  ),
                  label: const Text(
                    'Explain this',
                    style: TextStyle(color: AppTheme.primaryBlue),
                  ),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    backgroundColor: AppTheme.primaryBlue.withValues(
                      alpha: 0.1,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 24),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: items.length,
            separatorBuilder: (ctx, i) => const Divider(color: Colors.white12),
            itemBuilder: (context, index) {
              final item = items[index];
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.label,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        if (item.subLabel != null)
                          Text(
                            item.subLabel!,
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 12,
                            ),
                          ),
                      ],
                    ),
                    Row(
                      children: [
                        Text(
                          item.value,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (item.trend != null) ...[
                          const SizedBox(width: 8),
                          Text(
                            item.trend!,
                            style: TextStyle(
                              color: (item.isPositive ?? true)
                                  ? AppTheme.profitGreen
                                  : Colors.redAccent,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white.withValues(alpha: 0.1),
                foregroundColor: Colors.white,
              ),
              child: const Text('Close'),
            ),
          ),
        ],
      ),
    );
  }
}

class DrillDownItem {
  final String label;
  final String value;
  final String? subLabel;
  final String? trend;
  final bool? isPositive;

  const DrillDownItem({
    required this.label,
    required this.value,
    this.subLabel,
    this.trend,
    this.isPositive,
  });
}
