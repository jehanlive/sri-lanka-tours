import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LocaleCurrencyBar from "../components/LocaleCurrencyBar";
import CurrencyProvider from "../components/CurrencyProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oriental Travels | Sri Lanka",
  description: "Tailor-made Sri Lanka holidays",
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

          {/* Global locale/currency bar */}
          <Suspense fallback={null}>
            <LocaleCurrencyBar />
          </Suspense>

          {/* Page content */}
          {children}

          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
