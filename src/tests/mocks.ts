import { inMemoryDependencies } from "@index/core/dependencies";
import type sinon from "sinon"

function mockDependencies(mocks?: {
    search?: sinon.SinonStub;
    getEpisodes?: sinon.SinonStub;
    toggleFromFavorites?: sinon.SinonStub;
}) {
    return {
        podcastsDataSource: {
            search: mocks?.search ?? inMemoryDependencies.podcastsDataSource.search,
            getEpisodes: mocks?.getEpisodes ?? inMemoryDependencies.podcastsDataSource.getEpisodes,
        },
        podcastRepository: {
            toggleFromFavorites: mocks?.toggleFromFavorites
                ?? inMemoryDependencies.podcastRepository.toggleFromFavorites,
        },
    };
}

function fakePodcast(data?: { isFavorite: boolean }) {
    return {
        id: 1,
        title: "title",
        description: "description",
        available: true,
        picture: "picture",
        isFavorite: data?.isFavorite ?? false,
    }
}

export {
    fakePodcast,
    mockDependencies
}