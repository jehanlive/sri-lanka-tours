import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left column */}
          <div>
            <h1 className="text-5xl font-semibold tracking-tight">Contact us</h1>
            <p className="mt-4 text-black/70 max-w-lg">
              Get in touch with us for inquiries about inbound tours and holidays in Sri Lanka.
            </p>
            <p className="mt-3 text-black/70">We will love to hear from you!</p>

            <div className="mt-10 space-y-6 text-sm">
              <div>
                <div className="text-base font-semibold">Address</div>
                <div className="text-base text-black/70">93, 2/7 Main Street, Colombo 11, Sri Lanka</div>
              </div>

              <div>
                <div className="text-base font-semibold">Email</div>
                <div className="text-base text-black/70">contact@orientaltravels.lk</div>
              </div>

              <div>
                <div className="text-base font-semibold">Telephone Number</div>
                <div className="text-base text-black/70">+94 777 973022</div>
              </div>

              <div>
                <div className="text-base font-semibold">Hours</div>
                <div className="text-base text-black/70">9 AM - 6 PM</div>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/" className="text-base underline underline-offset-4 hover:opacity-70">
                Back to Home
              </Link>
            </div>
          </div>

          {/* Right column form */}
          <div className="rounded-2xl border border-black/10 p-8">
            <ContactForm />
          </div>
        </div>
      </main>
{/* Map section */}
<section className="mt-20">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-xl font-semibold text-center mb-6">
      Visit Our Office
    </h2>

    <div className="flex justify-center">
      <div className="w-full max-w-4xl h-[380px] rounded-2xl overflow-hidden border border-black/10">
        <iframe
          src="https://www.google.com/maps?q=93%20Main%20Street,%20Colombo%2011,%20Sri%20Lanka&output=embed"
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0"
        />
      </div>
    </div>

    <p className="mt-4 text-center text-sm text-black/60">
      <a
        href="https://www.google.com/maps?q=93+Main+Street,+Colombo+11,+Sri+Lanka"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:opacity-70"
      >
        Open in Google Maps
      </a>
    </p>
  </div>
</section>

 {/* Footer */}
      <footer className="border-t border-black/10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link className="hover:underline underline-offset-4" href="/about">
              About
            </Link>
            <Link className="hover:underline underline-offset-4" href="/terms">
              Terms
            </Link>
            <Link className="hover:underline underline-offset-4" href="/cancellation">
              Cancellation Policy
            </Link>
            <Link className="hover:underline underline-offset-4" href="/contact">
              Contact
            </Link>
          </div>

          <div className="mt-6 text-sm text-black/60">
            © Oriental Travels | Sri Lanka
          </div>
        </div>
      </footer>
      
    </div>
  );
}