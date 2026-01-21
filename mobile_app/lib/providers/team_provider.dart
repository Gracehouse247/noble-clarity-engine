import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/team_member_model.dart';

class TeamState {
  final List<TeamMember> members;
  final bool isLoading;
  final String? error;

  const TeamState({
    this.members = const [],
    this.isLoading = false,
    this.error,
  });

  TeamState copyWith({
    List<TeamMember>? members,
    bool? isLoading,
    String? error,
  }) {
    return TeamState(
      members: members ?? this.members,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class TeamNotifier extends StateNotifier<TeamState> {
  TeamNotifier() : super(const TeamState()) {
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    state = state.copyWith(isLoading: true);
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));

    try {
      final mockMembers = [
        TeamMember(
          id: '1',
          name: 'Noble Admin',
          email: 'admin@noblesworld.com.ng',
          role: TeamRole.owner,
          status: MemberStatus.active,
          joinedAt: DateTime(2025, 1, 1),
        ),
        TeamMember(
          id: '2',
          name: 'Sarah Finance',
          email: 'sarah.cfo@example.com',
          role: TeamRole.admin,
          status: MemberStatus.active,
          joinedAt: DateTime(2025, 1, 15),
        ),
        TeamMember(
          id: '3',
          name: 'Mike Marketing',
          email: 'mike.growth@example.com',
          role: TeamRole.editor,
          status: MemberStatus.pending,
          joinedAt: DateTime(2025, 1, 20),
        ),
      ];

      state = state.copyWith(members: mockMembers, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> inviteMember(String email, TeamRole role) async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(seconds: 2)); // Simulate API call

    final newMember = TeamMember(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: email.split('@')[0], // Placeholder name
      email: email,
      role: role,
      status: MemberStatus.pending,
      joinedAt: DateTime.now(),
    );

    state = state.copyWith(
      members: [...state.members, newMember],
      isLoading: false,
    );
  }

  Future<void> removeMember(String id) async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(seconds: 1));

    state = state.copyWith(
      members: state.members.where((m) => m.id != id).toList(),
      isLoading: false,
    );
  }

  Future<void> updateRole(String id, TeamRole newRole) async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(seconds: 1));

    state = state.copyWith(
      members: state.members.map((m) {
        if (m.id == id) {
          return m.copyWith(role: newRole);
        }
        return m;
      }).toList(),
      isLoading: false,
    );
  }

  Future<void> resendInvite(String id) async {
    // Just a mock action
    await Future.delayed(const Duration(seconds: 1));
  }
}

final teamProvider = StateNotifierProvider<TeamNotifier, TeamState>((ref) {
  return TeamNotifier();
});
