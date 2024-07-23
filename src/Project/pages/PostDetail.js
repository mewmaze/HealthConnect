import { useParams } from 'react-router-dom';
import Comment from '../components/Comment';
import NewComment from '../components/NewComment';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostDetail.css';

const PostDetail = ({ communities, addComment }) => {
  const { communityId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 게시글 불러오기
    axios.get('http://localhost:5000/posts')
      .then(response => {
        const foundPost = response.data.find(p => p.post_id === parseInt(postId));
        setPost(foundPost);
      })
      .catch(error => console.error(error));

    // 댓글 불러오기
    axios.get(`http://localhost:5000/posts/${postId}/comments`)
      .then(response => setComments(response.data))
      .catch(error => console.error(error));
  }, [postId]);

  const handleCommentSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('로그인이 필요합니다.');
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    axios.post(`http://localhost:5000/posts/${postId}/comments`, { content: comment, user_id: userId }, {
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        setComments([...comments, { ...response.data, username: '현재 사용자' }]); // 임시 사용자 이름
        setComment('');
      })
      .catch(error => console.error(error));
  };

  if (!post) return <div>로딩중...</div>;

  return (
    <div>
      <div className="post-detail">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <p>작성자: {post.user_id}</p>
        <p>작성 시간: {new Date(post.created_at).toLocaleString()}</p>

        <h3>댓글</h3>
        <ul>
          {comments.map(comment => (
            <li key={comment.comment_id}>
              <p>{comment.content}</p>
              <p>작성자: {comment.user_id}</p>
              <p>작성 시간: {new Date(comment.created_at).toLocaleString()}</p>
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
