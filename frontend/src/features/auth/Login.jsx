import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import Toast from "../../components/Toast";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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
    try {
      const res = await login(form.email, form.password);
      if (res.success) {
        setUser(res.data.user);
        setSuccess(true);
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161f34]">
      <Toast
        show={success}
        message="Login successful! Redirecting..."
        type="success"
        onClose={() => setSuccess(false)}
        duration={1500}
      />
      {error && (
        <Toast
          show={!!error}
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-[#232b41] p-8 rounded-2xl shadow-lg w-full max-w-sm"
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
          className="w-full p-3 mb-4 rounded bg-[#1d2436] text-white border-none outline-none"
          placeholder="you@example.com"
        />
        <label className="block text-white mb-1">Password</label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded bg-[#1d2436] text-white border-none outline-none"
          placeholder="********"
        />
        <button
          type="submit"
          className={`w-full bg-[#ff7900] text-white py-3 rounded-xl font-semibold mt-2 transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#ff9000]"
          }`}
          disabled={loading || success}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        <div className="mt-5 text-sm text-center text-gray-300">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#ff7900] hover:underline">
            Create Account
          </a>
        </div>
      </form>
    </div>
  );
}
