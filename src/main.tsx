import Example from "./presentation/Example";
import { createRoot } from "react-dom/client";
import { StoresProvider } from "./stores-provider";
import { stores } from "./use-stores";

const root = createRoot(document.getElementById("root") as HTMLElement);

// inject stores in Context Provider
root.render(
  <StoresProvider stores={stores}>
    <Example />
  </StoresProvider>
);
