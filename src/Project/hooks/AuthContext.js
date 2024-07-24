//로그인한 사용자의 정보 제공
//token, user관리 
import { createContext, useState, useEffect } from 'react';

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

  //로그아웃시 localStorate에서 user,token 삭제
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
      <AuthContext.Provider value={{ currentUser, setCurrentUser, token, setToken ,logout}}>
          {children}
      </AuthContext.Provider>
  );
};