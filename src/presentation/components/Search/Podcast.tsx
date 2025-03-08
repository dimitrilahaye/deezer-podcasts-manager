import "@index/index.css";
import type { Podcast } from "../../../core/models/podcast";
import useStores from "../../hooks/use-stores";
import ButtonLoader from "../ButtonLoader";

const PodcastItem: React.FC<{ podcast: Podcast }> = ({ podcast }) => {
  const { status, togglePodcastFromFavorites } = useStores("searchPodcasts");

  const isLoading = () => status === "toggle_favorite_loading";

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    podcast: Podcast
  ) => {
    togglePodcastFromFavorites(podcast);
    event.stopPropagation();
  };

  return (
    <li>
      <article>
        <h3>{podcast.title}</h3>
        <img src={podcast.picture} alt="" />
        <p className="ellipsis">{podcast.description}</p>
        <div>
          {podcast.isFavorite ? (
            <button
              type="button"
              aria-label="remove podcast from favorites"
              disabled={isLoading()}
              aria-busy={isLoading()}
              aria-live="assertive"
              onClick={(event) => handleClick(event, podcast)}
            >
              {isLoading() ? <ButtonLoader /> : "Retirer de vos favoris"}
            </button>
          ) : (
            <button
              type="button"
              aria-label="add podcast to favorites"
              disabled={isLoading()}
              aria-busy={isLoading()}
              aria-live="assertive"
              onClick={(event) => handleClick(event, podcast)}
            >
              {isLoading() ? <ButtonLoader /> : "Ajouter à vos favoris"}
            </button>
          )}
        </div>
      </article>
    </li>
  );
};

export default PodcastItem;
