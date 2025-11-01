import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { user } = useAuth();
  
  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to={redirectTo} replace />;
  }
  // Logged in? Render children or Outlet
  return children ? children : <Outlet />;
}
