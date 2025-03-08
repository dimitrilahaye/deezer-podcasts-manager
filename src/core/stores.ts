import { dependencies, inMemoryDependencies } from "./dependencies";
import type { StoreState as SearchPodcastsStoreState } from "./search-podcasts/store";
import createSearchPodcastsStore from "./search-podcasts/store";
import type { DpmStore } from "./types";

export type Stores = {
  searchPodcasts: DpmStore<SearchPodcastsStoreState>
};

// initialize all the stores and pass them to React context
export const stores: Stores = {
  searchPodcasts: createSearchPodcastsStore({
    podcastsDataSource: dependencies.podcastsDataSource,
    podcastRepository: inMemoryDependencies.podcastRepository
  })
};
