export type Genre =
'Mapenzi' |
'Drama' |
'Siri' |
'Thriller' |
'Adventure' |
'Fantasy' |
'Horror' |
'Vijana' |
'Maisha';

export type StoryStatus = 'Inaendelea' | 'Imekamilika';

export interface Episode {
  id: string;
  number: number;
  title: string;
  readingMinutes: number;
  publishedAt: string;
  premium: boolean;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  hook: string;
  description: string;
  cover: string;
  author: string;
  genres: Genre[];
  status: StoryStatus;
  premium: boolean;
  isOriginal: boolean;
  isNew: boolean;
  rating: number;
  reads: number;
  price?: number;
  releasedAt: string;
  tags: string[];
  episodes: Episode[];
}

export interface ReadingProgress {
  storyId: string;
  episodeNumber: number;
  percent: number;
  lastReadAt: string;
}

export interface KisaNotification {
  id: string;
  kind: 'episode' | 'subscription' | 'system';
  title: string;
  body: string;
  time: string;
  cta: string;
  href: string;
  unread: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  hint: string;
  tone: 'green' | 'red' | 'blue' | 'gold';
}