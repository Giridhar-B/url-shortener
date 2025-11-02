import React, { useState } from "react";
import axios from "axios";

const UrlForm = ({ onUrlCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("http://localhost:5000/api/url/shorten", {
        originalUrl,
        customAlias,
      });

      onUrlCreated(response.data); // pass created URL to parent
      setOriginalUrl("");
      setCustomAlias("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-xl mx-auto mt-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shorten Your URL</h2>

      <input
        type="url"
        placeholder="Enter the original URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Custom alias (optional)"
        value={customAlias}
        onChange={(e) => setCustomAlias(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
      >
        {loading ? "Shortening..." : "Shorten URL"}
      </button>
    </form>
  );
};

export default UrlForm;
