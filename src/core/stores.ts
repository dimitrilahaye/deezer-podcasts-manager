import { dependencies, inMemoryDependencies } from "./dependencies";
import type { StoreState as SearchPodcastsStoreState } from "./search-podcasts/store";
import type { StoreState as EpisodesStoreState } from "./episodes/store";
import createSearchPodcastsStore from "./search-podcasts/store";
import createEpisodesStore from "./episodes/store";
import type { DpmStore } from "./types";

export type Stores = {
  podcasts: DpmStore<SearchPodcastsStoreState>
  episodes: DpmStore<EpisodesStoreState>
};

// initialize all the stores and pass them to React context
export const stores: Stores = {
  podcasts: createSearchPodcastsStore({
    podcastsDataSource: dependencies.podcastsDataSource,
    podcastRepository: inMemoryDependencies.podcastRepository
  }),
  episodes: createEpisodesStore({
    podcastsDataSource: dependencies.podcastsDataSource
  })
};
