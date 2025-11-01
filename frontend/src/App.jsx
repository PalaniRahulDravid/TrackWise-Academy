import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Courses from './features/courses/Courses';
import FunnyGames from "./features/games/FunnyGames";
import MindGames from "./features/games/MindGames";

import { AuthProvider } from "./hooks/useAuth";
import GuestRoute from "./components/GuestRoute";

import DSAHome from "./features/dsa/DSAHome";
import DsaQuestionList from "./features/dsa/DsaQuestionList";
import CompanyList from "./features/dsa/CompanyList";
import CompanyQuestionList from "./features/dsa/CompanyQuestionList";
import DsaProblemDetail from "./features/dsa/DsaProblemDetail";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/roadmaps" element={<Roadmap />} />
          <Route path="/doubts" element={<Chat />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/funny" element={<FunnyGames />} />
          <Route path="/games/mind" element={<MindGames />} />
          <Route path="/games/tictactoe" element={<TicTacToe />} />
          <Route path="/games/memory" element={<MemoryFlip />} />
          <Route path="/games/snake" element={<Snake />} />
          <Route path="/games/whackamole" element={<WhackAMole />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/dsa" element={<DSAHome />} />
          <Route path="/dsa/sheet" element={<DsaQuestionList />} />
          <Route path="/dsa/company" element={<CompanyList />} />
          <Route path="/dsa/company/:company" element={<CompanyQuestionList />} />
          <Route path="/dsa/problems/:id" element={<DsaProblemDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
