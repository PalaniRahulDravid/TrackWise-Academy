import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <header className="w-full bg-black py-4 px-4 z-40">
        <div className="max-w-7xl mx-auto bg-gray-900 text-white rounded-xl shadow-lg px-6 py-3 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-lg">ASM</div>
            <span className="font-medium text-lg tracking-tight">AI Skill Mentor</span>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="hover:text-orange-400 transition flex items-center gap-1">
                Resources
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <a href="/roadmap" className="block px-4 py-2 hover:bg-gray-700 transition">Roadmap</a>
                  <a href="/courses" className="block px-4 py-2 hover:bg-gray-700 transition">Courses</a>
                  <a href="/doubts" className="block px-4 py-2 hover:bg-gray-700 transition">Doubts</a>
                  <a href="/games" className="block px-4 py-2 hover:bg-gray-700 transition">Games</a>
                </div>
              </div>
            </div>
            <button aria-label="Toggle Dark/Light Mode" className="text-lg hover:text-orange-400 transition p-2">🌙</button>
            <img
              className="h-10 w-10 rounded-full border-2 border-orange-400 cursor-pointer hover:border-orange-300 transition"
              src="https://randomuser.me/api/portraits/men/31.jpg"
              alt="profile"
            />
          </nav>
          {/* Mobile Hamburger */}
          <button 
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className={`w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-white transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>
      </header>
      {/* Mobile overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
           onClick={toggleMobileMenu} />
      {/* Mobile SideNav */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-800 text-white z-50 transform transition-transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-lg">ASM</div>
            <span className="font-medium text-lg">AI Skill Mentor</span>
          </div>
          <button onClick={toggleMobileMenu} className="text-2xl hover:text-orange-400 transition">×</button>
        </div>
        <div className="py-6">
          <div className="px-6 mb-4"><h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu</h3></div>
          <a href="/roadmap" className="block px-6 py-3 text-lg hover:bg-gray-700 transition">Roadmap</a>
          <a href="/courses" className="block px-6 py-3 text-lg hover:bg-gray-700 transition">Courses</a>
          <a href="/doubts" className="block px-6 py-3 text-lg hover:bg-gray-700 transition">Doubts</a>
          <a href="/games" className="block px-6 py-3 text-lg hover:bg-gray-700 transition">Games</a>
          <div className="px-6 mt-6 mb-4"><h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Resources</h3></div>
          <a href="/resources" className="block px-6 py-3 text-lg hover:bg-gray-700 transition">All Resources</a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <button aria-label="Toggle Dark/Light Mode" className="flex items-center gap-3 text-lg hover:text-orange-400 transition p-2">
              🌙 <span className="text-sm">Dark Mode</span>
            </button>
            <img className="h-12 w-12 rounded-full border-2 border-orange-400 cursor-pointer"
              src="https://randomuser.me/api/portraits/men/31.jpg" alt="profile" />
          </div>
        </div>
      </div>
    </>
  );
}