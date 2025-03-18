import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from 'jwt-decode';

interface UserType {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_registered: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: UserType | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load authentication state from localStorage on app startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setUser(decodedToken.user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token");
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    try {
      localStorage.setItem("token", token);
      const decodedToken: any = jwtDecode(token);
      setUser(decodedToken.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error decoding token", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
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
