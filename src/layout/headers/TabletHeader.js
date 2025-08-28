import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { useNavigation } from "../../hooks/useNavigation";

const TabletHeader = () => {
  const menus = ["BEST", "커뮤니티", "챌린지"];
  const { goHome } = useNavigation();
  return (
    <>
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
          <Box sx={{ display: "flex", gap: 2 }}>
            {menus.map((menu, index) => (
              <Button
                key={index}
                sx={{
                  color: "text.primary",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                {menu}
              </Button>
            ))}
          </Box>
          <Box></Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
export default TabletHeader;
