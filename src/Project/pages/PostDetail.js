import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import MyTabs from "../components/myTabs";
import './PostDetail.css';

const PostDetail = () => {
  const navigate = useNavigate();
  const { communityId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 게시글 불러오기
    axios.get('http://localhost:5000/posts')
      .then(response => {
        console.log('Post Data:', response.data); 
        const foundPost = response.data.find(p => p.post_id === parseInt(postId));
        setPost(foundPost);
      })
      .catch(error => console.error(error));

    // 댓글 불러오기
    axios.get(`http://localhost:5000/posts/${postId}/comments`)
    .then(response => {
      console.log('Comments Data:', response.data); // 서버에서 받은 데이터 로깅
      setComments(response.data);
    })
      .catch(error => console.error(error));
  }, [postId]);

  const handleCommentSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('로그인이 필요합니다.');
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const response = await axios.post(`http://localhost:5000/posts/${postId}/comments`, 
        { content: comment }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      setComments([...comments, response.data]);
      setComment('');
      console.log('댓글이 성공적으로 작성되었습니다.');
      setErrorMessage(''); // 에러 메시지 초기화
    } catch (error) {
      console.error('댓글 작성에 실패했습니다:', error.response ? error.response.data : error.message);
      setErrorMessage('댓글 작성에 실패했습니다.'); 
    }
  };
  if (!post) return <div>로딩중...</div>;

  // 날짜 포맷팅 함수
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '날짜 정보 없음' : date.toLocaleString();
  };

  const goHome = () => {
    navigate(`/`);
  }

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
      <div className="post-detail">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <p>작성자: {post.user_id}</p>
        <p>작성 시간: {formatDate(post.created_at)}</p>

        <h3>댓글</h3>
        <ul>
          {comments.map(comment => (
            <li key={comment.comment_id}>
              <p>{comment.content}</p>
              <p>작성자: {comment.user_id}</p>
              <p>작성 시간: {formatDate(comment.created_at)}</p>
            </li>
          ))}
        </ul>

        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
          ></textarea>
          <button type="submit">댓글 작성</button>
          {errorMessage && <p className="error">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default PostDetail;
