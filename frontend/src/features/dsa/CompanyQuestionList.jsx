// src/features/dsa/CompanyQuestionList.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

export default function CompanyQuestionList() {
  const { company } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/company/${company}/questions`);
        setQuestions(data.problems || []);
      } catch {
        setQuestions([]);
      }
      setLoading(false);
    }
    fetchQuestions();
  }, [company]);

  // In-memory search for fast UX
  const displayedQuestions = search
    ? questions.filter(
      q =>
        q.title.toLowerCase().includes(search.toLowerCase())
    )
    : questions;

  // Always 0 (until progress ready)
  const easy = 0, medium = 0, hard = 0, total = 0;

  return (
    <>
      <Header />
      <div
        className="flex flex-col justify-center items-center bg-black text-white relative overflow-hidden"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-orange-400 mb-6 mt-2 text-center capitalize">
            {company} Interview DSA Questions
          </h2>
          <div className="bg-gray-900/70 rounded-xl px-6 py-5 flex flex-wrap items-center justify-between mb-4 shadow-lg border border-gray-800">
            <div className="font-bold text-md sm:text-xl">
              Problems Solved: <span className="text-orange-400">{total}</span>
            </div>
            <div className="flex gap-3">
              <span className="w-20 px-0 py-1 rounded-lg font-semibold bg-green-700/70 text-white text-center">Easy {easy}</span>
              <span className="w-20 px-0 py-1 rounded-lg font-semibold bg-yellow-500/80 text-white text-center">Medium {medium}</span>
              <span className="w-20 px-0 py-1 rounded-lg font-semibold bg-red-600/70 text-white text-center">Hard {hard}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-5 flex flex-col sm:flex-row gap-4 items-center">
            <input
              className="flex-1 py-2 px-4 rounded-lg border bg-gray-900 border-gray-700 focus:border-orange-400 outline-none text-base"
              type="text"
              placeholder="🔍 Search Questions"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Problems List */}
          {loading ? (
            <div className="text-center text-lg text-gray-400 py-20">Loading questions...</div>
          ) : displayedQuestions.length === 0 ? (
            <div className="text-center text-lg text-gray-400 py-20">No questions found. Try a different keyword!</div>
          ) : (
            <ul className="space-y-4">
              {displayedQuestions.map((q, idx) => (
                <li
                  key={q.title}
                  onClick={() => q.url && window.open(q.url, "_blank")}
                  className="bg-[#181d2a] border border-gray-700 rounded-xl shadow-md px-5 py-4 hover:bg-orange-900/10 hover:border-orange-400 flex justify-between items-center cursor-pointer transition-all group"
                >
                  <span className="font-medium text-lg flex-1 truncate">
                    {idx + 1}. {q.title}
                  </span>
                  <span className={getBadgeClass(q.difficulty || "Easy")}>
                    {q.difficulty || "Easy"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
