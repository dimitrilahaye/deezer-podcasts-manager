import { fromPromise, setup } from "xstate";
import type PodcastsService from "../ports/podcasts-service";
import type { StateMachineContext } from "../types";

export type Dependencies = {
  podcastsService: PodcastsService;
};

export type States = "idle" | "loading" | "success";

export type Context = StateMachineContext<unknown, Dependencies>;

type Events = { type: "SEARCH"; query: string };

const createStateMachine = (dependencies: Dependencies) =>
  setup({
    types: {} as {
      context: Context;
      events: Events;
    },
    actors: {
      searchPodcasts: fromPromise<string, string>(
        async ({ input }) => await dependencies.podcastsService.search(input)
      ),
    },
  }).createMachine({
    id: "searchPodcastsStateMachine",
    context: {
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
          input: ({ event }) => event.query,
          onDone: "success",
        },
      },
      success: {},
    },
  });

export default createStateMachine;
