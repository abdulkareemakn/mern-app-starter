import nodemailer from "nodemailer";
import { Resend } from "resend";

export type Email = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

const send =
  process.env.NODE_ENV === "production"
    ? (email: Email) => new Resend().emails.send(email)
    : (email: Email) =>
        nodemailer
          .createTransport({ host: "127.0.0.1", port: 3025, secure: false })
          .sendMail(email);

export function sendEmail(email: Email) {
  return send(email);
}
