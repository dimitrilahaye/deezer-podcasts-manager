import { DataService } from "../providers/data-service/DataService";
import DeezerService from "../providers/deezer/in-memory/deezer-service";
import IndexedDbPodcastRepository from "../providers/persistence/in-memory/podcast-repository";

const inMemoryDependencies = {
    apiService: new DataService(),
    podcastsService: new DeezerService(),
    podcastRepository: new IndexedDbPodcastRepository()
};

const dependencies = null;

export {
    dependencies,
    inMemoryDependencies
}