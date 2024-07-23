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

<<<<<<< HEAD
    const community = communities.find(c => c.id === parseInt(communityId));

    if (!community) {
        return <div>커뮤니티를 찾을 수 없습니다.</div>;
    }

    const handleNewPost = () => {
        navigate(`/community/${community.id}/new-post`);
    };

    return (
      <div className="community">
          <h2>{community.name}</h2>
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
=======
  const handleNewPost = () => {
    navigate(`/community/${communityId}/new-post`);
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
>>>>>>> 269ea67950137398c425d289e065a6a29fc3b916
      </div>
  );
};

export default Community;
