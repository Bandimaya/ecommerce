// utils/email.ts
import nodemailer from "nodemailer";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

/**
 * Sends an email using SMTP (Gmail, custom SMTP, or any provider)
 */
export default async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: from || process.env.SMTP_FROM || "no-reply@example.com",
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
}
