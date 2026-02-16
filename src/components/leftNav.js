import React from "react";
import {
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";

function LeftNav({ items, activeItem, onNavItemClick }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    const activeIndex = items.indexOf(activeItem);

    return (
      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={activeIndex >= 0 ? activeIndex : 0}
          onChange={(e, newIndex) => onNavItemClick(items[newIndex])}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              minWidth: "auto",
              fontSize: "0.8rem",
              fontWeight: 500,
              px: 2,
            },
            "& .Mui-selected": {
              fontWeight: 700,
            },
          }}
        >
          {items.map((item, index) => (
            <Tab key={index} label={item} />
          ))}
        </Tabs>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        width: 180,
        flexShrink: 0,
        py: 1,
        alignSelf: "flex-start",
      }}
    >
      <List disablePadding>
        {items.map((item, index) => (
          <ListItemButton
            key={index}
            selected={item === activeItem}
            onClick={() => onNavItemClick(item)}
            sx={{
              py: 1.2,
              "&.Mui-selected": {
                color: "primary.main",
                fontWeight: "bold",
                bgcolor: "rgba(255, 170, 70, 0.08)",
              },
              "&.Mui-selected:hover": {
                bgcolor: "rgba(255, 170, 70, 0.12)",
              },
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            <ListItemText
              primary={item}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: item === activeItem ? 700 : 500,
                textAlign: "center",
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}

export default LeftNav;
