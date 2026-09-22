import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { Config } from "#/config";

export type Email = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export function sendEmail(email: Email, config: Config) {
  if (config.nodeEnv === "production")
    return new Resend(config.resendApiKey).emails.send(email);
  return nodemailer
    .createTransport({ host: "127.0.0.1", port: 3025, secure: false })
    .sendMail(email);
}
