import type React from "react";
import useStores from "../hooks/use-stores";
import { useParams } from "react-router-dom";
import AddToFavoritesButton from "../components/AddToFavoritesButton";
import RemoveFromFavoritesButton from "../components/RemoveFromFavoritesButton";
import Loader from "../components/Loader";
import { useEffect } from "react";

const PodcastDetail: React.FC = () => {
  const { id } = useParams();
  const { getPodcast } = useStores("podcasts");
  const { status, getEpisodes } = useStores("episodes");

  const podcast = getPodcast(Number(id));

  useEffect(() => {
    if (podcast) {
      getEpisodes(podcast.id);
    }
  }, [getEpisodes, podcast]);

  if (podcast) {
    return (
      <>
        <h2>Détails {podcast?.title}</h2>
        {status === "episodes_loading" && <Loader />}
        {!podcast.isFavorite && <AddToFavoritesButton podcast={podcast} />}
        {podcast.isFavorite && <RemoveFromFavoritesButton podcast={podcast} />}
      </>
    );
  }

  return <p>Podcast introuvable</p>;
};

export default PodcastDetail;
