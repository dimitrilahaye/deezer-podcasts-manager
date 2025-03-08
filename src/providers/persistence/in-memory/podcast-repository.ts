import type { Podcast } from "../../../core/models/podcast";
import type PodcastRepository from "../../../core/ports/podcast-repository";
import { sleep } from "../../../tests/utils";

export default class IndexedDbPodcastRepository implements PodcastRepository {
    async toggleFromFavorites(podcast: Podcast): Promise<Podcast> {
        await sleep(100)
        return {
            ...podcast,
            isFavorite: !podcast.isFavorite
        }
    }
}