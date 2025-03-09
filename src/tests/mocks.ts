import { inMemoryDependencies } from "@index/core/dependencies";

function mockDependencies(mocks?: {
    search?: sinon.SinonStub;
    toggleFromFavorites?: sinon.SinonStub;
}) {
    return {
        ...inMemoryDependencies,
        podcastsDataSource: {
            ...inMemoryDependencies.podcastsDataSource,
            search: mocks?.search ?? inMemoryDependencies.podcastsDataSource.search,
        },
        podcastRepository: {
            ...inMemoryDependencies.podcastRepository,
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