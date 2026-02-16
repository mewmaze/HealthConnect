import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../api/api";
import { AuthContext } from "../../hooks/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  const { setCurrentUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setEmailError(
      emailRegex.test(value) ? "" : "올바른 이메일 형식을 입력해주세요."
    );
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setPasswordError(
      passwordRegex.test(value)
        ? ""
        : "비밀번호는 최소 8자와 영문, 숫자, 특수문자를 포함합니다."
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (emailError || passwordError) {
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, refreshToken, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      setToken(token);
      setCurrentUser(user);

      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error) {
      console.error(
        "Error 로그인 실패",
        error.response ? error.response.data : error.message
      );
      setSnackbar({
        open: true,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        severity: "error",
      });
    }
  };

  const handleGuestLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email: "guest@healthconnect.com",
        password: "Guest1234!",
      });

      const { token, refreshToken, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      setToken(token);
      setCurrentUser(user);
      navigate("/");
    } catch {
      setSnackbar({
        open: true,
        message: "게스트 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
        severity: "error",
      });
    }
  };

  const handleSignup = () => {
    navigate("/signUp");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)",
        mt: { xs: 2, sm: 8 },
        px: { xs: 2, sm: 0 },
      }}
    >
      <Paper sx={{ p: { xs: 3, sm: 5 }, width: "100%", maxWidth: 460 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
          로그인
        </Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={2.5}>
            <TextField
              label="이메일"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              fullWidth
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="비밀번호"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              fullWidth
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
            >
              로그인
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleGuestLogin}
              sx={{ color: "text.secondary", borderColor: "#e0e0e0" }}
            >
              게스트로 체험하기
            </Button>
          </Stack>
        </form>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          <Typography variant="body2" color="text.secondary">
            아직 계정이 없으신가요?
          </Typography>
          <Button
            size="small"
            variant="contained"
            sx={{ bgcolor: "#212121", "&:hover": { bgcolor: "#424242" } }}
            onClick={handleSignup}
          >
            회원가입 하기
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
