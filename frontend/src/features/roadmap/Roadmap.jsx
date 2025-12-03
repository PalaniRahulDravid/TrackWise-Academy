import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Toast from "../../components/Toast";
import useAuth from "../../hooks/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Configure axios instance with credentials for cookie-based auth
const roadmapAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

export default function Roadmap() {
  const [inputFields, setInputFields] = useState({
    SelectedDomain: "",
    CurrentSkills: "",
    ExperienceLevel: "Beginner",
    TimeAvailability: "",
    PreferredLearningPace: "",
    YourGoals: "",
    CollegeBranch: "",
  });
  const [type, setType] = useState("domain");
  const [loading, setLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const [showGeneratedRoadmap, setShowGeneratedRoadmap] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserRoadmaps();
    }
    // eslint-disable-next-line
  }, [user]);

  async function fetchUserRoadmaps() {
    try {
      setError("");
      const res = await roadmapAPI.get('/roadmaps/user');
      if (res.data?.roadmaps) setRoadmaps(res.data.roadmaps);
    } catch {
      setError("Failed to load saved roadmaps.");
    }
  }

  const handleInputChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleGenerateClick = async (e) => {
    e.preventDefault();

    // 🔸 Just show toast if user not logged in, don't redirect
    if (!user) {
      setToast({ show: true, message: "Please login first to generate a roadmap.", type: "error" });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return;
    }

    setLoading(true);
    setError("");
    setShowGeneratedRoadmap(null);

    try {
      const res = await roadmapAPI.post(
        '/roadmaps/generate',
        { type, inputFields }
      );

      if (res.status === 201 && res.data?.roadmap) {
        setShowGeneratedRoadmap(res.data.roadmap.roadmapText);
        fetchUserRoadmaps();
      } else {
        setError("Failed to generate roadmap.");
      }
    } catch {
      setError("Error generating roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const downloadRoadmap = async (id) => {
    if (!user) {
      setToast({ show: true, message: "Please login first to download roadmap.", type: "error" });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return;
    }

    try {
      const res = await roadmapAPI.get(`/roadmaps/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `roadmap_${id}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setToast({ show: true, message: "Failed to download roadmap.", type: "error" });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Toast always above Header */}
      <div className="relative z-[9999]">
        <Toast
          {...toast}
          show={toast.show}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      </div>

      <Header fixed />

      {/* Decorative icons */}
      <div className="absolute top-28 left-8 text-orange-400 text-xl sm:text-2xl animate-pulse z-0">✦</div>
      <div className="absolute top-52 right-10 text-yellow-400 text-lg sm:text-2xl animate-pulse z-0">✦</div>
      <div className="absolute bottom-28 left-1/4 text-orange-400 text-base sm:text-xl animate-pulse z-0">+</div>
      <div className="absolute bottom-32 right-8 text-yellow-400 text-lg sm:text-2xl animate-pulse z-0">+</div>

      <main className="px-4 sm:px-5 py-12 sm:py-20 max-w-3xl mx-auto z-10 relative">
        {/* Title */}
        <section className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 px-2">
            Generate Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              Personalized Roadmap
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto px-2 leading-relaxed">
            Let AI help you build a step-by-step learning plan tailored to your skills, domain, and goals.
          </p>
        </section>

        {/* Form */}
        <section className="bg-gray-900/50 rounded-lg shadow-lg p-6 sm:p-10 mb-10 border border-gray-800">
          <form onSubmit={handleGenerateClick}>
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-center">
              <label className="text-base font-semibold text-white">Type: </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-gray-900/50 text-white p-2 rounded outline-none border border-gray-800 focus:border-orange-500"
              >
                <option value="domain">By Domain</option>
                <option value="branch">By College Branch</option>
              </select>
            </div>
            <div className="grid gap-4 mb-6">
              {type === "domain" ? (
                <>
                  <input
                    name="SelectedDomain"
                    placeholder="Domain (e.g., Web Dev)"
                    value={inputFields.SelectedDomain}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-900/50 border border-gray-800 outline-none focus:border-orange-500 text-white rounded p-3 placeholder-gray-400 transition"
                  />
                  <input
                    name="CurrentSkills"
                    placeholder="Current Skills"
                    value={inputFields.CurrentSkills}
                    onChange={handleInputChange}
                    className="bg-gray-900/50 border border-gray-800 outline-none focus:border-orange-500 text-white rounded p-3 placeholder-gray-400 transition"
                  />
                  <select
                    name="ExperienceLevel"
                    value={inputFields.ExperienceLevel}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-900/50 border border-gray-800 outline-none focus:border-orange-500 text-white rounded p-3"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <input
                    name="TimeAvailability"
                    placeholder="Time availability per day/week"
                    value={inputFields.TimeAvailability}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-900/50 border border-gray-800 outline-none focus:border-orange-500 text-white rounded p-3 placeholder-gray-400 transition"
                  />
                  <input
                    name="PreferredLearningPace"
                    placeholder="Preferred learning pace"
                    value={inputFields.PreferredLearningPace}
                    onChange={handleInputChange}
                    className="bg-gray-900/50 border border-gray-800 outline-none focus:border-orange-500 text-white rounded p-3 placeholder-gray-400 transition"
                  />
                  <textarea
                    name="YourGoals"
                    placeholder="Your Career Goals"
                    value={inputFields.YourGoals}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-900/50 border border-gray-800 outline-none focus:border-orange-500 text-white rounded p-3 h-24 placeholder-gray-400 transition"
                  />
                </>
              ) : (
                <>
                  <input
                    name="CollegeBranch"
                    placeholder="Your College Branch"
                    value={inputFields.CollegeBranch}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-900/50 border border-gray-800 outline-none focus:border-orange-500 text-white rounded p-3 placeholder-gray-400 transition"
                  />
                  <input
                    name="TimeAvailability"
                    placeholder="Time availability"
                    value={inputFields.TimeAvailability}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-900/50 border border-gray-800 outline-none focus:border-orange-500 text-white rounded p-3 placeholder-gray-400 transition"
                  />
                  <input
                    name="PreferredLearningPace"
                    placeholder="Preferred learning pace"
                    value={inputFields.PreferredLearningPace}
                    onChange={handleInputChange}
                    className="bg-gray-900/50 border border-gray-800 outline-none focus:border-orange-500 text-white rounded p-3 placeholder-gray-400 transition"
                  />
                  <textarea
                    name="YourGoals"
                    placeholder="Your Career Goals"
                    value={inputFields.YourGoals}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-900/50 border border-gray-800 outline-none focus:border-orange-500 text-white rounded p-3 h-24 placeholder-gray-400 transition"
                  />
                </>
              )}
            </div>
            <Button
              variant="primary"
              type="submit"
              className="mt-2 w-full py-3 text-lg"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Roadmap"}
            </Button>
          </form>

          {error && <div className="text-red-400 text-center mt-3">{error}</div>}

          {showGeneratedRoadmap && (
            <div className="mt-8 bg-[#1a2334] p-6 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-orange-400 text-lg font-bold mb-2">Your Roadmap</h2>
              <pre className="whitespace-pre-wrap text-[15px] text-gray-100">{showGeneratedRoadmap}</pre>
            </div>
          )}
        </section>

        {/* Previous Roadmaps */}
        {user && (
          <section className="bg-gray-900/50 rounded-lg p-4 sm:p-6 mb-6 text-center relative border border-gray-800 mx-0">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 px-2 text-white">Previous Roadmaps</h2>
            {roadmaps.length === 0 && (
              <div className="text-gray-400 text-center">No saved roadmaps yet.</div>
            )}
            <ul className="space-y-3">
              {roadmaps.map((rm) => (
                <li
                  key={rm._id}
                  className="flex justify-between items-center bg-[#20293c] rounded-lg p-3"
                >
                  <span className="text-gray-200 text-left truncate max-w-[180px]">
                    {rm.inputFields.YourGoals?.slice(0, 34) || "Roadmap"}
                  </span>
                  <Button variant="outline" onClick={() => downloadRoadmap(rm._id)}>
                    Download
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
