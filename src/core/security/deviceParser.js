import { UAParser } from "ua-parser-js";

// ! FUNCTION TO PARSE THE USER AGENT STRING FROM THE REQUEST HEADERS AND EXTRACT DEVICE INFORMATION SUCH AS BROWSER NAME, OPERATING SYSTEM, AND DEVICE TYPE. THIS FUNCTION USES THE UAParser LIBRARY TO ANALYZE THE USER AGENT STRING AND RETURNS AN OBJECT CONTAINING A HUMAN-READABLE DEVICE NAME (COMBINING BROWSER AND OS) AND THE DEVICE TYPE (E.G., DESKTOP, MOBILE, TABLET). THIS INFORMATION CAN BE USED FOR SECURITY PURPOSES, SUCH AS TRACKING DEVICES THAT ACCESS USER ACCOUNTS OR IMPLEMENTING DEVICE-BASED AUTHENTICATION MECHANISMS.

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
