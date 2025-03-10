/* eslint-disable @typescript-eslint/no-unused-vars */
import { type AnyEventObject, assign, fromPromise, setup } from "xstate";
import type PodcastsDataSource from "../ports/podcasts-data-source";
import type { Episodes } from "../models/episode";

export type Dependencies = {
  podcastsDataSource: PodcastsDataSource;
};

export type States =
  | "idle"
  | "episodes_loading"

export type Context = {
  episodes: Episodes;
}

export type Events =
  | { type: "SEARCH"; podcastId: number }

const createStateMachine = (dependencies: Dependencies) =>
  setup({
    types: {} as {
      context: Context;
      events: Events;
    },
    actions: {
      updateEpisodes: assign((_, params: Episodes) => ({
        episodes: params,
      })),
    },
    actors: {
      getEpisodes: fromPromise<Episodes, number>(
        async ({ input }) => await dependencies.podcastsDataSource.getEpisodes(input)
      ),
      // toggleFromFavorites: fromPromise<Podcast, Podcast>(
      //   async ({ input }) =>
      //     await dependencies.podcastRepository.toggleFromFavorites(input)
      // ),
    },
  }).createMachine({
    id: "episodesStateMachine",
    context: {
      episodes: [],
    },
    initial: "idle",
    states: {
      idle: {
        on: { SEARCH: "episodes_loading" },
      },
      episodes_loading: {
        invoke: {
          src: "getEpisodes",
          input: ({ event }) => {
            return (event as AnyEventObject).podcastId;
          },
          onDone: {
            target: "success_search",
            actions: {
              type: "updateEpisodes",
              params: ({ event }) => event.output,
            },
          },
        },
      },
      success_search: {}
    }
  });

export default createStateMachine;
