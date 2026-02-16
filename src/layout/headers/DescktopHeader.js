import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Container,
  useTheme,
} from "@mui/material";
import { useNavigation } from "../../hooks/useNavigation";
import UserAuth from "../components/UserAuth";
import mainLogo from "../../img/MainLogo.svg";

const pages = ["커뮤니티", "챌린지", "챌린지 기록"];

const DesktopHeader = () => {
  const theme = useTheme();
  const { goHome, goChallenge, goCommunity, goChallengeDiary } =
    useNavigation();

  const menuHandlers = {
    커뮤니티: goCommunity,
    챌린지: goChallenge,
    "챌린지 기록": goChallengeDiary,
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flexGrow: 0, ml: 1.5 }}>
            <Box
              component="img"
              src={mainLogo}
              alt="Logo"
              onClick={goHome}
              sx={{
                width: "100px",
                height: "auto",
                cursor: "pointer",
                mt: 0.5,
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
                sx={{ my: 2, color: "white", whiteSpace: "nowrap" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* 로그인/로그아웃 버튼 */}
          <UserAuth />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DesktopHeader;
