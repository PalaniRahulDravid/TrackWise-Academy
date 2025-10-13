export default function FeatureCard({ title, desc, gradient, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full text-left bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
    >
      <div className={`h-24 sm:h-28 md:h-32 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <span className="text-2xl sm:text-3xl">{icon}</span>
        </div>
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-orange-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          {desc}
        </p>
      </div>
    </button>
  );
}