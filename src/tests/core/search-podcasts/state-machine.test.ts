import { createActor } from "xstate";
import createStateMachine from "../../../core/search-podcasts/state-machine";
import sinon from "sinon";
import { sleep } from "../../utils";
import type { Podcasts } from "../../../core/models/podcast";

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

  it("should store the service response on success state", async () => {
    // Given
    const foundPodcasts = [
      {
        id: 1,
        title: "title",
        description: "description",
        available: true,
        picture: "picture",
      },
    ];
    const actor = createActor(
      createStateMachine(
        dependencies({
          search: searchPodcastsStub.resolves(foundPodcasts),
        })
      )
    );
    actor.start();

    // When
    actor.send({ type: "SEARCH", query: "floodcast" });

    await sleep(100);

    // Then
    expect(actor.getSnapshot().context.podcasts).toEqual(foundPodcasts);
  });

  it("should have state error if service throw an error", async () => {
    // Given
    const actor = createActor(
      createStateMachine(
        dependencies({
          search: searchPodcastsStub.rejects(new Error("error_message")),
        })
      )
    );
    actor.start();

    // When
    actor.send({ type: "SEARCH", query: "floodcast" });

    await sleep(100);

    // Then
    expect(actor.getSnapshot().value).toEqual("error");
  });

  it("should store error message if service throw an error", async () => {
    // Given
    const actor = createActor(
      createStateMachine(
        dependencies({
          search: searchPodcastsStub.rejects(new Error("error_message")),
        })
      )
    );
    actor.start();

    // When
    actor.send({ type: "SEARCH", query: "floodcast" });

    await sleep(100);

    // Then
    expect(actor.getSnapshot().context.error).toEqual("error_message");
  });

  describe("on success state", () => {
    function getActorOnSuccess(stub: sinon.SinonStub, podcasts: Podcasts) {
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: stub.resolves(podcasts),
          })
        )
      );
      actor.start();
      actor.send({ type: "SEARCH", query: "floodcast" });

      return actor;
    }

    it("should restore context on reset", async () => {
      // Given
      const foundPodcasts = [
        {
          id: 1,
          title: "title",
          description: "description",
          available: true,
          picture: "picture",
        },
      ];
      const actor = getActorOnSuccess(searchPodcastsStub, foundPodcasts);

      await sleep(100);

      // When
      actor.send({ type: "RESET" });

      await sleep(100);

      // Then
      expect(actor.getSnapshot().context.podcasts).toEqual([]);
      expect(actor.getSnapshot().context.error).toBeNull();
    });

    it("should be on idle state after reset", async () => {
      // Given
      const foundPodcasts = [
        {
          id: 1,
          title: "title",
          description: "description",
          available: true,
          picture: "picture",
        },
      ];
      const actor = getActorOnSuccess(searchPodcastsStub, foundPodcasts);

      await sleep(100);

      // When
      actor.send({ type: "RESET" });

      await sleep(100);

      // Then
      expect(actor.getSnapshot().value).toBe("idle");
    });

    it("should store the service response on retry", async () => {
      // Given
      const foundPodcasts = [
        {
          id: 1,
          title: "title",
          description: "description",
          available: true,
          picture: "picture",
        },
      ];
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub
              .onFirstCall()
              .resolves(["podcasts"])
              .onSecondCall()
              .resolves(foundPodcasts),
          })
        )
      );
      actor.start();

      // When
      actor.send({ type: "SEARCH", query: "floodcast" });
      await sleep(100);

      actor.send({ type: "SEARCH", query: "floodcast" });
      await sleep(100);

      // Then
      expect(searchPodcastsStub.calledTwice).toBe(true);
      expect(actor.getSnapshot().context.podcasts).toEqual(foundPodcasts);
    });
  });

  describe("on error state", () => {
    function getActorOnError(stub: sinon.SinonStub) {
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: stub.rejects(new Error("error_message")),
          })
        )
      );
      actor.start();
      actor.send({ type: "SEARCH", query: "floodcast" });

      return actor;
    }

    it("should restore context on reset", async () => {
      // Given
      const actor = getActorOnError(searchPodcastsStub);

      await sleep(100);

      // When
      actor.send({ type: "RESET" });

      await sleep(100);

      // Then
      expect(actor.getSnapshot().context.podcasts).toEqual([]);
      expect(actor.getSnapshot().context.error).toBeNull();
    });

    it("should be on idle state after reset", async () => {
      // Given
      const actor = getActorOnError(searchPodcastsStub);

      await sleep(100);

      // When
      actor.send({ type: "RESET" });

      await sleep(100);

      // Then
      expect(actor.getSnapshot().value).toBe("idle");
    });

    it("should store the service response on retry", async () => {
      // Given
      const foundPodcasts = [
        {
          id: 1,
          title: "title",
          description: "description",
          available: true,
          picture: "picture",
        },
      ];
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub
              .onFirstCall()
              .resolves(["podcasts"])
              .onSecondCall()
              .resolves(foundPodcasts),
          })
        )
      );
      actor.start();

      // When
      actor.send({ type: "SEARCH", query: "floodcast" });
      await sleep(100);

      actor.send({ type: "SEARCH", query: "floodcast" });
      await sleep(100);

      // Then
      expect(searchPodcastsStub.calledTwice).toBe(true);
      expect(actor.getSnapshot().context.podcasts).toEqual(foundPodcasts);
    });
  });
});
