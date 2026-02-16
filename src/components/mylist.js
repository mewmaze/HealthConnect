import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import {
  Box,
  Paper,
  Button,
  Stack,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from "@mui/material";

export default function MyList({ view = "posts" }) {
  const { user_id, postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const endpoint =
      view === "posts"
        ? `/api/myPage/${user_id}/getPosts`
        : `/api/myPage/${user_id}/${postId}/getComments`;

    api
      .get(endpoint)
      .then((response) => {
        const data = response.data[view];
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
          setError("Server returned invalid data.");
        }
      })
      .catch((error) => {
        console.error("API call failed:", error);
        setPosts([]);
        setError("Failed to fetch data.");
      });
  }, [user_id, view, postId]);

  useEffect(() => {
    setPage(0);
  }, [view]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxChange = (event, id) => {
    setPosts((prevRows) =>
      prevRows.map((item) =>
        item[view === "posts" ? "post_id" : "comment_id"] === id
          ? { ...item, checked: event.target.checked }
          : item
      )
    );
  };

  if (error) {
    return (
      <Paper sx={{ p: 3, width: "100%", textAlign: "center", color: "text.secondary" }}>
        {error}
      </Paper>
    );
  }

  const displayedPosts =
    rowsPerPage > 0
      ? posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : posts;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Stack
        direction="row"
        sx={{ p: 2 }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {view === "posts" ? "작성 글 목록" : "작성 댓글 목록"}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Button variant="outlined" color="error" size="small">
            전체삭제
          </Button>
          <Button variant="outlined" color="error" size="small">
            선택 삭제
          </Button>
        </Stack>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ width: 60, fontWeight: 700, display: { xs: "none", sm: "table-cell" } }}>번호</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {view === "posts" ? "제목" : "댓글 내용"}
              </TableCell>
              <TableCell sx={{ width: 160, fontWeight: 700, display: { xs: "none", sm: "table-cell" } }}>작성일</TableCell>
              <TableCell sx={{ width: 60, fontWeight: 700, textAlign: "center" }}>
                선택
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPosts.length > 0 ? (
              displayedPosts.map((item) => {
                const id = view === "posts" ? item.post_id : item.comment_id;
                return (
                  <TableRow key={id} hover>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{id}</TableCell>
                    <TableCell>
                      {view === "posts" ? (
                        <Link
                          to={`/myPosts/${user_id}/${item.post_id}`}
                          style={{ color: "inherit", textDecoration: "none" }}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        item.content
                      )}
                    </TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      {new Date(item.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Checkbox
                        size="small"
                        checked={item.checked || false}
                        onChange={(event) => handleCheckboxChange(event, id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={posts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="페이지당 행"
      />
    </Paper>
  );
}
