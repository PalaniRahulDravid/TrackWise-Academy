import { useState } from "react";
import { forgotPassword } from "../../api/auth";
import Toast from "../../components/Toast";
import Header from "../../components/Header";
import Button from "../../components/Button";

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
    <>
      <Header fixed />
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
      {/* Animated background icons */}
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
            Forgot Password
          </h2>
          <label className="block text-white mb-1">Registered Email</label>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 mb-6 rounded bg-gray-900/50 border border-gray-800 text-white outline-none"
            placeholder="your@email.com"
          />
          <Button
            type="submit"
            className="w-full mt-2 text-lg"
            variant="primary"
            disabled={loading || success}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </main>
    </>
  );
}
