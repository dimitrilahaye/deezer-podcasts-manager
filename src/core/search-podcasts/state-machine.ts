import { assign, type ErrorActorEvent, fromPromise, setup } from "xstate";
import type PodcastsService from "../ports/podcasts-service";
import type { StateMachineContext } from "../types";
import type { Podcasts } from "../models/podcast";

export type Dependencies = {
  podcastsService: PodcastsService;
};

export type States = "idle" | "loading" | "success";

export type Context = StateMachineContext<
  {
    podcasts: Podcasts;
    error: string | null;
  },
  Dependencies
>;

export type Events = { type: "SEARCH"; query: string } | { type: "RESET" };

const createStateMachine = (dependencies: Dependencies) =>
  setup({
    types: {} as {
      context: Context;
      events: Events;
    },
    actions: {
      updatePodcasts: assign((_, params: Podcasts) => ({
        podcasts: params,
      })),
      updateError: assign((_, params: string) => ({
        error: params,
      })),
      reset: assign(() => ({
        podcasts: [],
        error: null,
      })),
    },
    actors: {
      searchPodcasts: fromPromise<Podcasts, string>(
        async ({ input }) => await dependencies.podcastsService.search(input)
      ),
    },
  }).createMachine({
    id: "searchPodcastsStateMachine",
    context: {
      podcasts: [],
      error: null,
      dependencies,
    },
    initial: "idle",
    states: {
      idle: {
        on: { SEARCH: "loading" },
      },
      loading: {
        invoke: {
          src: "searchPodcasts",
          input: ({ event }) => {
            if (event.type === "SEARCH") {
              return event.query;
            }
            return event.type;
          },
          onDone: {
            target: "success",
            actions: {
              type: "updatePodcasts",
              params: ({ event }) => event.output,
            },
          },
          onError: {
            target: "error",
            actions: {
              type: "updateError",
              params: ({ event }) =>
                (event as ErrorActorEvent<Error>).error.message,
            },
          },
        },
      },
      success: {
        on: {
          RESET: {
            target: "idle",
            actions: {
              type: "reset",
            },
          },
          SEARCH: "loading",
        },
      },
      error: {
        on: {
          RESET: {
            target: "idle",
            actions: {
              type: "reset",
            },
          },
          SEARCH: "loading",
        },
      },
    },
  });

export default createStateMachine;
