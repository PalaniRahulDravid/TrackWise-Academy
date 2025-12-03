import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import FeatureCard from "../../components/FeatureCard";
import Toast from "../../components/Toast";
import { FaLaughBeam, FaBrain } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import * as gameSessionApi from "../../api/gameSession";

export default function Games() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const [status, setStatus] = useState("inactive"); // active | inactive | cooldown
  const [timeLeft, setTimeLeft] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  const [sessionStarted, setSessionStarted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const lastToastRef = useRef("");
  const cooldownToastShown = useRef(false);

  // =====================================
  //  LOCAL STORAGE PERSISTENCE FIX
  // =====================================
  useEffect(() => {
    const saved = localStorage.getItem("gameStarted");
    if (saved === "true") setGameStarted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("gameStarted", gameStarted ? "true" : "false");
  }, [gameStarted]);

  // Toast Helper
  const showToast = (message, type = "error") => {
    if (lastToastRef.current === message) return;
    lastToastRef.current = message;

    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
      lastToastRef.current = "";
    }, 3000);
  };

  // POLLING GAME SESSION
  useEffect(() => {
    if (!user) return;

    const loadStatus = async () => {
      try {
        const data = await gameSessionApi.getGameSessionStatus();
        const prevStatus = status;

        setStatus(data.status);
        setTimeLeft(data.timeLeft);
        setCooldown(data.cooldown);

        if (data.status === "active") {
          setSessionStarted(true);
          cooldownToastShown.current = false;
        }

        // ❌ Removed automatic toast – user does NOT get toast here

        // RESET gameStarted when cooldown starts
        if (data.status === "cooldown") {
          setGameStarted(false);
          localStorage.setItem("gameStarted", "false");
        }

        // RESET everything when session restarts
        if (data.status === "inactive") {
          setGameStarted(false);
          localStorage.setItem("gameStarted", "false");
        }
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to fetch session";
        showToast(msg);
      }
    };

    loadStatus();
    const poll = setInterval(loadStatus, 1000);
    return () => clearInterval(poll);
  }, [user, status]);

  // Auto-start new session
  useEffect(() => {
    if (status === "inactive" && user && !sessionStarted) {
      const start = async () => {
        try {
          await gameSessionApi.startGameSession();
          setSessionStarted(true);
        } catch (err) {
          const msg = err?.response?.data?.message || "Failed to start session";
          showToast(msg);
        }
      };
      start();
    }
  }, [status, user, sessionStarted]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // =====================================
  //   UPDATED CLICK HANDLER (YOUR REQUEST)
  // =====================================
  const handleCardClick = (path) => {
    if (!user) return showToast("Please login to play games");

    // Toast ONLY on manual click during cooldown
    if (status === "cooldown") {
      return showToast("Sorry, your free time is over");
    }

    if (status === "inactive") return;

    if (!gameStarted) setGameStarted(true);

    navigate(path);
  };

  // STATUS UI RENDERING
  const renderStatusUI = () => {
    if (!user) return null;

    // ACTIVE (Before game start)
    if (status === "active" && !gameStarted) {
      return (
        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 text-green-200 rounded-lg px-6 py-4 border border-green-600/30 shadow-xl mb-10 animate-pulse">
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-white">Games are active! Start playing now!</span>
          </p>
        </div>
      );
    }

    // ACTIVE (Game started → countdown)
    if (status === "active" && gameStarted) {
      return (
        <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 text-orange-200 rounded-lg px-6 py-4 border border-orange-600/30 shadow-xl mb-10">
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">⏳</span>
            <span>
              Your break time ends in{" "}
              <span className="font-bold text-white">{formatTime(timeLeft)}</span>
            </span>
          </p>
        </div>
      );
    }

    // COOLDOWN MODE
    if (status === "cooldown") {
      return (
        <div className="bg-gradient-to-r from-red-900/40 to-pink-900/40 text-red-200 rounded-lg px-6 py-4 border border-red-600/30 shadow-xl mb-10">
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">📚</span>
            <span>
              Your free time is over, go and study. I will be active within{" "}
              <span className="font-bold text-white">{formatTime(cooldown)}</span>
            </span>
          </p>
        </div>
      );
    }

    return null;
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

      <div
        className="flex flex-col justify-center items-center bg-black text-white"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <main className="px-4 py-10 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold mb-4">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              Games
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-8">
            Choose from categories to play and sharpen your mind!
          </p>

          {renderStatusUI()}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <FeatureCard
              title="Funny Games"
              desc="Relax and have fun with classic games!"
              gradient="from-pink-500 to-orange-400"
              icon={<FaLaughBeam />}
              onClick={() => handleCardClick("/games/funny")}
              disabled={status === "cooldown" || !user}
            />

            <FeatureCard
              title="Mind Games"
              desc="Challenge your brain with engaging puzzles!"
              gradient="from-blue-400 to-cyan-400"
              icon={<FaBrain />}
              onClick={() => handleCardClick("/games/mind")}
              disabled={status === "cooldown" || !user}
            />
          </div>
        </main>
      </div>
    </>
  );
}
