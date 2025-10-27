import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import Toast from "../../components/Toast";
import Header from "../../components/Header";

function getTokenFromURL(location) {
  const params = new URLSearchParams(
    location.search || window.location.search
  );
  return params.get("token");
}

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const token = getTokenFromURL(location);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!token) {
      setError("Reset link invalid or expired.");
      return;
    }
    if (pw !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(token, pw);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.message || "Reset failed.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reset password."
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
        message="Password reset successful! Login now."
        type="success"
        onClose={() => setSuccess(false)}
        duration={1600}
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
          Set New Password
        </h2>
        <label className="block text-white mb-1">New Password</label>
        <input
          type="password"
          name="pw"
          required
          minLength={6}
          value={pw}
          onChange={e => setPw(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-[#1d2436] text-white border-none outline-none"
          placeholder="********"
        />
        <label className="block text-white mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirmPw"
          required
          minLength={6}
          value={confirmPw}
          onChange={e => setConfirmPw(e.target.value)}
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
          {loading ? "Saving..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
