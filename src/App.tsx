import { Routes, Route } from "react-router-dom";
import Home from "./presentation/pages/Home";
import Navbar from "./presentation/components/Navbar";
import Search from "./presentation/pages/Search";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  );
};

export default App;
