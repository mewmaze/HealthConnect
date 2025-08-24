// src/Project/components/NavigationBar.js
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

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // 현재 경로를 탭의 value로 설정
  const currentTabValue = location.pathname;

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: 3,
        py: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "lg",
          mx: "auto",
        }}
      >
        <Tabs
          value={currentTabValue}
          onChange={handleTabChange}
          aria-label="navigation tabs"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
              height: 3,
            },
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: theme.palette.text.primary,
              "&.Mui-selected": {
                color: theme.palette.primary.main,
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

        <TextField
          placeholder="검색..."
          variant="outlined"
          size="small"
          sx={{
            width: 320,
            "& .MuiOutlinedInput-root": {
              borderRadius: 25,
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
      </Box>
    </Box>
  );
};

export default NavigationBar;
