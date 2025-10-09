import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth/register`
  : "http://localhost:5000/api/auth/register";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        API_URL,
        { name, email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed, check credentials & try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161f34]">
      <form
        className="bg-[#232b41] p-8 rounded-2xl shadow-lg w-full max-w-sm"
        onSubmit={handleRegister}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Register</h2>
        {error && (
          <div className="bg-red-200 text-red-800 p-2 rounded mb-2 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-200 text-green-800 p-2 rounded mb-2 text-sm text-center">
            Registration successful! Redirecting...
          </div>
        )}
        <label className="block text-white mb-1">Full Name</label>
        <input
          className="w-full p-3 mb-4 rounded bg-[#1d2436] text-white border-none outline-none"
          type="text"
          placeholder="Your full name"
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          disabled={loading || success}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
        <div className="mt-5 text-sm text-center text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-[#ff7900] hover:underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
