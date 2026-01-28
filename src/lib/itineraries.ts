export type Itinerary = {
  slug: string;
  days: number;
  title: string;
  summary: string;
  highlights: string[];
};

export const itineraries: Itinerary[] = [
  {
    slug: "3-day-highlights",
    days: 3,
    title: "3-Day Sri Lanka Highlights",
    summary: "Colombo → Sigiriya → Kandy in a compact short break.",
    highlights: ["Sigiriya Rock Fortress", "Kandy Temple of the Tooth", "Local cuisine"],
  },
  {
    slug: "4-day-cultural-escape",
    days: 4,
    title: "4-Day Cultural Escape",
    summary: "Culture + nature with the Cultural Triangle at a relaxed pace.",
    highlights: ["Dambulla Cave Temple", "Polonnaruwa ruins", "Village safari"],
  },
  {
    slug: "5-day-cultural-triangle",
    days: 5,
    title: "5-Day Cultural Triangle",
    summary: "The classics: ancient cities, wildlife option, and Kandy.",
    highlights: ["Anuradhapura", "Sigiriya", "Minneriya safari (optional)"],
  },
  {
    slug: "7-day-hills-and-beaches",
    days: 7,
    title: "7-Day Hill Country & Beaches",
    summary: "Tea hills + scenic train + a beach finish.",
    highlights: ["Nuwara Eliya", "Ella train ride", "South coast beaches"],
  },
  {
    slug: "10-day-classic",
    days: 10,
    title: "10-Day Classic Sri Lanka",
    summary: "A balanced loop: culture, hills, wildlife, beaches.",
    highlights: ["Cultural Triangle", "Hill Country", "Yala safari", "Beach time"],
  },
  {
    slug: "14-day-grand-tour",
    days: 14,
    title: "14-Day Grand Sri Lanka Tour",
    summary: "See it all with plenty of time for experiences.",
    highlights: ["Ancient cities", "Tea plantations", "Safaris", "Multiple beach stops"],
  },
];
