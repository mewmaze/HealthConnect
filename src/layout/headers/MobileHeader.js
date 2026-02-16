import { useState } from "react";
import { useNavigation } from "../../hooks/useNavigation";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  Button,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ForumIcon from "@mui/icons-material/Forum";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import UserAuth from "../components/UserAuth";
import { useNavigate, useLocation } from "react-router-dom";
import mainLogo from "../../img/MainLogo.svg";

const MobileHeader = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { goHome } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    { path: "/communities", label: "커뮤니티", icon: <ForumIcon fontSize="small" /> },
    { path: "/challenge", label: "챌린지", icon: <EmojiEventsIcon fontSize="small" /> },
    { path: "/challengediary", label: "챌린지 기록", icon: <AutoStoriesIcon fontSize="small" /> },
  ];

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        sx={{ backgroundColor: theme.palette.primary.main }}
      >
        <Toolbar sx={{ justifyContent: "space-between", pl: 2 }}>
          <Box
            component="img"
            src={mainLogo}
            alt="Logo"
            onClick={goHome}
            sx={{
              width: "68px",
              height: "auto",
              cursor: "pointer",
              marginTop: "4px",
              "&:hover": { opacity: 0.8 },
            }}
          />
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 240 } } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ px: 1, pt: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                fullWidth
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                startIcon={item.icon}
                sx={{
                  justifyContent: "flex-start",
                  pl: 2,
                  gap: 0.5,
                  minHeight: 48,
                  borderRadius: 1.5,
                  mb: 0.5,
                  backgroundColor:
                    location.pathname === item.path
                      ? theme.palette.primary.light + "20"
                      : "transparent",
                  color:
                    location.pathname === item.path
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light + "20",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <UserAuth mobile={true} />
        </Box>
      </Drawer>
    </>
  );
};

export default MobileHeader;
