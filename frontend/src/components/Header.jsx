import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import Button from "./Button";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const resourcesRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target))
        setResourcesOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLoginClick = () => {
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black py-4 px-4 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto bg-gray-900 text-white rounded-xl shadow-lg px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="bg-orange-500 px-3 py-1 rounded-lg font-bold text-lg h-8 flex items-center cursor-pointer hover:bg-orange-600 transition duration-200"
              onClick={() => navigate("/")}
            >
              ASM
            </div>
            <span className="font-medium text-lg tracking-tight">
              AI Skill Mentor
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-7">
            <div ref={resourcesRef} className="relative">
              <button
                onClick={() => setResourcesOpen((o) => !o)}
                className="hover:text-orange-400 transition flex items-center gap-1 cursor-pointer"
              >
                Resources
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
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
              {resourcesOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden">
                  <div className="py-1">
                    <a
                      href="/roadmaps"
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800 transition-colors group"
                    >
                      <div className="text-orange-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-white group-hover:text-orange-400 transition-colors">Roadmaps</div>
                        <div className="text-[11px] text-gray-400">Guided learning paths</div>
                      </div>
                    </a>
                    <a
                      href="/courses"
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800 transition-colors group"
                    >
                      <div className="text-orange-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-white group-hover:text-orange-400 transition-colors">Courses</div>
                        <div className="text-[11px] text-gray-400">Video tutorials</div>
                      </div>
                    </a>
                    <a
                      href="/dsa"
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800 transition-colors group"
                    >
                      <div className="text-orange-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-white group-hover:text-orange-400 transition-colors">DSA Practice</div>
                        <div className="text-[11px] text-gray-400">Solve problems</div>
                      </div>
                    </a>
                    <a
                      href="/doubts"
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800 transition-colors group"
                    >
                      <div className="text-orange-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-white group-hover:text-orange-400 transition-colors">Doubts</div>
                        <div className="text-[11px] text-gray-400">AI-powered help</div>
                      </div>
                    </a>
                    <a
                      href="/games"
                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800 transition-colors group"
                    >
                      <div className="text-orange-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-white group-hover:text-orange-400 transition-colors">Games</div>
                        <div className="text-[11px] text-gray-400">Fun activities</div>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
            {user ? (
              <div className="relative flex items-center gap-4">
                <span className="font-semibold">{user.name || "User"}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 bg-orange-500 text-white rounded-md font-medium text-sm hover:bg-orange-600 transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 bg-orange-500 text-white rounded-md font-medium text-sm cursor-pointer hover:bg-orange-600 transition duration-200"
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
        className={`fixed top-0 right-0 h-full w-80 bg-gray-800 text-white z-50 transform transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ maxWidth: "90vw" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div 
              className="bg-orange-500 px-3 py-1 rounded-lg font-bold text-lg hover:bg-orange-600 transition duration-200"
              onClick={() => {
                navigate("/");
                setMobileOpen(false);
              }}
            >
              ASM
            </div>
            <span className="font-medium text-lg">AI Skill Mentor</span>
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
              className="block px-6 py-3 text-lg hover:bg-gray-700 rounded"
            >
              Roadmaps
            </a>
            <a
              href="/courses"
              className="block px-6 py-3 text-lg hover:bg-gray-700 rounded"
            >
              Courses
            </a>
            <a
              href="/dsa"
              className="block px-6 py-3 text-lg hover:bg-gray-700 rounded"
            >
              DSA Practice
            </a>
            <a
              href="/doubts"
              className="block px-6 py-3 text-lg hover:bg-gray-700 rounded"
            >
              Doubts
            </a>
            <a
              href="/games"
              className="block px-6 py-3 text-lg hover:bg-gray-700 rounded"
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
                  handleLogout();
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
      <div className="h-20 md:h-24" />
    </>
  );
}
