import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FeatureCard from "../components/FeatureCard";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import { Github, Linkedin, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const features = [
  {
    title: "Create Your Roadmap",
    desc: "Build your personalized learning path with AI assistance tailored to your goals.",
    href: "/roadmaps",
    gradient: "from-orange-400 to-pink-600",
    icon: "📋",
  },
  {
    title: "Explore Courses",
    desc: "Access top-rated courses based on your roadmap and skill level.",
    href: "/courses",
    gradient: "from-blue-400 to-blue-600",
    icon: "📚",
  },
  {
    title: "Resolve Doubts",
    desc: "Get quick clarifications and support through intelligent doubt-solving chat.",
    href: "/doubts",
    gradient: "from-green-400 to-teal-600",
    icon: "💬",
  },
  {
    title: "Mind Refresh Games",
    desc: "Play relaxing coding games on breaks to keep your mind sharp and fresh.",
    href: "/games",
    gradient: "from-purple-400 to-pink-600",
    icon: "🎮",
  },
];

const learningTabs = [
  { id: "roadmaps", label: "AI Roadmap Generator" },
  { id: "courses", label: "Smart Courses" },
  { id: "doubts", label: "Doubt Resolution" },
  { id: "games", label: "Mind Refresh Games" },
];

const learningContent = [
  {
    id: "roadmaps",
    icon: "📋",
    title: "AI Roadmap Generator",
    description:
      "Your ultimate guide to mastering CS subjects with personalized AI-generated learning paths.",
    actionText: "Get Started",
    features: [
      "Personalized learning paths based on your goals",
      "AI-powered recommendations for skill development",
      "Track progress with interactive milestones",
    ],
  },
  {
    id: "courses",
    icon: "📚",
    title: "Smart Course Selection",
    description:
      "Access curated courses that align perfectly with your roadmap and learning objectives.",
    actionText: "Explore Courses",
    features: [
      "Courses matched to your roadmap",
      "Expert-verified content quality",
      "Interactive learning modules",
    ],
  },
  {
    id: "doubts",
    icon: "💬",
    title: "AI Doubt Resolution",
    description:
      "Get instant clarifications on complex topics through our intelligent doubt-solving system.",
    actionText: "Ask Questions",
    features: [
      "24/7 AI-powered doubt resolution",
      "Step-by-step explanations",
      "Context-aware learning assistance",
    ],
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("roadmaps");
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeContent = learningContent.find((content) => content.id === activeTab);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Floating symbols */}
      <div className="absolute top-32 left-4 sm:top-48 sm:left-20 text-orange-400 text-xl sm:text-3xl animate-pulse">✦</div>
      <div className="absolute top-64 right-8 sm:top-80 sm:right-32 text-yellow-400 text-lg sm:text-2xl animate-pulse">✦</div>
      <div className="absolute top-80 left-1/4 sm:top-96 text-orange-400 text-base sm:text-xl animate-pulse">+</div>
      <div className="absolute bottom-32 right-4 sm:bottom-96 sm:right-20 text-yellow-400 text-lg sm:text-2xl animate-pulse">+</div>

      <Header />

      <main className="px-4 sm:px-5 py-8 sm:py-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-12 sm:mb-20 max-w-4xl mx-auto animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5 px-2">
            Welcome{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse inline-block">
              {user ? user.name.split(" ")[0].toUpperCase() : "Buddy"}
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Welcome to TrackWise Academy! You can call me ASM, your AI Skill Mentor—that’s my special name.
            I’m here to help you master your skills with a unique AI-powered platform that guides your learning journey, answers your doubts, and keeps your mind sharp and motivated.
          </p>
          <Button
            variant="gradient"
            className="w-full sm:w-auto min-w-[240px] text-lg font-bold px-8 py-4 rounded-xl animate-fadeIn"
            onClick={() => navigate("/roadmaps")}
          >
            Let's start your journey
          </Button>
        </section>

        {/* Tabs Section */}
        <section className="mb-12 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Revolutionize the Way You Learn
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {learningTabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "primary" : "outline"}
                className={activeTab === tab.id ? "border-2 border-orange-500" : ""}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{activeContent?.icon}</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">{activeContent?.title}</h3>
              </div>
              <p className="text-lg text-gray-400 leading-relaxed">{activeContent?.description}</p>
              <ul className="space-y-3">
                {activeContent?.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-orange-400 mt-1">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="primary"
                className="inline-flex items-center gap-2 px-8"
                onClick={() => navigate(`/${activeContent?.id}`)}
              >
                {activeContent?.actionText} <span>→</span>
              </Button>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700">
                <div className="text-center">
                  <div className="text-6xl mb-4">{activeContent?.icon}</div>
                  <div className="text-xl font-semibold text-gray-300">{activeContent?.title} Preview</div>
                  <div className="text-sm text-gray-500 mt-2">Interactive demo coming soon</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 px-4">
            Resources to Learn
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
            {features.map(({ title, desc, href, gradient, icon }) => (
              <FeatureCard
                key={title}
                title={title}
                desc={desc}
                gradient={gradient}
                icon={icon}
                onClick={() => navigate(href)}
              />
            ))}
          </div>
        </section>

        {/* Learner Stats */}
        <section className="bg-gray-900/50 rounded-2xl p-4 sm:p-6 md:p-8 text-center relative mx-2 sm:mx-0">
          <div className="absolute top-4 left-4 text-orange-400 text-lg sm:text-xl">✦</div>
          <div className="absolute top-4 right-4 text-yellow-400 text-lg sm:text-xl">+</div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2 px-2">
            <span className="text-orange-400">12,19,773+</span> Learners
          </h3>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-4">
            have exceeded in their career through our platform
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-8 opacity-60">
            <div className="bg-gray-800 px-4 py-2 rounded-lg">RAHUL</div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">SWAMY</div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">SIVA</div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">GOVIND</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#181e24] border-t border-gray-800 pt-10 pb-4 text-gray-300 mt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-10 md:gap-20 items-start">
          <div className="md:w-1/3">
            <h3 className="text-2xl font-bold mb-2">
              <span className="text-orange-400">ASM</span> AI Skill Mentor
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Build your roadmap, clear doubts, play games, and upskill — all in one AI-driven platform.
            </p>
            <div className="flex gap-4 text-gray-400">
              <a href="https://github.com/PalaniRahulDravid" target="_blank" rel="noopener noreferrer" className="hover:text-black">
                <Github size={22} />
              </a>
              <a href="https://www.linkedin.com/in/palani-rahul-dravid-a89916292/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                <Linkedin size={22} />
              </a>
              <a href="https://www.instagram.com/useless._.boy._.rahul/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
                <Instagram size={22} />
              </a>
              <a href="https://wa.me/9059074389" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
                <FaWhatsapp size={22} />
              </a>
            </div>
          </div>

          {/* Footer Columns */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 w-full text-sm">
            <div>
              <p className="text-orange-400 font-semibold mb-2">Roadmaps</p>
              <p className="hover:text-orange-400 cursor-pointer">Domain-wise Planning</p>
            </div>
            <div>
              <p className="text-orange-400 font-semibold mb-2">Courses</p>
              <p className="hover:text-orange-400 cursor-pointer">Skill Development</p>
              <p className="hover:text-orange-400 cursor-pointer">Curated Learning</p>
            </div>
            <div>
              <p className="text-orange-400 font-semibold mb-2">Doubts</p>
              <p className="hover:text-orange-400 cursor-pointer">Ask & Resolve</p>
              <p className="hover:text-orange-400 cursor-pointer">AI Chat Support</p>
            </div>
            <div>
              <p className="text-orange-400 font-semibold mb-2">Games</p>
              <p className="hover:text-orange-400 cursor-pointer">Mind Refresh</p>
              <p className="hover:text-orange-400 cursor-pointer">Coding Challenges</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 border-t border-gray-800 pt-4 text-xs text-gray-500">
          © 2025 TrackWise Academy. All rights reserved. Built by Rahul.
        </div>
      </footer>
    </div>
  );
}
