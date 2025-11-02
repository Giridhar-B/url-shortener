import React, { useState } from "react";

const URLCard = ({ url, onDelete }) => {
  const [copied, setCopied] = useState(false);

  // Safeguards for missing data
  if (!url) {
    return (
      <div className="p-4  text-red-400 rounded-xl border border-red-500/40">
        URL data not available
      </div>
    );
  }

  const {
    originalUrl = "",
    shortUrl = "",
    clicks = 0,
    createdAt,
    updatedAt,
    qrCode,
  } = url;

  // Copy short URL
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download QR Code
  const handleDownloadQR = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qr_code.png";
    link.click();
  };

return (
  <div className="bg-white text-gray-900 border border-gray-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] flex flex-col sm:flex-row sm:items-center sm:justify-between">

    {/* Left Section: URL Info */}
    <div className="flex-1 space-y-2">
      {/* Original URL */}
      <p className="text-sm text-gray-700 break-all">
        <span className="font-semibold text-gray-800">Original:</span>{" "}
        {originalUrl?.length > 60
          ? `${originalUrl.slice(0, 60)}...`
          : originalUrl || "N/A"}
      </p>

      {/* Short URL + Copy button */}
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-800">Short:</span>{" "}
          <a
            href={shortUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            {shortUrl || "N/A"}
          </a>
        </p>
        <button
          onClick={handleCopy}
          className={`text-xs px-2 py-1 rounded-md ${
            copied
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          } transition`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Analytics Info */}
      <p className="text-sm text-gray-700">
        <span className="font-semibold text-gray-800">Clicks:</span>{" "}
        {clicks || 0}
      </p>

      {createdAt && (
        <p className="text-xs text-gray-600">
          <span className="font-semibold text-gray-700">Created:</span>{" "}
          {new Date(createdAt).toLocaleString()}
        </p>
      )}

      {updatedAt && updatedAt !== createdAt && (
        <p className="text-xs text-gray-600">
          <span className="font-semibold text-gray-700">Last Clicked:</span>{" "}
          {new Date(updatedAt).toLocaleString()}
        </p>
      )}
    </div>

    {/* Right Section: QR + Delete */}
    <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col items-center gap-3">
      {qrCode && (
        <div
          onClick={handleDownloadQR}
          className="cursor-pointer group relative"
        >
          <img
            src={qrCode}
            alt="QR Code"
            className="w-24 h-24 rounded-lg border border-gray-300 shadow-sm group-hover:shadow-md transition-all duration-200 object-contain"
          />
          <p className="absolute inset-0 bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition">
            Click to Download
          </p>
        </div>
      )}

      <button
        onClick={() => onDelete(url._id)}
        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
      >
        Delete
      </button>
    </div>
  </div>
);

};

export default URLCard;
