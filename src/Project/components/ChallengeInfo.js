import React, { useState, useEffect } from "react";
import useChallengeUtils from "../hooks/useChallengeUtils";
import Calendar from 'react-calendar';
import './ChallengeInfo.css';

const ChallengeInfo = ({ challenge, testDate}) => {
    const { calculateEndDate, calculateBadges } = useChallengeUtils();
    const [range, setRange] = useState([]);
    const [actualRange, setActualRange] = useState([]);

    useEffect(() => {
        console.log('challenge ;',challenge);
        console.log('test :', testDate)
        if (challenge && testDate) {
            const startDate = new Date(testDate);
            startDate.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정
            const endDate =  new Date(challenge.end_date);
            endDate.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정
            setRange([startDate, endDate]);
            

            const actualStartDate = new Date(challenge.start_date);
            actualStartDate.setHours(0, 0, 0, 0);
            const actualEndDate = new Date(challenge.end_date);
            actualEndDate.setHours(0, 0, 0, 0);
            setActualRange([actualStartDate, actualEndDate]);
        } else {
            setRange([]);
            setActualRange([]);
        }
    }, [challenge, testDate]);
console.log('range',range)
console.log('actualRange',actualRange);
   

    // Format dates as strings for rendering
    const formattedStartDate = new Date(testDate).toLocaleDateString();
    const endDate = new Date(challenge.end_date).toLocaleDateString();
    const actualStartDateFormatted = new Date(challenge.start_date).toLocaleDateString();
    const actualEndDateFormatted = new Date(challenge.end_date).toLocaleDateString();
    const badges = calculateBadges(challenge.target_days, challenge.start_date, challenge.target_period, testDate);

    const tileClassName = ({ date, view }) => {
        if (view !== 'month') return null;
        
        const [start, end] = range;
        const [actualStart, actualEnd] = actualRange;
    
        if (!start || !end || !actualStart || !actualEnd) return null;
    
        const isWithinActualRange = date >= actualStart && date <= actualEnd;
        const isWithinRange = date >= start && date <= end;
    
        // 선택된 날짜 범위(`range`)는 다른 색상으로 강조
        if (isWithinRange) {
            return 'highlight-range';
        }
    
        // 실제 챌린지 기간(`actualRange`)은 기본 회색으로 강조
        if (isWithinActualRange) {
            return 'actual-highlight-range';
        }
    
        return null;
    };
    console.log(tileClassName)
    return (
        <div className="ChallengeInfo">
            <div className="CalendarWrapper">
                <Calendar
                    view="month"
                    tileClassName={tileClassName}
                    
                />
            </div>
            <div className="ChallengeInfo-container">
                <div>챌린지 시작일 : {actualStartDateFormatted}</div> 
                <div>챌린지 종료일 : {actualEndDateFormatted}</div>
                <div>오늘부터 챌린지 시작일 : {formattedStartDate}</div> 
                <div>오늘부터 챌린지 종료일 : {endDate}</div>
                <div>얻을 수 있는 뱃지 개수 : {badges}</div>
            </div>
        </div>
    );
};

export default ChallengeInfo;
