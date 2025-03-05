import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import App from "../../App";
import { sleep } from "../utils";

describe("Router", () => {
  test("Navigate to search page by clicking on link", async () => {
    // Given
    render(<App />, { wrapper: BrowserRouter });

    // Then
    expect(window.location.pathname).toBe("/");

    // When
    const searchLink = screen.getByRole("link", {
      name: /Rechercher des podcasts/i,
    });
    await userEvent.click(searchLink);
    await sleep(100);

    // Then
    expect(window.location.pathname).toBe("/search");
  });
});
