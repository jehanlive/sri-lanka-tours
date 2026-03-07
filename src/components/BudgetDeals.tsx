"use client";

import Link from "next/link";
import { useCurrency } from "@/lib/currency";

const DEALS_USD = [
  { label: "Under $200 per person", display: "$200", price: "200", bg: "bg-sky-200 text-sky-900" },
  { label: "Under $400 per person", display: "$400", price: "400", bg: "bg-cyan-300 text-cyan-900" },
  { label: "Under $600 per person", display: "$600", price: "600", bg: "bg-blue-400 text-white" },
];

const DEALS_INR = [
  { label: "Under ₹20,000 per person", display: "₹20,000", price: "200", bg: "bg-sky-200 text-sky-900" },
  { label: "Under ₹38,000 per person", display: "₹38,000", price: "400", bg: "bg-cyan-300 text-cyan-900" },
  { label: "Under ₹55,000 per person", display: "₹55,000", price: "600", bg: "bg-blue-400 text-white" },
];

export default function BudgetDeals() {
  const currency = useCurrency();
  const deals = currency === "INR" ? DEALS_INR : DEALS_USD;

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      {deals.map((item) => (
        <Link
          key={item.price}
          href={`/itineraries?price=${item.price}`}
          className="rounded-2xl overflow-hidden border border-black/10 hover:shadow-md transition"
        >
          <div className={`p-8 ${item.bg}`}>
            <div className="text-sm font-medium opacity-80">Under</div>
            <div className="text-4xl font-bold mt-1">
              {item.display}
              <span className="text-lg font-semibold ml-1">per person</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-white">
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-xl">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
