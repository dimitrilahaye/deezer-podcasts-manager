import { createContext, useContext } from "react";
import createDataStore, { type DataStoreState } from "./core/data/store";
import { DataService } from "./providers/data-service/DataService";
import { type StoreApi, type UseBoundStore, useStore } from "zustand";

export type Stores = {
  dataStore: UseBoundStore<StoreApi<DataStoreState>>;
};

type StoresKeys = keyof Stores;

const dependencies = {
  apiService: new DataService(),
};

// initialize all the stores and pass them to React context
export const stores: Stores = {
  dataStore: createDataStore(dependencies),
};
export const StoreContext = createContext(stores);

/**
 * custom hook to use stores in components
 * example
 * ```
 *   const { data, fetchData } = useStores("dataStore");
 * ```
 */
export const useStores = <K extends StoresKeys>(key: K) => {
  const stores = useContext(StoreContext);

  return useStore(stores[key], (state) => state);
};
