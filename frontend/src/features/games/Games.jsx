import { useState, useEffect } from "react";
import Header from "../../components/Header";
import FeatureCard from "../../components/FeatureCard";
import Toast from "../../components/Toast";
import { FaLaughBeam, FaBrain } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import * as gameSessionApi from "../../api/gameSession"; // Use direct API calls

export default function Games() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  
  // Session state
  const [status, setStatus] = useState("inactive"); // active, inactive, cooldown
  const [timeLeft, setTimeLeft] = useState(0);      // seconds
  const [cooldown, setCooldown] = useState(0);

  // --- TIMER HANDLING ---
  useEffect(() => {
    // Fetch initial status
    const fetchGameStatus = async () => {
      try {
        const data = await gameSessionApi.getGameSessionStatus();
        setStatus(data.status);
        setTimeLeft(data.timeLeft);
        setCooldown(data.cooldown);
      } catch (err) {
        setToast({ show: true, message: err?.response?.data?.message || "Failed to fetch game session status", type: "error" });
      }
    };
    fetchGameStatus();
    // Poll every 3s to update status bar
    const poll = setInterval(fetchGameStatus, 3000);
    return () => clearInterval(poll);
  }, []);
  
  // If inactive, try to open a session
  useEffect(() => {
    const tryStart = async () => {
      if (status === "inactive" && user) {
        try {
          await gameSessionApi.startGameSession();
          // Session started, next poll will catch the update.
        } catch (err) {
          setToast({ show: true, message: err?.response?.data?.message || "Failed to start session", type: "error" });
        }
      }
    };
    tryStart();
  }, [status, user]);

  // Handle timer UI values
  const timerLabel = status === "active"
    ? `Game session in progress: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
    : status === "cooldown"
      ? `Games on cooldown. Wait ${Math.floor(cooldown / 60)}:${(cooldown % 60).toString().padStart(2, '0')} to play again`
      : "Games ready! Click to play.";

  const handleCardClick = (path) => {
    if (!user) {
      setToast({ show: true, message: "Please login to play the games.", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "error" }), 2500);
      return;
    }
    if (status === "cooldown") {
      setToast({ show: true, message: "You are in cooldown. Please wait.", type: "error" });
      return;
    }
    navigate(path);
  };

  return (
    <>
      <div className="relative z-[9999]">
        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "error" })}
        />
      </div>
      <Header />
      <div className="flex flex-col justify-center items-center bg-black text-white relative overflow-hidden" style={{ minHeight: "calc(100vh - 96px)" }}>
        {/* Games Session Rule Notice + Timer */}
        <div className="w-full flex flex-col items-center mt-8 mb-2">
          <div className="bg-yellow-800/80 text-yellow-300 rounded px-6 py-2 text-base font-medium border border-yellow-400/30 shadow-lg max-w-xl mx-auto mb-2">
            Games Feature: You get <span className="font-bold text-white">1 min</span> of play time, then <span className="font-bold text-white">1 min</span> cooldown before you can play again!
          </div>
          <div className={`mt-2 text-lg font-semibold ${status === "cooldown" ? "text-red-400" : "text-green-400"}`}>
            {timerLabel}
          </div>
        </div>

        {/* Main Section */}
        <main className="px-4 sm:px-5 py-10 max-w-3xl mx-auto text-center z-10 relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Games</span>
          </h1> 
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Choose from categories to play and sharpen your mind!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center items-center">
            <FeatureCard
              title="Funny Games"
              desc="Relax and have fun with these classic funny games!"
              gradient="from-pink-500 to-orange-400"
              icon={<FaLaughBeam />}
              onClick={() => handleCardClick("/games/funny")}
              disabled={status === "cooldown"}
            />
            <FeatureCard
              title="Mind Games"
              desc="Boost your brain with challenging mind games."
              gradient="from-blue-400 to-cyan-400"
              icon={<FaBrain />}
              onClick={() => handleCardClick("/games/mind")}
              disabled={status === "cooldown"}
            />
          </div>
        </main>
      </div>
    </>
  );
}
