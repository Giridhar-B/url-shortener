import axios from "axios";

// BASE API INSTANCE
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// AUTH INTERCEPTOR
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// CREATE SHORT URL
export const createShortUrl = (data) => {
  return API.post("/links", data);
};

// GET ALL LINKS
export const getLinks = () => {
  return API.get("/links");
};

// DELETE LINK
export const deleteLink = (id) => {
  return API.delete(`/links/${id}`);
};

// TOGGLE ACTIVE / INACTIVE
export const toggleLink = (id) => {
  return API.patch(`/links/${id}/toggle`);
};

// GLOBAL ANALYTICS
export const getGlobalAnalytics = () => {
  return API.get("/analytics");
};

// PER-LINK ANALYTICS
export const getAnalytics = (code, range = "7") => {
  // normalize value
  const normalizedRange =
    range === "all"
      ? "all"
      : String(parseInt(range) || 7);

  return API.get(`/analytics/${code}`, {
    params: {
      range: normalizedRange,
    },
  });
};

export default API;