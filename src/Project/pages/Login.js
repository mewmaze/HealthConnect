import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../hooks/AuthContext';
import '../components/styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { fetchCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setEmailError(emailRegex.test(value) ? '' : '올바른 이메일 형식을 입력해주세요.');
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setPasswordError(passwordRegex.test(value) ? '' : '비밀번호는 최소 8자와 영문, 숫자, 특수문자를 포함합니다.');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (emailError || passwordError) {
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      });

        
    console.log('Response Data:', response.data);
    
    const token = response.data.token;
    const userId = response.data.user_id;

    // 토큰을 localStorage에 저장
    localStorage.setItem('token', token);
    
   
    console.log('Received Token:', token);
    console.log('User ID:', userId);


      // 현재 사용자 정보를 업데이트
      await fetchCurrentUser();

      navigate(`/myPage/${userId}`);
    } catch (error) {
      console.error('Error 로그인 실패', error.response ? error.response.data : error.message);
    }
  };  

  const handleSignup = () => {
    navigate('/signUp');
  };

  return (
      <div className="container">
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <p className="error">{emailError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordError && <p className="error">{passwordError}</p>}
          </div>
          <button type="submit">로그인</button>
        </form>
        <p>아직 계정이 없으신가요?</p>
        <button onClick={handleSignup}>회원가입 하기</button>
      </div>
  );
};

export default Login;