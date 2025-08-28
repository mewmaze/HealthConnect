import React, { useContext } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../hooks/AuthContext";
import { useNavigation } from "../../hooks/useNavigation";

function UserAuth({ mobile = false }) {
  const { currentUser, logout } = useContext(AuthContext);
  const user_id = currentUser ? currentUser.user_id : null;
  const nickname = currentUser ? currentUser.username : "닉네임";
  const navigate = useNavigate();
  const theme = useTheme();
  const { goExercise, goLogin, goSignup, goMyPage } = useNavigation();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        justifyContent: mobile ? "flex-end" : "flex-end",
        alignItems: mobile ? "center" : "center",
        gap: mobile ? 2 : 2,
        p: mobile ? 2 : 0,
        width: mobile ? "90%" : "auto",
      }}
    >
      {user_id ? (
        <>
          <Button
            variant="outlined"
            onClick={goExercise}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              width: mobile ? "100%" : "auto",
              minWidth: mobile ? "auto" : 120,
              height: mobile ? 48 : "auto",
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.primary.light + "10",
              },
            }}
          >
            나의 기록
          </Button>

          <Button
            variant="outlined"
            onClick={() => goMyPage(user_id)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              width: mobile ? "100%" : "auto",
              minWidth: mobile ? "auto" : 140,
              height: mobile ? 48 : "auto",
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

          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              width: mobile ? "100%" : "auto",
              minWidth: mobile ? "auto" : 100,
              height: mobile ? 48 : "auto",
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              "&:hover": {
                borderColor: theme.palette.error.dark,
                backgroundColor: theme.palette.error.light + "10",
              },
            }}
          >
            로그아웃
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={goLogin}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              width: mobile ? "100%" : "auto",
              minWidth: mobile ? "auto" : 100,
              height: mobile ? 48 : "auto",
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
            onClick={goSignup}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              width: mobile ? "100%" : "auto",
              minWidth: mobile ? "auto" : 100,
              height: mobile ? 48 : "auto",
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

export default UserAuth;
