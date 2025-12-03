import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import VerifyEmail from "./features/auth/VerifyEmail";
import ForgotPassword from "./features/auth/ForgotPassword";
import ResetPassword from "./features/auth/ResetPassword";

import Roadmap from "./features/roadmap/Roadmap";
import Chat from "./features/chat/Chat";
import Games from "./features/games/Games";
import TicTacToe from "./features/games/TicTacToe";
import MemoryFlip from "./features/games/MemoryFlip";
import Snake from "./features/games/Snake";
import WhackAMole from "./features/games/WhackAMole";
import CoursesHome from "./features/courses/CoursesHome";
import Courses from "./features/courses/Courses";
import TrackWiseCourses from "./features/courses/TrackWiseCourses";
import FunnyGames from "./features/games/FunnyGames";
import MindGames from "./features/games/MindGames";

import { AuthProvider } from "./hooks/useAuth";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import DSAHome from "./features/dsa/DSAHome";
import DsaQuestionList from "./features/dsa/DsaQuestionList";
import CompanyList from "./features/dsa/CompanyList";
import CompanyQuestionList from "./features/dsa/CompanyQuestionList";
import DsaProblemDetail from "./features/dsa/DsaProblemDetail";

import { wakeUpServer } from "./utils/serverWakeUp";

export default function App() {
  // Wake up server on app load (for Render.com free tier)
  useEffect(() => {
    wakeUpServer();
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/roadmaps" element={<Roadmap />} />
          <Route path="/doubts" element={<Chat />} />
          <Route path="/games" element={<Games />} />
          <Route path="/courses" element={<CoursesHome />} />
          <Route path="/courses/youtube" element={<Courses />} />
          <Route path="/courses/trackwise" element={<TrackWiseCourses />} />
          <Route path="/dsa" element={<DSAHome />} />

          {/* Protected Routes */}
          <Route path="/games/funny" element={<ProtectedRoute><FunnyGames /></ProtectedRoute>} />
          <Route path="/games/mind" element={<ProtectedRoute><MindGames /></ProtectedRoute>} />
          <Route path="/games/tictactoe" element={<ProtectedRoute><TicTacToe /></ProtectedRoute>} />
          <Route path="/games/memory" element={<ProtectedRoute><MemoryFlip /></ProtectedRoute>} />
          <Route path="/games/snake" element={<ProtectedRoute><Snake /></ProtectedRoute>} />
          <Route path="/games/whackamole" element={<ProtectedRoute><WhackAMole /></ProtectedRoute>} />
          <Route path="/dsa/sheet" element={<ProtectedRoute><DsaQuestionList /></ProtectedRoute>} />
          <Route path="/dsa/company" element={<ProtectedRoute><CompanyList /></ProtectedRoute>} />
          <Route path="/dsa/company/:company" element={<ProtectedRoute><CompanyQuestionList /></ProtectedRoute>} />
          <Route path="/dsa/problems/:id" element={<ProtectedRoute><DsaProblemDetail /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
