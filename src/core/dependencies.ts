import ApiDeezerDataSource from "../providers/deezer/api/deezer-data-source";
import InMemoryDeezerDataSource from "../providers/deezer/in-memory/deezer-data-source";
import InMemoryPodcastRepository from "../providers/persistence/in-memory/podcast-repository";

const inMemoryDependencies = {
    podcastsDataSource: new InMemoryDeezerDataSource(),
    podcastRepository: new InMemoryPodcastRepository()
};

const dependencies = {
    podcastsDataSource: new ApiDeezerDataSource(),
};

export {
    dependencies,
    inMemoryDependencies
}