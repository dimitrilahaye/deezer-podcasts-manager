import { render, screen, fireEvent } from "@testing-library/react";
import sinon from "sinon";
import { StoresProvider } from "../../stores-provider";
import Example from "../../presentation/Example";
import createDataStore from "../../core/data/store";
import type { Dependencies } from "../../core/data/state-machine";
import type { Stores } from "../../core/stores";

describe("Example Component", () => {
  const mockApiService = {
    fetchData: sinon.stub().resolves("Fake Data"),
  };

  let mockStores: Stores;

  beforeEach(() => {
    mockApiService.fetchData.resetHistory();

    mockStores = {
      dataStore: createDataStore({
        apiService: mockApiService,
      } as Dependencies),
    };

    render(
      <StoresProvider stores={mockStores}>
        <Example />
      </StoresProvider>
    );
  });

  it("should display initial status 'idle'", () => {
    // Given
    expect(screen.getByText(/Status: idle/i)).toBeInTheDocument();
  });

  it("should change status and display the data from fetch", async () => {
    // Given
    mockApiService.fetchData.resolves("Fake Data");

    // When
    fireEvent.click(screen.getByText(/Fetch Data/i));

    // Then
    expect(screen.getByText(/Status: loading/i)).toBeInTheDocument();
    await screen.findByText(/Data: Fake Data/i);
    expect(screen.getByText(/Status: success/i)).toBeInTheDocument();
  });

  it("should display error in case of failure", async () => {
    // Given
    mockApiService.fetchData.rejects(new Error("Erreur réseau"));

    // When
    fireEvent.click(screen.getByText(/Fetch Data/i));

    // Then
    await screen.findByText(/Status: error/i);
    expect(screen.getByText(/Error: Erreur réseau/i)).toBeInTheDocument();
  });

  it("should reinitialize the data on Reset", async () => {
    // Given
    mockApiService.fetchData.resolves("Fake Data");

    // When
    fireEvent.click(screen.getByText(/Fetch Data/i));
    await screen.findByText(/Data: Fake Data/i);
    fireEvent.click(screen.getByText(/Reset/i));

    // then
    expect(screen.getByText(/Status: idle/i)).toBeInTheDocument();
    expect(screen.getByText(/Data:/i)).toBeInTheDocument();
  });
});
