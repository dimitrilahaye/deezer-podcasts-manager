/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Podcast, Podcasts } from "../../../core/models/podcast";
import type PodcastsService from "../../../core/ports/podcasts-service";
import { sleep } from "../../../tests/utils";

type DeezerPodcast = {
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

export default class DeezerService implements PodcastsService {
    async search(_name: string): Promise<Podcasts> {
        await sleep(100)
        return [{
            "id": 638922,
            "title": "TFTC - Le Podcast",
            "description": "L'équipe de Tales From The Click accompagnée de ses invités vous fait vivre leurs anecdotes de cinéma autour d'un film culte à voir ou à revoir.  Hébergé par Acast. Visitez acast.com/privacy pour plus d'informations.",
            "available": true,
            "fans": 9468,
            "link": "https://www.deezer.com/show/638922",
            "share": "https://www.deezer.com/show/638922?utm_source=deezer&utm_content=show-638922&utm_term=0_1741444976&utm_medium=web",
            "picture": "https://cdn-images.dzcdn.net/images/talk/5fdf47af685128026b9e21963b2d4397/180x180-000000-80-0-0.jpg",
            "picture_small": "https://cdn-images.dzcdn.net/images/talk/5fdf47af685128026b9e21963b2d4397/56x56-000000-80-0-0.jpg",
            "picture_medium": "https://cdn-images.dzcdn.net/images/talk/5fdf47af685128026b9e21963b2d4397/250x250-000000-80-0-0.jpg",
            "picture_big": "https://cdn-images.dzcdn.net/images/talk/5fdf47af685128026b9e21963b2d4397/500x500-000000-80-0-0.jpg",
            "picture_xl": "https://cdn-images.dzcdn.net/images/talk/5fdf47af685128026b9e21963b2d4397/1000x1000-000000-80-0-0.jpg",
            "type": "podcast"
        }].map((podcast) => toDomain(podcast))
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