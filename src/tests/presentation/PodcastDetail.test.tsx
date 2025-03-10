/* eslint-disable @typescript-eslint/no-unused-vars */
import { screen, render, act } from "@testing-library/react";
import PodcastDetail from "@index/presentation/pages/PodcastDetail";
import createPodcastsStore from "@index/core/search-podcasts/store";
import createEpisodesStore from "@index/core/episodes/store";
import { stores } from "@index/core/stores";
import { StoresProvider } from "@index/stores-provider";
import Sinon from "sinon";
import { sleep } from "../utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fakePodcast, mockDependencies } from "../mocks";

describe("Podcast details page", () => {
  beforeEach(() => {
    Sinon.resetHistory();
  });
  beforeAll(() => {
    Sinon.resetHistory();
  });

  test("When display podcast detail page, it should display elements", async () => {
    // Given
    const podcast = fakePodcast();
    const podcastsStore = createPodcastsStore(
      mockDependencies({
        search: Sinon.stub().resolves([podcast]),
      })
    );
    const episodesStore = createEpisodesStore(
      mockDependencies({
        getEpisodes: Sinon.stub().resolves([]),
      })
    );

    podcastsStore.getState().searchPodcast(podcast.title);
    await sleep(100);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/podcast/${podcast.id}`]}>
          <StoresProvider
            stores={{
              ...stores,
              podcasts: podcastsStore,
              episodes: episodesStore,
            }}
          >
            <Routes>
              <Route path="/podcast/:id" element={<PodcastDetail />} />
            </Routes>
          </StoresProvider>
        </MemoryRouter>
      );
    });

    // Then
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: `Détails ${podcast.title}`,
      })
    ).toBeInTheDocument();
  });

  test("When display podcast detail page, it should display a loader", async () => {
    // Given
    const podcast = fakePodcast();
    const podcastsStore = createPodcastsStore(
      mockDependencies({
        search: Sinon.stub().resolves([podcast]),
      })
    );
    const episodesStore = createEpisodesStore(
      mockDependencies({
        getEpisodes: Sinon.stub().callsFake(async (_podcastId: number) => {
          await sleep(100);
          return [];
        }),
      })
    );

    podcastsStore.getState().searchPodcast(podcast.title);
    await sleep(100);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/podcast/${podcast.id}`]}>
          <StoresProvider
            stores={{
              ...stores,
              podcasts: podcastsStore,
              episodes: episodesStore,
            }}
          >
            <Routes>
              <Route path="/podcast/:id" element={<PodcastDetail />} />
            </Routes>
          </StoresProvider>
        </MemoryRouter>
      );
    });

    // Then
    expect(
      screen.queryByRole("status", {
        name: "Chargement...",
      })
    ).toBeInTheDocument();
  });

  test("When episodes have been loaded successfuly, it should not display a loader", async () => {
    // Given
    const podcast = fakePodcast();
    const podcastsStore = createPodcastsStore(
      mockDependencies({
        search: Sinon.stub().resolves([podcast]),
        getEpisodes: Sinon.stub().resolves([]),
      })
    );
    const episodesStore = createEpisodesStore(
      mockDependencies({
        getEpisodes: Sinon.stub().resolves([]),
      })
    );

    podcastsStore.getState().searchPodcast(podcast.title);
    await sleep(100);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/podcast/${podcast.id}`]}>
          <StoresProvider
            stores={{
              ...stores,
              podcasts: podcastsStore,
              episodes: episodesStore,
            }}
          >
            <Routes>
              <Route path="/podcast/:id" element={<PodcastDetail />} />
            </Routes>
          </StoresProvider>
        </MemoryRouter>
      );
    });

    await act(async () => {
      await sleep(100);
    });

    // Then
    expect(
      screen.queryByRole("status", {
        name: "Chargement...",
      })
    ).not.toBeInTheDocument();
  });

  test("When podcast is not in favorite, it should display 'add podcast to favorites' button", async () => {
    // Given
    const podcast = fakePodcast({ isFavorite: false });
    const podcastsStore = createPodcastsStore(
      mockDependencies({
        search: Sinon.stub().resolves([podcast]),
      })
    );
    const episodesStore = createEpisodesStore(
      mockDependencies({
        getEpisodes: Sinon.stub().resolves([]),
      })
    );

    podcastsStore.getState().searchPodcast(podcast.title);
    await sleep(100);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/podcast/${podcast.id}`]}>
          <StoresProvider
            stores={{
              ...stores,
              podcasts: podcastsStore,
              episodes: episodesStore,
            }}
          >
            <Routes>
              <Route path="/podcast/:id" element={<PodcastDetail />} />
            </Routes>
          </StoresProvider>
        </MemoryRouter>
      );
    });

    // Then
    expect(
      screen.queryByRole("button", { name: "add podcast to favorites" })
    ).toBeInTheDocument();
  });

  test("When podcast is in favorite, it should display 'remove podcast from favorites' button", async () => {
    // Given
    const podcast = fakePodcast({ isFavorite: true });
    const podcastsStore = createPodcastsStore(
      mockDependencies({
        search: Sinon.stub().resolves([podcast]),
      })
    );
    const episodesStore = createEpisodesStore(
      mockDependencies({
        getEpisodes: Sinon.stub().resolves([]),
      })
    );

    podcastsStore.getState().searchPodcast(podcast.title);
    await sleep(100);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/podcast/${podcast.id}`]}>
          <StoresProvider
            stores={{
              ...stores,
              podcasts: podcastsStore,
              episodes: episodesStore,
            }}
          >
            <Routes>
              <Route path="/podcast/:id" element={<PodcastDetail />} />
            </Routes>
          </StoresProvider>
        </MemoryRouter>
      );
    });

    // Then
    expect(
      screen.queryByRole("button", { name: "remove podcast from favorites" })
    ).toBeInTheDocument();
  });

  test("When podcast is not found, it should display specific message", async () => {
    // Given
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/podcast/123"]}>
          <StoresProvider stores={stores}>
            <Routes>
              <Route path="/podcast/:id" element={<PodcastDetail />} />
            </Routes>
          </StoresProvider>
        </MemoryRouter>
      );
    });

    // Then
    expect(screen.queryByText("Podcast introuvable")).toBeInTheDocument();
  });
});
