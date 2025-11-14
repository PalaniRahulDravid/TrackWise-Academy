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
  withCredentials: true, // Enable sending cookies with requests
  timeout: 30000, // 30 seconds timeout
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

// Note: No need for token interceptor - cookies are sent automatically with withCredentials: true

// ======================================================
// ✅ Auth APIs
// ======================================================

// REGISTER — triggers OTP email
export async function register(name, email, password) {
  const response = await apiClient.post("/auth/register", {
    name,
    email,
    password
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

// LOGIN — returns user data (tokens are set in HTTP-Only cookies by backend)
export async function login(email, password) {
  const response = await apiClient.post("/auth/login", { email, password });
  // Cookies are automatically handled by the browser
  return response.data;
}

// LOGOUT — clears HTTP-Only cookies via backend
export async function logout() {
  try {
    await apiClient.post("/auth/logout");
    // Cookies are automatically cleared by the backend
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if logout fails, cookies might be cleared by backend
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

// REFRESH TOKEN — refresh tokens stored in HTTP-Only cookies
export async function refreshToken() {
  const response = await apiClient.post("/auth/refresh");
  // New tokens are automatically set in cookies by backend
  return response.data;
}

// ======================================================
// ✅ Export Configured Client
// ======================================================
export { apiClient };
