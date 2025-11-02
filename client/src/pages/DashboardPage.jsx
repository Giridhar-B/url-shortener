import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import URLCard from "../components/URLCard";

const DashboardPage = () => {
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Change this when you deploy
  const BASE_URL = "http://localhost:5000";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.token) navigate("/login");
  }, [user, navigate]);

  // Fetch user's URLs
  const fetchUrls = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/url/user`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUrls(res.data);
    } catch (err) {
      console.error("Error fetching URLs:", err);
      setError("Failed to load URLs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchUrls();
  }, [user]);

  // Handle new URL shorten
  const handleShorten = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    try {
      await axios.post(
        `${BASE_URL}/api/url/shorten`,
        { originalUrl, customAlias: customAlias || undefined },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setOriginalUrl("");
      setCustomAlias("");
      fetchUrls(); // Auto-refresh after new URL
    } catch (err) {
      console.error("Error shortening URL:", err);
      if (err.response?.status === 409) {
        setError("Custom alias already exists. Try another one.");
      } else {
        setError("Failed to shorten URL. Please try again.");
      }
    }
  };

  // Handle delete URL
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/url/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUrls((prev) => prev.filter((url) => url._id !== id)); // Update list locally
    } catch (err) {
      console.error("Error deleting URL:", err);
      setError("Failed to delete URL. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Dashboard
      </h1>

      {/* Shorten URL Form */}
      <form
        onSubmit={handleShorten}
        className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8"
      >
        <div className="flex-1 w-full">
          <input
            type="url"
            placeholder="Enter a long URL..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Custom alias (optional)"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition w-full sm:w-auto"
        >
          Shorten
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="text-center text-red-600 font-medium mb-4">{error}</p>
      )}

      {/* URLs List */}
      {loading ? (
        <p className="text-center text-gray-600">Loading your URLs...</p>
      ) : urls.length === 0 ? (
        <p className="text-center text-gray-600">No URLs created yet.</p>
      ) : (
        <div className="space-y-4">
          {urls.map((url) => (
            <URLCard key={url._id} url={url} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;




