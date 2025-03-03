import type { UseBoundStore, StoreApi } from "zustand";

/**
 * Used to declare and type each accessible store
 */
export type DpmStore<StoreState> = UseBoundStore<StoreApi<StoreState>>;

/**
 * Used to declare the context of a state machine
 *
 * - `Context`: this specific state machine context definition
 * - `Dependencies`: the definition of the external dependencies used by this state machine
 */
export type StateMachineContext<Context, Dependencies> = Context & {
  dependencies: Dependencies;
};

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
