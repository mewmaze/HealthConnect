import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Community.css';

const Community = () => {
  const { communityId } = useParams();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/posts')
      .then(response => setPosts(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleNewPost = () => {
    navigate(`/community/${communityId}/new-post`);
  };

  return (
        <div className="community">
        <h2>게시판</h2>
        <ul className="posts-list">
          {posts.map(post => (
            <li key={post.post_id}>
              <Link to={`/community/${communityId}/post/${post.post_id}`}>{post.title}</Link>
              <p>작성자: {post.user_id}</p>
              <p>작성 시간: {new Date(post.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
        <button className="new-post-button" onClick={handleNewPost}>글쓰기</button>
      </div>
  );
};

export default Community;
