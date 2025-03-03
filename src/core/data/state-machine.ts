import { assign, setup, fromPromise } from "xstate";
import type { ApiService } from "../ports/api-service";
import type { StateMachineContext } from "../types";

export type Dependencies = {
  apiService: ApiService;
};

export type DataStateMachineContext = StateMachineContext<
  {
    data: string;
    errorMessage: string | null;
  },
  Dependencies
>;

type DataStateMachineEvents =
  | { type: "FETCH" }
  | { type: "RESET" }
  | { type: "RETRY" };

export type DataStateMachineStates = "idle" | "loading" | "success" | "error";

const createDataMachine = (dependencies: Dependencies) =>
  setup({
    types: {} as {
      context: DataStateMachineContext;
      events: DataStateMachineEvents;
    },
    actors: {
      fetchData: fromPromise(
        async () => await dependencies.apiService.fetchData()
      ),
    },
  }).createMachine({
    id: "dataMachine",
    initial: "idle",
    context: {
      data: "",
      errorMessage: null,
      dependencies,
    },
    states: {
      idle: {
        on: { FETCH: "loading" },
      },
      loading: {
        invoke: {
          src: "fetchData",
          onDone: {
            target: "success",
            actions: assign(({ event }) => ({
              data: event.output,
              errorMessage: null,
            })),
          },
          onError: {
            target: "error",
            actions: assign(({ event }) => ({
              errorMessage: (event.error as Error).message,
            })),
          },
        },
      },
      success: {
        on: {
          RESET: {
            target: "idle",
            actions: assign(() => ({
              data: "",
              errorMessage: null,
            })),
          },
          RETRY: {
            target: "loading",
            actions: assign(() => ({
              data: "",
              errorMessage: null,
            })),
          },
          FETCH: {
            target: "loading",
            actions: assign(() => ({
              data: "",
              errorMessage: null,
            })),
          },
        },
      },
      error: {
        on: {
          RETRY: {
            target: "loading",
            actions: assign(() => ({
              data: "",
              errorMessage: null,
            })),
          },
          RESET: {
            target: "idle",
            actions: assign(() => ({
              data: "",
              errorMessage: null,
            })),
          },
        },
      },
    },
  });

export default createDataMachine;
