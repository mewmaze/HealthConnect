import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../hooks/AuthContext";
import { createGlobalStyle } from 'styled-components';
import { TablePagination } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import styled from 'styled-components';
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';

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
;`

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
  border: 2px solid black;
;`

const Filter = styled.div`
  position: relative;
  display: inline-flex;
  width: 100%;
  margin-top: 1%;
  margin-left: 40%;
  margin-bottom: 5px;

  &.writePost {
    width: 120px;
  }
;`

const DeleteAllButton = styled.button`
  position: inherit;
  font-size: 0.7rem;
  margin-left: 8%;
  margin-right: 1%;
  width: 100px;
  height: 35px;
;`

const DeleteButton = styled.button`
  font-size: 0.7rem;
  width: 140px;
  height: 35px;
;`

const StyledSmallCheckbox = styled(Checkbox)`
  transform: scale(0.9);
;`

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
;`

const Table = styled.table`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  border-collapse: collapse;
  border: none;
  width: 98%;
  margin: 10px;
;`

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
    
  &.deleteAll {
    width: 15%;
    text-align: center;
  }
;`

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
;`

export default function MyList() {
  const { user_id, postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [view, setView] = useState('posts'); // Default to 'posts'
  const navigate = useNavigate();
  const { currentUser, token } = useContext(AuthContext); // AuthContext에서 currentUser, token 가져오기

  useEffect(() => {
    const endpoint = view === 'posts'
      ? `http://localhost:5000/api/myPage/${user_id}/getPosts`
      : `http://localhost:5000/api/myPage/${user_id}/${postId}/getComments`;
  
    axios.get(endpoint)
      .then(response => {
        const data = response.data[view];
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
          setError('Server returned invalid data.');
        }
      })
      .catch(error => {
        console.error('API call failed:', error);
        setPosts([]);
        setError('Failed to fetch data.');
      });
  }, [user_id, view]);  

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - posts.length) : 0;

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
        item[view === 'posts' ? 'post_id' : 'comment_id'] === id
          ? { ...item, checked: event.target.checked }
          : item
      )
    );
  };

  if (error) return <p>{error}</p>;  

  return (
    <>
      <GlobalStyle />
      <Root>
        <Filter>
          <button className='writePost' onClick={() => setView('posts')}>작성글</button>
          <button className='writeComment' onClick={() => setView('comments')}>작성댓글</button>
          <DeleteAllButton className="deleteAll">전체삭제</DeleteAllButton>
          <DeleteButton className="delete">선택한 게시글 삭제</DeleteButton>
        </Filter>
        <Table aria-label="custom pagination table">
          <thead>
            {posts.length === 0 ? (
              <tr>
                <TableCell colSpan={4}>No data available</TableCell>
              </tr>
            ) : (
              <tr>
                <TableHeaderCell className="number">번호</TableHeaderCell>
                <TableHeaderCell className="title-header">{view === 'posts' ? '제목' : '댓글 내용'}</TableHeaderCell>
                <TableHeaderCell className="date">작성일</TableHeaderCell>
                <TableHeaderCell className="delete">삭제관리</TableHeaderCell>
              </tr>
            )}
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((item) => (
                <tr key={view === 'posts' ? item.post_id : item.comment_id}>
                  <TableCell className="number">{view === 'posts' ? item.post_id : item.comment_id}</TableCell>
                  <TableCell className="title">
                    {view === 'posts' ? (
                      <Link to={`/myPosts/${user_id}/${item.post_id}`}>
                        {item.title}
                      </Link>
                    ) : (
                      item.content
                    )}
                  </TableCell>
                  <TableCell className="date">
                    {new Date(item.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="delete">
                    <StyledSmallCheckbox
                      className="small-checkbox"
                      checked={item.checked || false}
                      onChange={(event) => handleCheckboxChange(event, view === 'posts' ? item.post_id : item.comment_id)}
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
