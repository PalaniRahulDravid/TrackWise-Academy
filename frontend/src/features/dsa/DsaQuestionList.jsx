import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DEFAULT_LIMIT = 50;

function getBadgeClass(difficulty) {
  return (
    "inline-block w-20 text-center px-3 py-1 ml-2 rounded font-bold uppercase text-xs " +
    (difficulty === "Easy"
      ? "bg-green-600 text-white"
      : difficulty === "Medium"
      ? "bg-yellow-500 text-white"
      : "bg-red-600 text-white")
  );
}

export default function DsaQuestionList() {
  const [problems, setProblems] = useState([]);
  const [solved] = useState([]); // Future: pull from user progress
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch either default or search results
  useEffect(() => {
    let delay;
    async function fetchProblems() {
      setLoading(true);
      let url;
      if (!search.trim()) {
        url = `${API_BASE_URL}/dsa/problems?limit=${DEFAULT_LIMIT}`;
      } else {
        url = `${API_BASE_URL}/dsa/problems?search=${encodeURIComponent(search)}`;
      }
      try {
        const { data } = await axios.get(url);
        setProblems(data.problems || []);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setProblems([]);
      }
      setLoading(false);
    }
    // Debounce search for user typing
    delay = setTimeout(fetchProblems, search.trim() ? 300 : 0);
    return () => clearTimeout(delay);
    // eslint-disable-next-line
  }, [search]);

  const difficultyStats = {
    easy: solved.length ? problems.filter((p) => p.difficulty === "Easy" && solved.includes(p.id)).length : 0,
    medium: solved.length ? problems.filter((p) => p.difficulty === "Medium" && solved.includes(p.id)).length : 0,
    hard: solved.length ? problems.filter((p) => p.difficulty === "Hard" && solved.includes(p.id)).length : 0,
    total: solved.length ? problems.filter((p) => solved.includes(p.id)).length : 0,
  };

  return (
    <>
      <Header />
      <div className="bg-black min-h-screen pt-7 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Stats Bar */}
          <div className="bg-gray-900/70 rounded-xl px-6 py-5 flex flex-wrap items-center justify-between mb-4 shadow-lg border border-gray-800">
            <div className="font-bold text-md sm:text-xl">
              Problems Solved: <span className="text-orange-400">{difficultyStats.total}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-20 px-0 py-1 rounded-lg font-semibold bg-green-700/70 text-white text-center">Easy 0</span>
              <span className="w-20 px-0 py-1 rounded-lg font-semibold bg-yellow-500/80 text-white text-center">Medium 0</span>
              <span className="w-20 px-0 py-1 rounded-lg font-semibold bg-red-600/70 text-white text-center">Hard 0</span>
            </div>
          </div>

          {/* Info Message */}
          {!search.trim() && (
            <div className="mb-4 text-center text-orange-300 text-base bg-gray-900/50 rounded-lg py-2 shadow border border-gray-800">
              Only the top {DEFAULT_LIMIT} DSA questions are displayed.<br/>
              If the question you want is not listed, please search above.
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-5 flex flex-col sm:flex-row gap-4 items-center">
            <input
              className="flex-1 py-2 px-4 rounded-lg border bg-gray-900 border-gray-700 focus:border-orange-400 outline-none text-base"
              type="text"
              placeholder="🔍 Search Questions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Problems List */}
          {loading ? (
            <div className="text-center text-lg text-gray-400 py-20">Loading DSA questions...</div>
          ) : problems.length === 0 ? (
            <div className="text-center text-lg text-gray-400 py-20">
              No matching problems found. Try a different keyword!
            </div>
          ) : (
            <ul className="space-y-4">
              {problems.map((problem, idx) => (
                <li
                  key={problem.id || problem._id}
                  onClick={() => {
                    if (problem.url) {
                      window.open(problem.url, "_blank");
                    } else {
                      navigate(`/dsa/problems/${problem.id}`);
                    }
                  }}
                  className="bg-[#181d2a] border border-gray-700 rounded-xl shadow-md px-5 py-4 hover:bg-orange-900/10 hover:border-orange-400 flex justify-between items-center cursor-pointer transition-all group"
                >
                  <span className="font-medium text-lg flex-1 truncate">
                    {idx + 1}. {problem.title}
                  </span>
                  <span className={getBadgeClass(problem.difficulty)}>{problem.difficulty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
