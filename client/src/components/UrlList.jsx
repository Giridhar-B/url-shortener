import React from "react";

const UrlList = ({ urls }) => {
  if (!urls.length)
    return <p className="text-gray-400 mt-6">No URLs shortened yet!</p>;

  return (
    <div className="mt-6 w-full max-w-md bg-white rounded-2xl shadow-md p-4">
      {urls.map((url) => (
        <div
          key={url._id}
          className="flex justify-between items-center border-b py-2"
        >
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 truncate max-w-[60%]"
          >
            {url.originalUrl}
          </a>
          <a
            href={url.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
          >
            {url.shortUrl}
          </a>
        </div>
      ))}
    </div>
  );
};

export default UrlList;
