import ms from "ms";
import { TRUSTED_DEVICE_EXPIRATION } from "../../../../config/env.js";



// ! GET TRUSTED DEVICE EXPIRY DATE
export const getTrustedDeviceExpiry = () => {
  return new Date(Date.now() + ms(TRUSTED_DEVICE_EXPIRATION));
};
