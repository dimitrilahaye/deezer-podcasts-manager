import type { Podcast } from "../models/podcast";

export default interface PodcastRepository {
  toggleFromFavorites(id: number): Promise<Podcast>;
}
