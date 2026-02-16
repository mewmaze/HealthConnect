import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Stack,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useChallengeUtils from "../../hooks/useChallengeUtils";
import dayjs from "dayjs";

function ChallengeEditor({ initData, onSubmit, text }) {
  const navigate = useNavigate();
  const { calculateEndDate } = useChallengeUtils();
  const today = dayjs().format("YYYY-MM-DD");

  const [form, setForm] = useState(() => ({
    challengeName: initData?.challenge_name ?? "",
    description: initData?.description ?? "",
    targetPeriod: initData?.target_period ?? 1,
    targetDays: initData?.target_days ?? 1,
    participantCount: initData?.participant_count ?? 0,
    challengeImg: null,
    startDate: initData?.start_date ?? today,
  }));

  const [fileName, setFileName] = useState("");

  const endDate = useMemo(
    () => calculateEndDate(form.startDate, form.targetPeriod),
    [form.startDate, form.targetPeriod, calculateEndDate]
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prevState) => ({ ...prevState, [name]: files[0] }));
      setFileName(files[0].name);
    } else {
      setForm((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.challengeImg) {
      setError("챌린지 이미지를 등록해주세요.");
      return;
    }
    if (!form.challengeName.trim()) {
      setError("챌린지 이름을 입력해주세요.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("challenge_name", form.challengeName);
    formData.append("description", form.description);
    formData.append("target_period", form.targetPeriod);
    formData.append("target_days", form.targetDays);
    formData.append("participant_count", form.participantCount);
    formData.append("challenge_img", form.challengeImg);
    formData.append("start_date", form.startDate);
    formData.append("end_date", endDate);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Failed to submit form:", err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Paper sx={{ p: 4, width: "100%", maxWidth: 600 }}>
      <Stack spacing={3}>
        <TextField
          label="챌린지 이름"
          name="challengeName"
          placeholder="챌린지 이름을 입력하세요"
          value={form.challengeName}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={1}
        />

        <TextField
          label="챌린지 설명"
          name="description"
          placeholder="상세설명을 입력하세요"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={3}
        />

        <FormControl fullWidth>
          <InputLabel>기간선택</InputLabel>
          <Select
            label="기간선택"
            name="targetPeriod"
            value={form.targetPeriod}
            onChange={(e) =>
              setForm((prevState) => ({
                ...prevState,
                targetPeriod: parseInt(e.target.value),
              }))
            }
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
              <MenuItem key={period} value={period}>
                {period}주
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            달성조건
          </Typography>
          <ToggleButtonGroup
            value={form.targetDays}
            exclusive
            onChange={(e, newVal) => {
              if (newVal !== null) {
                setForm((prevState) => ({
                  ...prevState,
                  targetDays: newVal,
                }));
              }
            }}
            sx={{ flexWrap: "wrap", gap: 1 }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((days) => (
              <ToggleButton
                key={days}
                value={days}
                sx={{
                  borderRadius: "100px !important",
                  px: 2,
                  border: "1px solid #e0e0e0 !important",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                }}
              >
                {days}번
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            챌린지 이미지 업로드
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            파일 선택
            <input
              type="file"
              name="challengeImg"
              accept="image/*"
              onChange={handleChange}
              hidden
            />
          </Button>
          {fileName && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {fileName}
            </Typography>
          )}
        </Box>

        {error && (
          <Typography color="error" variant="body2" textAlign="center">
            {error}
          </Typography>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={handleSubmit}>
            {text}
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#212121", "&:hover": { bgcolor: "#424242" } }}
            onClick={handleCancel}
          >
            취소
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default ChallengeEditor;
