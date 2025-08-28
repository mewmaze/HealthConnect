import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";
import "./NewPostPage.css";

const NewPostPage = () => {
  const { communityId } = useParams(); // 커뮤니티 ID 가져오기
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("로그인이 필요합니다.");
      setTimeout(() => {
        setErrorMessage("");
        navigate("/login");
      }, 2000);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      await api.post("/posts", {
        title,
        content,
        user_id: userId, // 서버와 일치하도록 수정
        community_id: communityId, // 서버와 일치하도록 수정
      });

      console.log("글이 성공적으로 작성되었습니다.");
      navigate(`/community/${communityId}`); // 글 작성 후 해당 커뮤니티 페이지로 이동
    } catch (error) {
      console.error("글 작성 실패:", error);
      setErrorMessage("글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="new-post-page">
      <h2>글쓰기</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="new-post-form">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="new-post-submit-button">
          작성
        </button>{" "}
        {/* 폼 내부에 버튼 위치 이동 */}
      </form>
    </div>
  );
};

export default NewPostPage;
