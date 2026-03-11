import { NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
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

    // Temporary placeholder until a real captcha is wired up on the form.
    if (!captchaToken || captchaToken !== "human") {
      return NextResponse.json(
        { error: "Human verification failed" },
        { status: 400 }
      );
    }

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.CONTACT_TO_EMAIL ||
      "contact@orientaltravels.lk";

    await sendBookingEmail({
      to: adminEmail,
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
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json(
      { error: "Contact submission failed" },
      { status: 500 }
    );
  }
}
