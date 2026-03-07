import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top links */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link href="/about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/itineraries" className="hover:text-white transition">
            Itineraries
          </Link>
          <Link href="/terms" className="hover:text-white transition">
            Terms
          </Link>
          <Link href="/cancellation" className="hover:text-white transition">
            Cancellation Policy
          </Link>
          <Link href="/contact" className="hover:text-white transition">
            Contact
          </Link>
        </div>

        {/* Partner logos */}
        <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
          <Image src="/iata.png" alt="IATA" width={80} height={40} className="object-contain h-10 w-auto opacity-80 hover:opacity-100 transition" />
          <Image src="/Lonely_Planet.png" alt="Lonely Planet" width={120} height={40} className="object-contain h-10 w-auto opacity-80 hover:opacity-100 transition" />
          <Image src="/sltda.jpg" alt="SLTDA" width={80} height={40} className="object-contain h-10 w-auto opacity-80 hover:opacity-100 transition" />
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-white/10" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-neutral-400">
          <div>
            © {new Date().getFullYear()} Oriental Travels & Tours · Sri Lanka
          </div>

          <div className="flex gap-4">
            <span>Licensed by SLTDA</span>
            <span>•</span>
            <span>35+ years experience</span>
          </div>
        </div>
      </div>
    </footer>
  );
}