import { render, screen, fireEvent } from "@testing-library/react";
import App from "../../App";

describe("App Component", () => {
  it("affiche le texte de bienvenue", () => {
    render(<App />);
    expect(screen.getByText("Vite + React")).toBeInTheDocument();
  });

  it("incrémente le compteur quand on clique sur le bouton", () => {
    render(<App />);
    
    const button = screen.getByRole("button", { name: /count is 0/i });

    fireEvent.click(button);
    expect(screen.getByRole("button", { name: /count is 1/i })).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByRole("button", { name: /count is 2/i })).toBeInTheDocument();
  });
});
