import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, logout as logoutUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then((res) => {
        if (mounted && res.success) setUser(res.user || res.data?.user);
        if (mounted) setLoading(false);
      })
      .catch(() => mounted && setLoading(false));

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
