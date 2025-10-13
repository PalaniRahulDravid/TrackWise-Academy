import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FeatureCard from "../components/FeatureCard";
import Button from "../components/Button";
import Toast from "../components/Toast";
import useAuth from "../hooks/useAuth";

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
  { id: "games", label: "Mind Games" },
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
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeContent = learningContent.find((content) => content.id === activeTab);

  const handleProtectedNavigate = (href) => {
    if (!user) {
      setToast({ show: true, message: "Please login to access this feature", type: "error" });
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Toast {...toast} show={toast.show} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
      <div className="absolute top-32 left-4 sm:top-48 sm:left-20 text-orange-400 text-xl sm:text-3xl animate-pulse">✦</div>
      <div className="absolute top-64 right-8 sm:top-80 sm:right-32 text-yellow-400 text-lg sm:text-2xl animate-pulse">✦</div>
      <div className="absolute top-80 left-1/4 sm:top-96 text-orange-400 text-base sm:text-xl animate-pulse">
        +
      </div>
      <div className="absolute bottom-32 right-4 sm:bottom-96 sm:right-20 text-yellow-400 text-lg sm:text-2xl animate-pulse">
        +
      </div>

      <Header />

      <main className="px-4 sm:px-5 py-8 sm:py-16 max-w-7xl mx-auto">
        <section className="text-center mb-12 sm:mb-20 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 px-2">
            Elevate Your Career with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              AI Skill Mentor
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
            Master computer science subjects with a unique AI-powered platform that guides your learning journey, solves your doubts, and keeps your mind fresh.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button variant="outline" className="w-full sm:w-auto min-w-[200px]">
              Start for Free ↓
            </Button>
            <Button variant="gradient" className="w-full sm:w-auto min-w-[200px]">
              Explore Plus
            </Button>
          </div>
        </section>

        <section className="mb-12 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Revolutionize the Way You Learn</h2>
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
              <Button variant="primary" className="inline-flex items-center gap-2 px-8" onClick={() => handleProtectedNavigate(`/${activeContent?.id}`)}>
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

        <section className="mb-12 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 px-4">Resources to Learn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
            {features.map(({ title, desc, href, gradient, icon }) => (
              <FeatureCard key={title} title={title} desc={desc} gradient={gradient} icon={icon} onClick={() => handleProtectedNavigate(href)} />
            ))}
          </div>
        </section>

        <section className="bg-gray-900/50 rounded-2xl p-4 sm:p-6 md:p-8 text-center relative mx-2 sm:mx-0">
          <div className="absolute top-4 left-4 sm:top-6 sm:left-8 text-orange-400 text-lg sm:text-xl">✦</div>
          <div className="absolute top-4 right-4 sm:top-6 sm:right-8 text-yellow-400 text-lg sm:text-xl">+</div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2 px-2">
            <span className="text-orange-400">12,19,773+</span> Learners
          </h3>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-4">
            have exceeded in their career through our platform
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-8 opacity-60">
            <div className="bg-gray-800 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base">RAHUL</div>
            <div className="bg-gray-800 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base">SWAMY</div>
            <div className="bg-gray-800 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base">SIVA</div>
            <div className="bg-gray-800 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base">GOVIND</div>
          </div>
        </section>
      </main>
    </div>
  );
}
