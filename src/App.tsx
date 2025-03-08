import { Routes, Route } from "react-router-dom";
import Home from "./presentation/pages/Home";
import Search from "./presentation/pages/Search";
import MainLayout from "./presentation/layouts/MainLayout";
import PodcastDetail from "./presentation/pages/PodcastDetail";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/podcast/:id" element={<PodcastDetail />} />
      </Route>
    </Routes>
  );
};

export default App;
