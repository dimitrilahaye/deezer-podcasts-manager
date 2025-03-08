import type { Podcasts } from "../models/podcast";

export default interface PodcastsDataSource {
  search(name: string): Promise<Podcasts>;
}
