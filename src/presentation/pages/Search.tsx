import type React from "react";
import useStores from "../hooks/use-stores";
import { useState } from "react";
import Loader from "../components/Loader";
import SearchResult from "../components/Search/SearchResult";
import ErrorComponent from "../components/Error";

const Search: React.FC = () => {
  const { status, error, searchPodcast, reset } = useStores("searchPodcasts");
  const [inputValue, setInputValue] = useState<string>("");

  const displayResult = () => {
    return [
      "toggle_favorite_loading",
      "success_search",
      "success_toggle",
      "error",
    ].includes(status);
  };

  const submitIsDisabled = () => inputValue.trim().length === 0;
  const resetIsDisabled = () => !["success_search", "error"].includes(status);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const searchHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchPodcast(inputValue);
  };

  const resetHandler = () => {
    reset();
    setInputValue("");
  };

  return (
    <>
      <h2>Rechercher vos podcasts</h2>
      <form aria-label="Recherche" onSubmit={searchHandler}>
        <label htmlFor="podcast">Podcast</label>
        <input
          id="podcast"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={submitIsDisabled()} aria-label="Search">
          🔎
        </button>
        <button
          type="button"
          disabled={resetIsDisabled()}
          onClick={resetHandler}
          aria-label="Reset"
        >
          🗑️
        </button>
      </form>
      {status === "podcasts_loading" && <Loader />}
      {displayResult() && <SearchResult />}
      {status === "error" && error && <ErrorComponent error={error} />}
    </>
  );
};

export default Search;
