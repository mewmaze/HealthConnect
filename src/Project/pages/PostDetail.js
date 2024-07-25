import { useParams, useNavigate } from 'react-router-dom';
import Comment from '../components/Comment';
import NewComment from '../components/NewComment';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostDetail.css';

const PostDetail = ({ communities, addComment }) => {
  const { communityId, postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    // 게시글 불러오기
    axios.get(`http://localhost:5000/posts/${postId}`)
      .then(response => {
        setPost(response.data);
        setEditedTitle(response.data.title);
        setEditedContent(response.data.content);
      })
      .catch(error => console.error(error));

    // 댓글 불러오기
    axios.get(`http://localhost:5000/posts/${postId}/comments`)
      .then(response => setComments(response.data))
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
      setErrorMessage('');
    } catch (error) {
      console.error('댓글 작성에 실패했습니다:', error.response ? error.response.data : error.message);
      setErrorMessage('댓글 작성에 실패했습니다.');
    }
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/posts/${postId}`, 
        { title: editedTitle, content: editedContent }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setPost({ ...post, title: editedTitle, content: editedContent });
      setEditMode(false);
      setErrorMessage('');
    } catch (error) {
      console.error('게시글 수정에 실패했습니다:', error.response ? error.response.data : error.message);
      setErrorMessage('게시글 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate(`/community/${communityId}`);
    } catch (error) {
      console.error('게시글 삭제에 실패했습니다:', error.response ? error.response.data : error.message);
      setErrorMessage('게시글 삭제에 실패했습니다.');
    }
  };

  if (!post) return <div>로딩중...</div>;

  return (
    <div>
      <div className="post-detail">
        {editMode ? (
          <form onSubmit={handleEditSubmit}>
            <input 
              type="text" 
              value={editedTitle} 
              onChange={e => setEditedTitle(e.target.value)} 
              required 
            />
            <textarea
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              required
            ></textarea>
            <button type="submit">저장</button>
            <button type="button" onClick={() => setEditMode(false)}>취소</button>
          </form>
        ) : (
          <>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>작성자: {post.user_id}</p>
            <p>작성 시간: {new Date(post.created_at).toLocaleString()}</p>
            <button onClick={() => setEditMode(true)}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </>
        )}

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
