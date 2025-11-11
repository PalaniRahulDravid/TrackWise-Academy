import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import CourseSearchBar from "./CourseSearchBar";
import Header from "../../components/Header";

// Auto-detect API base URL
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  return isDevelopment 
    ? "http://localhost:5000/api"
    : "https://trackwise-academy.onrender.com/api";
};

const BACKEND = getBaseURL();

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCourses = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const endpoint = query
        ? `${BACKEND}/courses/youtube-search?query=${encodeURIComponent(query)}`
        : `${BACKEND}/courses/youtube-search?query=React%20Tutorial`;
      const res = await fetch(endpoint);
      const data = await res.json();
      
      if (!data.success && data.message) {
        setError(data.message);
      }
      
      setCourses(data.results || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <Header />
      <main className="px-4 py-12 max-w-4xl mx-auto">
        <section className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              Available Courses
            </span>
          </h1>
          <div className="flex flex-col items-center justify-center mt-3 mb-1">
            <CourseSearchBar onSearch={fetchCourses} />
          </div>
        </section>

        {loading && <div className="mt-8 text-center text-orange-400">Loading...</div>}
        {error && (
          <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            <p className="mt-2 text-sm">
              To fix: Add <code className="bg-red-200 px-1">YOUTUBE_API_KEY</code> to your backend .env file.
              Get one from: <a href="https://console.cloud.google.com/apis" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a>
            </p>
          </div>
        )}
        <div className="flex flex-col gap-6 w-full">
          {courses.length > 0 ? (
            courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            !loading && !error && (
              <div className="text-center text-gray-500 mt-8">
                No courses found. Try searching for something else.
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
}
