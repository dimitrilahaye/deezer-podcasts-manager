import { Routes, Route } from "react-router-dom";
import Example from "./presentation/Example";
import Home from "./presentation/Home";
import Navbar from "./presentation/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/example" element={<Example />} />
      </Routes>
    </>
  );
};

export default App;
