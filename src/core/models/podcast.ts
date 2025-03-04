export interface Podcast {
  id: number;
  title: string;
  description: string;
  available: boolean;
  picture: string;
}

export type Podcasts = Podcast[];
