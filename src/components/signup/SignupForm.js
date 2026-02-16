import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../api/api";

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    height: "",
    weight: "",
    age: "",
    profile_picture: "",
    interest: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: emailRegex.test(value)
          ? ""
          : "올바른 이메일 형식을 입력해주세요.",
      }));
    } else if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: passwordRegex.test(value)
          ? ""
          : "비밀번호는 최소 8자와 영문, 숫자, 특수문자를 포함합니다.",
      }));
    } else if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.password ? "" : "비밀번호가 일치하지 않습니다.",
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    try {
      const {
        name,
        nickname,
        email,
        password,
        gender,
        height,
        weight,
        age,
        profile_picture,
        interest,
      } = formData;
      await api.post("/auth/register", {
        name,
        nickname,
        email,
        password,
        gender,
        height,
        weight,
        age,
        profile_picture,
        interest,
      });

      setSnackbar({
        open: true,
        message: "회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.",
        severity: "success",
      });
      setTimeout(() => {
        navigate(`/login`, { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Error 회원가입 실패", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "회원가입에 실패했습니다. 다시 시도해주세요.",
        severity: "error",
      });
    }
  };

  const interestOptions = [
    { value: "런닝", label: "런닝" },
    { value: "자전거", label: "자전거" },
    { value: "헬스", label: "헬스" },
    { value: "다이어트", label: "다이어트" },
  ];

  return (
    <>
      <Paper sx={{ p: { xs: 3, sm: 5 }, width: "100%", maxWidth: 500, mx: { xs: 2, sm: 0 } }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
          회원가입
        </Typography>
        <form onSubmit={handleSignup}>
          <Stack spacing={2.5}>
            <TextField
              label="이름"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="닉네임"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="이메일"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <TextField
              label="성별"
              name="gender"
              select
              value={formData.gender}
              onChange={handleChange}
              required
              fullWidth
            >
              <MenuItem value="남성">남성</MenuItem>
              <MenuItem value="여성">여성</MenuItem>
            </TextField>
            <Stack direction="row" spacing={2}>
              <TextField
                label="키(cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="몸무게(kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                required
                fullWidth
              />
            </Stack>
            <TextField
              label="나이"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="관심 운동"
              name="interest"
              select
              value={formData.interest}
              onChange={handleChange}
              required
              fullWidth
            >
              {interestOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" size="large" fullWidth>
              회원가입
            </Button>
          </Stack>
        </form>
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
    </>
  );
};

export default SignupForm;
