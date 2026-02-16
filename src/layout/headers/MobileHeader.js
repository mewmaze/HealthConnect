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
import mainLogo from "../../img/MainLogo.svg";

const MobileHeader = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { goHome } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    { path: "/communities", label: "커뮤니티" },
    { path: "/challenge", label: "챌린지" },
    { path: "/challengediary", label: "챌린지 기록" },
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

          <UserAuth mobile={true} />
        </Box>
      </Drawer>
    </>
  );
};

export default MobileHeader;
