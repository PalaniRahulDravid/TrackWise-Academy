import { apiClient } from "./auth";

// Do NOT throw errors automatically.
// Just return whatever backend sends.

export const getGameSessionStatus = async () => {
  try {
    const response = await apiClient.get("/auth/games/session/status");
    return response.data.data;
  } catch (err) {
    // Return clean error object instead of throwing
    return {
      error: true,
      message: err?.response?.data?.message || "Failed to fetch session",
      status: err?.response?.status || 500
    };
  }
};

export const startGameSession = async () => {
  try {
    const response = await apiClient.post("/auth/games/session/start", {});
    return response.data.data;
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || "Failed to start session",
      status: err?.response?.status || 500
    };
  }
};

export const endGameSession = async () => {
  try {
    const response = await apiClient.post("/auth/games/session/end", {});
    return response.data.data;
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || "Failed to end session",
      status: err?.response?.status || 500
    };
  }
};
