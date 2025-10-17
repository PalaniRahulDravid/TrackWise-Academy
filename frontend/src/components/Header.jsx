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
            <div className="bg-orange-500 px-3 py-1 rounded-lg font-bold text-lg h-8 flex items-center">
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
                className="hover:text-orange-400 transition flex items-center gap-1"
              >
                Resources
                <svg
                  className="w-4 h-4 ml-1"
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
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <a
                      href="/roadmaps"
                      className="block px-4 py-2 hover:bg-gray-700 rounded"
                    >
                      Roadmaps
                    </a>
                    <a
                      href="/courses"
                      className="block px-4 py-2 hover:bg-gray-700 rounded"
                    >
                      Courses
                    </a>
                    <a
                      href="/doubts"
                      className="block px-4 py-2 hover:bg-gray-700 rounded"
                    >
                      Doubts
                    </a>
                    <a
                      href="/games"
                      className="block px-4 py-2 hover:bg-gray-700 rounded"
                    >
                      Games
                    </a>
                  </div>
                </div>
              )}
            </div>
            {user ? (
              <div className="relative flex items-center gap-4">
                <span className="font-semibold">{user.name || "User"}</span>
                <Button
                  variant="primary"
                  className="h-8 px-3 py-1 rounded text-lg flex items-center"
                  style={{ minHeight: "32px" }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                className="h-8 px-3 py-1 rounded text-lg flex items-center"
                style={{ minHeight: "32px" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
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
            <div className="bg-orange-500 px-3 py-1 rounded-lg font-bold text-lg">
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
              <Button
                variant="primary"
                className="px-3 py-1 rounded font-semibold text-base"
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div
              className="flex flex-col gap-2 items-center px-6 py-6 border-t border-gray-700 bg-gray-900"
              style={{ minHeight: 86 }}
            >
              <span className="font-semibold text-base text-orange-400">
                Don't have an account?
              </span>
              <Button
                variant="primary"
                className="px-3 py-1 rounded font-semibold w-full mt-2"
                onClick={handleLoginClick}
              >
                Login
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="h-20 md:h-24" />
    </>
  );
}
