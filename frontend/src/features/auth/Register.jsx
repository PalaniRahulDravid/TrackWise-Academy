import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import Toast from "../../components/Toast";
import Header from "../../components/Header";
import Button from "../../components/Button";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.name.trim() || !form.email.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(form.name.trim(), form.email.trim(), form.password.trim());

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(form.email)}`, {
            state: { email: form.email },
          });
        }, 1200);
      } else {
        setError(res.message || "Registration failed.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed, check details & try again.";

      if (msg.toLowerCase().includes("already registered")) {
        setError("Email already registered. Try logging in instead.");
      } else if (msg.toLowerCase().includes("not verified")) {
        setError("Email already exists but not verified. Please check your inbox for OTP.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header fixed />
      <Toast
        show={success}
        message="Registration successful! OTP sent to your email."
        type="success"
        onClose={() => setSuccess(false)}
        duration={1800}
      />
      {error && (
        <Toast
          show={!!error}
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}

      {/* ✦ Decorative icons ✦ */}
      <div className="absolute top-28 left-8 text-orange-400 text-xl sm:text-2xl animate-pulse z-0">
        ✦
      </div>
      <div className="absolute top-52 right-10 text-yellow-400 text-lg sm:text-2xl animate-pulse z-0">
        ✦
      </div>
      <div className="absolute bottom-28 left-1/4 text-orange-400 text-base sm:text-xl animate-pulse z-0">
        +
      </div>
      <div className="absolute bottom-32 right-8 text-yellow-400 text-lg sm:text-2xl animate-pulse z-0">
        +
      </div>

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
            Create Account
          </h2>

          {/* Full Name */}
          <label className="block text-white mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            minLength={2}
            required
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-900/50 border border-gray-800 text-white outline-none"
            placeholder="Your full name"
          />

          {/* Email */}
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

          {/* Password */}
          <label className="block text-white mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              minLength={6}
              required
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded bg-gray-900/50 border border-gray-800 text-white outline-none pr-12"
              placeholder="********"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-[-7px] text-gray-400 hover:text-orange-400 transition"
              onClick={() => setShowPassword((show) => !show)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-7s4.477-7 10-7c1.294 0 2.515.196 3.625.559M19.183 19.183A9.918 9.918 0 0022 12c0-2-4.477-7-10-7-.819 0-1.621.072-2.403.207M3.172 3.172L21.999 21.999" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12S5.5 5.5 12 5.5 22.5 12 22.5 12 18.5 18.5 12 18.5 1.5 12 1.5 12z" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <label className="block text-white mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              minLength={6}
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 mb-6 rounded bg-gray-900/50 border border-gray-800 text-white outline-none pr-12"
              placeholder="********"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-[-12px] text-gray-400 hover:text-orange-400 transition"
              onClick={() => setShowConfirmPassword((show) => !show)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-7s4.477-7 10-7c1.294 0 2.515.196 3.625.559M19.183 19.183A9.918 9.918 0 0022 12c0-2-4.477-7-10-7-.819 0-1.621.072-2.403.207M3.172 3.172L21.999 21.999" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12S5.5 5.5 12 5.5 22.5 12 22.5 12 18.5 18.5 12 18.5 1.5 12 1.5 12z" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
              )}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full mt-2 text-lg"
            variant="primary"
            disabled={loading || success}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="mt-5 text-sm text-center text-gray-300">
            Already have an account?{" "}
            <a href="/login" className="text-[#ff7900] hover:text-white hover:animate-pulse">
              Login
            </a>
          </div>
        </form>
      </main>
    </>
  );
}
