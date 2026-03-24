import { parseDeviceInfo } from "../../../core/security/index.js";

// ! FORMAT SESSION OBJECTS FOR RESPONSE
export const formatSessions = (sessions, currentDeviceId) => {
  return sessions.map(session => {
    const { deviceName, deviceType } = parseDeviceInfo(session.userAgent);
    return {
      id: session.id,
      deviceName,
      deviceType,
      userAgent: session.userAgent,
      ipaddress: session.ipAddress,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
      current: session.deviceId === currentDeviceId,
    };
  });
};
