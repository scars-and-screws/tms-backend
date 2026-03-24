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
  createSessionRecord,
  findSessionByTokenHash,
  deleteSessionById,
  deleteSessionByHash,
  deleteAllUserSessions,
  findUserSessions,
  verifySessionFingerprint,
  formatSessions,
  upserSession,
} from "./index.js";

// ! CREATE SESSION SERVICE
export const createSessionService = async (user, meta) => {
  const { deviceId, userAgent, ipAddress } = meta;

  // 1️⃣ Ensure deviceId exists
  if (!deviceId) {
    throw new ApiError(400, "Device ID is required");
  }

  // 2️⃣  Enforce max sessions (only for different devices)
  const sessionCount = await countUserSessions(user.id);

  if (sessionCount >= MAX_SESSIONS) {
    const oldestSession = await findOldestSession(user.id);

    if (oldestSession) {
      await deleteSessionById(oldestSession.id);
    }
  }

  // 5️⃣ Generate tokens d
  const payload = buildTokenPayload(user);

  const { accessToken, refreshToken, tokenHash } =
    generateSessionTokens(payload);

  // 6️⃣ Create session record in DB
  await upserSession({
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

  // 1️⃣ Verify JWT signature
  const decoded = verifyRefreshToken(refreshToken);

  // 2️⃣ Hash the provided refresh token to find the session
  const tokenHash = hashToken(refreshToken);

  const existingSession = await findSessionByTokenHash(tokenHash);

  // 3️⃣ If no session found, possible token reuse - revoke all sessions
  if (!existingSession) {
    await deleteAllUserSessions(decoded.id);
    throw new ApiError(401, "Session reuse detected. All sessions revoked.");
  }

  // 4️⃣ Verify session fingerprint to prevent token theft
  const isFingerprintValid = verifySessionFingerprint(existingSession, meta);

  if (!isFingerprintValid) {
    await deleteAllUserSessions(decoded.id);
    throw new ApiError(
      401,
      "Device mismatch detected. Possible token theft. All sessions revoked.  Please log in again."
    );
  }

  // 5️⃣ Expiration check
  if (existingSession.expiresAt < new Date()) {
    await deleteSessionById(existingSession.id);
    throw new ApiError(401, "Refresh token expired. Please log in again.");
  }

  // 6️⃣ JWT payload user ID check
  if (decoded.id !== existingSession.userId) {
    console.log("Decoded", decoded);
    console.log("ExistingUser", existingSession);
    throw new ApiError(401, "Token user mismatch");
  }

  // 7️⃣ Token rotation - delete old session
  await deleteSessionById(existingSession.id);

  // 8️⃣ Create new session
  return createSessionService(existingSession.user, meta);
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

  const session = await findSessionByTokenHash(tokenHash);

  if (!session || session.userId !== userId) {
    throw new ApiError(401, "Invalid session token");
  }

  if (session && session.id === sessionId) {
    throw new ApiError(
      400,
      "Cannot terminate current session. Use logout or logout all instead."
    );
  }

  await deleteSessionById(sessionId);

  return true;
};
