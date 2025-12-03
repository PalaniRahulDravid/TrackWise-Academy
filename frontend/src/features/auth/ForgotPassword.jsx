import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/auth";
import Toast from "../../components/Toast";
import Button from "../../components/Button";
import Header from "../../components/Header";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Error sending reset link");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header fixed />
      <Toast
        show={success}
        message="Reset link sent to your email!"
        type="success"
        onClose={() => setSuccess(false)}
      />
      {error && (
        <Toast
          show={!!error}
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}
      <main className="w-full bg-black text-white flex flex-col items-center justify-center px-4 min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-lg w-full max-w-sm p-8 flex flex-col"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            Forgot Password
          </h2>
          <label className="block text-white mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-900/50 border border-gray-800 text-white outline-none"
            placeholder="you@example.com"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          <p
            onClick={() => navigate("/login")}
            className="text-xs text-[#ff7900] hover:text-white text-center mt-4 cursor-pointer"
          >
            Back to Login
          </p>
        </form>
      </main>
    </>
  );
}
