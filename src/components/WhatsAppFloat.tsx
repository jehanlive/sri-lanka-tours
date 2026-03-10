"use client";

const WHATSAPP_URL =
  "https://wa.me/94777973022?text=Hi%20OriLanka%2C%20I%20have%20a%20query%21";

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with OriLanka on WhatsApp"
      className="fixed bottom-6 right-6 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      title="WhatsApp us"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-7 w-7 fill-current"
      >
        <path d="M20.52 3.48A11.8 11.8 0 0 0 12.09.02C5.55.02.22 5.35.22 11.89c0 2.09.55 4.14 1.58 5.95L.05 24l6.33-1.66a11.82 11.82 0 0 0 5.7 1.46h.01c6.54 0 11.87-5.33 11.87-11.87 0-3.17-1.23-6.15-3.44-8.45Zm-8.43 18.3h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.66-.23-.37a9.84 9.84 0 0 1-1.5-5.25c0-5.43 4.43-9.86 9.88-9.86 2.63 0 5.11 1.03 6.97 2.9a9.8 9.8 0 0 1 2.89 6.97c0 5.44-4.43 9.87-9.85 9.87Zm5.41-7.39c-.3-.15-1.78-.88-2.05-.98-.27-.1-.46-.15-.66.15s-.76.98-.93 1.18c-.17.2-.34.23-.64.08-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.47.13-.62.14-.14.3-.34.45-.5.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.52.08-.8.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.2 3.06c.15.2 2.08 3.17 5.03 4.44.7.3 1.25.48 1.68.61.71.23 1.36.2 1.88.12.57-.08 1.78-.73 2.03-1.43.25-.71.25-1.31.18-1.43-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
