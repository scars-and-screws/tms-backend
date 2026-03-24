export const sanitizeMember = membership => {
  return {
    id: membership.id,
    role: membership.role,
    joinedAt: membership.joinedAt,

    user: {
      id: membership.user.id,
      name: membership.user.username,
      email: membership.user.email,
      firstName: membership.user.firstName,
      lastName: membership.user.lastName,
      avatarUrl: membership.user.avatarUrl,
    },
  };
};

export const mapMemberList = memberships => {
  return memberships.map(sanitizeMember);
};
