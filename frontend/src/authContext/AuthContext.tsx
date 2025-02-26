import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: number | 0;
  role: string | null;
  login: (userId: number, role: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<number>(0);
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load authentication state from localStorage on app startup
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");

    if (storedUserId && storedRole) {
      setUserId(Number(storedUserId));
      setRole(storedRole);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userId: number, role: string) => {
    console.log("Logging in...");
    setIsLoggedIn(true);
    setUserId(userId);
    setRole(role);
    localStorage.setItem("userId", String(userId));
    localStorage.setItem("role", role);
  };

  const logout = () => {
    console.log("Logging out...");
    setIsLoggedIn(false);
    setUserId(0);
    setRole(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
  };

  console.log("AuthProvider isLoggedIn:", isLoggedIn, "UserId:", userId, "Role:", role);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userId, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
