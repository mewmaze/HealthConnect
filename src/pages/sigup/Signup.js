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
        mt: 4,
        pb: 4,
      }}
    >
      <SignupForm />
    </Box>
  );
};

export default Signup;
