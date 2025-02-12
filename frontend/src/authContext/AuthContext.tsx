import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userId: number | null;
  login: (userId: number) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load authentication state from localStorage on app startup
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userId: number) => {
    console.log('Logging in...');
    setIsLoggedIn(true);
    setUserId(userId);
    localStorage.setItem("userId", String(userId)); // Save to local storage
  };

  const logout = () => {
    console.log('Logging out...');
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem("userId"); // Clear from local storage
  };

  console.log('AuthProvider isLoggedIn:', isLoggedIn, 'UserId:', userId);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
