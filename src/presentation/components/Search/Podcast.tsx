import "@index/index.css";
import type { Podcast } from "../../../core/models/podcast";
import RemoveFromFavoritesButton from "../RemoveFromFavoritesButton";
import AddToFavoritesButton from "../AddToFavoritesButton";

const PodcastItem: React.FC<{ podcast: Podcast }> = ({ podcast }) => {
  return (
    <li className={podcast.isFavorite ? "is-favorite" : ""}>
      <article>
        <h3>{podcast.title}</h3>
        <img src={podcast.picture} alt="" />
        <p className="ellipsis">{podcast.description}</p>
        <div>
          {podcast.isFavorite ? (
            <RemoveFromFavoritesButton podcast={podcast} />
          ) : (
            <AddToFavoritesButton podcast={podcast} />
          )}
        </div>
      </article>
    </li>
  );
};

export default PodcastItem;
