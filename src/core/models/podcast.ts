export interface Podcast {
  id: number;
  title: string;
  description: string;
  available: boolean;
  picture: string;
  isFavorite?: boolean
}

export type Podcasts = Podcast[];
