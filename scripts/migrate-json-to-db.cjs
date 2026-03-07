/* scripts/migrate-json-to-db.cjs */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({ log: ["error"] });

// 👉 Update this path if your JSON file is elsewhere
const JSON_PATH = path.join(process.cwd(), "src", "data", "bookings.json");

function toInt(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function getBookings(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.bookings)) return raw.bookings;
  return [];
}

function extractRefParts(reference) {
  // Expected: SLT-YYYYMMDD-0001
  const m = /^SLT-(\d{8})-(\d{4})$/.exec(reference || "");
  if (!m) return null;
  return { dateKey: m[1], num: Number(m[2]) };
}

async function main() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`❌ JSON file not found: ${JSON_PATH}`);
    process.exit(1);
  }

  const rawText = fs.readFileSync(JSON_PATH, "utf-8").trim();
  if (!rawText) {
    console.error(`❌ JSON file is empty: ${JSON_PATH}`);
    process.exit(1);
  }

  const parsed = JSON.parse(rawText);
  const bookings = getBookings(parsed);

  console.log(`📦 Found ${bookings.length} booking(s) in JSON.`);

  let inserted = 0;
  let skipped = 0;

  // Track latest reference so we can set BookingCounter
  let latestDateKey = null;
  let latestLast = 0;

  for (const b of bookings) {
    const stripeSessionId = b.stripeSessionId || b.sessionId || b.stripe_session_id;
    const reference = b.reference;

    if (!stripeSessionId || !reference) {
      console.warn("⚠️ Skipping booking missing stripeSessionId/reference:", b);
      skipped++;
      continue;
    }

    // Derive itinerary fields from either flat fields OR metadata
    const md = b.metadata || {};
    const itinerarySlug = b.itinerarySlug || md.itinerarySlug || "";
    const itineraryTitle = b.itineraryTitle || md.itineraryTitle || null;
    const startDate = b.startDate || md.startDate || "";
    const tier = b.tier || md.tier || "";
    const adults = toInt(b.adults ?? md.adults, 0);
    const children = toInt(b.children ?? md.children, 0);
    const infants = toInt(b.infants ?? md.infants, 0);
    const days = toInt(b.days ?? md.days, 0);

    // Amount/currency/email can be flat or nested
    const amount = toInt(b.amount ?? b.amount_total ?? b.totalUsdCents ?? 0, 0);
    const currency = (b.currency || "usd").toLowerCase();
    const email = b.email || null;

    // Preserve createdAt if present
    const createdAt = b.createdAt ? new Date(b.createdAt) : null;

    // Upsert by stripeSessionId to avoid duplicates
    const existing = await prisma.booking.findUnique({
      where: { stripeSessionId },
      select: { id: true },
    });

    if (existing) {
      skipped++;
    } else {
      await prisma.booking.create({
        data: {
          reference,
          stripeSessionId,
          amount,
          currency,
          email,

          itinerarySlug,
          itineraryTitle,
          startDate,
          tier,
          adults,
          children,
          infants,
          days,

          ...(createdAt ? { createdAt } : {}),
        },
      });
      inserted++;
    }

    const parts = extractRefParts(reference);
    if (parts) {
      if (!latestDateKey || parts.dateKey > latestDateKey) {
        latestDateKey = parts.dateKey;
        latestLast = parts.num;
      } else if (parts.dateKey === latestDateKey && parts.num > latestLast) {
        latestLast = parts.num;
      }
    }
  }

  console.log(`✅ Inserted: ${inserted}`);
  console.log(`↩️ Skipped (already existed / invalid): ${skipped}`);

  // Update BookingCounter so new webhooks continue after latest reference
  if (latestDateKey) {
    await prisma.bookingCounter.upsert({
      where: { id: 1 },
      create: { id: 1, dateKey: latestDateKey, last: latestLast },
      update: { dateKey: latestDateKey, last: latestLast },
    });
    console.log(`🔢 BookingCounter set to dateKey=${latestDateKey} last=${latestLast}`);
  } else {
    console.log("ℹ️ No valid SLT-YYYYMMDD-#### references found; BookingCounter not updated.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Done.");
  })
  .catch(async (e) => {
    console.error("❌ Migration failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });