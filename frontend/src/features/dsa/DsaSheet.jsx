import { useEffect, useState } from "react";
import { fetchTopics, fetchQuestions, fetchProgress } from "./api";
import useAuth from "../../hooks/useAuth";

export default function DsaSheet({ stage, onSelectQuestion }) {
  const { user, token } = useAuth();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState([]);
  const [solvedIds, setSolvedIds] = useState([]);

  useEffect(() => {
    fetchTopics(stage).then(res => setTopics(res.data.topics || []));
    fetchQuestions(stage).then(res => setQuestions(res.data.questions || []));
    fetchProgress(token).then(res => setSolvedIds((res.data.solvedQuestions || []).map(q => q._id)));
  }, [stage, token]);

  async function handleTopicChange(topic) {
    setSelectedTopic(topic);
    const res = await fetchQuestions(stage, topic, search);
    setQuestions(res.data.questions);
  }

  async function handleSearchChange(e) {
    const val = e.target.value;
    setSearch(val);
    const res = await fetchQuestions(stage, selectedTopic, val);
    setQuestions(res.data.questions);
  }

  return (
    <div className="max-w-3xl mx-auto px-3 py-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold text-orange-500">
          {user?.name || "User"} - {stage.charAt(0).toUpperCase() + stage.slice(1)}
        </div>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="🔎 Search questions..."
          className="border bg-gray-900 rounded px-3 py-1 text-white outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <span className="font-semibold">Topic:</span>
        <select
          value={selectedTopic}
          onChange={e => handleTopicChange(e.target.value)}
          className="border rounded px-3 py-1 text-black"
        >
          <option value="">All</option>
          {topics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-3">
        {questions.map((q, idx) => (
          <button
            key={q._id}
            className={`flex justify-between items-center p-3 rounded border text-left
              ${solvedIds.includes(q._id) ?
                'border-green-500 bg-green-50/60 text-green-700' :
                'border-gray-800 bg-gray-900 text-white'}
              hover:bg-orange-50 hover:text-orange-500 transition duration-150`}
            onClick={() => onSelectQuestion(q._id)}
          >
            <span>
              <span className="font-medium">{idx+1}. {q.title}</span>
              <span className="ml-2 text-xs">{q.difficulty}</span>
            </span>
            {solvedIds.includes(q._id) && <span className="text-green-500 ml-2 font-bold">✔</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
