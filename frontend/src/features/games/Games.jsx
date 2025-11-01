import { useState } from "react";
import Header from "../../components/Header";
import FeatureCard from "../../components/FeatureCard";
import Toast from "../../components/Toast";
import { FaLaughBeam, FaBrain } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Games() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const handleCardClick = (path) => {
    if (!user) {
      setToast({ show: true, message: "Please login first to play the games.", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "error" }), 3000);
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
        {/* Decorative icons */}
        <div className="absolute top-20 left-8 text-orange-400 text-xl sm:text-2xl animate-pulse z-0">✦</div>
        <div className="absolute top-56 right-10 text-yellow-400 text-lg sm:text-2xl animate-pulse z-0">✦</div>

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
            />
            <FeatureCard
              title="Mind Games"
              desc="Boost your brain with challenging mind games."
              gradient="from-blue-400 to-cyan-400"
              icon={<FaBrain />}
              onClick={() => handleCardClick("/games/mind")}
            />
          </div>
        </main>
      </div>
    </>
  );
}
