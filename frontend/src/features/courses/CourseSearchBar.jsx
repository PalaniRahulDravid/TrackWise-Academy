import { useState } from "react";

export default function CourseSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    onSearch(query);
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        className="w-36 sm:w-64 px-2 py-1 border border-gray-700 focus:border-orange-400 rounded text-sm bg-gray-900 text-white placeholder-gray-400 transition"
        placeholder="Search any course..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit" className="bg-orange-500 text-white px-3 rounded font-bold text-sm">
        Search
      </button>
    </form>
  );
}
