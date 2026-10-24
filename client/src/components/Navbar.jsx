import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Attendee / logged-out top bar. Organizers use the sidebar layout instead.
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (user?.role === 'organizer') return null;

  const out = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <strong>QRCHECK</strong>
      <div className="nav-links">
        {user?.role === 'attendee' && (
          <>
            <Link to="/events">Events</Link>
            <Link to="/tickets">My Tickets</Link>
          </>
        )}
        {user ? (
          <button className="btn small" onClick={out}>Logout ({user.name})</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
