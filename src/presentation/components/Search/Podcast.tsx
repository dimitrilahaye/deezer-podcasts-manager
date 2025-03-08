import "@index/index.css";
import type { Podcast } from "../../../core/models/podcast";
import RemoveFromFavoritesButton from "../RemoveFromFavoritesButton";
import AddToFavoritesButton from "../AddToFavoritesButton";
import { useNavigate } from "react-router-dom";

const PodcastItem: React.FC<{ podcast: Podcast }> = ({ podcast }) => {
  const navigate = useNavigate();

  return (
    <article>
      <h3>{podcast.title}</h3>
      <img src={podcast.picture} alt="" />
      <p className="ellipsis">{podcast.description}</p>
      <button
        type="button"
        aria-label="go to episodes"
        onClick={() => navigate(`/podcast/${podcast.id}`)}
      >
        📋
      </button>
      {podcast.isFavorite ? (
        <RemoveFromFavoritesButton podcast={podcast} />
      ) : (
        <AddToFavoritesButton podcast={podcast} />
      )}
    </article>
  );
};

export default PodcastItem;
