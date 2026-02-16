import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../hooks/AuthContext";
import { useNavigation } from "../../hooks/useNavigation";

function UserAuth({ mobile = false }) {
  const { currentUser, logout } = useContext(AuthContext);
  const user_id = currentUser ? currentUser.user_id : null;
  const nickname = currentUser ? currentUser.username : "닉네임";
  const navigate = useNavigate();
  const { goLogin, goSignup, goMyPage } = useNavigation();

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

  const mobileStyles = {
    mypage: {
      borderColor: "#FFAA46",
      color: "#FFAA46",
      "&:hover": { borderColor: "#b27000", backgroundColor: "#fff8ef" },
    },
    logout: {
      borderColor: "#9e9e9e",
      color: "#757575",
      "&:hover": { borderColor: "#616161", backgroundColor: "#f5f5f5" },
    },
    login: {
      bgcolor: "#FFAA46",
      color: "white",
      "&:hover": { bgcolor: "#b27000" },
    },
    signup: {
      borderColor: "#FFAA46",
      color: "#FFAA46",
      "&:hover": { borderColor: "#b27000" },
    },
  };

  const desktopStyles = {
    mypage: {
      borderColor: "white",
      color: "white",
      "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.15)" },
    },
    logout: {
      borderColor: "rgba(255,255,255,0.6)",
      color: "rgba(255,255,255,0.85)",
      "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.15)" },
    },
    login: {
      bgcolor: "white",
      color: "#FFAA46",
      "&:hover": { bgcolor: "#f5f5f5" },
    },
    signup: {
      borderColor: "white",
      color: "white",
      "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.15)" },
    },
  };

  const s = mobile ? mobileStyles : desktopStyles;

  const commonSx = {
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 600,
    whiteSpace: "nowrap",
    width: mobile ? "100%" : "auto",
    height: mobile ? 48 : "auto",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1.5,
        p: mobile ? 2 : 0,
        width: mobile ? "100%" : "auto",
        boxSizing: mobile ? "border-box" : undefined,
      }}
    >
      {user_id ? (
        <>
          <Button
            variant="outlined"
            onClick={() => goMyPage(user_id)}
            sx={{ ...commonSx, minWidth: mobile ? "auto" : 120, ...s.mypage }}
          >
            {nickname} 님
          </Button>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{ ...commonSx, minWidth: mobile ? "auto" : 80, ...s.logout }}
          >
            로그아웃
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={goLogin}
            sx={{ ...commonSx, minWidth: mobile ? "auto" : 80, ...s.login }}
          >
            로그인
          </Button>
          <Button
            variant="outlined"
            onClick={goSignup}
            sx={{ ...commonSx, minWidth: mobile ? "auto" : 80, ...s.signup }}
          >
            회원가입
          </Button>
        </>
      )}
    </Box>
  );
}

export default UserAuth;
