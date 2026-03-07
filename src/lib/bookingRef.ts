import { prisma } from "@/lib/prisma";

function dateKeyToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

export async function nextBookingReference() {
  const today = dateKeyToday();

  const counter = await prisma.bookingCounter.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, dateKey: today, last: 0 },
  });

  // If date changed, reset to 0
  const base =
    counter.dateKey === today
      ? counter
      : await prisma.bookingCounter.update({
          where: { id: 1 },
          data: { dateKey: today, last: 0 },
        });

  // Increment atomically
  const updated = await prisma.bookingCounter.update({
    where: { id: 1 },
    data: { last: { increment: 1 } },
  });

  const seq = String(updated.last).padStart(4, "0");
  return `SLT-${today}-${seq}`;
}