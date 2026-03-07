export const metadata = {
  title: "Cancellation & Refund Policy | OT Travel",
  description: "Cancellation & Refund Policy for OT Travel bookings",
};

export default function CancellationPolicyPage() {
  return (
    <div className="bg-white text-black">
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Cancellation & Refund Policy
        </h1>

        <p className="mt-3 text-sm text-black/60">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="mt-8 text-black/70 leading-relaxed">
          This Cancellation &amp; Refund Policy applies to all bookings made with
          OT Travel / OT Holidays (“we”, “us”, “our”). By confirming a booking,
          you agree to the terms set out below.
        </p>

        <div className="mt-12 space-y-12">
          <Section title="Deposits & Payment Terms">
            <h3 className="font-semibold">Standard bookings</h3>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>A 20% non-interest-bearing deposit is required to confirm a booking.</li>
              <li>The remaining 80% balance must be paid no later than 30 days prior to the tour start date.</li>
              <li>
                Failure to pay the balance by the due date may result in cancellation of the booking,
                with applicable cancellation charges applied.
              </li>
            </ul>

            <h3 className="font-semibold mt-6">Late bookings</h3>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Bookings made within 30 days of the tour start date require 100% payment at the time of confirmation.</li>
            </ul>
          </Section>

          <Section title="Cancellation by the Client">
            <p>
              All cancellation requests must be made in writing and will be effective
              from the date we receive written notice.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border border-black/10 rounded-lg">
                <thead className="bg-black/[0.03]">
                  <tr>
                    <th className="text-left font-semibold px-4 py-3 border-b border-black/10">
                      Time of cancellation
                    </th>
                    <th className="text-left font-semibold px-4 py-3 border-b border-black/10">
                      Refund amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black/10">
                    <td className="px-4 py-3">More than 30 days before start date</td>
                    <td className="px-4 py-3">100% refund of deposit paid</td>
                  </tr>
                  <tr className="border-b border-black/10">
                    <td className="px-4 py-3">15–30 days before start date</td>
                    <td className="px-4 py-3">50% refund of total booking value</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Less than 15 days before start date</td>
                    <td className="px-4 py-3">No refund</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Peak Season Policy (December & January)">
            <p>
              Due to peak travel demand and supplier policies, different cancellation
              terms apply for travel in December and January:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>The 20% deposit is non-refundable once a booking is confirmed</li>
              <li>Cancellations made within 30 days of the tour start date will not be eligible for a full refund</li>
              <li>Refunds, if any, will be subject to supplier-specific cancellation penalties</li>
            </ul>
            <p className="mt-4">
              Exact refund eligibility during this period will be confirmed at the time of booking.
            </p>
          </Section>

          <Section title="Supplier Cancellation Charges">
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Many airlines, hotels and ground service providers apply their own cancellation fees</li>
              <li>These fees may be higher than OT Travel’s standard policy</li>
              <li>Any non-recoverable supplier costs will be deducted from the refund amount</li>
            </ul>
            <p className="mt-4">
              OT Travel cannot be held responsible for supplier-imposed penalties beyond our control.
            </p>
          </Section>

          <Section title="No-Shows & Early Departures">
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>No refunds will be provided for no-shows, unused services, or early departures</li>
              <li>This includes missed flights, accommodation, transfers or activities for any reason</li>
            </ul>
          </Section>

          <Section title="Changes to Bookings">
            <p>Requests for changes to confirmed bookings (dates, itinerary, accommodation, etc.) are subject to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Availability</li>
              <li>Supplier approval</li>
              <li>Possible additional charges</li>
            </ul>
            <p className="mt-4">
              Changes are not guaranteed and may be treated as a cancellation under this policy.
            </p>
          </Section>

          <Section title="Cancellation by OT Travel">
            <p>
              In the unlikely event that OT Travel must cancel a confirmed booking due to operational reasons,
              we will offer one of the following options:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>A full refund of all amounts paid, or</li>
              <li>An alternative arrangement of equivalent value, subject to availability</li>
            </ul>
            <p className="mt-4">
              OT Travel shall not be liable for additional expenses incurred by the client,
              such as visa fees, insurance or non-refundable personal costs.
            </p>
          </Section>

          <Section title="Force Majeure">
            <p>
              OT Travel shall not be liable for cancellations, changes or delays caused by force majeure events,
              including but not limited to:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Natural disasters</li>
              <li>Extreme weather conditions</li>
              <li>Pandemics or public health emergencies</li>
              <li>Government restrictions or border closures</li>
              <li>War, civil unrest or terrorism</li>
              <li>Airline or transport strikes</li>
              <li>Acts of God or events beyond our reasonable control</li>
            </ul>
            <p className="mt-4">
              In such circumstances, refunds will be subject to supplier policies. OT Travel will make reasonable
              efforts to recover costs on your behalf, but we cannot guarantee full refunds.
            </p>
          </Section>

          <Section title="Travel Insurance">
            <p>
              We strongly recommend that all clients purchase comprehensive travel insurance at the time of booking.
              Insurance should cover, at a minimum:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Trip cancellation</li>
              <li>Medical emergencies</li>
              <li>Personal liability</li>
              <li>Travel disruption</li>
            </ul>
            <p className="mt-4">
              OT Travel is not responsible for losses that could have been covered by insurance.
            </p>
          </Section>

          <Section title="Waiver & Limitation of Liability">
            <p>By booking with OT Travel, you acknowledge that:</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Travel involves inherent risks</li>
              <li>You participate in activities at your own discretion</li>
              <li>OT Travel acts as an intermediary between clients and third-party suppliers</li>
            </ul>
            <p className="mt-4">OT Travel shall not be liable for:</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Injury, loss, damage or delay caused by third-party suppliers</li>
              <li>Events beyond our direct control</li>
              <li>Personal belongings lost or damaged during travel</li>
            </ul>
          </Section>

          <Section title="Acceptance of Policy">
            <p>
              By making a booking with OT Travel, you confirm that you have read, understood and accepted
              this Cancellation &amp; Refund Policy.
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}

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