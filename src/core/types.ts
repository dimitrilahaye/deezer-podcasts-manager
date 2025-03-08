import type { UseBoundStore, StoreApi } from "zustand";

/**
 * Used to declare and type each accessible store
 */
export type DpmStore<StoreState> = UseBoundStore<StoreApi<StoreState>>;

/**
 * Used to declare the State type of a store
 *
 * - `StateMachineStates`: the transitionnal states of the related state machine
 * - `StateMachineContext`: the context definition exported by the related state machine
 * - `StoreState`: this specific store state definition
 */
export type StoreStateFromStateMachineContext<
  StateMachineStates,
  StateMachineContext,
  StoreState
> = Omit<StateMachineContext, "dependencies"> &
  StoreState & {
    status: StateMachineStates;
  };
