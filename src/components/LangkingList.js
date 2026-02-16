import React, { useEffect, useState } from "react";
import { Avatar, Typography, Stack } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import api, { API_BASE_URL } from "../api/api";

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

function LangkingList() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await api.get("/api/rankings");
        setRankings(response.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch rankings:", error);
      }
    };
    fetchRankings();
  }, []);

  if (rankings.length === 0) return null;

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1.5, sm: 3 }}
      justifyContent="center"
      alignItems="flex-end"
      sx={{ py: 2, px: 1, overflowX: "auto" }}
    >
      {rankings.map((user, index) => (
        <Stack key={user.user_id} alignItems="center" spacing={0.5}>
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{
              color: index < 3 ? medalColors[index] : "text.secondary",
              fontSize: index === 0 ? "1.1rem" : "0.85rem",
            }}
          >
            {index < 3 && (
              <EmojiEventsIcon
                sx={{
                  fontSize: index === 0 ? 22 : 18,
                  verticalAlign: "middle",
                  mr: 0.3,
                }}
              />
            )}
            {index + 1}
          </Typography>
          <Avatar
            src={
              user.profile_picture
                ? `${API_BASE_URL}/uploads/${user.profile_picture}`
                : undefined
            }
            alt={user.nickname}
            sx={{
              width: { xs: index === 0 ? 48 : 40, sm: index === 0 ? 64 : 52 },
              height: { xs: index === 0 ? 48 : 40, sm: index === 0 ? 64 : 52 },
              border:
                index < 3
                  ? `2px solid ${medalColors[index]}`
                  : "2px solid #e0e0e0",
            }}
          />
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{ fontSize: "0.8rem" }}
          >
            {user.nickname}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: index < 3 ? medalColors[index] : "text.secondary",
              fontWeight: 700,
            }}
          >
            {user.achievement_count}회 달성
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
export default LangkingList;
