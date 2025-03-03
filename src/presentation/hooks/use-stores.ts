import { useContext } from "react";
import { useStore } from "zustand";
import { StoresContext } from "../../stores-context";
import type { Stores } from "../../core/stores";

export type StoresKeys = keyof Stores;

/**
 * custom hook to use stores in components
 * example
 * ```
 *   const { data, fetchData } = useStores("dataStore");
 * ```
 */
const useStores = <K extends StoresKeys>(key: K) => {
  const stores = useContext(StoresContext);

  return useStore(stores[key], (state) => state);
};

export default useStores;
