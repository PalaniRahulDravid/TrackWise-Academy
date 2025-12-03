import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

export default function TrackWiseCourses() {
  const navigate = useNavigate();

  const upcomingCourses = [
    {
      title: 'Full Stack Web Development',
      description: 'Master MERN stack with real-world projects',
      duration: '12 weeks',
      level: 'Beginner to Advanced',
      icon: '💻'
    },
    {
      title: 'Data Structures & Algorithms',
      description: 'Complete DSA mastery for interviews',
      duration: '10 weeks',
      level: 'Intermediate',
      icon: '🧮'
    },
    {
      title: 'System Design Fundamentals',
      description: 'Learn to design scalable systems',
      duration: '8 weeks',
      level: 'Advanced',
      icon: '🏗️'
    }
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              TrackWise Premium Courses
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Expert-crafted courses with certificates and mentor support
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-lg p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold mb-3">🚀 Coming Soon!</h2>
          <p className="text-lg mb-4">
            We're working hard to bring you the best learning experience
          </p>
          <button
            onClick={() => navigate('/courses/youtube')}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Explore YouTube Courses →
          </button>
        </div>

        {/* Upcoming Courses Preview */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-center">📚 What's Coming</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingCourses.map((course, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-purple-400 transition"
              >
                <div className="text-5xl mb-4">{course.icon}</div>
                <h4 className="text-xl font-bold mb-2">{course.title}</h4>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>⏱️ {course.duration}</span>
                  <span>📊 {course.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">✨ Course Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎓</div>
              <h4 className="font-bold mb-1">Certificate</h4>
              <p className="text-sm text-gray-600">Get recognized for your skills</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">👨‍🏫</div>
              <h4 className="font-bold mb-1">Mentor Support</h4>
              <p className="text-sm text-gray-600">Direct access to experts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💼</div>
              <h4 className="font-bold mb-1">Real Projects</h4>
              <p className="text-sm text-gray-600">Build portfolio-ready work</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-bold mb-1">Lifetime Access</h4>
              <p className="text-sm text-gray-600">Learn at your own pace</p>
            </div>
          </div>
        </div>

        {/* Notification Form */}
        <div className="mt-12 max-w-xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-4">Get Notified When We Launch</h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
            />
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
