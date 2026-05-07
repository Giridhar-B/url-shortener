import { Link } from "react-router-dom";

const LinkList = ({ links }) => {
  // Copy to clipboard
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert("Copied to clipboard!");
  };

  return (
    <div>
      <h2>Your Links</h2>

      {links.length === 0 ? (
        <p>No links found</p>
      ) : (
        links.map((link) => {
          const shortUrl = `http://localhost:5000/${link.shortId}`;

          return (
            <div
              key={link.shortId}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              {/* Original URL */}
              <p>
                <strong>Original:</strong>{" "}
                <a
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.originalUrl}
                </a>
              </p>

              {/* Short URL */}
              <p>
                <strong>Short:</strong>{" "}
                <a
                  href={`http://localhost:5000/${link.shortId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortUrl}
                </a>
              </p>

              {/* Copy Button */}
              <button onClick={() => copyToClipboard(shortUrl)}>
                Copy
              </button>

              {/* Click count */}
              <p>
                <strong>Clicks:</strong> {link.clicks}
              </p>

              {/* Analytics */}
              <Link to={`/analytics/${link.shortId}`}>
                View Analytics
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LinkList;