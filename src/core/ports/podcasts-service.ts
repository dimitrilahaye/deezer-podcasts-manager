import type { Podcasts } from "../models/podcast";

export default interface PodcastsService {
  search(name: string): Promise<Podcasts>;
}
