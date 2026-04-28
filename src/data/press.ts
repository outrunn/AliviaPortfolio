export interface PressItem {
  id: string;
  publication: string;
  title: string;
  pullQuote: string;
  url: string | null;
  date: string | null;
}

export const pressItems: PressItem[] = [
  {
    id: "origin-interview",
    publication: "Artist Interview Series",
    title: "Alivia Clark: Alive With Faith",
    pullQuote: "I want to share my ideas, opinions, and moments of growth with the people around me.",
    url: null,
    date: null,
  },
  {
    id: "breathless-feature",
    publication: "Music Feature",
    title: "Behind 'Breathless'",
    pullQuote: "I was sitting under the palm trees and hot sun in Miami. The song just came to me instantly. I wrote it in about 10 minutes.",
    url: null,
    date: null,
  },
  {
    id: "carnegie-hall",
    publication: "Performance Spotlight",
    title: "Carnegie Hall at 15",
    pullQuote: "Hundreds of people swaying, singing, and smiling — it felt like everyone was connected in the same breath.",
    url: null,
    date: null,
  },
  {
    id: "diversity-interview",
    publication: "Industry Voices",
    title: "Diversity in Music",
    pullQuote: "When different voices are represented, it doesn't just build up the industry, but it truly shapes culture in a way that's more inclusive, inspiring, and just real.",
    url: null,
    date: null,
  },
];
