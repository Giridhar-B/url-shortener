import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api", // Change this to your deployed backend later
// });

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// Create short URL (supports custom alias)
export const shortenUrl = (originalUrl, customAlias = "") =>
  API.post("/shorten", { originalUrl, customAlias });

// Get all shortened URLs (for dashboard or history)
export const getAllUrls = () => API.get("/urls");

// Get analytics for a specific short URL (click count, recent clicks, etc.)
export const getUrlAnalytics = (shortId) => API.get(`/analytics/${shortId}`);

// Get QR code for a short URL
export const getQrCode = (shortId) => API.get(`/qrcode/${shortId}`, { responseType: "blob" });
