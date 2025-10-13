import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("trackwise_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(email, password) {
  const response = await apiClient.post("/auth/login", { email, password });
  const accessToken = response.data?.data?.tokens?.accessToken;
  if (accessToken) {
    localStorage.setItem("trackwise_token", accessToken);
  }
  return response.data;
}

export async function register(name, email, password) {
  const response = await apiClient.post("/auth/register", {
    name,
    email,
    password,
  });
  return response.data;
}

export async function getProfile() {
  const response = await apiClient.get("/auth/profile");
  return response.data;
}

export async function logout() {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("trackwise_token");
  }
}
