import { Routes, Route } from "react-router-dom";
import Home from "./presentation/pages/Home";
import Search from "./presentation/pages/Search";
import MainLayout from "./presentation/layouts/MainLayout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Route>
    </Routes>
  );
};

export default App;
