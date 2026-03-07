import { Suspense } from "react";
import ReviewPageClient from "@/components/ReviewPageClient";

export const dynamic = "force-dynamic";

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-6 py-16">Loading…</div>}>
      <ReviewPageClient />
    </Suspense>
  );
}
