import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Checkbox,
  Typography,
  Stack,
  LinearProgress,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import api from "../../api/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AuthContext } from "../../hooks/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

const challengeColors = ["#FF6B6B", "#4ECDC4", "#556270", "#FFD700", "#C71585"];

function ChallengeDiary() {
  const [date, setDate] = useState(dayjs());
  const [challenges, setChallenges] = useState([]);
  const [challengeStatus, setChallengeStatus] = useState({});
  const [selectedChallenge, setSelectedChallenge] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [badges, setBadges] = useState([]);
  const { currentUser, token } = useContext(AuthContext);

  const userId = currentUser ? currentUser.user_id : null;

  useEffect(() => {
    if (userId && token) {
      const fetchChallenges = async () => {
        try {
          const [participantRes, allChallengesRes, badgeRes] = await Promise.all([
            api.get("/participants/user-challenges", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            api.get("/challenges"),
            api.get(`/challengebadges/user/${userId}`).catch(() => ({ data: [] })),
          ]);

          const challengeMap = {};
          (allChallengesRes.data || []).forEach((c) => {
            challengeMap[c.challenge_id] = c;
          });

          setChallenges(
            participantRes.data.map((p, index) => ({
              ...challengeMap[p.challenge_id],
              ...p,
              color: challengeColors[index % challengeColors.length],
            }))
          );
          setBadges(Array.isArray(badgeRes.data) ? badgeRes.data : []);
        } catch (error) {
          console.error("Failed to fetch challenges:", error);
        }
      };
      fetchChallenges();
    }
  }, [userId, token]);

  const getBadgeCount = (challengeId) =>
    badges.filter((b) => b.challenge_id === challengeId).length;

  useEffect(() => {
    const fetchAllChallengeRecords = async () => {
      try {
        const response = await api.get(`/challengerecords/challenge-status`, {
          params: { user_id: userId },
        });

        const formattedRecords = response.data.reduce((acc, record) => {
          const dateStr = format(
            new Date(record.completion_date),
            "yyyy-MM-dd"
          );
          if (!acc[dateStr]) acc[dateStr] = {};
          acc[dateStr][record.challenge_id] = true;
          return acc;
        }, {});

        setChallengeStatus(formattedRecords);
      } catch (error) {
        if (error.response?.status === 404) {
          setChallengeStatus({});
        } else {
          console.error("Failed to fetch challenge records:", error);
          setChallengeStatus({});
        }
      }
    };

    if (userId && token) {
      fetchAllChallengeRecords();
    }
  }, [userId, token]);

  const refreshBadges = async () => {
    try {
      const res = await api.get(`/challengebadges/user/${userId}`);
      setBadges(Array.isArray(res.data) ? res.data : []);
    } catch {
      // ignore
    }
  };

  const handleChallengeCheck = async (challengeId, participantId, checked) => {
    try {
      const completionDate = format(date.toDate(), "yyyy-MM-dd");

      if (checked) {
        await api.post("/challengerecords/update", {
          participant_id: participantId,
          challenge_id: challengeId,
          completion_date: completionDate,
        });
      } else {
        await api.post("/challengerecords/delete", {
          participant_id: participantId,
          challenge_id: challengeId,
          completion_date: completionDate,
        });
      }

      setChallengeStatus((prevStatus) => ({
        ...prevStatus,
        [completionDate]: {
          ...prevStatus[completionDate],
          [challengeId]: checked,
        },
      }));

      await refreshBadges();
    } catch (error) {
      console.error("Failed to update challenge status:", error);
    }
  };

  const getCompletedForDay = (formattedDay) => {
    const dayStatus = challengeStatus[formattedDay];
    if (!dayStatus) return [];
    return challenges.filter((c) => {
      if (!dayStatus[c.challenge_id]) return false;
      if (selectedChallenge === "all") return true;
      return Number(c.challenge_id) === Number(selectedChallenge);
    });
  };

  const renderDay = (props) => {
    const { day, ...other } = props;
    const formattedDay = format(day.toDate(), "yyyy-MM-dd");
    const completed = getCompletedForDay(formattedDay);
    const hasCompletion = completed.length > 0;

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <PickersDay
          {...other}
          day={day}
          disableMargin
          sx={{
            ...(hasCompletion && {
              backgroundColor: "rgba(255, 170, 70, 0.15)",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(255, 170, 70, 0.3)",
              },
            }),
            borderRadius: "4px",
          }}
        />
        {hasCompletion && (
          <Box
            sx={{
              display: "flex",
              gap: "2px",
              justifyContent: "center",
              position: "absolute",
              bottom: 2,
            }}
          >
            {completed.slice(0, 4).map((c) => (
              <Box
                key={c.challenge_id}
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  bgcolor: c.color,
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const handleDateClick = (newDate) => {
    setDate(newDate);
    const formattedDate = format(newDate.toDate(), "yyyy-MM-dd");

    if (challengeStatus[formattedDate]) {
      const challengesForDate = challengeStatus[formattedDate];
      const completedChallenges = challenges.filter(
        (challenge) => challengesForDate[challenge.challenge_id]
      );
      setModalContent(completedChallenges);
      setShowModal(true);
    }
  };

  const getFilteredChallenges = () => {
    if (selectedChallenge === "all") return challenges;
    return challenges.filter(
      (challenge) => challenge.challenge_id === Number(selectedChallenge)
    );
  };

  const navigate = useNavigate();
  const formattedDate = format(date.toDate(), "yyyy-MM-dd");
  const dateStatus = challengeStatus[formattedDate] || {};

  if (!currentUser || !token) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Paper sx={{ p: 5 }}>
          <LockOutlinedIcon sx={{ fontSize: 56, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            로그인이 필요합니다
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            챌린지 기록은 로그인 후 이용할 수 있습니다.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
          >
            로그인하기
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        챌린지 기록
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>챌린지별 기록 보기</InputLabel>
            <Select
              value={selectedChallenge}
              label="챌린지별 기록 보기"
              onChange={(e) => setSelectedChallenge(e.target.value)}
            >
              <MenuItem value="all">전체</MenuItem>
              {challenges.map((challenge) => (
                <MenuItem
                  key={challenge.challenge_id}
                  value={challenge.challenge_id}
                >
                  {challenge.challenge_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Paper
            sx={{
              p: 2,
              "& .MuiDateCalendar-root": { width: "100%" },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={date}
                onChange={handleDateClick}
                slots={{ day: renderDay }}
                disableHighlightToday
              />
            </LocalizationProvider>
          </Paper>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              {format(date.toDate(), "yyyy. M. d", { locale: ko })} 챌린지 기록
            </Typography>

            <List sx={{ pt: 0 }}>
              {getFilteredChallenges().length > 0 ? (
                getFilteredChallenges().map((challenge) => (
                  <ListItem
                    key={challenge.challenge_id}
                    sx={{
                      px: 0,
                      borderBottom: "1px solid #eee",
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        edge="start"
                        checked={dateStatus[challenge.challenge_id] || false}
                        onChange={(e) =>
                          handleChallengeCheck(
                            challenge.challenge_id,
                            challenge.participant_id,
                            e.target.checked
                          )
                        }
                        sx={{
                          color: challenge.color,
                          "&.Mui-checked": { color: challenge.color },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color: challenge.color,
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                        >
                          {challenge.challenge_name}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ color: "#999", textAlign: "center", py: 2 }}>
                  참여 중인 챌린지가 없습니다
                </Typography>
              )}
            </List>
          </Paper>

          {challenges.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                주간 달성 현황
              </Typography>
              <Stack spacing={2.5}>
                {getFilteredChallenges().map((challenge) => {
                  const totalWeeks = challenge.target_period || 1;
                  const badgeCount = getBadgeCount(challenge.challenge_id);
                  const targetDays = challenge.target_days || 1;

                  const weekStart = dayjs().startOf("week");
                  const weekEnd = dayjs().endOf("week");
                  let thisWeekCount = 0;
                  Object.entries(challengeStatus).forEach(([dateStr, status]) => {
                    const d = dayjs(dateStr);
                    if (
                      d.isAfter(weekStart.subtract(1, "day")) &&
                      d.isBefore(weekEnd.add(1, "day")) &&
                      status[challenge.challenge_id]
                    ) {
                      thisWeekCount++;
                    }
                  });
                  const weekPercent = Math.min(
                    Math.round((thisWeekCount / targetDays) * 100),
                    100
                  );

                  return (
                    <Box key={challenge.challenge_id}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: challenge.color }}
                        >
                          {challenge.challenge_name}
                        </Typography>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                          {thisWeekCount}/{targetDays}일
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={weekPercent}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "rgba(0,0,0,0.06)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            bgcolor: challenge.color,
                          },
                        }}
                      />
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                        <EmojiEventsIcon sx={{ fontSize: 14, color: "#FFD700" }} />
                        <Typography variant="caption" color="text.secondary">
                          뱃지 {badgeCount}/{totalWeeks}주 획득
                        </Typography>
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          )}
        </Box>
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "18px" }}>
          {format(date.toDate(), "yyyy. M. d", { locale: ko })} 완료된 챌린지
        </DialogTitle>
        <DialogContent>
          <List>
            {modalContent.map((challenge) => (
              <ListItem key={challenge.challenge_id}>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: challenge.color }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ color: challenge.color, fontWeight: "bold" }}>
                      {challenge.challenge_name}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default ChallengeDiary;
