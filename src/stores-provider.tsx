import type React from "react";
import { StoresContext } from "./stores-context";
import type { Stores } from "./core/stores";

export const StoresProvider: React.FC<{
  stores: Stores;
  children: React.ReactNode;
}> = ({ stores, children }) => {
  return (
    <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
  );
};
