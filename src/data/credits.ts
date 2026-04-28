export interface Credit {
  title: string;
  role?: string;
}

export interface CreditCategory {
  category: string;
  items: Credit[];
}

export const actingCredits: CreditCategory[] = [
  {
    category: "Feature Film",
    items: [{ title: "18 To Party" }, { title: "Buttons: A Christmas Tale" }],
  },
  {
    category: "Television",
    items: [{ title: "Law & Order: OC" }, { title: "NBC's Draftsville" }],
  },
  {
    category: "Sketch Comedy",
    items: [
      { title: "Saturday Night Live" },
      { title: "Last Week Tonight with John Oliver" },
      { title: "Late Show with David Letterman" },
    ],
  },
  {
    category: "Voice Over",
    items: [{ title: "Paw Patrol" }, { title: "Bing Bunny" }],
  },
];

export const performanceCredits: CreditCategory[] = [
  {
    category: "Notable Performances",
    items: [
      { title: "Carnegie Hall — Annual Performance (Creative Director, Age 15)" },
      { title: "Little Miss Sunshine: The Musical — Second Stage Theater, NYC" },
      { title: "University of Miami — Patio Jams" },
      { title: "Cat 5 — Live Recording" },
      { title: "Bar A" },
    ],
  },
];
