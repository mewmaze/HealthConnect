import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

const NewPostPage = () => {
  const { communityId } = useParams();
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
        user_id: userId,
        community_id: communityId,
      });

      console.log("글이 성공적으로 작성되었습니다.");
      navigate(`/community/${communityId}`);
    } catch (error) {
      console.error("글 작성 실패:", error);
      setErrorMessage("글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, pb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          글쓰기
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              fullWidth
              multiline
              minRows={6}
            />
            <Button type="submit" variant="contained" size="large">
              작성
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default NewPostPage;
