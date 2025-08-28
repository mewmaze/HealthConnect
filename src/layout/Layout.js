import React, { useState, useEffect } from "react";
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";
import MobileHeader from "./headers/MobileHeader";
import TabletHeader from "./headers/TabletHeader";

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

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
      {isTablet && <TabletHeader />}
      {/* {isDesktop && <DesktopHeader />} */}

      {/* 메인 컨텐츠 */}
      <Box component="main">
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
};

export default Layout;
