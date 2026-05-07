import { useState } from "react";
import { createLink } from "../services/linkService";

const LinkForm = ({ fetchLinks }) => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending request:", url);

      const res = await createLink({ url });

      console.log("Response:", res.data);

      // Show short URL instantly
      setShortUrl(res.data.shortUrl);

      // Clear input
      setUrl("");

      // Refresh list
      if (fetchLinks) {
        fetchLinks();
      }

    } catch (error) {
      console.error("FULL ERROR:", error);
      console.error("ERROR RESPONSE:", error.response?.data);

      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Copy function
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard!");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ marginLeft: "10px", padding: "8px" }}
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {/* Show result */}
      {shortUrl && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Short URL:</strong></p>

          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortUrl}
          </a>

          <br /><br />

          <button onClick={handleCopy}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkForm;