import { otpBlock } from "./components/otpBlock.js";
import { baseTemplate } from "./base.template.js";

export const passwordResetTemplate = otp => {
  return baseTemplate({
    title: "Reset your password",
    subtitle: "Use the code below to reset your password securely.",

    content: `
      ${otpBlock(otp)}

      <p style="font-size:13px; color:#6b7280;">
        This code will expire in ${
          process.env.OTP_EXPIRY_MINUTES || 10
        } minutes.
      </p>
    `,

    footer:
      "If you didn’t request a password reset, we recommend securing your account.",
  });
};
