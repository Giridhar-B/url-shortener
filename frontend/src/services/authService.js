import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// REGISTER
export const registerUser = (data) =>
  API.post("/auth/register", data);

// LOGIN
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);

  localStorage.setItem("token", res.data.token);

  return res;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
};
