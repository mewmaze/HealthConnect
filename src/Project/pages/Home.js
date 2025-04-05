import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "./Home.css";
import BannerSlider from "../components/BannerSlider";
import ChallengeSlider from "../components/ChallengeSlider";
import LangkingList from "../components/LangkingList";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(""); // 선택한 카테고리 상태 추가
  const [selectedCategory, setSelectedCategory] = useState(""); // 클릭된 카테고리 상태 추가

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = selectedCategory
          ? { communityId: selectedCategory }
          : {};
        const postsResponse = await api.get("/posts", { params });
        setPosts(postsResponse.data);
      } catch (error) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setCategory(category);
    setSelectedCategory(category); // 클릭된 카테고리 업데이트
  };

  return (
    <div className="Home">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <div className="Home-Langking">
        <LangkingList />
      </div>
      <div className="Home-title">커뮤니티</div>
      <div className="Home-box">
        <div className="Home-filter">
          <button
            className={`category-buttons ${
              selectedCategory === "" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("")}
          >
            전체
          </button>
          <button
            className={`category-buttons ${
              selectedCategory === "1" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("1")}
          >
            런닝
          </button>
          <button
            className={`category-buttons ${
              selectedCategory === "2" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("2")}
          >
            자전거
          </button>
          <button
            className={`category-buttons ${
              selectedCategory === "3" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("3")}
          >
            헬스
          </button>
          <button
            className={`category-buttons ${
              selectedCategory === "4" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("4")}
          >
            다이어트
          </button>
          <button
            className={`category-buttons ${
              selectedCategory === "5" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("5")}
          >
            자유
          </button>
        </div>
        <ul>
          {posts.slice(0, 6).map((post) => (
            <li key={post.post_id}>
              {/* Link 컴포넌트로 감싸서 상세 페이지로 이동하도록 설정 */}
              <Link
                to={`/community/${post.community_id}/post/${post.post_id}`}
                className="post-title"
              >
                {post.title}
              </Link>
              <div className="post-author">
                {post.user ? post.user.nickname : "Unknown"}
              </div>
              <div className="post-date">
                {new Date(post.created_at).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="Home-banner">
        <BannerSlider />
      </div>
      <div className="Home-challenge-title">
        챌린지
        <span className="hot-label">HOT!</span>
      </div>
      <div className="Home-challenge">
        <ChallengeSlider />
      </div>
    </div>
  );
}

export default Home;
