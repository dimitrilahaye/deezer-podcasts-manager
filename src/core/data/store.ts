import { create } from "zustand";
import { createActor } from "xstate";
import type { ApiService } from "../ports/api-service";
import { createDataMachine } from "./state-machine";

type Status = "idle" | "loading" | "success" | "error";

interface StoreState {
  data: string;
  errorMessage: string | null;
  status: Status;
  fetchData: () => void;
  resetData: () => void;
  retry: () => void;
}

export const createDataStore = (apiService: ApiService) => {
  const dataMachine = createDataMachine(apiService);
  const service = createActor(dataMachine);

  return create<StoreState>((set) => {
    service.subscribe((state) => {
      set({
        data: state.context.data,
        errorMessage: state.context.errorMessage,
        status: state.value as Status
      });
    });

    service.start();

    return {
      data: "",
      errorMessage: null,
      status: "idle",
      fetchData: () => service.send({ type: "FETCH" }),
      resetData: () => service.send({ type: "RESET" }),
      retry: () => service.send({ type: "RETRY" }),
    };
  });
};
