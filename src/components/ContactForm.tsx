"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        country: formData.get("country"),
        message: formData.get("message"),
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Thank you! We will contact you shortly.");
      form.reset();
    } else {
      alert("Submission failed. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          First Name*
        </label>
        <input
          name="name"
          required
          placeholder="Enter your first name"
          className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/30"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Email*
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="Enter your email address"
          className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/30"
        />
      </div>

      {/* Mobile Number */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Mobile Number
        </label>
        <input
          name="phone"
          placeholder="Mobile Number"
          className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/30"
        />
      </div>

      {/* Country / Residency */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Country
        </label>
        <input
          name="country"
          placeholder="Country / Residency"
          className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/30"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Your Message*
        </label>
        <textarea
          name="message"
          required
          rows={3}
          placeholder="Type your message here"
          className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/30 resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-[#1f5f7a] text-white px-8 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Request a Proposal"}
      </button>
    </form>
  );
}