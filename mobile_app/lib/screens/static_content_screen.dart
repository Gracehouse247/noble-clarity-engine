import 'package:flutter/material.dart';
import '../core/app_theme.dart';

class StaticContentScreen extends StatelessWidget {
  final String title;
  final List<StaticSection> sections;

  const StaticContentScreen({
    super.key,
    required this.title,
    required this.sections,
  });

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ...sections.map((section) => _buildSection(section)),
                const SizedBox(height: 100),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSection(StaticSection section) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (section.title != null)
            Text(
              section.title!,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          if (section.title != null) const SizedBox(height: 12),
          Text(
            section.content,
            style: const TextStyle(
              color: Colors.white60,
              fontSize: 14,
              height: 1.6,
            ),
          ),
          if (section.bullets != null) ...[
            const SizedBox(height: 16),
            ...section.bullets!.map(
              (bullet) => Padding(
                padding: const EdgeInsets.only(bottom: 8, left: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '\u2022 ',
                      style: TextStyle(
                        color: AppTheme.primaryBlue,
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        bullet,
                        style: const TextStyle(
                          color: Colors.white60,
                          fontSize: 14,
                          height: 1.6,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class StaticSection {
  final String? title;
  final String content;
  final List<String>? bullets;

  const StaticSection({this.title, required this.content, this.bullets});
}
