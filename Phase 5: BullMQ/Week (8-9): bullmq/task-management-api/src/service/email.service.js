import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({ recipient, subject, text }) => {
  const info = await transporter.sendMail({
    from: env.SMTP_FROM,
    to: recipient,
    subject,
    text,
  });

  return info;
};
