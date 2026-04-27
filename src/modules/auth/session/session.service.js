import { MAX_SESSIONS } from "../../../core/config/env.js";
import { ApiError, buildTokenPayload } from "../../../core/utils/index.js";
import {
  generateSessionTokens,
  hashToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
  generateFingerprint,
} from "../../../core/security/index.js";
import {
  countUserSessions,
  findOldestSession,
  findSessionByTokenHash,
  deleteSessionById,
  deleteSessionByHash,
  deleteAllUserSessions,
  findUserSessions,
  upsertSession,
} from "./session.repository.js";

import { formatSessions } from "./session.helper.js";

import { verifySessionFingerprint } from "./session.security.js";

// ! CREATE SESSION SERVICE
export const createSessionService = async (user, meta) => {
  const { deviceId, userAgent, ipAddress } = meta;

  if (!deviceId) {
    throw new ApiError(400, "Device ID is required");
  }

  // 1️⃣ Enforce max sessions
  const sessionCount = await countUserSessions(user.id);

  if (sessionCount >= MAX_SESSIONS) {
    const oldestSession = await findOldestSession(user.id);

    if (oldestSession) {
      await deleteSessionById(oldestSession.id);
    }
  }

  // 2️⃣ Generate tokens
  const payload = buildTokenPayload(user);

  const { accessToken, refreshToken, tokenHash } =
    generateSessionTokens(payload);

  // 3️⃣ Save session
  await upsertSession({
    userId: user.id,
    deviceId,
    tokenHash,
    fingerprint: generateFingerprint(deviceId, userAgent),
    ipAddress,
    userAgent,
    expiresAt: getRefreshTokenExpiry(),
  });

  return { accessToken, refreshToken };
};

// ! ROTATE REFRESH TOKEN SERVICE
export const rotateSessionService = async (refreshToken, meta) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  // 1️⃣ Verify token
  const decoded = verifyRefreshToken(refreshToken);

  // 2️⃣ Find session
  const tokenHash = hashToken(refreshToken);
  const session = await findSessionByTokenHash(tokenHash);

  // 🚨 TOKEN REUSE DETECTED
  if (!session) {
    await deleteAllUserSessions(decoded.id);
    throw new ApiError(401, "Session reuse detected. Logged out everywhere.");
  }

  // 3️⃣ Fingerprint check
  const isValid = verifySessionFingerprint(session, meta);

  if (!isValid) {
    await deleteAllUserSessions(decoded.id);
    throw new ApiError(401, "Device mismatch. Logged out everywhere.");
  }

  // 4️⃣ Expiry check
  if (session.expiresAt < new Date()) {
    await deleteSessionById(session.id);
    throw new ApiError(401, "Session expired");
  }

  // 5️⃣ User mismatch check
  if (decoded.id !== session.userId) {
    throw new ApiError(401, "Token mismatch");
  }

  // 6️⃣ Rotate session
  await deleteSessionById(session.id);

  return createSessionService(session.user, meta);
};

// ! REVOKE SESSION SERVICE
export const revokeSessionService = async refreshToken => {
  if (!refreshToken) return true; // No token means no session to revoke

  //  1️⃣ Hash the provided refresh token to find the session
  const tokenHash = hashToken(refreshToken);

  // 2️⃣ Delete the session by token hash
  await deleteSessionByHash(tokenHash);

  return true;
};

// ! REVOKE ALL SESSIONS SERVICE
export const revokeAllSessionsService = async userId => {
  // 1️⃣ Delete all sessions for the user
  await deleteAllUserSessions(userId);
  return true;
};

// ! LIST USER SESSIONS SERVICE
export const getUserSessionsService = async (userId, currentDeviceId) => {
  const sessions = await findUserSessions(userId);

  return formatSessions(sessions, currentDeviceId);
};

// ! LOGOUT SPECIFIC SESSION SERVICE
export const terminateSessionService = async (
  userId,
  sessionId,
  refreshToken
) => {
  if (!refreshToken) {
    throw new ApiError(400, "Current session token required");
  }

  const tokenHash = hashToken(refreshToken);
  const currentSession = await findSessionByTokenHash(tokenHash);

  if (!currentSession || currentSession.userId !== userId) {
    throw new ApiError(401, "Invalid session");
  }

  // 🚫 Prevent deleting current session
  if (currentSession.id === sessionId) {
    throw new ApiError(
      400,
      "Cannot terminate current session. Use logout instead."
    );
  }

  await deleteSessionById(sessionId);

  return true;
};
