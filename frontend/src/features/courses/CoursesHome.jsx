import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import FeatureCard from "../../components/FeatureCard";
import Toast from "../../components/Toast";
import { FaYoutube, FaGraduationCap } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

export default function CoursesHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const handleCardClick = (path, disabled = false) => {
    if (disabled) {
      setToast({ show: true, message: "TrackWise Premium Courses coming soon!", type: "error" });
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
      <div
        className="flex flex-col justify-center items-center bg-black text-white relative overflow-hidden"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        {/* Decorative icons */}
        <div className="absolute top-20 left-8 text-orange-400 text-xl sm:text-2xl animate-pulse z-0">✦</div>
        <div className="absolute top-56 right-10 text-yellow-400 text-lg sm:text-2xl animate-pulse z-0">✦</div>

        {/* Main Section */}
        <main className="px-4 sm:px-6 py-10 sm:py-12 max-w-3xl mx-auto text-center z-10 relative">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl font-extrabold leading-tight mb-3 sm:mb-4">
            Welcome{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              {user?.name || "User"}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2">
            Explore our{" "}
            <span className="font-semibold text-orange-400">Course Library!</span>
          </p>

          {/* Feature Cards */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-10 justify-center items-center">
            <FeatureCard
              title="TrackWise Courses"
              desc="Premium courses with certificates (Coming Soon)"
              gradient="from-purple-500 to-pink-400"
              icon={<FaGraduationCap />}
              onClick={() => handleCardClick("/courses/trackwise", true)}
            />
            <FeatureCard
              title="YouTube Courses"
              desc="Free curated video courses from top creators"
              gradient="from-red-500 to-orange-400"
              icon={<FaYoutube />}
              onClick={() => handleCardClick("/courses/youtube")}
            />
          </div>
        </main>
      </div>
    </>
  );
}
