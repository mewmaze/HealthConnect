import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Stack,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Chip,
  LinearProgress,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import LeftNav from "../../components/leftNav";
import Profile from "../../components/profile/profile";
import MyList from "../../components/mylist";
import api from "../../api/api";
import { AuthContext } from "../../hooks/AuthContext";

const NAV_ITEMS = [
  "프로필",
  "나의 챌린지",
  "작성 글 목록",
  "작성 댓글 목록",
  "내 정보",
];

function MyChallenges({ userId }) {
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [participantRes, allChallengesRes, badgeRes, recordRes] = await Promise.all([
          api.get("/participants/user-challenges", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/challenges"),
          api.get(`/challengebadges/user/${userId}`).catch(() => ({ data: [] })),
          api.get("/challengerecords/challenge-status", {
            params: { user_id: userId },
          }).catch(() => ({ data: [] })),
        ]);

        const challengeMap = {};
        (allChallengesRes.data || []).forEach((c) => {
          challengeMap[c.challenge_id] = c;
        });

        setChallenges(
          (participantRes.data || []).map((p) => ({
            ...challengeMap[p.challenge_id],
            ...p,
          }))
        );
        setBadges(Array.isArray(badgeRes.data) ? badgeRes.data : []);
        setRecords(Array.isArray(recordRes.data) ? recordRes.data : []);
      } catch (error) {
        console.error("챌린지 조회 실패:", error);
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const getBadgeCount = (challengeId) =>
    badges.filter((b) => b.challenge_id === challengeId).length;

  const getThisWeekCount = (challengeId) => {
    const weekStart = dayjs().startOf("week");
    const weekEnd = dayjs().endOf("week");
    return records.filter((r) => {
      if (r.challenge_id !== challengeId) return false;
      const d = dayjs(r.completion_date);
      return d.isAfter(weekStart.subtract(1, "day")) && d.isBefore(weekEnd.add(1, "day"));
    }).length;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (challenges.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <EmojiEventsIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
        <Typography color="text.secondary">
          참여중인 챌린지가 없습니다.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {challenges.map((challenge) => {
        const totalWeeks = challenge.target_period || 1;
        const badgeCount = getBadgeCount(challenge.challenge_id);
        const targetDays = challenge.target_days || 1;
        const thisWeekCount = getThisWeekCount(challenge.challenge_id);
        const weekPercent = Math.min(
          Math.round((thisWeekCount / targetDays) * 100),
          100
        );

        return (
          <Paper
            key={challenge.challenge_id}
            sx={{
              p: 2.5,
              cursor: "pointer",
              "&:hover": { boxShadow: 3 },
              transition: "box-shadow 0.2s",
            }}
            onClick={() =>
              navigate(`/challengeDetail/${challenge.challenge_id}`)
            }
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography fontWeight={600}>
                {challenge.challenge_name}
              </Typography>
              <Chip
                label={`주 ${targetDays}회`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>

            {challenge.start_date && challenge.end_date && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <CalendarTodayIcon
                  sx={{ fontSize: 14, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {challenge.start_date} ~ {challenge.end_date}
                </Typography>
              </Stack>
            )}

            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography variant="caption" fontWeight={600}>
                  이번 주 달성
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="primary.main"
                >
                  {thisWeekCount}/{targetDays}일
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={weekPercent}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(255, 170, 70, 0.15)",
                  "& .MuiLinearProgress-bar": { borderRadius: 3 },
                }}
              />
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                <EmojiEventsIcon sx={{ fontSize: 14, color: "#FFD700" }} />
                <Typography variant="caption" color="text.secondary">
                  뱃지 {badgeCount}/{totalWeeks}주 획득
                </Typography>
              </Stack>
            </Box>
          </Paper>
        );
      })}
    </Stack>
  );
}

function MyInfo({ userProfile }) {
  if (!userProfile) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">정보를 불러오는 중...</Typography>
      </Paper>
    );
  }

  const infoItems = [
    { label: "이름", value: userProfile.name },
    { label: "닉네임", value: userProfile.nickname },
    { label: "이메일", value: userProfile.email },
    { label: "성별", value: userProfile.gender },
    { label: "나이", value: userProfile.age ? `${userProfile.age}세` : "-" },
    { label: "키", value: userProfile.height ? `${userProfile.height}cm` : "-" },
    { label: "몸무게", value: userProfile.weight ? `${userProfile.weight}kg` : "-" },
    { label: "관심 운동", value: userProfile.interest || "-" },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        내 정보
      </Typography>
      <Stack spacing={1.5}>
        {infoItems.map((item) => (
          <Stack key={item.label} direction="row" spacing={2} alignItems="center">
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ width: 80, flexShrink: 0 }}
            >
              {item.label}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {item.value || "-"}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

export default function MyPage() {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const { token } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get(`/api/myPage/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    if (user_id) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [user_id, token, navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case "프로필":
        return <Profile userProfile={userProfile} />;
      case "나의 챌린지":
        return <MyChallenges userId={user_id} />;
      case "작성 글 목록":
        return <MyList view="posts" />;
      case "작성 댓글 목록":
        return <MyList view="comments" />;
      case "내 정보":
        return <MyInfo userProfile={userProfile} />;
      default:
        return <Profile userProfile={userProfile} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        마이페이지
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <LeftNav
          items={NAV_ITEMS}
          activeItem={activeSection}
          onNavItemClick={setActiveSection}
        />
        <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          {renderContent()}
        </Box>
      </Stack>
    </Container>
  );
}
