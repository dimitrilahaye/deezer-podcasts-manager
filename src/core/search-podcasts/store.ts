import { create } from "zustand";
import { createActor } from "xstate";
import createStateMachine, {
  type States,
  type Dependencies,
  type Context,
} from "./state-machine";
import type { StoreStateFromStateMachineContext } from "../types";
import type { Podcast } from "../models/podcast";

export type StoreState = StoreStateFromStateMachineContext<
  States,
  Context,
  {
    searchPodcast(query: string): void,
    togglePodcastFromFavorites(podcast: Podcast): void
    getPodcast(id: number): Podcast | undefined
    reset(): void
  }
>;

const createStore = (dependencies: Dependencies) => {
  const dataMachine = createStateMachine(dependencies);
  const service = createActor(dataMachine);

  return create<StoreState>((set, get) => {
    service.subscribe(({ value, context }) => {
      set({
        podcasts: [...context.podcasts].toSorted((a, b) => a.id - b.id),
        error: context.error,
        status: value as States,
      });
    });

    service.start();

    return {
      podcasts: [],
      error: null,
      status: "idle",
      getPodcast: (id: number) => get().podcasts.find((podcast) => podcast.id === id),
      searchPodcast: (query: string) => service.send({ type: "SEARCH", query }),
      togglePodcastFromFavorites: (podcast: Podcast) => service.send({ type: "TOGGLE", podcast }),
      reset: () => service.send({ type: "RESET" }),
    };
  });
};

export default createStore;
