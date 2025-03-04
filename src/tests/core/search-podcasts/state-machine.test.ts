import { createActor } from "xstate";
import createStateMachine from "../../../core/search-podcasts/state-machine";
import sinon from "sinon";
import { sleep } from "../../utils";

function dependencies(stubs: { search: sinon.SinonStub }) {
  return {
    podcastsService: {
      search: stubs.search,
    },
  };
}

describe("Search podcasts state machine", () => {
  let searchPodcastsStub: sinon.SinonStub;

  beforeEach(() => {
    searchPodcastsStub = sinon.stub();
    searchPodcastsStub.resetHistory();
  });

  it("should have idle state at creation", () => {
    // Given
    const actor = createActor(
      createStateMachine(
        dependencies({
          search: searchPodcastsStub,
        })
      )
    );

    // When
    actor.start();

    // Then
    expect(actor.getSnapshot().value).toEqual("idle");
  });

  it("should have loading state at SEARCH event", () => {
    // Given
    const actor = createActor(
      createStateMachine(
        dependencies({
          search: searchPodcastsStub,
        })
      )
    );
    actor.start();

    // When
    actor.send({ type: "SEARCH", query: "" });

    // Then
    expect(actor.getSnapshot().value).toEqual("loading");
  });

  it("should search for podcasts at SEARCH event", () => {
    // Given
    const actor = createActor(
      createStateMachine(
        dependencies({
          search: searchPodcastsStub,
        })
      )
    );
    actor.start();

    // When
    actor.send({ type: "SEARCH", query: "floodcast" });

    // Then
    expect(searchPodcastsStub.calledOnceWith("floodcast")).toBe(true);
  });

  it("should have success state when loading is on done", async () => {
    // Given
    const actor = createActor(
      createStateMachine(
        dependencies({
          search: searchPodcastsStub,
        })
      )
    );
    actor.start();

    // When
    actor.send({ type: "SEARCH", query: "floodcast" });

    await sleep(100);

    // Then
    expect(actor.getSnapshot().value).toEqual("success");
  });
});
