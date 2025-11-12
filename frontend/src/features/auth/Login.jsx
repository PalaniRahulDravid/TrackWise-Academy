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
    
    console.log('🚀 Starting login...', { email: form.email });
    
    // Safety timeout to prevent infinite loading state
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Safety timeout triggered');
        setLoading(false);
        setError("Request took too long. Please try again.");
      }
    }, 35000); // 35 seconds
    
    try {
      const res = await login(form.email, form.password);
      console.log('✅ Login response:', res);
      
      if (res.success) {
        setUser(res.data.user);
        setSuccess(true);
        setTimeout(() => navigate("/"), 1100);
      } else {
        setError(res.message || "Invalid credentials");
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      
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
        message="Login successful! Redirecting..."
        type="success"
        onClose={() => setSuccess(false)}
        duration={1300}
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
        className="w-full bg-black text-white flex flex-col items-center justify-center px-4"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg w-full max-w-sm p-8 flex flex-col"
          style={{ marginTop: "24px" }}
          autoComplete="off"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            Login
          </h2>
          <label className="block text-white mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-900/50 border border-gray-800 text-white outline-none"
            placeholder="you@example.com"
          />
          <label className="block text-white mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 mb-2 rounded bg-gray-900/50 border border-gray-800 text-white outline-none pr-12"
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
              className="text-xs text-[#ff7900] hover:text-white hover:animate-pulse mb-4"
            >
              Forgot password?
            </a>
          </div>
          <Button
            type="submit"
            className="w-full mt-2 text-lg"
            variant="primary"
            disabled={loading || success}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
          
          {/* Verify Email Link */}
          <div className="mt-3 text-center">
            <a 
              href="/verify-email" 
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
            >
              Need to verify your email?
            </a>
          </div>
          
          <div className="mt-3 text-sm text-center text-gray-300">
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
