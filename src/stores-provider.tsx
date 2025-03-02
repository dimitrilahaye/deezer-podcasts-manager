import type React from "react";
import { StoreContext, type Stores } from "./use-stores";

export const StoresProvider: React.FC<{
  stores: Stores;
  children: React.ReactNode;
}> = ({ stores, children }) => {
  return (
    <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>
  );
};
