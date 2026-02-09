import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Container,
  Tooltip,
  Menu,
  IconButton,
  Avatar,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigation } from "../../hooks/useNavigation";

const pages = ["커뮤니티", "챌린지", "챌린지 기록"];
const settings = ["마이페이지", "로그아웃"];
const DesktopHeader = () => {
  const theme = useTheme();
  const { goChallenge, goCommunity, goChallengeDiary } = useNavigation();
  //메뉴 클릭 시 이동할 경로 매핑
  const menuHandlers = {
    커뮤니티: goCommunity,
    챌린지: goChallenge,
    "챌린지 기록": goChallengeDiary,
  };
  //메뉴가 붙을 Dom 요소를 저장, 초기값은 null(메뉴가 닫힌 상태태)
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget); //클릭된 버튼의 Dom 요소를 저장
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null); //메뉴 닫기
  };
  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flexGrow: 0 }}>
            <Box
              component="img"
              src={require("../../img/MainLogo.png")}
              alt="Logo"
              sx={{
                width: "120px",
                height: "auto",
                cursor: "pointer",
              }}
            />
          </Box>
          {/* 데스크톱 네비게이션 */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              gap: 3,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={menuHandlers[page]}
                sx={{ my: 2, color: "white" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {/* 사용자 메뉴 */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="메뉴">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar
                  alt="User"
                  src={require("../../img/MainLogo.png")}
                  sx={{ width: "40px", height: "40px" }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DesktopHeader;
