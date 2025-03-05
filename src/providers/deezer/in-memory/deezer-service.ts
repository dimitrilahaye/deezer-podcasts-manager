import type { Podcasts } from "../../../core/models/podcast";
import type PodcastsService from "../../../core/ports/podcasts-service";

export default class DeezerService implements PodcastsService {
    async search(name: string): Promise<Podcasts> {
        return [{
            id: 1,
            title: name,
            description: 'description',
            available: true,
            picture: '',
            isFavorite: false,
        }]
    }
}
