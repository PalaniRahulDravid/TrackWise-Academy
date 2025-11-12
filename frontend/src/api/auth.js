import axios from "axios";

// ======================================================
// ✅ Base URL Configuration - Works for both local and production
// ======================================================
const getBaseURL = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect: if running on localhost, use local backend
  // Otherwise, use production backend
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  return isDevelopment 
    ? "http://localhost:5000/api"  // Local development
    : "https://trackwise-academy.onrender.com/api"; // Production
};

const BASE_URL = getBaseURL();
console.log('🔗 API Base URL:', BASE_URL);

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 90000, // 90 seconds timeout (for Render.com cold starts)
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// ======================================================
// ✅ Token Interceptor (Attach JWT to every request)
// ======================================================
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("trackwise_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======================================================
// ✅ Auth APIs
// ======================================================

// REGISTER — triggers OTP email
export async function register(
  name,
  email,
  password,
  age,
  education,
  experience,
  interests
) {
  const response = await apiClient.post("/auth/register", {
    name,
    email,
    password,
    age,
    education,
    experience,
    interests,
  });
  return response.data;
}

// VERIFY OTP — confirms email verification
export async function verifyOtp(email, otp) {
  const response = await apiClient.post("/auth/verify-otp", { email, otp });
  return response.data;
}

// ✅ RESEND OTP — resends OTP email
export async function resendOtp(email) {
  const response = await apiClient.post("/auth/resend-otp", { email });
  return response.data;
}

// LOGIN — returns tokens + user data
export async function login(email, password) {
  const response = await apiClient.post("/auth/login", { email, password });

  const accessToken = response.data?.data?.tokens?.accessToken;
  if (accessToken) {
    localStorage.setItem("trackwise_token", accessToken);
  }

  return response.data;
}

// LOGOUT — removes token both from backend & local storage
export async function logout() {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("trackwise_token");
  }
}

// GET PROFILE — fetch authenticated user data
export async function getProfile() {
  const response = await apiClient.get("/auth/profile");
  return response.data;
}

// FORGOT PASSWORD — sends reset link to email
export async function forgotPassword(email) {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
}

// RESET PASSWORD — resets using token
export async function resetPassword(token, newPassword) {
  const response = await apiClient.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
}

// REFRESH TOKEN — optional helper if needed later
export async function refreshToken(refreshToken) {
  const response = await apiClient.post("/auth/refresh", { refreshToken });
  const newAccess = response.data?.data?.tokens?.accessToken;
  if (newAccess) {
    localStorage.setItem("trackwise_token", newAccess);
  }
  return response.data;
}

// ======================================================
// ✅ Export Configured Client
// ======================================================
export { apiClient };
