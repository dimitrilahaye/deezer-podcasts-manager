import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";

describe("Router", () => {
  test("Navigate to example page by clicking on link", async () => {
    // Given
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Then
    expect(screen.getByText("Accueil")).toBeInTheDocument();

    // When
    const exampleLink = screen.getByRole("link", { name: /Un exemple/i });
    await userEvent.click(exampleLink);

    // Then
    expect(screen.getByText(/idle/i)).toBeInTheDocument();
  });
});
