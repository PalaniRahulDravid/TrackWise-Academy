import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Roadmap from "./features/roadmap/Roadmap";
import { AuthProvider } from "./hooks/useAuth";
import GuestRoute from "./components/GuestRoute";

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
          <Route path="/roadmaps" element={<Roadmap />} />
          {/* You can add other public routes for courses, doubts, and games here */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
