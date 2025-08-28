import { useState } from "react";
import { useNavigation } from "../../hooks/useNavigation";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MainNavigationBar from "../components/MainNavigation";
import UserAuth from "../components/UserAuth";

const MobileHeader = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { goHome } = useNavigation();

  return (
    <>
      {/* 상단 바 */}
      <AppBar
        position="static"
        elevation={1}
        sx={{ backgroundColor: "background.paper" }}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          {/* 상단: 메인 네비게이션 */}
          <MainNavigationBar mobile={true} />
          {/* 하단: 로그인, 회원가입 인증 버튼들들 */}
          <UserAuth mobile={true} />
        </Box>
      </Drawer>
    </>
  );
};

export default MobileHeader;
