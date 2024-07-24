import React, { useState, useEffect } from "react";
import useChallengeUtils from "../hooks/useChallengeUtils";
import Calendar from 'react-calendar';
import './ChallengeInfo.css';

const ChallengeInfo = ({ challenge, testDate }) => {
    const { calculateEndDate, calculateBadges } = useChallengeUtils();
    const startDate = new Date(testDate); // testDate를 챌린지의 시작일로 설정
    const [range, setRange] = useState([]);

    useEffect(() => {
        if (challenge && testDate) {
            const startDate = new Date(testDate);
            const endDate = new Date(calculateEndDate(challenge.start_date, challenge.target_period));
            
            // Only update the range if it is different from the current range
            if (JSON.stringify(range) !== JSON.stringify([startDate, endDate])) {
                setRange([startDate, endDate]);
            }
        } else {
            // If no challenge or testDate, clear the range
            if (range.length !== 0) {
                setRange([]);
            }
        }
    }, [challenge, testDate]);

    const tileClassName = ({ date }) => {
        const [start, end] = range;
        const isWithinRange = start && end && date >= start && date <= end;
        return isWithinRange ? 'highlight-range' : null;
    };

    const formattedStartDate = startDate.toISOString().split('T')[0]; // 포맷팅된 시작일 설정
    const endDate = calculateEndDate(challenge.start_date, challenge.target_period); // 종료일 계산
    const badges = calculateBadges(challenge.target_days, challenge.start_date, challenge.target_period, testDate); // 뱃지 개수 계산

    console.log("satartDate : ",startDate);
    console.log("endDate : ",endDate);
    console.log("range:",range);
    return (
        <div className="ChallengeInfo">
            <div className="CalendarWrapper">
                <Calendar
                    view="month"
                    tileClassName={tileClassName}
                />
            </div>            
            <div className="ChallengeInfo-container">
                <div>챌린지 시작일 : {formattedStartDate}</div>
                <div>챌린지 종료일 : {endDate}</div>
                <div>얻을 수 있는 뱃지 개수 : {badges}</div>
            </div>
        </div>
    );
};

export default ChallengeInfo;
