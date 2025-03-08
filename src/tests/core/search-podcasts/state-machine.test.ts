import { createActor } from "xstate";
import createStateMachine from "../../../core/search-podcasts/state-machine";
import sinon from "sinon";
import { sleep } from "../../utils";
import type { Podcasts } from "../../../core/models/podcast";

function dependencies(stubs: {
  search: sinon.SinonStub;
  toggle: sinon.SinonStub;
}) {
  return {
    podcastsDataSource: {
      search: stubs.search,
    },
    podcastRepository: {
      toggleFromFavorites: stubs.toggle,
    },
  };
}

function getFakePodcast(data: { isFavorite: boolean }) {
  return {
    id: 1,
    title: "title",
    description: "description",
    available: true,
    picture: "picture",
    isFavorite: data.isFavorite,
  }
}

describe("Search podcasts state machine", () => {
  let searchPodcastsStub: sinon.SinonStub;
  let toggleFromFavoritesStub: sinon.SinonStub;

  beforeEach(() => {
    searchPodcastsStub = sinon.stub();
    toggleFromFavoritesStub = sinon.stub();
    searchPodcastsStub.resetHistory();
    toggleFromFavoritesStub.resetHistory();
  });

  it("should have idle state at creation", () => {
    // Given
    const actor = createActor(
      createStateMachine(
        dependencies({
          search: searchPodcastsStub,
          toggle: toggleFromFavoritesStub,
        })
      )
    );

    // When
    actor.start();

    // Then
    expect(actor.getSnapshot().value).toEqual("idle");
  });

  describe("Search podcasts", () => {
    it("should have podcasts_loading state at SEARCH event", () => {
      // Given
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub,
            toggle: toggleFromFavoritesStub,
          })
        )
      );
      actor.start();

      // When
      actor.send({ type: "SEARCH", query: "" });

      // Then
      expect(actor.getSnapshot().value).toEqual("podcasts_loading");
    });

    it("should search for podcasts at SEARCH event", () => {
      // Given
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub,
            toggle: toggleFromFavoritesStub,
          })
        )
      );
      actor.start();

      // When
      actor.send({ type: "SEARCH", query: "floodcast" });

      // Then
      expect(searchPodcastsStub.calledOnceWith("floodcast")).toBe(true);
    });

    it("should have success state when podcasts_loading is on done", async () => {
      // Given
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub,
            toggle: toggleFromFavoritesStub,
          })
        )
      );
      actor.start();

      // When
      actor.send({ type: "SEARCH", query: "floodcast" });

      await sleep(100);

      // Then
      expect(actor.getSnapshot().value).toEqual("success_search");
    });

    it("should store the service response on success state", async () => {
      // Given
      const foundPodcasts = [
        getFakePodcast({ isFavorite: false }),
      ];
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub.resolves(foundPodcasts),
            toggle: toggleFromFavoritesStub,
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
            toggle: toggleFromFavoritesStub,
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
            toggle: toggleFromFavoritesStub,
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
      it("should store the service response on retry", async () => {
        // Given
        const foundPodcasts = [
          getFakePodcast({ isFavorite: false })
        ];
        const actor = createActor(
          createStateMachine(
            dependencies({
              search: searchPodcastsStub
                .onFirstCall()
                .resolves(["podcasts"])
                .onSecondCall()
                .resolves(foundPodcasts),
              toggle: toggleFromFavoritesStub,
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
      it("should store the service response on retry", async () => {
        // Given
        const foundPodcasts = [
          getFakePodcast({ isFavorite: false })
        ];
        const actor = createActor(
          createStateMachine(
            dependencies({
              search: searchPodcastsStub
                .onFirstCall()
                .resolves(["podcasts"])
                .onSecondCall()
                .resolves(foundPodcasts),
              toggle: toggleFromFavoritesStub,
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

  describe("Toggle podcast from favorites", () => {
    it("should have toggle_favorite_loading state at TOGGLE", () => {
      // Given
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub,
            toggle: toggleFromFavoritesStub,
          })
        )
      );
      actor.start();

      // When
      actor.send({
        type: "TOGGLE", podcast: getFakePodcast({ isFavorite: false })
      });

      // Then
      expect(actor.getSnapshot().value).toEqual("toggle_favorite_loading");
    });

    it("should toggle the podcast at TOGGLE", () => {
      // Given
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub,
            toggle: toggleFromFavoritesStub,
          })
        )
      );
      actor.start();

      // When
      actor.send({
        type: "TOGGLE", podcast: getFakePodcast({ isFavorite: false })
      });

      // Then
      expect(toggleFromFavoritesStub.calledOnceWith(getFakePodcast({ isFavorite: false }))).toBe(true);
    });

    it("should have success state when toggle_favorite_loading is on done", async () => {
      // Given
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub,
            toggle: toggleFromFavoritesStub,
          })
        )
      );
      actor.start();

      // When
      actor.send({
        type: "TOGGLE", podcast: getFakePodcast({ isFavorite: false })
      });
      await sleep(100);

      // Then
      expect(actor.getSnapshot().value).toEqual("success_toggle");
    });

    it("should have update the podcast on success state", async () => {
      // Given
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub.resolves([
              getFakePodcast({ isFavorite: false }),
            ]),
            toggle: toggleFromFavoritesStub.resolves(getFakePodcast({ isFavorite: true })),
          })
        )
      );
      actor.start();

      // When
      actor.send({ type: "SEARCH", query: 'query' });
      await sleep(100);
      actor.send({
        type: "TOGGLE", podcast: getFakePodcast({ isFavorite: false })
      });
      await sleep(100);

      // Then
      expect(actor.getSnapshot().context.podcasts).toStrictEqual([getFakePodcast({ isFavorite: true })]);
    });

    it("should have state error if repository throw an error", async () => {
      // Given
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub,
            toggle: toggleFromFavoritesStub.rejects(new Error('error_message'))
          })
        ));
      actor.start();

      // When
      actor.send({
        type: "TOGGLE", podcast: getFakePodcast({ isFavorite: false })
      });
      await sleep(100);

      // Then
      expect(actor.getSnapshot().value).toBe('error');
    });

    it("should store error message if repository throw an error", async () => {
      // Given
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: searchPodcastsStub,
            toggle: toggleFromFavoritesStub.rejects(new Error('error_message'))
          })
        ));
      actor.start();

      // When
      actor.send({
        type: "TOGGLE", podcast: getFakePodcast({ isFavorite: false })
      });
      await sleep(100);

      // Then
      expect(actor.getSnapshot().context.error).toBe('error_message');
    });

    describe("on success state", () => {
      it("should store the repository response on retry", async () => {
        // Given
        const foundPodcast = getFakePodcast({ isFavorite: false });
        const actor = createActor(
          createStateMachine(
            dependencies({
              search: searchPodcastsStub
                .resolves([foundPodcast]),
              toggle: toggleFromFavoritesStub.onFirstCall().resolves({
                ...foundPodcast,
                isFavorite: true,
              }).onSecondCall().resolves({
                ...foundPodcast,
                isFavorite: false,
              }),
            })
          )
        );
        actor.start();

        // When
        actor.send({ type: "TOGGLE", podcast: foundPodcast });
        await sleep(100);

        actor.send({
          type: "TOGGLE", podcast: {
            ...foundPodcast,
            isFavorite: true,
          }
        });
        await sleep(100);

        // Then
        expect(toggleFromFavoritesStub.calledTwice).toBe(true);
        expect(actor.getSnapshot().context.podcasts).toStrictEqual([getFakePodcast({ isFavorite: false })]);
      });
    });

    describe("on error state", () => {
      it("should store the repository response on retry", async () => {
        // Given
        const foundPodcast = getFakePodcast({ isFavorite: false });
        const actor = createActor(
          createStateMachine(
            dependencies({
              search: searchPodcastsStub
                .resolves([foundPodcast]),
              toggle: toggleFromFavoritesStub
                .onFirstCall()
                .rejects(new Error('error_message'))
                .onSecondCall()
                .resolves({
                  ...foundPodcast,
                  isFavorite: true,
                }),
            })
          )
        );
        actor.start();

        // When
        actor.send({
          type: "TOGGLE", podcast: foundPodcast
        });
        await sleep(100);

        actor.send({
          type: "TOGGLE", podcast: foundPodcast
        });
        await sleep(100);

        // Then
        expect(toggleFromFavoritesStub.calledTwice).toBe(true);
        expect(actor.getSnapshot().context.podcasts).toStrictEqual([{
          ...foundPodcast,
          isFavorite: true,
        }]);
      });
    });
  });

  describe("on success state", () => {
    function getActorOnSuccess(stub: sinon.SinonStub, podcasts: Podcasts) {
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: stub.resolves(podcasts),
            toggle: toggleFromFavoritesStub,
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
        getFakePodcast({ isFavorite: false }),
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
        getFakePodcast({ isFavorite: false }),
      ];
      const actor = getActorOnSuccess(searchPodcastsStub, foundPodcasts);

      await sleep(100);

      // When
      actor.send({ type: "RESET" });

      await sleep(100);

      // Then
      expect(actor.getSnapshot().value).toBe("idle");
    });
  });

  describe("on error state", () => {
    function getActorOnError(stub: sinon.SinonStub) {
      const actor = createActor(
        createStateMachine(
          dependencies({
            search: stub.rejects(new Error("error_message")),
            toggle: toggleFromFavoritesStub,
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
  });
});
