import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function DsaProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function fetchProblem() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/dsa/problems/${id}`);
        setProblem(data.problem);
        setCode(data.problem.codeTemplates?.python || "def solution(input):\n    # Write your code here\n    return result");
      } catch (err) {
        setProblem(null);
      }
      setLoading(false);
    }
    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    if (!code.trim()) return alert("Please write some code first!");
    setRunning(true); setShowResults(false);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/dsa/problems/${id}/run`, { code, language: "python" });
      setTestResults(data.results); setShowResults(true);
    } catch (err) {
      alert(err.response?.data?.message || "Code execution failed!");
    }
    setRunning(false);
  };

  const handleSubmit = async () => {
    if (!code.trim()) return alert("Please write some code first!");
    if (!user?._id) { alert("Please login to submit solutions!"); navigate("/login"); return; }
    setSubmitting(true); setShowResults(false);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/dsa/problems/${id}/submit`, { code, language: "python", userId: user._id });
      setTestResults(data.testCaseResults || []); setShowResults(true);
      if (data.success) alert(`✅ ${data.message}\n\nRuntime: ${data.runtime}ms\nMemory: ${data.memory}MB`);
      else alert(`❌ ${data.message}\n\nPassed: ${data.testCasesPassed}/${data.totalTestCases}`);
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed!");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <>
      <Header />
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Loading problem...</div>
      </div>
    </>
  );

  if (!problem) return (
    <>
      <Header />
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-4">Problem not found</div>
          <button onClick={() => navigate("/dsa/problems")} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg">
            Back to Problems
          </button>
        </div>
      </div>
    </>
  );

  const difficultyColor =
    problem.difficulty === "Easy" ? "text-green-400"
      : problem.difficulty === "Medium" ? "text-yellow-400"
      : "text-red-400";

  return (
    <>
      <Header />
      <div className="bg-black min-h-screen text-white">
        <div className="flex h-[calc(100vh-56px)] pt-5">
          {/* Left Panel */}
          <div className="w-1/2 max-h-full overflow-y-auto border-r border-gray-800 p-6"
            style={{ background: "#111827", scrollbarColor: "#333 #111" }}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{id}. {problem.title}</h1>
              <div className="flex items-center gap-4">
                <span className={`font-semibold ${difficultyColor}`}>{problem.difficulty}</span>
                {problem.topics?.length > 0 && (
                  <div className="flex gap-2">
                    {problem.topics.map((topic) => (
                      <span key={topic} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">{topic}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 border-b border-gray-800 mb-6">
              {["description", "solutions", "submissions"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-1 font-medium ${activeTab === tab
                    ? "text-orange-400 border-b-2 border-orange-400"
                    : "text-gray-400 hover:text-white"}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {activeTab === "description" && (
              <div className="space-y-6 text-gray-300">
                <div className="leading-relaxed">{problem.description}</div>
                {problem.examples?.length > 0 && (
                  <div className="space-y-4">
                    {problem.examples.map((example, idx) => (
                      <div key={idx}>
                        <div className="font-semibold text-white mb-2">Example {idx + 1}:</div>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-2">
                          <div>
                            <span className="font-bold text-white">Input: </span>
                            <pre className="inline bg-gray-800 px-2 py-1 rounded text-orange-300 font-mono text-sm">
                              {JSON.stringify(example.input)}
                            </pre>
                          </div>
                          <div>
                            <span className="font-bold text-white">Output: </span>
                            <pre className="inline bg-gray-800 px-2 py-1 rounded text-orange-300 font-mono text-sm">
                              {JSON.stringify(example.output)}
                            </pre>
                          </div>
                          {example.explanation && (
                            <div className="pt-2 border-t border-gray-800">
                              <span className="font-bold text-white">Explanation: </span>
                              <span className="text-gray-400">{example.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {problem.constraints?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Constraints:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-2">
                      {problem.constraints.map((constraint, idx) => (
                        <li key={idx} className="leading-relaxed">{constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {activeTab === "solutions" && (
              <div className="text-gray-400">Solutions will be available after you solve the problem.</div>
            )}
            {activeTab === "submissions" && (
              <div className="text-gray-400">Your previous submissions will appear here.</div>
            )}
          </div>
          {/* Right Panel */}
          <div className="w-1/2 max-h-full flex flex-col bg-gray-950 overflow-y-auto"
            style={{ scrollbarColor: "#333 #111" }}>
            <div className="flex-1 flex flex-col p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-400 font-semibold">Python3</div>
                <button onClick={() => setCode(problem.codeTemplates?.python || "")}
                  className="text-xs text-orange-400 hover:text-orange-300 font-medium"
                  style={{ minWidth: "90px" }}>
                  Reset Code
                </button>
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                className="flex-1 bg-gray-900 text-white p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-800"
                placeholder="Write your Python code here..."
                spellCheck={false}
                style={{ lineHeight: "1.6", minHeight: 250 }}
              />
            </div>
            {showResults && testResults && (
              <div className="px-4 pb-4 max-h-64 overflow-y-auto border-t border-gray-800"
                style={{ scrollbarColor: "#333 #111" }}>
                <div className="py-4">
                  <h3 className="font-semibold text-white mb-3 text-lg">Test Results</h3>
                  <div className="space-y-3">
                    {testResults.map((result, idx) => (
                      <div key={idx}
                        className={`p-4 rounded-lg border ${result.passed
                          ? "bg-green-900/20 border-green-700/50"
                          : "bg-red-900/20 border-red-700/50"}`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-white">
                            {result.passed ? "✅ Test Case " : "❌ Test Case "} {idx + 1}
                          </span>
                          <span className="text-xs text-gray-400">{result.runtime}ms</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Input: </span>
                            <code className="text-orange-300 bg-gray-800 px-2 py-1 rounded">
                              {JSON.stringify(result.input)}
                            </code>
                          </div>
                          <div>
                            <span className="text-gray-400">Expected: </span>
                            <code className="text-green-300 bg-gray-800 px-2 py-1 rounded">
                              {JSON.stringify(result.expectedOutput)}
                            </code>
                          </div>
                          <div>
                            <span className="text-gray-400">Got: </span>
                            <code className={`${result.passed ? "text-green-300" : "text-red-300"} bg-gray-800 px-2 py-1 rounded`}>
                              {result.actualOutput !== undefined ? JSON.stringify(result.actualOutput) : "Error"}
                            </code>
                          </div>
                          {result.error && (
                            <div className="text-red-400 text-xs mt-2 bg-red-900/20 p-2 rounded">
                              ⚠️ {result.error}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="border-t border-gray-800 p-4 flex justify-end gap-3 bg-gray-950">
              <button
                onClick={handleRun} disabled={running}
                className="px-8 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg font-medium transition text-white"
              >{running ? "Running..." : "▶ Run"}</button>
              <button
                onClick={handleSubmit} disabled={submitting}
                className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:text-gray-400 rounded-lg font-medium transition text-white"
              >{submitting ? "Submitting..." : "Submit"}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
