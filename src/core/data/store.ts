import { create } from "zustand";
import { createActor } from "xstate";
import createDataMachine, {
  type DataStateMachineStates,
  type Dependencies,
  type DataStateMachineContext,
} from "./state-machine";
import type { StoreStateFromStateMachineContext } from "../types";

export type DataStoreState = StoreStateFromStateMachineContext<
  DataStateMachineStates,
  DataStateMachineContext,
  {
    fetchData: () => void;
    resetData: () => void;
    retry: () => void;
  }
>;

const createDataStore = (dependencies: Dependencies) => {
  const dataMachine = createDataMachine(dependencies);
  const service = createActor(dataMachine);

  return create<DataStoreState>((set) => {
    service.subscribe((state) => {
      set({
        data: state.context.data,
        errorMessage: state.context.errorMessage,
        status: state.value as DataStateMachineStates,
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

export default createDataStore;
