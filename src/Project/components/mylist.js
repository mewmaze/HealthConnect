import { TablePagination } from '@mui/base/TablePagination';
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Checkbox } from '@mui/material';
import styled, { createGlobalStyle } from 'styled-components';

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../hooks/AuthContext";

// Global styles including CSS variables
const GlobalStyle = createGlobalStyle`
  :root {
    --border-color: grey;
    --text-color: #1c2025;
    --hover-background-color: #f3f6f9;
    --hover-border-color: #dae2ed;
    --focus-outline-color: #dae2ed;
    --focus-border-color: #3399ff;
  }
`;

// Styled components
const Root = styled.div`
  border-radius: 12px;
  overflow: clip;
  margin-left: 19%;
  margin-top: 6%;
  margin-bottom: 10%;
  width: 61%;
  background-color: white;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Filter = styled.div`
  position: relative;
  display: inline-flex;
  width: 60%;
  margin-top: 1%;
  margin-left: 40%;
  margin-bottom: 5px;
`;

const DeleteAllButton = styled.button`
  position: inherit;
  font-size: 0.7rem;
  margin-left: 28%;
  margin-right: 3%;
  width: 90px;
`;

const DeleteButton = styled.button`
  font-size: 0.7rem;
`;

const SmallCheckbox = styled(Checkbox)`
  transform: scale(0.9);
`;

const CustomTablePagination = styled(TablePagination)`
  .tablePagination-spacer {
    display: none;
  }

  .tablePagination-toolbar {
    position: inherit;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 4px 0;
    margin-left: 10px;
  }

  @media (min-width: 600px) {
    .tablePagination-toolbar {
      flex-direction: row;
      align-items: center;
    }
  }

  .tablePagination-selectLabel {
    margin: 0;
  }

  .tablePagination-select {
    position: inherit;
    margin-left: 10px;
    font-family: 'IBM Plex Sans', sans-serif;
    padding: 2px 0 2px 4px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: transparent;
    color: var(--text-color);
    transition: all 100ms ease;
  }

  .tablePagination-select:hover {
    background-color: var(--hover-background-color);
    border-color: var(--hover-border-color);
  }

  .tablePagination-select:focus {
    outline: 3px solid var(--focus-outline-color);
    border-color: var(--focus-border-color);
  }

  .tablePagination-displayedRows {
    margin: 0;
  }

  @media (min-width: 768px) {
    .tablePagination-displayedRows {
      margin-left: auto;
    }
  }

  .tablePagination-actions {
    display: flex;
    gap: 6px;
    border: transparent;
    text-align: center;
  }

  .tablePagination-actions > button {
    display: flex;
    align-items: center;
    padding: 0;
    border: transparent;
    border-radius: 50%;
    background-color: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-color);
    transition: all 120ms ease;
  }

  .tablePagination-actions > button > svg {
    font-size: 22px;
  }

  .tablePagination-actions > button:hover {
    background-color: var(--hover-background-color);
    border-color: var(--hover-border-color);
  }

  .tablePagination-actions > button:focus {
    outline: 3px solid var(--focus-outline-color);
    border-color: var(--focus-border-color);
  }

  .tablePagination-actions > button:disabled {
    opacity: 0.3;
  }

  .tablePagination-actions > button:disabled:hover {
    border: 1px solid var(--border-color);
    background-color: transparent;
  }
`;

const Table = styled.table`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  border-collapse: collapse;
  border: none;
  width: 98%;
  margin: 10px;
`;

const TableCell = styled.td`
  border: 1px solid var(--border-color);
  text-align: left;
  padding: 8px;

  &.number {
    width: 15%;
  }

  &.title {
    width: 48%;
    font-size: 0.875rem;
  }

  &.date {
    width: 20%;
  }

  &.delete {
    width: 12%;
    text-align: center;
  }
`;

const TableHeaderCell = styled.th`
  border: 1px solid var(--border-color);
  text-align: left;
  padding: 8px;

  &.number {
    width: 15%;
  }

  &.title-header {
    width: 55%;
    font-size: 0.875rem; /* Set the font size for the "제목" header */
  }

  &.date {
    width: 15%;
  }

  &.delete {
    width: 15%;
    text-align: center;
  }
`;

export default function MyList() {
  const { user_id } = useParams();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const navigate = useNavigate();
  const { currentUser, token } = useContext(AuthContext); // AuthContext에서 currentUser, token 가져오기

  useEffect(() => {
    axios.get(`http://localhost:5000/api/myPage/${user_id}/getPosts`)
      .then(response => {
        const data = response.data.posts; // 서버 응답에서 posts 배열 추출
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setError('서버에서 반환된 데이터가 올바르지 않습니다.');
        }
      })
      .catch(error => {
        console.error('API 호출 실패:', error);
        setError('데이터를 가져오는 데 실패했습니다.');
      });
  }, [user_id]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - posts.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxChange = (event, post_id) => {
    setPosts((prevRows) =>
      prevRows.map((post) =>
        post.post_id === post_id ? { ...post, checked: event.target.checked } : post
      )
    );
  };

  if (error) return <p>{error}</p>;

  return (
    <>
      <GlobalStyle />
      <Root>
        <Filter>
          <li>작성글</li>
          <li>작성댓글</li>
          <DeleteAllButton className="deleteAll">전체삭제</DeleteAllButton>
          <DeleteButton className="delete">선택한 게시글 삭제</DeleteButton>
        </Filter>
        <Table aria-label="custom pagination table">
          <thead>
            <tr>
              <TableHeaderCell className="number">글번호</TableHeaderCell>
              <TableHeaderCell className="title-header">제목</TableHeaderCell>
              <TableHeaderCell className="date">날짜</TableHeaderCell>
              <TableHeaderCell className="delete">삭제관리</TableHeaderCell>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
            <tr key={post.post_id}>
            <TableCell className="number">{post.post_id}</TableCell>
            <TableCell className="title">
            <Link to={`/myPosts/${user_id}/${post.post_id}`}>{post.title}</Link>
            </TableCell>
            <TableCell className="date">
            {new Date(post.created_at).toLocaleString()}
            </TableCell>
            <TableCell className="delete">
              <SmallCheckbox
                className="small-checkbox"
                checked={post.checked || false}
                onChange={(event) => handleCheckboxChange(event, post.post_id)}
              />
            </TableCell>
              </tr>
            ))
          ) : (
            <tr>
              <TableCell colSpan={4}>No data available</TableCell>
            </tr>
          )}

          {emptyRows > 0 && (
            <tr style={{ height: 34 * emptyRows }}>
              <TableCell colSpan={4} aria-hidden />
            </tr>
          )}
          </tbody>

          <tfoot>
            <tr>
              <CustomTablePagination
                rowsPerPageOptions={[3, 10, 25, { label: 'All', value: -1 }]}
                colSpan={4}
                count={posts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    'aria-label': 'rows per page',
                  },
                  actions: {
                    showFirstButton: true,
                    showLastButton: true,
                    slots: {
                      firstPageIcon: FirstPageRoundedIcon,
                      lastPageIcon: LastPageRoundedIcon,
                      nextPageIcon: ChevronRightRoundedIcon,
                      backPageIcon: ChevronLeftRoundedIcon,
                    },
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className="customTablePagination"
              />
            </tr>
          </tfoot>
        </Table>
      </Root>
    </>
  );
}

function createData(post_id, title, created_at, checked = false) {
  return { post_id, title, created_at, checked };
}
