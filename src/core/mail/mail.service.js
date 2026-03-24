import {Resend} from "resend";
import {MAIL_CONFIG} from "../config/mail.config.js";

const resend = new Resend(MAIL_CONFIG.RESEND_API_KEY);

export const sendMail = async ({to, subject, html}) => {
  await resend.emails.send({
    from: "TMS <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
};
