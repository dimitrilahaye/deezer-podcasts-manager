import createDataStore, { type DataStoreState } from "./data/store";
import { inMemoryDependencies } from "./dependencies";
import type { StoreState as SearchPodcastsStoreState } from "./search-podcasts/store";
import createSearchPodcastsStore from "./search-podcasts/store";
import type { DpmStore } from "./types";

export type Stores = {
  dataStore: DpmStore<DataStoreState>;
  searchPodcasts: DpmStore<SearchPodcastsStoreState>
};

// initialize all the stores and pass them to React context
export const stores: Stores = {
  dataStore: createDataStore(inMemoryDependencies),
  searchPodcasts: createSearchPodcastsStore(inMemoryDependencies)
};
