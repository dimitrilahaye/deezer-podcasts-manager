import "@index/index.css";
import image from "../../assets/icon.png";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <header>
        <img src={image} alt="Deezer Podcasts Manager" width="20%" />
        <Navbar />
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
