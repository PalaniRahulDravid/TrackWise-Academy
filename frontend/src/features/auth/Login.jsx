import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth/login`
  : "http://localhost:5000/api/auth/login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        API_URL,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success && res.data.tokens?.accessToken) {
        localStorage.setItem("trackwise_token", res.data.tokens.accessToken);
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Login failed.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Check credentials & try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161f34]">
      <form
        className="bg-[#232b41] p-8 rounded-2xl shadow-lg w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>
        {error && (
          <div className="bg-red-200 text-red-800 p-2 rounded mb-2 text-sm text-center">
            {error}
          </div>
        )}
        <label className="block text-white mb-1">Email</label>
        <input
          className="w-full p-3 mb-4 rounded bg-[#1d2436] text-white border-none outline-none"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="block text-white mb-1">Password</label>
        <input
          className="w-full p-3 mb-6 rounded bg-[#1d2436] text-white border-none outline-none"
          type="password"
          placeholder="********"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={`w-full bg-[#ff7900] text-white py-3 rounded-xl font-semibold mt-2 transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#ff9000]"
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="mt-5 text-sm text-center text-gray-300">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-[#ff7900] hover:underline">
            Create Account
          </a>
        </div>
      </form>
    </div>
  );
}
