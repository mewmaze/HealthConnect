//로그인한 사용자의 정보 제공
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token'); // 토큰을 localStorage에서 가져오기
      if (!token) {
        console.log('No token found in localStorage');
        return;
      }
      console.log('Token:', token); // 디버깅: 토큰 확인
      const res = await axios.get('http://localhost:5000/auth/current-user', {
        headers: { Authorization: `Bearer ${token}` } // 토큰을 요청 헤더에 추가
      });
      setCurrentUser({ ...res.data, token }); // 사용자 정보와 토큰을 함께 저장
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};