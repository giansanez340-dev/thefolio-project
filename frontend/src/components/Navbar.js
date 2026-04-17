import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "10px", background: "#222" }}>
      <Link to="/" style={{ color: "white", marginRight: "10px" }}>
        Home
      </Link>

      {!user ? (
        <>
          <Link to="/login" style={{ color: "white", marginRight: "10px" }}>
            Login
          </Link>
          <Link to="/register" style={{ color: "white", marginRight: "10px" }}>
            Register
          </Link>
        </>
      ) : (
        <>
          <Link to="/profile" style={{ color: "white", marginRight: "10px" }}>
            Profile
          </Link>

          <Link to="/create" style={{ color: "white", marginRight: "10px" }}>
            Create Post
          </Link>

          {user.role === 'admin' && (
            <Link to="/admin" style={{ color: "white", marginRight: "10px" }}>
              Admin
            </Link>
          )}

          <button
            onClick={logout}
            style={{
              color: "white",
              background: "transparent",
              border: "1px solid white",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;