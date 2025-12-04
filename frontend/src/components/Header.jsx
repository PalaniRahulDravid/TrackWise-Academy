import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import Button from "./Button";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const resourcesRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target))
        setResourcesOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setLogoutConfirm(false);
    setProfileOpen(false);
    setMobileOpen(false);
    logout();
    navigate("/login");
  };

  const handleLoginClick = () => {
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md border-b border-gray-800/50 z-50">
        <div className="max-w-7xl mx-auto text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              className="bg-orange-500 px-2 sm:px-3 py-1 rounded-md font-bold text-base sm:text-lg h-7 sm:h-8 flex items-center cursor-pointer hover:bg-orange-600 transition duration-200"
              onClick={() => {
                navigate("/");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ASM
            </div>
            <span className="font-medium text-sm sm:text-base md:text-lg tracking-tight">
              AI Skill Mentor
            </span>
          </div>
          {/* Animated Resource Links - Centered */}
          <div className={`hidden md:flex items-center gap-6 overflow-hidden transition-all duration-500 ease-in-out absolute left-1/2 transform -translate-x-1/2 ${
            resourcesOpen ? "max-w-[600px] opacity-100" : "max-w-0 opacity-0"
          }`}>
            <a
              href="/roadmaps"
              className="text-sm font-medium hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              Roadmaps
            </a>
            <a
              href="/courses"
              className="text-sm font-medium hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              Courses
            </a>
            <a
              href="/dsa"
              className="text-sm font-medium hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              DSA
            </a>
            <a
              href="/doubts"
              className="text-sm font-medium hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              Doubts
            </a>
            <a
              href="/games"
              className="text-sm font-medium hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              Games
            </a>
          </div>
          
          <nav className="hidden md:flex items-center gap-7">
            <button
              onClick={() => setResourcesOpen((o) => !o)}
              className="text-xs sm:text-sm font-medium hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Resources
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  resourcesOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-9 h-9 rounded-full border-2 border-orange-500 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white border-2 border-orange-500">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{user.name || "User"}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email || ""}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setLogoutConfirm(true);
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-800 transition-colors text-left text-sm cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-white">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-3 sm:px-4 py-1.5 bg-orange-500 text-white rounded-md font-medium text-xs sm:text-sm cursor-pointer hover:bg-orange-600 transition duration-200"
              >
                Login
              </button>
            )}
          </nav>
          <button
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle mobile menu"
          >
            <div
              className={`w-6 h-0.5 bg-white transition-transform ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white transition-opacity ${
                mobileOpen ? "opacity-0" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white transition-transform ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></div>
          </button>
        </div>
      </header>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[320px] sm:max-w-[360px] bg-gray-800 text-white z-50 transform transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              className="bg-orange-500 px-2 sm:px-3 py-1 rounded-md font-bold text-base sm:text-lg hover:bg-orange-600 transition duration-200 cursor-pointer"
              onClick={() => {
                navigate("/");
                setMobileOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ASM
            </div>
            <span className="font-medium text-sm sm:text-base md:text-lg">AI Skill Mentor</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-2xl hover:text-orange-400 transition"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col justify-between h-[calc(100%-112px)]">
          <div>
            <div className="px-6 mb-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Menu
              </h3>
            </div>
            <a
              href="/roadmaps"
              className="block px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg hover:bg-gray-700 rounded"
            >
              Roadmaps
            </a>
            <a
              href="/courses"
              className="block px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg hover:bg-gray-700 rounded"
            >
              Courses
            </a>
            <a
              href="/dsa"
              className="block px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg hover:bg-gray-700 rounded"
            >
              DSA Practice
            </a>
            <a
              href="/doubts"
              className="block px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg hover:bg-gray-700 rounded"
            >
              Doubts
            </a>
            <a
              href="/games"
              className="block px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg hover:bg-gray-700 rounded"
            >
              Games
            </a>
            <div className="px-6 mt-6 mb-1">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Resources
              </h3>
            </div>
            <a
              href="/"
              className="block px-6 py-3 text-lg hover:bg-gray-700 rounded"
            >
              All Resources
            </a>
          </div>
          {user ? (
            <div
              className="flex items-center justify-between px-6 py-5 border-t border-gray-700 bg-gray-900"
              style={{ minHeight: 76 }}
            >
              <span className="font-bold">{user.name || "User"}</span>
              <button
                onClick={() => {
                  setLogoutConfirm(true);
                  setMobileOpen(false);
                }}
                className="px-4 py-1.5 bg-orange-500 text-white rounded-md font-medium text-sm hover:bg-orange-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col gap-2 items-center px-6 py-6 border-t border-gray-700 bg-gray-900"
              style={{ minHeight: 86 }}
            >
              <span className="font-semibold text-base text-orange-400">
                Don't have an account?
              </span>
              <button
                onClick={handleLoginClick}
                className="px-4 py-1.5 bg-orange-500 text-white rounded-md font-medium text-sm hover:bg-orange-600 transition duration-200 w-full"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      /* Logout Confirmation Modal */
      {logoutConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-gray-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Logout Confirmation</h3>
                  <p className="text-sm text-gray-400 mt-0.5">Are you sure you want to leave?</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-gray-300 text-sm leading-relaxed">
                You will be logged out of your account and redirected to the login page.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                You can log back in anytime to continue learning.
              </p>
            </div>

            {/* Footer */}
            <div className="bg-gray-900/50 border-t border-gray-800 px-6 py-4 flex gap-3 justify-end">
              <button
                className="px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors text-sm cursor-pointer"
                onClick={() => setLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium transition-all shadow-lg shadow-orange-500/30 text-sm cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
