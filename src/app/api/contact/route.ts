import { NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    name,
    email,
    phone,
    country,
    message,
    captchaToken,
  } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // --- SIMPLE HUMAN CHECK (MVP) ---
  if (!captchaToken || captchaToken !== "human") {
    return NextResponse.json(
      { error: "Human verification failed" },
      { status: 400 }
    );
  }

  // 📧 Email to YOU
  await sendBookingEmail({
    to: "contact@orientaltravels.lk",
    subject: `New contact enquiry from ${name}`,
    text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "-"}
Country: ${country || "-"}

Message:
${message}
    `,
  });

  // 📧 Confirmation to USER
  await sendBookingEmail({
    to: email,
    subject: "We received your enquiry – Oriental Travels",
    text: `
Dear ${name},

Thank you for contacting Oriental Travels.

We have received your enquiry and will get back to you shortly.

Warm regards,
Oriental Travels & Tours
Sri Lanka
    `,
  });

  return NextResponse.json({ ok: true });
}