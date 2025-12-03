import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import Toast from "../../components/Toast";
import useAuth from "../../hooks/useAuth";
import Header from "../../components/Header";
import Button from "../../components/Button";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    // Safety timeout to prevent infinite loading state
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("Request took too long. Please try again.");
      }
    }, 35000); // 35 seconds
    
    try {
      const res = await login(form.email, form.password);
      clearTimeout(safetyTimeout);
      
      if (res.success) {
        setUser(res.data.user);
        setSuccess(true);
        setLoading(false);
        // Faster redirect - 600ms
        setTimeout(() => navigate("/"), 600);
      } else {
        setError(res.message || "Invalid credentials");
        setLoading(false);
      }
    } catch (err) {
      clearTimeout(safetyTimeout);
      
      // Handle timeout errors (Render.com cold start)
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError("Request timeout. The server may be waking up. Please wait 10 seconds and try again.");
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError("Network error. Please check your internet connection and try again.");
      } else if (err.response?.status === 0) {
        setError("Cannot reach server. Please check your connection or try again later.");
      } else {
        const msg = err?.response?.data?.message || err?.message || "Login failed. Please try again.";
        
        // Check if user needs to verify email
        if (msg.toLowerCase().includes("not verified") || msg.toLowerCase().includes("verify your email")) {
          setError("Please verify your email first. Check your inbox for OTP.");
        } else {
          setError(msg);
        }
      }
      setLoading(false);
    } finally {
      clearTimeout(safetyTimeout);
    }
  };

  return (
    <>
      <Header fixed />
      <Toast
        show={success}
        message="✅ Welcome back! Redirecting..."
        type="success"
        onClose={() => setSuccess(false)}
        duration={1000}
      />
      {error && (
        <Toast
          show={!!error}
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}
      {/* Decorative icons */}
      <div className="absolute top-28 left-8 text-orange-400 text-xl sm:text-2xl animate-pulse z-0">✦</div>
      <div className="absolute top-52 right-10 text-yellow-400 text-lg sm:text-2xl animate-pulse z-0">✦</div>
      <div className="absolute bottom-28 left-1/4 text-orange-400 text-base sm:text-xl animate-pulse z-0">+</div>
      <div className="absolute bottom-32 right-8 text-yellow-400 text-lg sm:text-2xl animate-pulse z-0">+</div>

      <main
        className="w-full bg-black text-white flex items-center justify-center px-4 overflow-hidden"
        style={{ height: "calc(100vh - 96px)" }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-lg w-full max-w-sm p-6 flex flex-col"
          autoComplete="off"
        >
          <h2 className="text-3xl font-bold mb-4 text-center text-white">
            Login
          </h2>
          <label className="block text-white mb-1 text-sm">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full p-2.5 mb-3 rounded bg-gray-900/50 border border-gray-800 text-white outline-none focus:border-orange-500"
            placeholder="you@example.com"
          />
          <label className="block text-white mb-1 text-sm">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="w-full p-2.5 mb-2 rounded bg-gray-900/50 border border-gray-800 text-white outline-none focus:border-orange-500 pr-12"
              placeholder="********"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition mt-[-5px]"
              onClick={() => setShowPassword((show) => !show)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye-off SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-7s4.477-7 10-7c1.294 0 2.515.196 3.625.559M19.183 19.183A9.918 9.918 0 0022 12c0-2-4.477-7-10-7-.819 0-1.621.072-2.403.207M3.172 3.172L21.999 21.999" />
                </svg>
              ) : (
                // Eye SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12S5.5 5.5 12 5.5 22.5 12 22.5 12 18.5 18.5 12 18.5 1.5 12 1.5 12z" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-xs text-[#ff7900] hover:text-white hover:animate-pulse mb-3"
            >
              Forgot password?
            </a>
          </div>
          <Button
            type="submit"
            className="w-full mt-1"
            variant="primary"
            disabled={loading || success}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

          {/* Divider */}
          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Google Sign In Button */}
          <a
            href={`${import.meta.env.VITE_API_URL || "https://trackwise-academy.onrender.com/api"}/auth/google`}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-gray-900/50 border border-gray-800 text-white rounded-lg font-medium hover:bg-gray-800/50 hover:border-orange-500 transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>
          
          {/* Verify Email Link */}
          <div className="mt-2 text-center">
            <a 
              href="/verify-email" 
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
            >
              Need to verify your email?
            </a>
          </div>
          
          <div className="mt-2 text-sm text-center text-gray-300">
            Don't have an account?{" "}
            <a href="/register" className="text-[#ff7900] hover:text-white hover:animate-pulse">
              Create Account
            </a>
          </div>
        </form>
      </main>
    </>
  );
}
