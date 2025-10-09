export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) {
  const base = "px-6 py-3 rounded-xl font-semibold focus:outline-none transition duration-300";
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg",
    secondary: "bg-gray-700 text-white hover:bg-gray-800 shadow-md",
    outline: "bg-transparent border-2 border-gray-600 text-white hover:border-orange-400 hover:text-white",
    gradient: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
  };
  return (
    <button
      className={`${base} ${variants[variant] || ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}