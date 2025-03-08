import { type AnyEventObject, assign, type ErrorActorEvent, fromPromise, setup } from "xstate";
import type PodcastsDataSource from "../ports/podcasts-data-source";
import type { StateMachineContext } from "../types";
import type { Podcast, Podcasts } from "../models/podcast";
import type PodcastRepository from "../ports/podcast-repository";

export type Dependencies = {
  podcastsDataSource: PodcastsDataSource;
  podcastRepository: PodcastRepository;
};

export type States =
  | "idle"
  | "podcasts_loading"
  | "toggle_favorite_loading"
  | "success_search"
  | "success_toggle"
  | "error";

export type Context = StateMachineContext<
  {
    podcasts: Podcasts;
    error: string | null;
  },
  Dependencies
>;

export type Events =
  | { type: "SEARCH"; query: string }
  | { type: "RESET" }
  | { type: "TOGGLE"; podcast: Podcast };

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
      updatePodcast: assign(({ context }, params: Podcast) => ({
        podcasts: [...context.podcasts.filter((podcast) => podcast.id !== params.id), { ...params }],
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
        async ({ input }) => await dependencies.podcastsDataSource.search(input)
      ),
      toggleFromFavorites: fromPromise<Podcast, Podcast>(
        async ({ input }) =>
          await dependencies.podcastRepository.toggleFromFavorites(input)
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
        on: { SEARCH: "podcasts_loading", TOGGLE: "toggle_favorite_loading" },
      },
      podcasts_loading: {
        invoke: {
          src: "searchPodcasts",
          input: ({ event }) => {
            return (event as AnyEventObject).query;
          },
          onDone: {
            target: "success_search",
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
      toggle_favorite_loading: {
        invoke: {
          src: "toggleFromFavorites",
          input: ({ event }) => {
            return (event as AnyEventObject).podcast;
          },
          onDone: {
            target: "success_toggle",
            actions: {
              type: "updatePodcast",
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
      success_search: {
        on: {
          RESET: {
            target: "idle",
            actions: {
              type: "reset",
            },
          },
          SEARCH: "podcasts_loading",
          TOGGLE: "toggle_favorite_loading",
        },
      },
      success_toggle: {
        on: {
          RESET: {
            target: "idle",
            actions: {
              type: "reset",
            },
          },
          SEARCH: "podcasts_loading",
          TOGGLE: "toggle_favorite_loading",
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
          SEARCH: "podcasts_loading",
          TOGGLE: "toggle_favorite_loading",
        },
      },
    },
  });

export default createStateMachine;
