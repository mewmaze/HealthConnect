import React, { useState, useEffect } from "react";
import useChallengeUtils from "../hooks/useChallengeUtils";
import Calendar from 'react-calendar';
import './ChallengeInfo.css';

const ChallengeInfo = ({ challenge}) => {
    const {calculateBadges } = useChallengeUtils();
    const [testDate, setTestDate] = useState(null);
    const [challengeRange, setChallengeRange] = useState([]); //챌린지 생성일, 종료일 표시하는 기간. 안바뀜
    const [testRange, setTestRange] = useState([]); //오늘부터 하면 어떻게 되나 알아볼 수 있는 테스트 기간. 선택에따라 바뀜

    useEffect(() => {
        if (challenge) {
            const startDate = new Date(challenge.start_date);
            startDate.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정
            const endDate = new Date(challenge.end_date);
            endDate.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정
            setChallengeRange([startDate, endDate]); // 챌린지의 생성일, 종료일 범위를 지정
        }
    }, [challenge]);


    useEffect(() => {
        if (testDate && challenge) {
            const startDate = new Date(testDate);
            startDate.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정
            const endDate = new Date(challenge.end_date);
            endDate.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정
            setTestRange([startDate, endDate]); // 테스트의 시작일, 종료일 범위를 지정
        } else {
            setTestRange([]); // 초기 상태에서 testDate가 없으면 빈 배열로 설정
        }
    }, [testDate, challenge]);

    // Format dates as strings for rendering
    const formattedChallengeStartDate = new Date(challenge.start_date).toLocaleDateString();
    const formattedChallengeEndDate = new Date(challenge.end_date).toLocaleDateString();
    const formattedTestStartDate = testDate ? new Date(testDate).toLocaleDateString() : '';
    const formattedTestEndDate = challenge ? new Date(challenge.end_date).toLocaleDateString() : '';
    const badges = calculateBadges(challenge.target_days, challenge.start_date, challenge.target_period, testDate);

    const tileClassName = ({ date, view }) => {
        if (view !== 'month') return null;
        
        const [startDate, endDate] = challengeRange;
        const [testDate, testEndDate] = testRange;
    
        if (!startDate || !endDate || !testDate || !testEndDate) return null;
    
        const isWithinChallengeRange = date >= startDate && date <= endDate;
        const isWithinTestRange = date >= testDate && date <= testEndDate;

        // ChallengeRange 표시. 즉 챌린지 생성일, 종료일 기간
        if (isWithinChallengeRange) {
            if (isWithinTestRange) {
                return 'test-highlight-range'; // testRange 범위가 겹치는 경우
            }
            return 'highlight-range'; // ChallengeRange 범위만 포함된 경우
        }

        return 'disabled-date'; // 범위 외의 날짜는 비활성화
    };

    const handleDateChange = (date) => {
        // Ensure date is a valid Date object
        if (date instanceof Date && !isNaN(date)) {
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            setTestDate(utcDate); // 객체 상태로 testDate에 저장
            console.log('선택된 테스트 날짜:',utcDate);
        }
    };


    return (
        <div className="ChallengeInfo">
            <div className="CalendarWrapper">
                <Calendar
                    view="month"
                    tileClassName={tileClassName}
                    onChange={handleDateChange} // 날짜 선택 시 testDate 업데이트
                    value={testDate ? new Date(testDate) : new Date()} // testDate가 없으면 오늘 날짜로 설정  
                />
            </div>
            <div className="ChallengeInfo-container">
                <div>챌린지 생성일 : {formattedChallengeStartDate}</div> 
                <div>챌린지 종료일 : {formattedChallengeEndDate}</div>
                <div>오늘부터 챌린지 시작일 : {formattedTestStartDate}</div> 
                <div>오늘부터 챌린지 종료일 : {formattedTestEndDate}</div>
                <div>얻을 수 있는 뱃지 개수 : {badges}</div>
            </div>
        </div>
    );
};

export default ChallengeInfo;
