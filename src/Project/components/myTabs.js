import React, { useState, useEffect, useContext } from "react";
import {
  Tabs,
  Tab,
  Box,
  Menu,
  MenuItem,
  Button,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";

function MyTabs() {
  const { currentUser, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const user_id = currentUser ? currentUser.user_id : null;
  const nickname = currentUser ? currentUser.username : "닉네임";
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const validTabs = [
    "/exercise",
    user_id ? `/myPage/${user_id}` : "/myPage",
    "/login",
    "/signUp",
  ];

  // 메인 홈페이지인 경우 아무것도 선택되지 않은 상태로 설정
  const initialTab =
    location.pathname === "/"
      ? null
      : validTabs.includes(location.pathname)
      ? location.pathname
      : "/login";
  const [selectedTab, setSelectedTab] = useState(initialTab);

  useEffect(() => {
    const newTab =
      location.pathname === "/"
        ? null
        : validTabs.includes(location.pathname)
        ? location.pathname
        : "/login";
    setSelectedTab(newTab);
  }, [location.pathname, user_id]);

  const handleTabChange = (event, newValue) => {
    if (newValue === "/myPage" && !user_id) {
      console.log("로그인을 하셔야 합니다.");
      navigate("/login");
    } else if (newValue === "/myPage") {
      navigate(`/myPage/${user_id}`);
    } else {
      setSelectedTab(newValue);
      navigate(newValue);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    handleTabChange(null, path);
    handleMenuClose();
  };

  const handleLogout = () => {
    try {
      // 로컬 스토리지에서 JWT와 사용자 정보 삭제
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // AuthContext 상태 초기화
      logout();

      // 로그아웃 후 메인 페이지로 리다이렉션
      navigate("/login");
      setSelectedTab("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {user_id ? (
        <>
          <Button
            variant={selectedTab === "/exercise" ? "contained" : "outlined"}
            onClick={() => handleTabChange(null, "/exercise")}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              minWidth: 120,
              ...(selectedTab === "/exercise" && {
                backgroundColor: theme.palette.primary.main,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }),
            }}
          >
            나의 기록
          </Button>

          <Button
            variant="outlined"
            onClick={handleMenuOpen}
            endIcon={<span>▼</span>}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              minWidth: 140,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.primary.light + "10",
              },
            }}
          >
            {nickname} 님
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                boxShadow: theme.shadows[3],
                borderRadius: 2,
              },
            }}
          >
            <MenuItem onClick={() => handleMenuClick(`/myPage/${user_id}`)}>
              마이페이지
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick(`/myPage/${user_id}`)}>
              프로필 보기
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick("/myPosts")}>
              작성 글 보기
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              로그아웃
            </MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={() => handleTabChange(null, "/login")}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              minWidth: 100,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            로그인
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleTabChange(null, "/signUp")}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              minWidth: 100,
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              "&:hover": {
                borderColor: theme.palette.secondary.dark,
                backgroundColor: theme.palette.secondary.light + "10",
              },
            }}
          >
            회원가입
          </Button>
        </>
      )}
    </Box>
  );
}

export default MyTabs;
