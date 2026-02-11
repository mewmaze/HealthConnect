import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./MyPost.css";

const MyPost = () => {
  const { user_id, postId } = useParams();
  const [post, setPost] = useState(null); // Initialize as null
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/api/myPage/${user_id}/${postId}`)
      .then((response) => {
        console.log("Post Data:", response.data);
        // Directly set the post if response.data is the post object
        if (response.data && response.data.post_id === parseInt(postId)) {
          setPost(response.data);
        } else {
          // Handle case where post is not found
          setError("Post not found");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("An error occurred while fetching the post");
      });
  }, [user_id, postId]);

  if (error) return <div>{error}</div>;
  if (!post) return <div>로딩중...</div>;

  return (
    <div>
      <div className="post-detail">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <p>작성자: {post.user_id}</p>
        <p>작성 시간: {new Date(post.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MyPost;
