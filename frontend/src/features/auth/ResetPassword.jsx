import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import Toast from "../../components/Toast";
import Button from "../../components/Button";
import Header from "../../components/Header";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm)
      return setError("Passwords do not match!");
    setLoading(true);
    setError("");
    try {
      const res = await resetPassword(token, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.message || "Reset failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header fixed />
      <Toast
        show={success}
        message="Password reset successful!"
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
          className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg w-full max-w-sm p-8 flex flex-col"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            Reset Password
          </h2>
          <label className="block text-white mb-1">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-900/50 border border-gray-800 text-white outline-none"
            placeholder="********"
          />
          <label className="block text-white mb-1">Confirm Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-900/50 border border-gray-800 text-white outline-none"
            placeholder="********"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </main>
    </>
  );
}
