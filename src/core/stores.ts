import type { UseBoundStore, StoreApi } from "zustand";
import { DataService } from "../providers/data-service/DataService";
import createDataStore, { type DataStoreState } from "./data/store";

// for DX
type DpmStore<T> = UseBoundStore<StoreApi<T>>;

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
