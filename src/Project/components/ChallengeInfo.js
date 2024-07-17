import React from "react";
import useChallengeUtils from "../hooks/useChallengeUtils";


const ChallengeInfo = ({ challenge, testDate }) => {
    const { calculateEndDate, calculateBadges } = useChallengeUtils();
    const startDate = new Date(testDate); // testDate를 챌린지의 시작일로 설정

    const formattedStartDate = startDate.toISOString().split('T')[0]; // 포맷팅된 시작일 설정
    const endDate = calculateEndDate(challenge.start_date, challenge.target_period); // 종료일 계산
    const badges = calculateBadges(challenge.target_days, challenge.start_date, challenge.target_period, testDate); // 뱃지 개수 계산

    return (
        <div className="ChallengeInfo">
            <div>챌린지 시작일: {formattedStartDate}</div>
            <div>챌린지 종료일: {endDate}</div>
            <div>얻을 수 있는 뱃지 개수: {badges}</div>
        </div>
    );
};

export default ChallengeInfo;
