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
  Checkbox,
  Typography,
} from "@mui/material";
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

const challengeColors = ["#FF6B6B", "#4ECDC4", "#556270", "#FFD700", "#C71585"];

function ChallengeDiary() {
  const [date, setDate] = useState(dayjs());
  const [challenges, setChallenges] = useState([]);
  const [challengeStatus, setChallengeStatus] = useState({});
  const [selectedChallenge, setSelectedChallenge] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const { currentUser, token } = useContext(AuthContext);

  const userId = currentUser ? currentUser.user_id : null;


  // 사용자가 참여 중인 챌린지 목록 가져오기
  useEffect(() => {
    if (userId && token) {
      const fetchChallenges = async () => {
        try {
          const response = await api.get("/participants/user-challenges", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setChallenges(
            response.data.map((challenge, index) => ({
              ...challenge,
              color: challengeColors[index % challengeColors.length],
            }))
          );
        } catch (error) {
          console.error("Failed to fetch challenges:", error);
        }
      };
      fetchChallenges();
    }
  }, [userId, token]);

  // 전체 챌린지 기록 가져오기
  useEffect(() => {
    const fetchAllChallengeRecords = async () => {
      try {
        const response = await api.get(`/challengerecords/challenge-status`, {
          params: { user_id: userId },
          headers: { Authorization: `Bearer ${token}` },
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
        console.error("Failed to fetch all challenge records:", error);
      }
    };

    if (userId && token) {
      fetchAllChallengeRecords();
    }
  }, [userId, token]);

  // 체크박스 변경 처리
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
    } catch (error) {
      console.error("Failed to update challenge status:", error);
    }
  };

  // 달력의 각 날짜 렌더링
  const renderDay = (props) => {
    const { day, ...other } = props;
    const formattedDay = format(day.toDate(), "yyyy-MM-dd");
    const completedChallenges = challengeStatus[formattedDay];

    const filteredCompleted =
      selectedChallenge === "all"
        ? completedChallenges
        : completedChallenges &&
          Object.keys(completedChallenges).filter(
            (id) =>
              completedChallenges[id] &&
              Number(id) === Number(selectedChallenge)
          );

    const hasCompletion =
      filteredCompleted && Object.keys(filteredCompleted).length > 0;

    return (
      <PickersDay
        {...other}
        day={day}
        disableMargin
        sx={{
          ...(hasCompletion && {
            backgroundColor: "#FFAA46",
            color: "white",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#FF8C00",
            },
          }),
          borderRadius: "4px",
        }}
      />
    );
  };

  // 날짜 클릭 처리
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

  // 필터링된 챌린지 목록
  const getFilteredChallenges = () => {
    if (selectedChallenge === "all") {
      return challenges;
    }
    return challenges.filter(
      (challenge) => challenge.challenge_id === Number(selectedChallenge)
    );
  };

  const formattedDate = format(date.toDate(), "yyyy-MM-dd");
  const dateStatus = challengeStatus[formattedDate] || {};

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* 메인 콘텐츠 */}
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", mt: 10, p: 3 }}
      >
        <Container maxWidth="lg" sx={{ flex: 1, display: "flex", gap: 4 }}>
          {/* 왼쪽: 필터 + 달력 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>챌린지별 기록 보기</InputLabel>
              <Select
                value={selectedChallenge}
                label="챌린지별 기록 보기"
                onChange={(e) => setSelectedChallenge(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
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
                border: "2px solid #000",
                borderRadius: "12px",
                "& .MuiDateCalendar-root": {
                  width: "100%",
                },
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

          {/* 오른쪽: 챌린지 기록 리스트 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              sx={{
                p: 3,
                border: "2px solid #000",
                borderRadius: "12px",
                height: "fit-content",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                {format(date.toDate(), "yyyy. M. d", { locale: ko })} 챌린지
                기록
              </Typography>

              <List sx={{ pt: 0 }}>
                {getFilteredChallenges().length > 0 ? (
                  getFilteredChallenges().map((challenge) => (
                    <ListItem
                      key={challenge.challenge_id}
                      sx={{
                        pl: 0,
                        pr: 0,
                        borderBottom: "1px solid #eee",
                        "&:hover": {
                          bgcolor: "#f5f5f5",
                        },
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
                            "&.Mui-checked": {
                              color: challenge.color,
                            },
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
                  <Typography
                    sx={{ color: "#999", textAlign: "center", py: 2 }}
                  >
                    참여 중인 챌린지가 없습니다
                  </Typography>
                )}
              </List>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* 완료된 챌린지 모달 */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            border: "2px solid #000",
          },
        }}
      >
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
                    <Typography
                      sx={{ color: challenge.color, fontWeight: "bold" }}
                    >
                      {challenge.challenge_name}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ChallengeDiary;
