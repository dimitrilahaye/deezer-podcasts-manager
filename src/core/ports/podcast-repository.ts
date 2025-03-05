import type { Podcast } from "../models/podcast";

export default interface PodcastRepository {
  toggleFromFavorites(podcast: Podcast): Promise<Podcast>;
}
