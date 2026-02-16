import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Box,
  Divider,
  List,
  ListItem,
  Alert,
} from "@mui/material";
import api from "../../api/api";

const PostDetail = ({ communities, addComment }) => {
  const { communityId, postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    api
      .get(`/posts/${postId}`)
      .then((response) => {
        setPost(response.data);
        setEditedTitle(response.data.title);
        setEditedContent(response.data.content);
      })
      .catch((error) => console.error(error));

    api
      .get(`/posts/${postId}/comments`)
      .then((response) => setComments(response.data))
      .catch((error) => console.error(error));
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        content: comment,
      });
      setComments([...comments, response.data]);
      setComment("");
      setErrorMessage("");
    } catch (error) {
      console.error(
        "댓글 작성에 실패했습니다:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("댓글 작성에 실패했습니다.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    try {
      await api.put(`/posts/${postId}`, {
        title: editedTitle,
        content: editedContent,
      });
      setPost({ ...post, title: editedTitle, content: editedContent });
      setEditMode(false);
      setErrorMessage("");
    } catch (error) {
      console.error(
        "게시글 수정에 실패했습니다:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("게시글 수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);
      navigate(`/community/${communityId}`);
    } catch (error) {
      console.error(
        "게시글 삭제에 실패했습니다:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("게시글 삭제에 실패했습니다.");
    }
  };

  if (!post)
    return (
      <Container maxWidth="md" sx={{ mt: 12, textAlign: "center" }}>
        <Typography>로딩중...</Typography>
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 8 }, pb: 4, px: { xs: 1, sm: 3 } }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        {editMode ? (
          <form onSubmit={handleEditSubmit}>
            <Stack spacing={2}>
              <TextField
                label="제목"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="내용"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                required
                fullWidth
                multiline
                minRows={4}
              />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained">
                  저장
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(false)}
                >
                  취소
                </Button>
              </Stack>
            </Stack>
          </form>
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" sx={{ pb: 2, borderBottom: "2px solid #e0e0e0" }}>
              {post.title}
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ my: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                작성자: {post.user_id}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                {new Date(post.created_at).toLocaleString()}
              </Typography>
            </Stack>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                my: 2,
                minHeight: 200,
                bgcolor: "#fafafa",
              }}
            >
              <Typography sx={{ lineHeight: 1.8 }}>{post.content}</Typography>
            </Paper>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                sx={{ bgcolor: "#212121", "&:hover": { bgcolor: "#424242" } }}
                onClick={() => setEditMode(true)}
              >
                수정
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                삭제
              </Button>
            </Stack>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          댓글
        </Typography>
        <List disablePadding>
          {comments.map((cmt) => (
            <ListItem
              key={cmt.comment_id}
              disablePadding
              sx={{
                py: 1.5,
                px: 2,
                mb: 1,
                bgcolor: "#fafafa",
                borderRadius: 1,
                display: "block",
              }}
            >
              <Typography>{cmt.content}</Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 0.5 }}
              >
                <Typography variant="caption" color="text.secondary">
                  작성자: {cmt.user_id}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontStyle="italic">
                  {new Date(cmt.created_at).toLocaleString()}
                </Typography>
              </Stack>
            </ListItem>
          ))}
        </List>

        <Box component="form" onSubmit={handleCommentSubmit} sx={{ mt: 2 }}>
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 1 }}
          />
          <Button type="submit" variant="contained">
            댓글 작성
          </Button>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PostDetail;
