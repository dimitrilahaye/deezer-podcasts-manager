import { screen, render, within, act } from "@testing-library/react";
import Search from "../../presentation/pages/Search";
import { stores } from "../../core/stores";
import { StoresProvider } from "../../stores-provider";
import userEvent from "@testing-library/user-event";
import createSearchPodcastsStore from "../../core/search-podcasts/store";
import { inMemoryDependencies } from "../../core/dependencies";
import Sinon from "sinon";
import { sleep } from "../utils";
import { BrowserRouter } from "react-router-dom";

describe("Search page", () => {
  beforeEach(() => Sinon.resetHistory());
  afterEach(() => Sinon.resetHistory());

  test("When display search page, it should display elements", async () => {
    // Given
    render(<Search />);

    // Then
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Rechercher vos podcasts",
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("form", {
        name: "Recherche",
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: "Podcast",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
    expect(
      screen.queryByRole("button", {
        name: "Search",
      })
    ).toBeDisabled();
    expect(
      screen.queryByRole("list", {
        name: "result",
      })
    ).toBeNull();
  });

  describe("Search podcast", () => {
    test("When click on Search button, loading should be display", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore(inMemoryDependencies),
          }}
        >
          <Search />
        </StoresProvider>
      );

      // When
      await searchForPodcast("Podkassos");

      // Then
      expect(
        screen.queryByRole("status", {
          name: "Chargement...",
        })
      ).toBeInTheDocument();
    });

    test("When search is successful, list of results should be display", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().resolves([
                  {
                    id: 123,
                    available: false,
                    description: "description",
                    picture: "picture_medium",
                    title: "title",
                    isFavorite: false,
                  },
                ]),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>,
        { wrapper: BrowserRouter }
      );

      // When
      await searchForPodcast("Podkassos");

      // Then
      const listItems = await screen.findAllByRole("listitem");
      expect(listItems).toHaveLength(1);
      const [result] = screen.queryAllByRole("article");
      expect(
        within(result).queryByRole("heading", { level: 3, name: "title" })
      ).toBeInTheDocument();
      expect(within(result).getByText("description")).toBeInTheDocument();
      expect(within(result).getByRole("presentation")).toBeInTheDocument();
      expect(
        within(result).getByRole("button", {
          name: "go to episodes",
        })
      ).toBeInTheDocument();
    });

    test("When click on reset button, page should be reset", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().resolves([
                  {
                    id: 123,
                    available: false,
                    description: "description",
                    picture: "picture_medium",
                    title: "title",
                    isFavorite: false,
                  },
                ]),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>,
        { wrapper: BrowserRouter }
      );
      await searchForPodcast("Podkassos");
      const listItems = await screen.findAllByRole("listitem");
      expect(listItems).toHaveLength(1);
      expect(screen.getByRole("button", { name: "Reset" })).toBeEnabled();

      // When
      await userEvent.click(screen.getByRole("button", { name: "Reset" }));

      // Then
      const listItemsAfterReset = screen.queryAllByRole("listitem");
      expect(listItemsAfterReset).toHaveLength(0);
      expect(
        screen.queryByRole("button", {
          name: "Reset",
        })
      ).toBeDisabled();
      expect(
        screen.getByRole("textbox", {
          name: "Podcast",
        })
      ).toHaveValue("");
    });

    test("When click on 'go to episode' button, it should be redirected to podcast detail page", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().resolves([
                  {
                    id: 123,
                    available: false,
                    description: "description",
                    picture: "picture_medium",
                    title: "title",
                    isFavorite: false,
                  },
                ]),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>,
        { wrapper: BrowserRouter }
      );
      await searchForPodcast("Podkassos");
      const listItems = await screen.findAllByRole("listitem");
      expect(listItems).toHaveLength(1);
      const [result] = screen.queryAllByRole("article");
      const goToEpisodesButton = within(result).getByRole("button", {
        name: "go to episodes",
      });

      // When
      await userEvent.click(goToEpisodesButton);

      // Then
      expect(window.location.pathname).toBe("/podcast/123");
    });

    test("When search is successful, non-favorite results should have the button to add to favorite", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().resolves([
                  {
                    id: 123,
                    available: false,
                    description: "description",
                    picture: "picture_medium",
                    title: "title",
                    isFavorite: false,
                  },
                ]),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>,
        { wrapper: BrowserRouter }
      );

      // When
      await searchForPodcast("Podkassos");

      // Then
      const [result] = screen.queryAllByRole("article");
      expect(
        within(result).queryByRole("button", {
          name: "add podcast to favorites",
        })
      ).toBeInTheDocument();
    });

    test("When search is successful, favorite results should have the button to remove from favorite", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().resolves([
                  {
                    id: 123,
                    available: false,
                    description: "description",
                    picture: "picture_medium",
                    title: "title",
                    isFavorite: true,
                  },
                ]),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>,
        { wrapper: BrowserRouter }
      );

      // When
      await searchForPodcast("Podkassos");

      // Then
      const [result] = screen.queryAllByRole("article");
      expect(
        within(result).queryByRole("button", {
          name: "remove podcast from favorites",
        })
      ).toBeInTheDocument();
    });

    test("When search result is empty, it should display a specific message", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().resolves([]),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>
      );

      // When
      await searchForPodcast("Podkassos");

      // Then
      expect(screen.queryByText("Pas de résultat")).toBeInTheDocument();
    });

    test("When search is on error, it should display the error message", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().rejects(new Error("Deezer error")),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>
      );

      // When
      await searchForPodcast("Podkassos");

      // Then
      expect(screen.queryByText("Deezer error")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reset" })).toBeEnabled();
    });
  });

  describe("Favorites", () => {
    test("When click on 'add to favorites' button, it should display the loading", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().resolves([
                  {
                    id: 123,
                    available: false,
                    description: "description",
                    picture: "picture_medium",
                    title: "title",
                    isFavorite: false,
                  },
                ]),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>,
        { wrapper: BrowserRouter }
      );
      await searchForPodcast("Podkassos");
      const favoritesButton = getResultButton("add podcast to favorites");

      // When
      await userEvent.click(favoritesButton);

      // Then
      expect(screen.queryByLabelText("Mise à jour...")).toBeInTheDocument();
    });

    test("When click on 'add to favorites' button, it should display the 'remove podcast from favorites' button", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().resolves([
                  {
                    id: 123,
                    available: false,
                    description: "description",
                    picture: "picture_medium",
                    title: "title",
                    isFavorite: false,
                  },
                ]),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>,
        { wrapper: BrowserRouter }
      );
      await searchForPodcast("Podkassos");
      const favoritesButton = getResultButton("add podcast to favorites");

      // When
      await act(async () => {
        await userEvent.click(favoritesButton);
        await sleep(300);
      });

      // Then
      const [result] = screen.getAllByRole("article");
      expect(
        within(result).queryByRole("button", {
          name: "remove podcast from favorites",
        })
      ).toBeInTheDocument();
    });

    test("When click on reset button, page should be reset", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().resolves([
                  {
                    id: 123,
                    available: false,
                    description: "description",
                    picture: "picture_medium",
                    title: "title",
                    isFavorite: false,
                  },
                ]),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>,
        { wrapper: BrowserRouter }
      );
      await searchForPodcast("Podkassos");
      const favoritesButton = getResultButton("add podcast to favorites");
      await act(async () => {
        await userEvent.click(favoritesButton);
        await sleep(300);
      });
      expect(screen.getByRole("button", { name: "Reset" })).toBeEnabled();

      // When
      await userEvent.click(screen.getByRole("button", { name: "Reset" }));

      // Then
      const listItemsAfterReset = screen.queryAllByRole("listitem");
      expect(listItemsAfterReset).toHaveLength(0);
      expect(
        screen.queryByRole("button", {
          name: "Reset",
        })
      ).toBeDisabled();
    });

    test("When click on 'remove podcast from favorites' button, it should display the 'add to favorites' button", async () => {
      // Given
      render(
        <StoresProvider
          stores={{
            ...stores,
            searchPodcasts: createSearchPodcastsStore({
              ...inMemoryDependencies,
              podcastsDataSource: {
                search: Sinon.stub().resolves([
                  {
                    id: 123,
                    available: false,
                    description: "description",
                    picture: "picture_medium",
                    title: "title",
                    isFavorite: true,
                  },
                ]),
              },
            }),
          }}
        >
          <Search />
        </StoresProvider>,
        { wrapper: BrowserRouter }
      );
      await searchForPodcast("Podkassos");
      const favoritesButton = getResultButton("remove podcast from favorites");

      // When
      await act(async () => {
        await userEvent.click(favoritesButton);
        await sleep(300);
      });

      // Then
      const [result] = screen.getAllByRole("article");
      expect(
        within(result).queryByRole("button", {
          name: "add podcast to favorites",
        })
      ).toBeInTheDocument();
    });
  });
});

async function searchForPodcast(name: string) {
  const podcastInput = screen.getByRole("textbox", {
    name: "Podcast",
  });
  const searchButton = screen.getByRole("button", {
    name: "Search",
  });
  await userEvent.type(podcastInput, name);

  await userEvent.click(searchButton);
}

function getResultButton(name: string) {
  const [result] = screen.getAllByRole("article");

  return within(result).getByRole("button", { name });
}
