import "@index/index.css";
import useStores from "../../hooks/use-stores";
import PodcastItem from "./Podcast";

const SearchResult: React.FC = () => {
  const { podcasts } = useStores("searchPodcasts");

  return (
    <ul aria-live="polite" aria-label="result">
      {podcasts.length === 0 && <div>Pas de résultat</div>}
      {podcasts.map((podcast) => {
        return (
          <li
            key={podcast.id}
            className={podcast.isFavorite ? "is-favorite" : ""}
          >
            <PodcastItem podcast={podcast} />
          </li>
        );
      })}
    </ul>
  );
};

export default SearchResult;
