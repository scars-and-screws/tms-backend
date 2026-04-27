import { otpBlock } from "./components/otpBlock.js";
import { baseTemplate } from "./base.template.js";

export const emailVerificationTemplate = otp => {
  return baseTemplate({
    title: "Verify your email",
    subtitle: "Confirm your email address to get started.",

    content: `
      ${otpBlock(otp)}

      <p style="font-size:13px; color:#6b7280;">
        This code will expire in ${
          process.env.OTP_EXPIRY_MINUTES || 10
        } minutes.
      </p>
    `,

    footer:
      "If you didn’t create an account, you can safely ignore this email.",
  });
};
