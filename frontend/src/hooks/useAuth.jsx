import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, logout as logoutUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Try to fetch user profile - cookies are sent automatically
    // If user is logged in, backend will authenticate via HTTP-Only cookie
    getProfile()
      .then((res) => {
        if (mounted && res.success) {
          setUser(res.user || res.data?.user);
        }
        if (mounted) setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        // If authentication fails, user is not logged in
        // No need to clear anything - cookies are HTTP-Only
        if (mounted) setLoading(false);
      });

    // Cleanup on component unmount
    return () => {
      mounted = false;
    };
  }, []);

  const logout = () => {
    setUser(null);
    logoutUser();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
