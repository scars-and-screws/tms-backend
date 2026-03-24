const sanitizeUser = user => {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,

    firstName: user.firstName,
    lastName: user.lastName,

    avatarUrl: user.avatarUrl,
    bio: user.bio,
    headline: user.headline,
    skills: user.skills,

    isEmailVerified: user.isEmailVerified,
    twoFactorEnabled: user.twoFactorEnabled,

    createdAt: user.createdAt,
  };
};

export default sanitizeUser;
