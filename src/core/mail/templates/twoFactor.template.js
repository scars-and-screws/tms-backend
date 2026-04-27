import { otpBlock } from "./components/otpBlock.js";
import { baseTemplate } from "./base.template.js";

export const twoFactorTemplate = otp => {
  return baseTemplate({
    title: "Security verification",
    subtitle: "Enter this code to complete your sign-in.",

    content: `
      ${otpBlock(otp)}

      <p style="font-size:13px; color:#6b7280;">
        This code expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.
      </p>
    `,

    footer: "If this wasn’t you, please change your password immediately.",
  });
};
