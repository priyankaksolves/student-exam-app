import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../interfaces/User";

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: User | null;
  updateUser: (updatedUser: Partial<User>) => void;
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
      localStorage.setItem("registered", String(decodedToken.user.is_registered));
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error decoding token", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("registered");
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedUser } : null));
    localStorage.setItem("registered", String(updatedUser.is_registered ?? ""));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser, loading }}>
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
