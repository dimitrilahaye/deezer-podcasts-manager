/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Episodes } from "@index/core/models/episode";
import type { Podcasts } from "../../../core/models/podcast";
import type PodcastsDataSource from "../../../core/ports/podcasts-data-source";
import { sleep } from "../../../tests/utils";

export default class DeezerDataSource implements PodcastsDataSource {
    async search(_name: string): Promise<Podcasts> {
        await sleep(100)
        return [{
            "id": 638922,
            "title": "TFTC - Le Podcast",
            "description": "L'équipe de Tales From The Click accompagnée de ses invités vous fait vivre leurs anecdotes de cinéma autour d'un film culte à voir ou à revoir.  Hébergé par Acast. Visitez acast.com/privacy pour plus d'informations.",
            "available": true,
            "picture": "https://cdn-images.dzcdn.net/images/talk/5fdf47af685128026b9e21963b2d4397/56x56-000000-80-0-0.jpg",
        }]
    }

    async getEpisodes(podcastId: number): Promise<Episodes> {
        await sleep(100)
        return [{
            podcastId,
            "id": 726448571,
            "title": "3 films que j'adore : I Never Sang For My Father, Les Ripoux, A Real Pain",
            "release_date": new Date("2025-03-07 16:41:59"),
            "picture": "https://cdn-images.dzcdn.net/images/talk/5fdf47af685128026b9e21963b2d4397/180x180-000000-80-0-0.jpg",
        }]
    }
}