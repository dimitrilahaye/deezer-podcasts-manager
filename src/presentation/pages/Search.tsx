import type React from "react";
import useStores from "../hooks/use-stores";
import { useState } from "react";
import Loader from "../components/Loader";
import SearchResult from "../components/Search/SearchResult";
import ErrorComponent from "../components/Error";

const Search: React.FC = () => {
  const { status, error, searchPodcast } = useStores("searchPodcasts");
  const [inputValue, setInputValue] = useState<string>("");

  const displayResult = () => {
    return ["toggle_favorite_loading", "success_search", "success_toggle", "error"].includes(
      status
    );
  };

  const submitIsDisabled = () => inputValue.trim().length === 0;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const searchHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchPodcast(inputValue);
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
        <button type="submit" disabled={submitIsDisabled()}>
          Search
        </button>
      </form>
      {status === "podcasts_loading" && <Loader />}
      {displayResult() && <SearchResult />}
      {status === "error" && error && <ErrorComponent error={error} />}
    </>
  );
};

export default Search;
