import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../../App";
import { visitSearch } from "./Page";

describe("Router", () => {
  test("Navigate to search page by clicking on link", async () => {
    // Given
    render(<App />, { wrapper: BrowserRouter });

    // Then
    expect(window.location.pathname).toBe("/");

    // When
    await visitSearch()

    // Then
    expect(window.location.pathname).toBe("/search");
  });
});
