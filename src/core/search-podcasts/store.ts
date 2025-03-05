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
    reset(): void
  }
>;

const createStore = (dependencies: Dependencies) => {
  const dataMachine = createStateMachine(dependencies);
  const service = createActor(dataMachine);

  return create<StoreState>((set) => {
    service.subscribe(({ value, context }) => {
      set({
        podcasts: context.podcasts,
        error: context.error,
        status: value as States,
      });
    });

    service.start();

    return {
      podcasts: [],
      error: null,
      status: "idle",
      searchPodcast: (query: string) => service.send({ type: "SEARCH", query }),
      togglePodcastFromFavorites: (podcast: Podcast) => service.send({ type: "TOGGLE", podcast }),
      reset: () => service.send({ type: "RESET" }),
    };
  });
};

export default createStore;
