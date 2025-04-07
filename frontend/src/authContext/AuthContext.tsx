import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../interfaces/User";

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: User | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthState = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: any = jwtDecode(token);
          setUser(decodedToken.user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchAuthState();
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
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
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
