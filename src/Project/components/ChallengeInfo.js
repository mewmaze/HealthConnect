import React, { useState, useEffect } from "react";
import useChallengeUtils from "../hooks/useChallengeUtils";
import Calendar from "react-calendar";
import "./ChallengeInfo.css";

const ChallengeInfo = ({
  challenge,
  calendarStartDate,
  calendarEndDate,
  localStartDate,
  localEndDate,
}) => {
  const { calculateBadges } = useChallengeUtils();
  const badges = calculateBadges(
    challenge.target_period,
    calendarStartDate,
    calendarEndDate
  );

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    // 날짜를 Date 객체로 변환
    const start = new Date(calendarStartDate);
    const end = new Date(calendarEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // calendarStartDate부터 today-1까지는 회색 표시
    const isPastDate = date >= start && date < today; // 오늘 전날까지
    const isWithinActiveChallenge = date >= today && date <= end; // 오늘~종료일

    if (isPastDate) return "past-date"; // 회색
    if (isWithinActiveChallenge) return "active-challenge"; // 주황색
    return "disabled-date"; // 범위 외 날짜
  };
  return (
    <div className="ChallengeInfo">
      <div className="CalendarWrapper">
        <Calendar view="month" tileClassName={tileClassName} />
      </div>
      <div className="ChallengeInfo-container">
        <div>챌린지 시작일 : {localStartDate}</div>
        <div>챌린지 종료일 : {localEndDate}</div>
        <div>얻을 수 있는 뱃지 개수 : {badges}</div>
      </div>
    </div>
  );
};

export default ChallengeInfo;
