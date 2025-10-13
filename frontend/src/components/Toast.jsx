import { useEffect } from "react";

export default function Toast({ show, message, type = "info", onClose, duration = 2000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;
  const bg =
    type === "error"
      ? "bg-red-700"
      : type === "success"
      ? "bg-green-700"
      : "bg-gray-800";
  return (
    <div
      className={`fixed top-4 right-4 max-w-xs px-6 py-3 rounded-lg text-white shadow-xl z-50 font-semibold ${bg} border border-white/20 backdrop-blur-sm`}
      style={{
        boxShadow: "0 4px 15px rgba(0,0,0,.3)",
        animation: `${show ? "fadeInRight 0.3s ease forwards" : ""}`
      }}
    >
      {message}
      <style>
        {`
          @keyframes fadeInRight {
            0% { opacity: 0; transform: translateX(20px);}
            100% { opacity: 1; transform: translateX(0);}
          }
        `}
      </style>
    </div>
  );
}