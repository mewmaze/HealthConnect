import React from "react";
import { Box } from "@mui/material";
import SignupForm from "../../components/signup/SignupForm";

const Signup = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)",
        mt: { xs: 2, sm: 4 },
        pb: 4,
        px: { xs: 1, sm: 0 },
      }}
    >
      <SignupForm />
    </Box>
  );
};

export default Signup;
