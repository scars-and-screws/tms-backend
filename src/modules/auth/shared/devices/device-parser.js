import { UAParser } from "ua-parser-js";

// ! FUNCTION TO PARSE THE USER AGENT STRING FROM THE REQUEST HEADERS AND EXTRACT DEVICE INFORMATION

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
