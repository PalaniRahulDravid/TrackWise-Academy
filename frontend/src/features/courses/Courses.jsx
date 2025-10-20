import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import CourseSearchBar from "./CourseSearchBar";
import Header from "../../components/Header";

const BACKEND = "http://localhost:5000";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async (query = "") => {
    setLoading(true);
    const endpoint = query
      ? `${BACKEND}/api/courses/youtube-search?query=${encodeURIComponent(query)}`
      : `${BACKEND}/api/courses/youtube-search?query=Thorab%20Codes%20React%20Tutorial`;
    const res = await fetch(endpoint);
    const data = await res.json();
    setCourses(data.results || []);
    setLoading(false);
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
        <div className="flex flex-col gap-6 w-full">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </>
  );
}
