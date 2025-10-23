import { useState } from "react";
export default function DsaLanding({ user, onStageSelect }) {
  const [stage, setStage] = useState("");
  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name || "User"}</h1>
      <p className="mb-4 text-gray-500">Welcome to DSA preparation!</p>
      <h2 className="mb-2">Select your learning stage:</h2>
      <div className="flex flex-col gap-4 mb-6">
        {["beginner", "intermediate", "advanced"].map(lvl => (
          <button
            key={lvl}
            className={`border rounded-lg py-2 px-4 text-lg capitalize ${
              stage === lvl
                ? "bg-orange-500 text-white"
                : "bg-gray-900 text-orange-400"
            }`}
            onClick={() => setStage(lvl)}
          >
            {lvl}
          </button>
        ))}
      </div>
      <button
        disabled={!stage}
        className="bg-blue-600 text-white rounded px-6 py-2 font-bold disabled:opacity-50"
        onClick={() => onStageSelect(stage)}
      >
        Let's Go
      </button>
    </div>
  );
}
