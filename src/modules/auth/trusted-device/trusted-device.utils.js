import ms from "ms";
import { TRUSTED_DEVICE_EXPIRATION } from "../../../core/config/env.js";

import ms from "ms";

// ! GET TRUSTED DEVICE EXPIRY DATE
export const getTrustedDeviceExpiry = () => {
  return new Date(Date.now() + ms(TRUSTED_DEVICE_EXPIRATION));
};
