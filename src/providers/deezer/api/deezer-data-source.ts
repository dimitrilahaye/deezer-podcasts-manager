import type { Episode, Episodes } from "@index/core/models/episode";
import type { Podcast, Podcasts } from "../../../core/models/podcast";
import type PodcastsDataSource from "../../../core/ports/podcasts-data-source";

export type DeezerEpisode = {
    id: number
    title: string
    release_date: string
    duration: number
    picture: string
    type: string
}

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
        return data.map((podcast: DeezerPodcast) => podcastToDomain(podcast))
    }

    async getEpisodes(podcastId: number): Promise<Episodes> {
        const response = await fetch(`https://corsproxy.io/?url=https://api.deezer.com/podcast/${podcastId}/episodes`)
        const { data } = await response.json()
        return data.map((episode: DeezerEpisode) => episodeToDomain(podcastId, episode))
    }
}

function podcastToDomain(podcast: DeezerPodcast): Podcast {
    return {
        id: podcast.id,
        available: podcast.available,
        description: podcast.description,
        picture: podcast.picture_small,
        title: podcast.title,
        isFavorite: false
    }
}

function episodeToDomain(podcastId: number, episode: DeezerEpisode): Episode {
    return {
        id: episode.id,
        picture: episode.picture,
        release_date: new Date(episode.release_date),
        title: episode.title,
        podcastId,
    }
}