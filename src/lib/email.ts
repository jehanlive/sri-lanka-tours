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

  if (!host || !port || !user || !pass || !from) {
    console.warn("⚠️ Email not sent – missing SMTP env vars:", {
      SMTP_HOST: !!host,
      SMTP_PORT: !!port,
      SMTP_USER: !!user,
      SMTP_PASS: !!pass,
      EMAIL_FROM: !!from,
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    const info = await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
    });
    console.log("✅ Email sent to", input.to, "–", info.messageId);
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
}
