import type React from "react";
import useStores from "../hooks/use-stores";
import { useParams } from "react-router-dom";
import AddToFavoritesButton from "../components/AddToFavoritesButton";
import RemoveFromFavoritesButton from "../components/RemoveFromFavoritesButton";

const PodcastDetail: React.FC = () => {
  const { id } = useParams();
  const { getPodcast } = useStores("searchPodcasts");

  const podcast = getPodcast(Number(id));

  if (podcast) {
    return (
      <>
        <h2>Détails {podcast?.title}</h2>
        {!podcast.isFavorite && <AddToFavoritesButton podcast={podcast} />}
        {podcast.isFavorite && <RemoveFromFavoritesButton podcast={podcast} />}
      </>
    );
  }

  return <p>Podcast introuvable</p>;
};

export default PodcastDetail;
