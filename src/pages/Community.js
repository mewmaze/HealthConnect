import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Community.css";

const Community = () => {
  const { communityId } = useParams();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/posts", {
        params: { communityId }, // 커뮤니티 ID를 쿼리 파라미터로 전달
      })
      .then((response) => setPosts(response.data))
      .catch((error) =>
        console.error("게시글을 불러오는 데 실패했습니다:", error)
      );
  }, [communityId]);

  const handleNewPost = () => {
    navigate(`/community/${communityId}/new-post`);
  };

  return (
    <div className="community">
      <table className="posts-list">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post.post_id}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/community/${communityId}/post/${post.post_id}`}>
                  {post.title}
                </Link>
              </td>
              <td>{post.user.nickname}</td>
              <td>{new Date(post.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="new-post-button" onClick={handleNewPost}>
        글쓰기
      </button>
    </div>
  );
};

export default Community;
