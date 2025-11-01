import { apiClient } from "./auth";

// API endpoints are relative to http://localhost:5000/api

export const getGameSessionStatus = async () => {
  const response = await apiClient.get("/auth/games/session/status");
  if (!response.data || !response.data.data) throw new Error('Invalid API response');
  return response.data.data;
};

export const startGameSession = async () => {
  const response = await apiClient.post("/auth/games/session/start", {});
  if (!response.data || !response.data.data) throw new Error('Invalid API response');
  return response.data.data;
};

export const endGameSession = async () => {
  const response = await apiClient.post("/auth/games/session/end", {});
  if (!response.data || !response.data.data) throw new Error('Invalid API response');
  return response.data.data;
};
