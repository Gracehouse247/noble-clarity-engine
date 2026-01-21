enum TeamRole { owner, admin, editor, viewer }

enum MemberStatus { active, pending }

class TeamMember {
  final String id;
  final String name;
  final String email;
  final TeamRole role;
  final MemberStatus status;
  final String? avatarUrl;
  final DateTime joinedAt;

  const TeamMember({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.status,
    this.avatarUrl,
    required this.joinedAt,
  });

  TeamMember copyWith({String? name, TeamRole? role, MemberStatus? status}) {
    return TeamMember(
      id: id,
      name: name ?? this.name,
      email: email,
      role: role ?? this.role,
      status: status ?? this.status,
      avatarUrl: avatarUrl,
      joinedAt: joinedAt,
    );
  }
}
