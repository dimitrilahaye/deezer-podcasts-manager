import type { Episodes } from "../models/episode";
import type { Podcasts } from "../models/podcast";

export default interface PodcastsDataSource {
  search(name: string): Promise<Podcasts>;
  getEpisodes(podcastId: number): Promise<Episodes>;
}
