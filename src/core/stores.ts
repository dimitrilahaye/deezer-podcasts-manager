import { DataService } from "../providers/data-service/DataService";
import createDataStore, { type DataStoreState } from "./data/store";
import type { DpmStore } from "./types";

export type Stores = {
  dataStore: DpmStore<DataStoreState>;
};

const dependencies = {
  apiService: new DataService(),
};

// initialize all the stores and pass them to React context
export const stores: Stores = {
  dataStore: createDataStore(dependencies),
};
