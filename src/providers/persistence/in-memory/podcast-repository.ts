import type { Podcast } from "../../../core/models/podcast";
import type PodcastRepository from "../../../core/ports/podcast-repository";

export default class IndexedDbPodcastRepository implements PodcastRepository {
    async toggleFromFavorites(podcast: Podcast): Promise<Podcast> {
        return {
            ...podcast,
            isFavorite: !podcast.isFavorite
        }
    }
}