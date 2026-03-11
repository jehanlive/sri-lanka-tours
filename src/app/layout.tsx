import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CurrencyProvider from "../components/CurrencyProvider";
import WhatsAppFloat from "../components/WhatsAppFloat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ori Lanka Travels",
    template: "%s - Ori Lanka Travels",
  },
  description: "Tailor-made Sri Lanka holidays",
  icons: {
    icon: "/OTlogo4.png",
    shortcut: "/OTlogo4.png",
    apple: "/OTlogo4.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ GLOBAL HEADER */}
        <CurrencyProvider>
          <Header />

          {/* Page content */}
          {children}

          <WhatsAppFloat />
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
