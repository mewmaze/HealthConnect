import React from "react";
import useChallengeUtils from "../../hooks/useChallengeUtils";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import "./ChallengeInfo.css";

const ChallengeInfo = ({ challenge }) => {
  const { calculateBadges } = useChallengeUtils();
  const badges = calculateBadges(
    challenge.target_period,
    challenge.start_date,
    challenge.end_date
  );
  const start = dayjs(challenge.start_date);
  const end = dayjs(challenge.end_date);
  const today = dayjs().add(3, "day");

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
    <div className="ChallengeInfo">
      <div className="CalendarWrapper">
        <DateCalendar
          readOnly
          disableHighlightToday
          slots={{
            day: renderDay,
          }}
        />
      </div>
      <div className="ChallengeInfo-container">
        <div>챌린지 시작일 : {challenge.start_date}</div>
        <div>챌린지 종료일 : {challenge.end_date}</div>
        <div>얻을 수 있는 뱃지 개수 : {badges}</div>
      </div>
    </div>
  );
};

export default ChallengeInfo;
