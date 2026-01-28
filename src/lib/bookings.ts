import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "src/data/bookings.json");

type BookingRecord = {
  reference: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  email?: string;
  metadata: Record<string, string>;
  createdAt: string;
};

type Store = {
  counter: number;
  bookings: BookingRecord[];
};

function readStore(): Store {
  try {
    if (!fs.existsSync(dataFile)) {
      const fresh: Store = { counter: 0, bookings: [] };
      fs.mkdirSync(path.dirname(dataFile), { recursive: true });
      fs.writeFileSync(dataFile, JSON.stringify(fresh, null, 2));
      return fresh;
    }

    const raw = fs.readFileSync(dataFile, "utf-8").trim();

    // If file is empty or corrupted, reset safely
    if (!raw) {
      const fresh: Store = { counter: 0, bookings: [] };
      fs.writeFileSync(dataFile, JSON.stringify(fresh, null, 2));
      return fresh;
    }

    const parsed = JSON.parse(raw);

    // Guard missing keys
    return {
      counter: typeof parsed.counter === "number" ? parsed.counter : 0,
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
    };
  } catch {
    const fresh: Store = { counter: 0, bookings: [] };
    fs.writeFileSync(dataFile, JSON.stringify(fresh, null, 2));
    return fresh;
  }
}


function writeStore(store: Store) {
  fs.writeFileSync(dataFile, JSON.stringify(store, null, 2));
}

function todayStamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

export function saveBookingOnce(input: {
  stripeSessionId: string;
  amount: number;
  currency: string;
  email?: string;
  metadata: Record<string, string>;
}): { reference: string } {
  const store = readStore();

  // Idempotency: Stripe may send webhook multiple times
  const existing = store.bookings.find(
    (b) => b.stripeSessionId === input.stripeSessionId
  );

  if (existing) {
    return { reference: existing.reference };
  }

  store.counter += 1;

  const reference = `SLT-${todayStamp()}-${String(store.counter).padStart(
    4,
    "0"
  )}`;

  store.bookings.push({
    reference,
    stripeSessionId: input.stripeSessionId,
    amount: input.amount,
    currency: input.currency,
    email: input.email,
    metadata: input.metadata,
    createdAt: new Date().toISOString(),
  });

  writeStore(store);

  return { reference };
}
