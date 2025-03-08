import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Accueil</Link>
        </li>
        <li>
          <Link to="/search">Rechercher des podcasts</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
