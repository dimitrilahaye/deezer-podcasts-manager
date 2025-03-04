import { assign, type ErrorActorEvent, fromPromise, setup } from "xstate";
import type PodcastsService from "../ports/podcasts-service";
import type { StateMachineContext } from "../types";
import type { Podcast, Podcasts } from "../models/podcast";
import type PodcastRepository from "../ports/podcast-repository";

export type Dependencies = {
  podcastsService: PodcastsService;
  podcastRepository: PodcastRepository;
};

export type States =
  | "idle"
  | "podcasts_loading"
  | "toggle_favorite_loading"
  | "success"
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
  | { type: "TOGGLE"; podcastId: number };

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
        podcasts: [...context.podcasts.filter((podcast) => podcast.id !== params.id), params],
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
      toggleFromFavorites: fromPromise<Podcast, number>(
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
            if (event.type === "SEARCH") {
              return event.query;
            }
            return '';
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
      toggle_favorite_loading: {
        invoke: {
          src: "toggleFromFavorites",
          input: ({ event }) => {
            if (event.type === "TOGGLE") {
              return event.podcastId;
            }
            return 0
          },
          onDone: {
            target: "success",
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
      success: {
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
