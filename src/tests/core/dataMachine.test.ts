import { createActor } from "xstate";
import { createDataMachine } from "../../core/state-machines/data-machine";
import sinon from "sinon";

describe("Data Machine", () => {
  let fetchDataSpy: sinon.SinonStub;

  beforeEach(() => {
    fetchDataSpy = sinon.stub();
    fetchDataSpy.resetHistory();
  });

  it("should transition to loading and then to success when data is fetched", async () => {
    fetchDataSpy.resolves("Some data");

    const mockApiService = { fetchData: fetchDataSpy };
    const dataMachine = createDataMachine(mockApiService);
    const service = createActor(dataMachine).start();

    expect(service.getSnapshot().value).toBe("idle");

    service.send({ type: "FETCH" });

    expect(service.getSnapshot().value).toBe("loading");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(service.getSnapshot().value).toBe("success");
    expect(service.getSnapshot().context.data).toBe("Some data");
    expect(service.getSnapshot().context.errorMessage).toBeNull();

    expect(fetchDataSpy.callCount).toBe(1);
  });

  it("should transition to error if the fetch fails", async () => {
    fetchDataSpy.rejects(new Error("Fetch failed"));

    const mockApiService = { fetchData: fetchDataSpy };
    const dataMachine = createDataMachine(mockApiService);
    const service = createActor(dataMachine).start();

    expect(service.getSnapshot().value).toBe("idle");

    service.send({ type: "FETCH" });

    expect(service.getSnapshot().value).toBe("loading");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(service.getSnapshot().value).toBe("error");
    expect(service.getSnapshot().context.errorMessage).toBe("Fetch failed");

    expect(fetchDataSpy.callCount).toBe(1);
  });

  it("should reset to idle when RESET is sent", async () => {
    fetchDataSpy.resolves("Some data");

    const mockApiService = { fetchData: fetchDataSpy };
    const dataMachine = createDataMachine(mockApiService);
    const service = createActor(dataMachine).start();

    service.send({ type: "FETCH" });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(service.getSnapshot().value).toBe("success");

    service.send({ type: "RESET" });

    expect(service.getSnapshot().value).toBe("idle");
    expect(service.getSnapshot().context.data).toBe("");
    expect(service.getSnapshot().context.errorMessage).toBeNull();

    expect(fetchDataSpy.callCount).toBe(1);
  });

  it("should reset data to an empty string when RESET is sent in error state", async () => {
    fetchDataSpy.rejects(new Error("Fetch failed"));

    const mockApiService = { fetchData: fetchDataSpy };
    const dataMachine = createDataMachine(mockApiService);
    const service = createActor(dataMachine).start();

    expect(service.getSnapshot().value).toBe("idle");

    service.send({ type: "FETCH" });
    expect(service.getSnapshot().value).toBe("loading");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(service.getSnapshot().value).toBe("error");
    expect(service.getSnapshot().context.errorMessage).toBe("Fetch failed");

    service.send({ type: "RESET" });

    expect(service.getSnapshot().value).toBe("idle");
    expect(service.getSnapshot().context.errorMessage).toBeNull();
    expect(service.getSnapshot().context.data).toBe("");

    expect(fetchDataSpy.callCount).toBe(1);
  });

  it("should call fetchData twice and update data correctly", async () => {
    fetchDataSpy.onFirstCall().rejects(new Error("Fetch failed")).onSecondCall().resolves("Some data");

    const mockApiService = { fetchData: fetchDataSpy };
    const dataMachine = createDataMachine(mockApiService);
    const service = createActor(dataMachine).start();

    expect(service.getSnapshot().value).toBe("idle");

    service.send({ type: "FETCH" });
    expect(service.getSnapshot().value).toBe("loading");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(service.getSnapshot().value).toBe("error");
    expect(service.getSnapshot().context.errorMessage).toBe("Fetch failed");

    service.send({ type: "RETRY" });
    expect(service.getSnapshot().value).toBe("loading");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(service.getSnapshot().value).toBe("success");
    expect(service.getSnapshot().context.data).toBe("Some data");

    expect(fetchDataSpy.callCount).toBe(2);
  });
});
