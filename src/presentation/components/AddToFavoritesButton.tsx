import "@index/index.css";
import type { Podcast } from "../../core/models/podcast";
import useStores from "../hooks/use-stores";
import ButtonLoader from "./ButtonLoader";

const AddToFavoritesButton: React.FC<{ podcast: Podcast }> = ({ podcast }) => {
  const { status, togglePodcastFromFavorites } = useStores("podcasts");

  const isLoading = () => status === "toggle_favorite_loading";

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    podcast: Podcast
  ) => {
    togglePodcastFromFavorites(podcast);
    event.stopPropagation();
  };

  return (
    <button
      type="button"
      aria-label="add podcast to favorites"
      disabled={isLoading()}
      aria-busy={isLoading()}
      aria-live="assertive"
      onClick={(event) => handleClick(event, podcast)}
    >
      {isLoading() ? <ButtonLoader /> : "🤍"}
    </button>
  );
};

export default AddToFavoritesButton;
