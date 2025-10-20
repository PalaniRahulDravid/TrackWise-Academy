export default function CourseCard({ course }) {
  function formatDuration(raw) {
    return raw.replace(/^PT/, '')
      .replace(/(\d+)H/, '$1h ')
      .replace(/(\d+)M/, '$1m ')
      .replace(/(\d+)S/, '$1s')
      .trim();
  }

  return (
    <div className="border rounded-lg shadow bg-gray-900 flex flex-col sm:flex-row p-4 gap-4 items-center w-full">
      <img
        src={course.thumbnail}
        alt={course.title}
        loading="lazy"
        className="w-full sm:w-32 h-32 sm:h-24 object-cover rounded-lg mb-2 sm:mb-0"
      />
      <div className="flex-1 flex flex-col gap-1 w-full">
        <h3 className="font-bold text-base sm:text-lg text-orange-400 line-clamp-2 break-words">
          {course.title}
        </h3>
        <div className="text-xs sm:text-sm text-gray-300 mb-2 line-clamp-2 break-words">
          {course.description}
        </div>
        <div className="text-xs text-gray-500 mb-1">
          Channel: <span className="font-semibold">{course.channel}</span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-gray-400 mt-1">
          <span>Duration: {formatDuration(course.duration)}</span>
          <span>Views: {course.views}</span>
          <span>Likes: {course.likes}</span>
        </div>
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 bg-orange-500 px-3 py-1 rounded text-white text-xs sm:text-sm font-bold hover:bg-orange-600 w-fit"
        >
          Play Video
        </a>
      </div>
    </div>
  );
}
