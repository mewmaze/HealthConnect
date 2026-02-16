import React from "react";
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";
import MobileHeader from "./headers/MobileHeader";
import DesktopHeader from "./headers/DescktopHeader";

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      {/* 반응형 헤더 */}
      {isMobile && <MobileHeader />}
      {isDesktop && <DesktopHeader />}

      {/* 메인 컨텐츠 */}
      <Box component="main">
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
};

export default Layout;
