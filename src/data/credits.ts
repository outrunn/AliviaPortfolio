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
    items: [
      { title: "18 To Party", role: "Lead" },
      { title: "Buttons: A New Musical Film", role: "Lead" },
    ],
  },
  {
    category: "Television",
    items: [
      { title: "Law & Order: Organized Crime" },
      { title: "Saturday Night Live" },
      { title: "Last Week Tonight with John Oliver" },
      { title: "Late Show with David Letterman" },
      { title: "NBC's Draftsville" },
    ],
  },
  {
    category: "Voice Over",
    items: [
      { title: "Paw Patrol", role: "Skye — Nickelodeon" },
      { title: "Bing", role: "Coco — Cartoon Network / HBO Max" },
    ],
  },
];

export const performanceCredits: CreditCategory[] = [
  {
    category: "Notable Performances",
    items: [
      { title: "Carnegie Hall — Featured Soloist (7 Years)" },
      { title: "Opener for Mariah Carey — World Trade Center Opening" },
      { title: "Joe Biden & Michael Bloomberg NYC Gala — Featured Soloist" },
      { title: "Little Miss Sunshine: The Musical — Second Stage Theater, NYC" },
      { title: "Broadway" },
      { title: "Rockwood Music Hall" },
      { title: "University of Miami — Patio Jams" },
      { title: "Cat 5 — Live Recording" },
    ],
  },
];
