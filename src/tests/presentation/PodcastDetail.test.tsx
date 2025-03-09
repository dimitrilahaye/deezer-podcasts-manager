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
});
