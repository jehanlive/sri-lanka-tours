export function validateBookingInput(input: {
  days: number;
  startDate: string; // YYYY-MM-DD
  tier: "VALUE" | "STAR3" | "STAR4" | "STAR5";
  adults: number;
  children: number;
  infants: number;
}) {
  const errors: string[] = [];

  const { days, startDate, adults, children, infants } = input;

  if (!Number.isInteger(days) || days < 3 || days > 25) errors.push("Invalid days (3–25).");
  if (!startDate) errors.push("Start date is required.");

  if (!Number.isInteger(adults) || adults < 1) errors.push("At least 1 adult (12+) is required.");
  if (!Number.isInteger(children) || children < 0) errors.push("Children must be 0 or more.");
  if (!Number.isInteger(infants) || infants < 0) errors.push("Infants must be 0 or more.");

  const total = adults + children + infants;
  if (total > 8) errors.push("Maximum group size is 8 people total.");
  if (infants > adults) errors.push("Infants cannot exceed number of adults.");
  if (infants > 4) errors.push("Maximum infants is 4 per group.");

  // infants free
  const payingPax = adults + children;
  if (payingPax < 1) errors.push("At least 1 paying traveller required.");

  return {
    ok: errors.length === 0,
    errors,
    total,
    payingPax,
  };
}
