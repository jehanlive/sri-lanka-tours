import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "src/data/bookings.json");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const raw = fs.readFileSync(dataFile, "utf-8");
  const store = JSON.parse(raw);

  const booking = store.bookings.find(
    (b: any) => b.stripeSessionId === sessionId
  );

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
