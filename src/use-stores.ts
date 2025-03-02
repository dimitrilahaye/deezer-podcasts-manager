import { createContext, useContext } from "react";
import createDataStore, { type DataStoreState } from "./core/data/store";
import { DataService } from "./providers/data-service/DataService";
import {
  type StoreApi,
  type UseBoundStore,
  useStore as ZustandUseStore,
} from "zustand";

export type Stores = {
  dataStore: UseBoundStore<StoreApi<DataStoreState>>;
};

const dependencies = {
  apiService: new DataService(),
};

// initialize all the stores and pass them to React context
export const stores: Stores = {
  dataStore: createDataStore(dependencies),
};
export const StoreContext = createContext(stores);

// custom hook to use stores in components
export const useStores = () => {
  const stores = useContext(StoreContext);
  return {
    dataStore: ZustandUseStore(stores.dataStore, (state) => state),
  };
};
