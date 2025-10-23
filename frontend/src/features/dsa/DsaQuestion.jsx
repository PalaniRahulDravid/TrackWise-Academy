import { useEffect, useState } from "react";
import { fetchQuestionById, submitSolution } from "./api";
import useAuth from "../../hooks/useAuth";

export default function DsaQuestion({ questionId, onBack }) {
  const { token } = useAuth();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState(`# Write your Python code here`);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestionById(questionId).then(res => setQuestion(res.data.question));
  }, [questionId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await submitSolution({
        questionId,
        code,
        language: "python",
        status: "solved",
        result: "Sample output, mocked for now"
      }, token);
      setStatus("success");
      setResult("Submitted! (Backend code-run integration required for real output)");
    } catch (e) {
      setStatus("fail");
      setResult("Submission failed: " + (e?.response?.data?.error || "Network error"));
    }
    setSubmitting(false);
  };

  if (!question) return <div className="py-10 text-center text-orange-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">← Back to DSA Sheet</button>
      <div className="rounded border bg-gray-900 text-white p-6 mb-5">
        <h1 className="text-xl font-bold text-orange-400 mb-2">{question.title} <span className="text-sm text-gray-300 ml-5">{question.difficulty}</span></h1>
        <div className="mb-4">{question.description}</div>
        <div className="mb-2 text-sm">
          <div className="mb-1 font-semibold">Input:</div>
          <pre className="bg-gray-800 p-2 rounded">{question.input}</pre>
          <div className="mb-1 mt-2 font-semibold">Output:</div>
          <pre className="bg-gray-800 p-2 rounded">{question.output}</pre>
        </div>
        <div className="py-2 text-xs">
          {question.sampleCases?.length > 0 && (
            <>
              <div className="mb-1 font-semibold">Sample Cases:</div>
              {question.sampleCases.map((s, idx) =>
                <div key={idx} className="flex gap-5 mb-1">
                  <span className="font-mono text-teal-400">Input: {s.input}</span>
                  <span className="font-mono text-yellow-300">Output: {s.output}</span>
                </div>)}
            </>
          )}
        </div>
      </div>
      <div className="mb-3">
        <textarea
          className="w-full min-h-[180px] max-h-[380px] rounded border bg-gray-950 text-white px-3 py-2 font-mono"
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="flex gap-4 items-center">
        <button className="bg-orange-500 rounded px-6 py-2 text-white font-bold hover:bg-orange-600"
          onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
        {status && (
          <span className={status === "success" ? "text-green-500" : "text-red-400"}>
            {result}
          </span>
        )}
      </div>
    </div>
  );
}
