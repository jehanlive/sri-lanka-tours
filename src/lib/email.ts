import nodemailer from "nodemailer";

export async function sendBookingEmail(input: {
  to: string;
  subject: string;
  text: string;
}) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;

  // MVP: if not configured, just skip.
  if (!host || !port || !user || !pass || !from) return;

  const transporter = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
  });
}
