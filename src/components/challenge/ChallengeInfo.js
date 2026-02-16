import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import useChallengeUtils from "../../hooks/useChallengeUtils";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";

const ChallengeInfo = ({ challenge }) => {
  const { calculateBadges } = useChallengeUtils();
  const badges = calculateBadges(
    challenge.target_period,
    challenge.start_date,
    challenge.end_date
  );
  const start = dayjs(challenge.start_date);
  const end = dayjs(challenge.end_date);
  const today = dayjs();

  const renderDay = (props) => {
    const { day, selected, ...other } = props;
    const isInRange =
      day.isAfter(start.subtract(1, "day"), "day") &&
      day.isBefore(end.add(1, "day"), "day");
    const isStart = day.isSame(start, "day");
    const isEnd = day.isSame(end, "day");
    let backgroundColor = "transparent";
    let color = "inherit";
    if (isInRange) {
      if (today.isBefore(start, "day")) {
        backgroundColor = "#90caf9";
        color = "white";
      } else if (today.isAfter(end, "day")) {
        backgroundColor = "#bdbdbd";
        color = "white";
      } else {
        if (day.isBefore(today, "day")) {
          backgroundColor = "#bdbdbd";
          color = "white";
        } else {
          backgroundColor = "#90caf9";
          color = "white";
        }
      }
    }

    return (
      <PickersDay
        {...other}
        day={day}
        disableMargin
        sx={{
          pointerEvents: "none",
          ...(isInRange && {
            backgroundColor,
            color,
            borderRadius: 0,
          }),
          ...(isStart && {
            borderTopLeftRadius: "50%",
            borderBottomLeftRadius: "50%",
          }),
          ...(isEnd && {
            borderTopRightRadius: "50%",
            borderBottomRightRadius: "50%",
          }),
        }}
      />
    );
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={4}
      alignItems="center"
      justifyContent="center"
    >
      <Box
        sx={{
          "& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer": {
            gap: 0,
          },
          "& .MuiDayCalendar-weekDayLabel": {
            width: 36,
            height: 36,
            margin: 0,
          },
          "& .MuiPickersDay-root": {
            margin: 0,
          },
        }}
      >
        <DateCalendar
          readOnly
          disableHighlightToday
          slots={{
            day: renderDay,
          }}
        />
      </Box>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
            챌린지 시작일
          </Typography>
          <Chip label={challenge.start_date} variant="outlined" />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
            챌린지 종료일
          </Typography>
          <Chip label={challenge.end_date} variant="outlined" />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
            얻을 수 있는 뱃지
          </Typography>
          <Chip
            label={`${badges}개`}
            sx={{ bgcolor: "primary.main", color: "white", fontWeight: 700 }}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default ChallengeInfo;
