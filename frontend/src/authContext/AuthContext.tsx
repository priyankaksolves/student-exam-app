import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode; // Allow children to be any valid React node
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = () => {
    console.log('Logging in...');
    setIsLoggedIn(true);
  };
  const logout = () => {
    console.log('Logging out...');
    setIsLoggedIn(false);
  };

  console.log('AuthProvider isLoggedIn:', isLoggedIn);


  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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
