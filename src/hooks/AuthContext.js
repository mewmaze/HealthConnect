//로그인한 사용자의 정보 제공
//token, user관리 
import { createContext, useState, useEffect } from 'react';

// AuthContext를 생성하여 사용자 인증 상태를 관리
export const AuthContext = createContext(); 

// AuthContextProvider는 인증 정보를 제공
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => { // currentUser : 현재 로그인한 사용자 정보
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null; // 사용자 정보가 있으면 파싱하여 반환, 없으면 null 반환
  });

  const [token, setToken] = useState(() => { // token : 현재 로그인한 사용자의 토큰
    return localStorage.getItem('token') || null; // 토큰이 있으면 반환, 없으면 null 반환
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

  //로그아웃시 사용자 정보를 null로 설정하고 localStorate에서 user,token 제거
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