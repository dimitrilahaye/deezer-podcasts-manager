import type { Podcast, Podcasts } from "../../../core/models/podcast";
import type PodcastsDataSource from "../../../core/ports/podcasts-data-source";

export type DeezerPodcast = {
    id: number
    title: string
    description: string
    available: boolean
    fans: number
    link: string
    share: string
    picture: string
    picture_small: string
    picture_medium: string
    picture_big: string
    picture_xl: string
    type: string
}

export default class DeezerDataSource implements PodcastsDataSource {
    async search(query: string): Promise<Podcasts> {
        const response = await fetch(`https://corsproxy.io/?url=https://api.deezer.com/search/podcast?q=${query}`)
        const { data } = await response.json()
        return data.map((podcast: DeezerPodcast) => toDomain(podcast))
    }
}

function toDomain(podcast: DeezerPodcast): Podcast {
    return {
        id: podcast.id,
        available: podcast.available,
        description: podcast.description,
        picture: podcast.picture_small,
        title: podcast.title,
        isFavorite: false
    }
}