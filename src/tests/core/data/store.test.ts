import sinon from "sinon";
import { createDataStore } from "../../../core/data/store";

describe("Data Store", () => {
  let fetchDataSpy: sinon.SinonStub;

  beforeEach(() => {
    fetchDataSpy = sinon.stub();
    fetchDataSpy.resetHistory();
  });

  it("should initialize the store with idle status", () => {
    // Given
    const mockApiService = { fetchData: fetchDataSpy };
    const useStore = createDataStore(mockApiService);

    // When
    const { data, errorMessage, status } = useStore.getState();

    // Then
    expect(status).toBe("idle");
    expect(data).toBe("");
    expect(errorMessage).toBeNull();
  });

  it("should transition to loading and then success when data is fetched", async () => {
    // Given
    const mockApiService = { fetchData: fetchDataSpy };
    mockApiService.fetchData.resolves("Some data");

    const useStore = createDataStore(mockApiService);

    // When
    useStore.getState().fetchData();

    // Then
    expect(useStore.getState().status).toBe("loading");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(useStore.getState().status).toBe("success");
    expect(useStore.getState().data).toBe("Some data");
    expect(useStore.getState().errorMessage).toBeNull();
  });

  it("should transition to error if the fetch fails", async () => {
    // Given
    const mockApiService = { fetchData: fetchDataSpy };
    mockApiService.fetchData.rejects(new Error("Fetch failed"));

    const useStore = createDataStore(mockApiService);

    // When
    useStore.getState().fetchData();

    // Then
    expect(useStore.getState().status).toBe("loading");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(useStore.getState().status).toBe("error");
    expect(useStore.getState().errorMessage).toBe("Fetch failed");
    expect(useStore.getState().data).toBe("");
  });

  it("should reset to idle and clear data and errorMessage when RESET is sent", async () => {
    // Given
    const mockApiService = { fetchData: fetchDataSpy };
    mockApiService.fetchData.resolves("Some data");

    const useStore = createDataStore(mockApiService);

    // When
    useStore.getState().fetchData();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Then
    expect(useStore.getState().status).toBe("success");
    expect(useStore.getState().data).toBe("Some data");

    // When
    useStore.getState().resetData();

    // Then
    expect(useStore.getState().status).toBe("idle");
    expect(useStore.getState().data).toBe("");
    expect(useStore.getState().errorMessage).toBeNull();
  });

  it("should retry the fetch when RETRY is sent", async () => {
    // Given
    fetchDataSpy
      .onFirstCall()
      .rejects(new Error("Fetch failed"))
      .onSecondCall()
      .resolves("Some data");

    const mockApiService = { fetchData: fetchDataSpy };

    const useStore = createDataStore(mockApiService);

    // When
    useStore.getState().fetchData();

    // Then
    expect(useStore.getState().status).toBe("loading");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(useStore.getState().status).toBe("error");

    // When
    useStore.getState().retry();

    // Then
    expect(useStore.getState().status).toBe("loading");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(useStore.getState().status).toBe("success");
    expect(useStore.getState().data).toBe("Some data");
  });
});
