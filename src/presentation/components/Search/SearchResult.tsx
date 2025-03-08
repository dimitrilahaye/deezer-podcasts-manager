import useStores from "../../hooks/use-stores";
import PodcastItem from "./Podcast";

const SearchResult: React.FC = () => {
  const { podcasts } = useStores("searchPodcasts");

  return (
    <ul aria-live="polite" aria-label="result">
      {podcasts.length === 0 && <div>Pas de résultat</div>}
      {podcasts.map((podcast) => {
        return <PodcastItem key={podcast.id} podcast={podcast} />;
      })}
    </ul>
  );
};

export default SearchResult;
