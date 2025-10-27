import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import Toast from "../../components/Toast";
import Header from "../../components/Header";

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Frontend confirm password validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(form.name, form.email, form.password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/verify-email", {
            state: { email: form.email },
          });
        }, 1200);
      } else {
        setError(res.message || "Registration failed.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed, check details & try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161f34] flex flex-col items-center justify-center">
      <Header />
      <Toast
        show={success}
        message="Registration successful! OTP sent to email."
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
      <form
        onSubmit={handleSubmit}
        className="bg-[#232b41] shadow-lg p-8 rounded-2xl w-full max-w-sm mt-28"
        style={{ zIndex: 3 }}
        autoComplete="off"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Create Account
        </h2>
        <label className="block text-white mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          minLength={2}
          required
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-[#1d2436] text-white border-none outline-none"
          placeholder="Your full name"
        />
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
          minLength={6}
          required
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-[#1d2436] text-white border-none outline-none"
          placeholder="********"
        />
        <label className="block text-white mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          minLength={6}
          required
          value={form.confirmPassword}
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
