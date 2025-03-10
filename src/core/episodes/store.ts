import { create } from "zustand";
import { createActor } from "xstate";
import createStateMachine, {
  type States,
  type Dependencies,
  type Context,
} from "./state-machine";
import type { StoreStateFromStateMachineContext } from "../types";

export type StoreState = StoreStateFromStateMachineContext<
  States,
  Context,
  {
    getEpisodes(podcastId: number): void
  }
// {
//   searchPodcast(query: string): void,
//   togglePodcastFromFavorites(podcast: Podcast): void
//   getPodcast(id: number): Podcast | undefined
//   reset(): void
// }
>;

const createStore = (dependencies: Dependencies) => {
  const dataMachine = createStateMachine(dependencies);
  const service = createActor(dataMachine);

  return create<StoreState>((set) => {
    service.subscribe(({ value, context }) => {
      set({
        episodes: [...context.episodes].toSorted((a, b) => a.release_date.getTime() - b.release_date.getTime()),
        status: value as States,
      });
    });

    service.start();

    return {
      episodes: [],
      status: "idle",
      getEpisodes: (podcastId: number) => service.send({ type: "SEARCH", podcastId })
    };
  });
};

export default createStore;
