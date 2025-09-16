import { useState } from "react";
import { useNavigation } from "../../hooks/useNavigation";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  Button,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import UserAuth from "../components/UserAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Search as SearchIcon } from "@mui/icons-material";

const MobileHeader = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { goHome } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    { path: "/bests", label: "BEST" },
    { path: "/communities", label: "커뮤니티" },
    { path: "/challenge", label: "챌린지" },
  ];

  return (
    <>
      {/* 상단 바 */}
      <AppBar
        position="static"
        elevation={1}
        sx={{ backgroundColor: theme.palette.primary.main }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            component="img"
            src={require("../../img/MainLogo.png")}
            alt="Logo"
            onClick={goHome}
            sx={{
              width: "80px",
              height: "auto",
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
            }}
          />
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 모바일 메뉴 드로어 */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 200 } } }}
      >
        <TextField
          placeholder="검색..."
          variant="outlined"
          size="small"
          sx={{
            width: "100%",
            borderRadius: 2,
            "& .MuiOutlinedInput-root fieldset": {
              borderColor: "theme.palette.primary.lignt",
            },
            "&.Mui-focused fieldset": {
              borderColor: "theme.palette.primary.main",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "theme.palette.text.primary" }} />
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box>
            {/* 상단: 메인 네비게이션 */}
            {menuItems.map((item) => (
              <Button
                key={item.label}
                fullWidth
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  justifyContent: "flex-start",
                  minHeight: 56,
                  backgroundColor:
                    location.pathname === item.path
                      ? theme.palette.primary.light + "10"
                      : "transparent",
                  color:
                    location.pathname === item.path
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light + "10",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* 하단: 로그인, 회원가입 인증 버튼들들 */}
          <UserAuth mobile={true} />
        </Box>
      </Drawer>
    </>
  );
};

export default MobileHeader;
