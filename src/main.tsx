import { createRoot } from "react-dom/client";
import { StoresProvider } from "./stores-provider";
import { stores } from "./use-stores";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = createRoot(document.getElementById("root") as HTMLElement);

// inject stores in Context Provider
root.render(
  <StoresProvider stores={stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StoresProvider>
);
