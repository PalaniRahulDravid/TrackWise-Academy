export default function FeatureCard({ title, desc, gradient, icon, img, onClick, isComingSoon }) {
  return (
    <button
      type="button"
      onClick={isComingSoon ? null : onClick}
      className={`group flex flex-col w-full text-left 
        bg-gray-900 rounded-lg overflow-hidden 
        hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl
        h-full min-h-[260px] xs:min-h-[280px] sm:min-h-[300px]
        ${isComingSoon ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {/* 🔥 If IMG exists → show image top */}
      {img ? (
        <div className="w-full h-36 xs:h-40 sm:h-44 md:h-48 bg-gray-800 overflow-hidden">
          <img 
            src={img} 
            alt={title} 
            className="w-full h-full object-cover object-center"
          />
        </div>
      ) : (
        /* 🔥 Otherwise show old gradient + icon block */
        <div className={`h-24 sm:h-28 md:h-32 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <span className="text-2xl sm:text-3xl">{icon}</span>
          </div>
        </div>
      )}

      {/* TEXT SECTION */}
      <div className="p-4 xs:p-5 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-base xs:text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-orange-400 transition-all">
          {title}
        </h3>
        <p className="text-gray-400 text-xs xs:text-sm sm:text-base leading-relaxed line-clamp-3">
          {desc}
        </p>
      </div>
    </button>
  );
}
