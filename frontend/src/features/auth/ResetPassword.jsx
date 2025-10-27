import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import Toast from "../../components/Toast";
import Header from "../../components/Header";
import Button from "../../components/Button";

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
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
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
    <>
      <Header fixed />
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
      {/* Animated brand icons */}
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
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Set New Password
          </h2>
          <label className="block text-white mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              name="pw"
              required
              minLength={6}
              value={pw}
              onChange={e => setPw(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-gray-900/50 border border-gray-800 text-white outline-none pr-12"
              placeholder="********"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-[-8px] text-gray-400 hover:text-orange-400 transition"
              onClick={() => setShowPw((show) => !show)}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? (
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
          <label className="block text-white mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPw ? "text" : "password"}
              name="confirmPw"
              required
              minLength={6}
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              className="w-full p-3 mb-6 rounded bg-gray-900/50 border border-gray-800 text-white outline-none pr-12"
              placeholder="********"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-[-12px] text-gray-400 hover:text-orange-400 transition"
              onClick={() => setShowConfirmPw((show) => !show)}
              aria-label={showConfirmPw ? "Hide password" : "Show password"}
            >
              {showConfirmPw ? (
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
          <Button
            type="submit"
            className="w-full mt-2 text-lg"
            variant="primary"
            disabled={loading || success}
          >
            {loading ? "Saving..." : "Reset Password"}
          </Button>
        </form>
      </main>
    </>
  );
}
