export function validateGroup(args: {
  adults: number;
  children: number;
  infants: number;
}) {
  const errors: string[] = [];
  const { adults, children, infants } = args;

  if (adults < 1) errors.push("At least 1 adult (12+) is required.");
  const total = adults + children + infants;
  if (total > 8) errors.push("Maximum group size is 8 people total.");
  if (infants > adults) errors.push("Infants cannot exceed number of adults.");
  if (infants > 4) errors.push("Maximum infants is 4 per group.");

  // optional: disallow negative
  if (adults < 0 || children < 0 || infants < 0) errors.push("People counts cannot be negative.");

  return { ok: errors.length === 0, errors, total };
}
