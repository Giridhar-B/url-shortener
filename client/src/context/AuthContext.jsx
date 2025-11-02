import { createContext, useContext, useState, useEffect } from "react";

// Create and export the context
export const AuthContext = createContext();

// Custom hook to use AuthContext anywhere
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Login handler
  const login = (userData) => {
    setUser(userData);
  };

  // Logout handler
  const logout = () => {
    setUser(null);
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
