import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero" role="main">
        <h1>Find Your Perfect Companion</h1>
        <p>Browse our available pets and start your adoption journey today</p>
        <Link to="/pets" className="cta-button" aria-label="Browse available pets for adoption">
          Browse Pets
        </Link>
      </div>
    </div>
  );
};

export default Home;
