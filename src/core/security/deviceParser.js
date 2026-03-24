import { UAParser } from "ua-parser-js";

export const parseDeviceInfo = userAgent => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  const browser = result.browser.name || "Unknown Browser";
  const os = result.os.name || "Unknown OS";
  const deviceType = result.device.type || "Desktop";

  return {
    deviceName: `${browser} on ${os}`,
    deviceType,
  };
};
