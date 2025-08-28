import React from "react";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const MainNavigation = ({ mobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // 현재 경로를 탭의 value로 설정 (홈일 때는 false로 처리)
  const currentTabValue = location.pathname === "/" ? false : location.pathname;

  const handleTabChange = (event, newValue) => {
    if (newValue) {
      navigate(newValue);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderBottom: mobile ? "none" : `1px solid ${theme.palette.divider}`,
        px: mobile ? 0 : 3,
        py: mobile ? 0 : 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          alignItems: mobile ? "flex-start" : "center",
          justifyContent: "space-between",
          maxWidth: mobile ? "100%" : "lg",
          mx: mobile ? 0 : "auto",
          gap: mobile ? 2 : 0,
        }}
      >
        <TextField
          placeholder="검색..."
          variant="outlined"
          size="small"
          sx={{
            width: mobile ? "100%" : 320,
            borderRadius: mobile ? 2 : 25,
            order: mobile ? -1 : 1, // 모바일에서만 위로 이동
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme.palette.text.primary,
                borderWidth: 2,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputBase-input": {
              paddingLeft: 2,
              paddingRight: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
        />

        <Tabs
          value={currentTabValue}
          onChange={handleTabChange}
          aria-label="navigation tabs"
          orientation={mobile ? "vertical" : "horizontal"}
          variant={mobile ? "fullWidth" : "standard"}
          sx={{
            width: mobile ? "100%" : "auto",
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
              height: mobile ? "100%" : 3,
              width: mobile ? 3 : "auto",
              display: mobile ? "none" : "block",
            },
            "& .MuiTab-root": {
              minHeight: mobile ? 56 : 48,
              width: mobile ? "100%" : "auto",
              fontWeight: 600,
              fontSize: mobile ? "1rem" : "0.875rem",
              color: theme.palette.text.primary,
              justifyContent: mobile ? "flex-start" : "center",
              margin: mobile ? 0 : "auto",
              padding: mobile ? "16px 20px" : "12px 24px",

              "&.Mui-selected": {
                color: theme.palette.primary.main,
                backgroundColor: mobile
                  ? theme.palette.primary.light + "20"
                  : "transparent",
              },

              "&:hover": {
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
            },
          }}
        >
          <Tab value="/bests" label="BEST" />
          <Tab value="/communities" label="커뮤니티" />
          <Tab value="/challenge" label="챌린지" />
        </Tabs>
      </Box>
    </Box>
  );
};

export default MainNavigation;
