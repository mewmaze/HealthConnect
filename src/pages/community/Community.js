import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../api/api";

const Community = () => {
  const { communityId } = useParams();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/posts", {
        params: { communityId },
      })
      .then((response) => setPosts(response.data))
      .catch((error) =>
        console.error("게시글을 불러오는 데 실패했습니다:", error),
      );
  }, [communityId]);

  const handleNewPost = () => {
    navigate(`/community/${communityId}/new-post`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 8 }, pb: 10, px: { xs: 1, sm: 3 } }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", width: 60, display: { xs: "none", sm: "table-cell" } }}>
                번호
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                제목
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", width: 120, display: { xs: "none", sm: "table-cell" } }}
              >
                작성자
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", width: 160, display: { xs: "none", md: "table-cell" } }}
              >
                작성일
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post, index) => (
              <TableRow
                key={post.post_id}
                hover
                sx={{ "&:nth-of-type(even)": { bgcolor: "#fafafa" } }}
              >
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{index + 1}</TableCell>
                <TableCell>
                  <Link
                    to={`/community/${communityId}/post/${post.post_id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontWeight: "bold",
                    }}
                  >
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{post.user.nickname}</TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  {new Date(post.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab
        color="primary"
        onClick={handleNewPost}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
      >
        <EditIcon />
      </Fab>
    </Container>
  );
};

export default Community;
