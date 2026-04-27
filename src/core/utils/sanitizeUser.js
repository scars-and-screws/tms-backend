import { DEFAULT_AVATAR_URL } from "../constants/defaultAvatar.js";

const sanitizeUser = user => {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,

    firstName: user.firstName,
    lastName: user.lastName,

    avatarUrl: user.avatarUrl || DEFAULT_AVATAR_URL,
    bio: user.bio,
    headline: user.headline,
    skills: user.skills,

    isEmailVerified: user.isEmailVerified,
    twoFactorEnabled: user.twoFactorEnabled,

    createdAt: user.createdAt,
  };
};

export default sanitizeUser;
