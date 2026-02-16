import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useContext } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import api, { getImageUrl } from "../../api/api";
import ChallengeInfo from "../../components/challenge/ChallengeInfo";
import useChallengeActions from "../../hooks/useChallengeActions";
import { AuthContext } from "../../hooks/AuthContext";
import dayjs from "dayjs";

function ChallengeProgress({ challengeId, userId, challenge }) {
  const [badges, setBadges] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [badgeRes, recordRes] = await Promise.all([
          api.get(`/challengebadges/challenge/${challengeId}/user/${userId}`),
          api.get("/challengerecords/challenge-status", {
            params: { user_id: userId },
          }),
        ]);
        setBadges(Array.isArray(badgeRes.data) ? badgeRes.data : []);

        const allRecords = recordRes.data || [];
        const challengeRecords = allRecords.filter(
          (r) => r.challenge_id === parseInt(challengeId, 10),
        );
        setRecords(challengeRecords);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [challengeId, userId]);

  if (loading) return null;

  const totalWeeks = challenge.target_period || 1;
  const badgeCount = badges.length;
  const totalRecordDays = records.length;

  const weekStart = dayjs().startOf("week");
  const weekEnd = dayjs().endOf("week");
  const thisWeekRecords = records.filter((r) => {
    const d = dayjs(r.completion_date);
    return (
      d.isAfter(weekStart.subtract(1, "day")) &&
      d.isBefore(weekEnd.add(1, "day"))
    );
  });

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        bgcolor: "rgba(255, 170, 70, 0.08)",
        border: "1px solid",
        borderColor: "primary.main",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <CheckCircleOutlineIcon sx={{ color: "primary.main" }} />
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          참여중인 챌린지입니다
        </Typography>
      </Stack>

      <Box sx={{ mb: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="body2" fontWeight={600}>
            이번 주 달성
          </Typography>
          <Typography variant="body2" fontWeight={700} color="primary.main">
            {thisWeekRecords.length} / {challenge.target_days}일
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={Math.min(
            Math.round(
              (thisWeekRecords.length / (challenge.target_days || 1)) * 100,
            ),
            100,
          )}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: "rgba(255, 170, 70, 0.15)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
            },
          }}
        />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Paper variant="outlined" sx={{ flex: 1, p: 2, textAlign: "center" }}>
          <EmojiEventsIcon sx={{ color: "#FFD700", fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700}>
            {badgeCount} / {totalWeeks}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            뱃지 ({totalWeeks}주 중)
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ flex: 1, p: 2, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {totalRecordDays}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            총 달성 일수
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ flex: 1, p: 2, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {thisWeekRecords.length} / {challenge.target_days}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            이번 주 달성
          </Typography>
        </Paper>
      </Stack>

      {badgeCount > 0 && (
        <Box sx={{ mt: 2.5 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            획득한 뱃지
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {badges.map((badge) => (
              <Chip
                key={badge.badge_id}
                icon={<EmojiEventsIcon sx={{ color: "#FFD700 !important" }} />}
                label={`${dayjs(badge.week_start).format("M/D")}~${dayjs(badge.week_end).format("M/D")}`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );
}

function ChallengeDetail() {
  const { id } = useParams();
  const { joinChallenge, checkParticipant } = useChallengeActions();
  const { currentUser, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchChallenge = useCallback(async () => {
    try {
      const response = await api.get(`/challenges/${id}`);
      setChallenge(response.data);
    } catch (error) {
      console.error("Failed to fetch challenge:", error);
      setChallenge(null);
    }
  }, [id]);

  useEffect(() => {
    fetchChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchChallenge]);

  useEffect(() => {
    const checkParticipation = async () => {
      if (currentUser && token) {
        const participantStatus = await checkParticipant(
          parseInt(id, 10),
          currentUser.user_id,
          token,
        );
        setIsParticipant(participantStatus);
      }
    };
    checkParticipation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.user_id, id, token]);

  const handleJoinChallenge = async () => {
    try {
      const userId = currentUser.user_id;
      await joinChallenge(parseInt(id, 10), userId, challenge, token);
      await fetchChallenge();
      setIsParticipant(true);
      setSnackbar({
        open: true,
        message: "챌린지에 참여했습니다! 함께 도전해봐요!",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to join challenge:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "챌린지 참여에 실패했습니다.",
        severity: "error",
      });
    }
  };

  const handleGoList = () => {
    navigate("/challenge", { replace: true });
  };

  if (!challenge) {
    return (
      <Container maxWidth="md" sx={{ mt: 12, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          챌린지를 찾을 수 없습니다.
        </Typography>
      </Container>
    );
  }

  const {
    challenge_name,
    description,
    participant_count,
    target_days,
    challenge_img,
    target_period,
    start_date,
    end_date,
  } = challenge;

  return (
    <Container maxWidth="md" sx={{ mt: 12, pb: 8 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
        {challenge_name}
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="flex-start"
        >
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Box
              component="img"
              src={getImageUrl(challenge_img)}
              alt={challenge_name}
              sx={{
                width: { xs: "100%", md: 330 },
                height: 260,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
            <Chip
              label={`${participant_count}명 도전중`}
              sx={{
                position: "absolute",
                bottom: -12,
                right: -12,
                bgcolor: "primary.main",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Box>

          <Stack spacing={2} sx={{ flex: 1 }}>
            <Chip
              label="챌린지 설명"
              size="small"
              sx={{
                alignSelf: "flex-start",
                bgcolor: "#212121",
                color: "#FFAA46",
              }}
            />
            <Typography fontWeight="bold">{description}</Typography>

            <Chip
              label="챌린지 기간"
              size="small"
              sx={{
                alignSelf: "flex-start",
                bgcolor: "#212121",
                color: "#FFAA46",
              }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`${target_period}주`}
                variant="outlined"
                size="small"
              />
              <Typography fontWeight="bold">
                {start_date}~{end_date}
              </Typography>
            </Stack>

            <Chip
              label="달성조건"
              size="small"
              sx={{
                alignSelf: "flex-start",
                bgcolor: "#212121",
                color: "#FFAA46",
              }}
            />
            <Typography fontWeight="bold">주 {target_days}회</Typography>
          </Stack>
        </Stack>
      </Paper>

      {isParticipant ? (
        <ChallengeProgress
          challengeId={id}
          userId={currentUser?.user_id}
          challenge={challenge}
        />
      ) : (
        <>
          <Paper
            sx={{
              textAlign: "center",
              py: 1.5,
              px: 3,
              mb: -2,
              mx: "auto",
              width: "fit-content",
              position: "relative",
              zIndex: 1,
              bgcolor: "primary.main",
              color: "white",
              fontWeight: "bold",
              border: "none",
            }}
          >
            오늘부터 챌린지에 참여한다면?
          </Paper>
          <Paper sx={{ p: 4, pt: 5, mb: 4 }}>
            <ChallengeInfo challenge={challenge} />
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                sx={{ px: 5 }}
                onClick={handleJoinChallenge}
              >
                참여하기
              </Button>
            </Box>
          </Paper>
        </>
      )}

      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          sx={{ bgcolor: "#212121", "&:hover": { bgcolor: "#424242" } }}
          onClick={handleGoList}
        >
          챌린지 목록 보기
        </Button>
      </Box>

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
    </Container>
  );
}

export default ChallengeDetail;
