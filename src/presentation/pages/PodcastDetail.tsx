import type React from "react";
import useStores from "../hooks/use-stores";
import { useParams } from "react-router-dom";

const PodcastDetail: React.FC = () => {
  const { id } = useParams();
  const { getPodcast } = useStores("searchPodcasts");

  const podcast = getPodcast(Number(id))


  return <h2>Détails {podcast?.title}</h2>;
};

export default PodcastDetail;
