import { useState } from "react";
import { forgotPassword } from "../../api/auth";
import Toast from "../../components/Toast";
import Header from "../../components/Header";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(res.message || "Request failed.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Try again."
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
        message="Reset link sent to your email!"
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
        className="bg-[#232b41] p-8 rounded-2xl shadow-lg w-full max-w-sm mt-28"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Forgot Password
        </h2>
        <label className="block text-white mb-1">Registered Email</label>
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-[#1d2436] text-white border-none outline-none"
          placeholder="your@email.com"
        />
        <button
          type="submit"
          className={`w-full bg-[#ff7900] text-white py-3 rounded-xl font-semibold mt-2 transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#ff9000]"
          }`}
          disabled={loading || success}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
