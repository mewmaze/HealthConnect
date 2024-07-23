import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import MyTabs from "../components/myTabs";
import './NewPostPage.css';

const NewPostPage = () => {
  const { communityId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const goHome = () => {
    navigate(`/`);
  }

  const handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('로그인이 필요합니다.');
      setTimeout(() => {
        setErrorMessage('');
        navigate('/login');
      }, 2000);
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    axios.post('http://localhost:5000/posts', { title, content, user_id: userId }, {
      headers: {
        Authorization: token
      }
    })
      .then(() => {
        navigate(`/community/${communityId}`);
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <nav className="topNav">
        <li className="Logo" onClick={goHome}>
          <img className="imgLogo" src={require('../img/MainLogo.png')} alt="Logo" />
        </li>
        <li>
          <MyTabs />
        </li>
      </nav>
      <div className="new-post-page">
        <h2>글쓰기</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="new-post-form">
          <input 
            type="text" 
            placeholder="제목" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
          <textarea 
            placeholder="내용" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            required 
          ></textarea>
          <button type="submit">작성</button>
        </form>
      </div>
    </div>
  );
};

export default NewPostPage;
