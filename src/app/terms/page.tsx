export const metadata = {
  title: "Terms & Conditions",
  description: "Website Terms & Conditions",
};

export default function TermsPage() {
  return (
    <div className="bg-white text-black">
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Website Terms & Conditions
        </h1>

        <p className="mt-3 text-sm text-black/60">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* Intro */}
        <p className="mt-8 text-black/70 leading-relaxed">
          These Terms and Conditions govern your use of the Oriental Travels & Tours 
          Private Limited website (the “Website”). By accessing or using this Website, 
          you agree to be bound by these Terms. If you do not agree with any part of 
          these Terms, please do not use our Website.
        </p>

        {/* Sections */}
        <div className="mt-12 space-y-12">
          <Section title="About Us">
            <p>
              This Website is operated by Oriental Travels & Tours Private Limited, a travel company established
              in 1989 and based in Sri Lanka.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-1">
              <li>Registered with the International Air Transport Association (IATA)</li>
              <li>Licensed by the Sri Lanka Tourism Development Authority (SLTDA)</li>
            </ul>
            <p className="mt-4">
              References to “we”, “us” or “our” refer to Oriental Travels & Tours Private Limited.
            </p>
          </Section>

          <Section title="Use of the Website">
            <p>You agree to use this Website for lawful purposes only.</p>
            <ul className="list-disc pl-5 mt-4 space-y-1">
              <li>Breaches any applicable laws or regulations</li>
              <li>Is fraudulent or harmful</li>
              <li>Interferes with Website security or functionality</li>
              <li>Infringes the rights of others</li>
            </ul>
            <p className="mt-4">
              We reserve the right to restrict or terminate access at any time.
            </p>
          </Section>

          <Section title="Travel Information & Content">
            <p>
              All information on this Website is provided for general guidance only.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-1">
              <li>Information may not be complete or current</li>
              <li>Prices and availability may change</li>
            </ul>
          </Section>

          <Section title="Bookings & Enquiries">
            <p>
              Submitting an enquiry does not constitute a confirmed booking.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-1">
              <li>Availability must be confirmed</li>
              <li>Written confirmation must be issued</li>
              <li>Deposits or payments must be received</li>
            </ul>
          </Section>

          <Section title="Prices & Payments">
            <p>
              Prices shown are indicative only and may change due to exchange
              rates, availability, supplier costs or taxes.
            </p>
          </Section>

          <Section title="Third-Party Services & Links">
            <p>
              We are not responsible for third-party websites, services or
              content. Access is at your own risk.
            </p>
          </Section>

          <Section title="Intellectual Property">
            <p>
              All content on this Website is the property of Oriental Travels & Tours Private Limited or its
              licensors and may not be reproduced without written permission.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              Oriental Travels & Tours Private Limited shall not be liable for indirect, consequential or
              incidental losses to the fullest extent permitted by law.
            </p>
          </Section>

          <Section title="Website Availability">
            <p>
              We do not guarantee uninterrupted access and may suspend the
              Website for maintenance or updates.
            </p>
          </Section>

          <Section title="Privacy & Data Protection">
            <p>
              Your use of this Website is also governed by our Privacy Policy.
            </p>
          </Section>

          <Section title="Governing Law">
            <p>
              These Terms are governed by the laws of Sri Lanka.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              If you have any questions about these Terms, please contact us
              via the Contact page.
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}

/* Helper component */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-black/70 leading-relaxed">{children}</div>
      <div className="mt-6 h-px bg-black/10" />
    </section>
  );
}