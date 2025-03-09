import { screen, render } from "@testing-library/react";
import PodcastDetail from "@index/presentation/pages/PodcastDetail";
import createStore from "@index/core/search-podcasts/store";
import { stores } from "@index/core/stores";
import { StoresProvider } from "@index/stores-provider";
import Sinon from "sinon";
import { sleep } from "../utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { mockDependencies } from "../mocks";

describe("Podcast details page", () => {
  test("When display podcast detail page, it should display elements", async () => {
    // Given
    const podcast = {
      id: 1,
      title: "title",
      description: "description",
      available: true,
      picture: "picture",
      isFavorite: true,
    };
    const store = createStore(
      mockDependencies({
        search: Sinon.stub().resolves([podcast]),
      })
    );
    store.getState().searchPodcast(podcast.title);
    await sleep(100);

    render(
      <MemoryRouter initialEntries={[`/podcast/${podcast.id}`]}>
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: store,
          }}
        >
          <Routes>
            <Route path="/podcast/:id" element={<PodcastDetail />} />
          </Routes>
        </StoresProvider>
      </MemoryRouter>
    );

    // Then
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: `Détails ${podcast.title}`,
      })
    ).toBeInTheDocument();
  });

  test("When podcast is not in favorite, it should display 'add podcast to favorites' button", async () => {
    // Given
    const podcast = {
      id: 1,
      title: "title",
      description: "description",
      available: true,
      picture: "picture",
      isFavorite: false,
    };
    const store = createStore(
      mockDependencies({
        search: Sinon.stub().resolves([podcast]),
      })
    );
    store.getState().searchPodcast(podcast.title);
    await sleep(100);

    render(
      <MemoryRouter initialEntries={[`/podcast/${podcast.id}`]}>
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: store,
          }}
        >
          <Routes>
            <Route path="/podcast/:id" element={<PodcastDetail />} />
          </Routes>
        </StoresProvider>
      </MemoryRouter>
    );

    // Then
    expect(
      screen.queryByRole("button", { name: "add podcast to favorites" })
    ).toBeInTheDocument();
  });

  test("When podcast is in favorite, it should display 'remove podcast from favorites' button", async () => {
    // Given
    const podcast = {
      id: 1,
      title: "title",
      description: "description",
      available: true,
      picture: "picture",
      isFavorite: true,
    };
    const store = createStore(
      mockDependencies({
        search: Sinon.stub().resolves([podcast]),
      })
    );
    store.getState().searchPodcast(podcast.title);
    await sleep(100);

    render(
      <MemoryRouter initialEntries={[`/podcast/${podcast.id}`]}>
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: store,
          }}
        >
          <Routes>
            <Route path="/podcast/:id" element={<PodcastDetail />} />
          </Routes>
        </StoresProvider>
      </MemoryRouter>
    );

    // Then
    expect(
      screen.queryByRole("button", { name: "remove podcast from favorites" })
    ).toBeInTheDocument();
  });

  test("When podcast is not found, it should display specific message", async () => {
    // Given
    render(
      <MemoryRouter initialEntries={["/podcast/123"]}>
        <StoresProvider stores={stores}>
          <Routes>
            <Route path="/podcast/:id" element={<PodcastDetail />} />
          </Routes>
        </StoresProvider>
      </MemoryRouter>
    );

    // Then
    expect(screen.queryByText("Podcast introuvable")).toBeInTheDocument();
  });
});
