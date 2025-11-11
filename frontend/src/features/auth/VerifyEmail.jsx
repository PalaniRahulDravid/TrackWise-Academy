import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../api/auth";
import Toast from "../../components/Toast";
import Button from "../../components/Button";
import Header from "../../components/Header";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    new URLSearchParams(location.search).get("email") ||
    "";

  // Countdown timer for resend button
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // --- Handle OTP Verification ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.message || "Invalid OTP");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Resend OTP ---
  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    setResending(true);
    setError("");
    try {
      const res = await resendOtp(email);
      if (res.success) {
        setSuccess(true);
        setCooldown(30); // 30-second cooldown
      } else {
        setError(res.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not resend OTP. Please try again later."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Header fixed />

      {/* Toasts */}
      <Toast
        show={success}
        message="OTP sent successfully! Check your inbox."
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

      {/* Main content */}
      <main className="w-full bg-black text-white flex flex-col items-center justify-center px-4 min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg w-full max-w-sm p-8 flex flex-col"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            Verify Email
          </h2>

          <p className="text-sm mb-5 text-gray-400 text-center">
            Enter the 6-digit OTP sent to <br />
            <span className="text-orange-400 font-semibold">{email}</span>
          </p>

          <input
            type="text"
            maxLength={6}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-900/50 border border-gray-800 text-center text-xl tracking-widest text-white outline-none"
            placeholder="123456"
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          {/* Resend OTP Button */}
          <div className="text-center mt-5">
            {cooldown > 0 ? (
              <p className="text-sm text-gray-400">
                Resend available in <span className="text-orange-400">{cooldown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-[#ff7900] hover:text-white transition disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>

          <p
            className="text-xs text-gray-400 mt-4 text-center cursor-pointer hover:text-orange-400"
            onClick={() => navigate("/register")}
          >
            Wrong email? Register again
          </p>
        </form>
      </main>
    </>
  );
}
