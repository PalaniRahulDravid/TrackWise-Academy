import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../api/auth";
import Toast from "../../components/Toast";
import Header from "../../components/Header";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailState = location.state?.email || "";
  const [email, setEmail] = useState(emailState);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError(res.message || "Invalid OTP");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Verification failed. Try again."
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
        message="Email verified! You can login now."
        type="success"
        onClose={() => setSuccess(false)}
        duration={1300}
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
        style={{ zIndex: 2 }}
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Verify Your Email
        </h2>
        <label className="block text-white mb-1">Email</label>
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-[#1d2436] text-white border-none outline-none"
          placeholder="you@example.com"
        />
        <label className="block text-white mb-1">OTP</label>
        <input
          type="text"
          name="otp"
          required
          maxLength={6}
          minLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-[#1d2436] text-white border-none outline-none"
          placeholder="Enter OTP code"
        />
        <button
          type="submit"
          className={`w-full bg-[#ff7900] text-white py-3 rounded-xl font-semibold mt-2 transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#ff9000]"
          }`}
          disabled={loading || success}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
