import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* Brand / Logo */}
      <Link
        to="/"
        className="text-2xl font-bold tracking-wide hover:text-yellow-400 transition-colors"
      >
        URL Shortener
      </Link>

      {/* Navigation Links */}
      <div className="space-x-4">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 transition-colors px-3 py-1 rounded font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-yellow-400 transition-colors font-medium"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
