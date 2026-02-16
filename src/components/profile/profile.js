import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import api, { API_BASE_URL } from "../../api/api";
import { AuthContext } from "../../hooks/AuthContext";

function Profile() {
  const { user_id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [formData, setFormData] = useState({
    nickname: "",
    intro: "",
    profile_picture: "",
    profile_picture_url: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user_id) {
        setError("사용자 ID가 없습니다.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("로그인 정보가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/myPage/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setFormData({
          nickname: response.data.nickname,
          intro: response.data.intro,
          profile_picture: null,
          profile_picture_url: response.data.profile_picture,
        });
      } catch (error) {
        setError("사용자 정보를 가져오는 데 실패했습니다.");
        console.error(
          "API 호출 실패:",
          error.response ? error.response.data : error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, token]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewSrc(reader.result);
    };
    reader.readAsDataURL(file);
    setFormData({
      ...formData,
      profile_picture: file,
      profile_picture_url: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("nickname", formData.nickname);
      form.append("intro", formData.intro);
      if (formData.profile_picture) {
        form.append("profile_picture", formData.profile_picture);
      }

      const response = await api.put(`/api/update/${user_id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data);
      setSnackbar({
        open: true,
        message: "프로필이 수정되었습니다.",
        severity: "success",
      });
    } catch (error) {
      const msg =
        error.response?.data?.message || "프로필 업데이트에 실패했습니다.";
      setSnackbar({
        open: true,
        message: msg,
        severity: "error",
      });
    }
  };

  const handleUpdateClick = async () => {
    await handleSubmit();
    navigate(`/myPage/${user_id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    );
  }

  const pictureSource =
    previewSrc ||
    (userData?.profile_picture
      ? `${API_BASE_URL}/uploads/${userData.profile_picture}`
      : "");

  return (
    <>
      <Paper
        sx={{
          p: { xs: 2.5, sm: 3 },
          bgcolor: "primary.main",
          color: "white",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 3 }}
          alignItems="center"
        >
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              src={pictureSource}
              alt={userData?.nickname}
              sx={{
                width: 100,
                height: 100,
                border: "3px solid white",
                mb: 1,
              }}
            />
            <Button
              component="label"
              size="small"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "0.75rem",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
            >
              사진 변경
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Box>

          <Box sx={{ flex: 1, width: "100%" }}>
            <Stack spacing={2}>
              <TextField
                label="닉네임"
                value={formData.nickname || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                    borderRadius: 2,
                  },
                }}
              />

              <Stack direction="row" alignItems="center" spacing={1}>
                <EmojiEventsIcon sx={{ color: "rgba(255,255,255,0.9)" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.9)" }}
                >
                  챌린지 달성
                </Typography>
                <Chip
                  label={`${userData?.achievement_count || 0}개`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 700,
                  }}
                />
              </Stack>

              <TextField
                label="자기소개"
                value={formData.intro || ""}
                onChange={(e) =>
                  setFormData({ ...formData, intro: e.target.value })
                }
                multiline
                rows={3}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                    borderRadius: 2,
                  },
                }}
              />
            </Stack>
          </Box>

          <Box sx={{ alignSelf: { xs: "stretch", sm: "flex-end" } }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleUpdateClick}
              sx={{
                bgcolor: "#212121",
                color: "white",
                px: 3,
                "&:hover": { bgcolor: "#424242" },
              }}
            >
              프로필 수정
            </Button>
          </Box>
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
    </>
  );
}

export default Profile;
