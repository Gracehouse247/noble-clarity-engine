import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/multi_tenant_provider.dart';
import '../core/app_theme.dart';

class BusinessSwitcher extends ConsumerWidget {
  const BusinessSwitcher({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profiles = ref.watch(profilesProvider);
    final activeId = ref.watch(activeProfileIdProvider);
    final activeProfile = profiles.firstWhere(
      (p) => p.id == activeId,
      orElse: () => profiles.first,
    );

    return InkWell(
      onTap: () => _showSwitcher(context, ref),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.business, size: 16, color: AppTheme.primaryBlue),
            const SizedBox(width: 8),
            Text(
              activeProfile.name.toUpperCase(),
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 4),
            const Icon(
              Icons.keyboard_arrow_down,
              size: 16,
              color: Colors.white54,
            ),
          ],
        ),
      ),
    );
  }

  void _showSwitcher(BuildContext context, WidgetRef ref) {
    final profiles = ref.read(profilesProvider);
    final activeId = ref.read(activeProfileIdProvider);

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceDark,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'SWITCH BUSINESS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
                color: Colors.white54,
              ),
            ),
            const SizedBox(height: 20),
            ...profiles.map(
              (profile) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: profile.id == activeId
                        ? AppTheme.primaryBlue.withValues(alpha: 0.2)
                        : Colors.white.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    Icons.business,
                    color: profile.id == activeId
                        ? AppTheme.primaryBlue
                        : Colors.white24,
                    size: 20,
                  ),
                ),
                title: Text(
                  profile.name,
                  style: TextStyle(
                    color: profile.id == activeId
                        ? Colors.white
                        : Colors.white70,
                    fontWeight: profile.id == activeId
                        ? FontWeight.bold
                        : FontWeight.normal,
                  ),
                ),
                subtitle: Text(
                  profile.industry,
                  style: const TextStyle(fontSize: 11, color: Colors.white24),
                ),
                trailing: profile.id == activeId
                    ? const Icon(
                        Icons.check_circle,
                        color: AppTheme.primaryBlue,
                        size: 20,
                      )
                    : null,
                onTap: () {
                  ref.read(activeProfileIdProvider.notifier).state = profile.id;
                  Navigator.pop(context);
                },
              ),
            ),
            const SizedBox(height: 16),
            const Divider(color: Colors.white10),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.add, color: Colors.white70, size: 20),
              ),
              title: const Text(
                'Add New Business',
                style: TextStyle(color: Colors.white70),
              ),
              onTap: () {
                Navigator.pop(context);
                _showAddBusiness(context, ref);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showAddBusiness(BuildContext context, WidgetRef ref) {
    final nameController = TextEditingController();
    final industryController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.surfaceDark,
        title: const Text('New Business Profile'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: const InputDecoration(labelText: 'Business Name'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: industryController,
              decoration: const InputDecoration(labelText: 'Industry'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (nameController.text.isNotEmpty) {
                ref
                    .read(profilesProvider.notifier)
                    .addProfile(
                      nameController.text,
                      industryController.text.isEmpty
                          ? 'Technology'
                          : industryController.text,
                    );
                Navigator.pop(context);
              }
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }
}

