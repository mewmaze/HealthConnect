import { createContext, useState, useEffect, useCallback } from 'react';
import { setupAuthInterceptor } from '../api/api';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }, []);

  useEffect(() => {
    setupAuthInterceptor(logout);
  }, [logout]);

  return (
      <AuthContext.Provider value={{ currentUser, setCurrentUser, token, setToken, logout }}>
          {children}
      </AuthContext.Provider>
  );
};