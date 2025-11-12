import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="Pet Adoption Home">
          Pet Adoption
        </Link>
        <ul className="navbar-menu" role="menubar">
          <li role="none">
            <Link to="/pets" role="menuitem">Browse Pets</Link>
          </li>
          {!user ? (
            <>
              <li role="none">
                <Link to="/login" role="menuitem">Login</Link>
              </li>
              <li role="none">
                <Link to="/register" role="menuitem">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li role="none">
                <Link to="/dashboard" role="menuitem">My Applications</Link>
              </li>
              {user.role === 'admin' && (
                <li role="none">
                  <Link to="/admin" role="menuitem">Admin</Link>
                </li>
              )}
              <li role="none">
                <button onClick={handleLogout} className="logout-btn" role="menuitem" aria-label="Logout">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
