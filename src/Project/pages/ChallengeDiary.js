import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { format } from 'date-fns';

function ChallengeDiary() {
    const [date, setDate] = useState(new Date()); // 날짜 상태 관리
    const [challenges, setChallenges] = useState([]); // 사용자가 가입한 챌린지 목록 상태 관리
    const [challengeStatus, setChallengeStatus] = useState({}); // 날짜별 챌린지 완료 상태 관리
    const userId = 1; // 특정 사용자의 user_id. 테스트용

    useEffect(() => { // 사용자가 가입한 챌린지 목록을 불러온다
        const fetchChallenges = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/participants/user-challenges?userId=${userId}`);
                console.log('Fetched challenges:', response.data);
                setChallenges(response.data);
            } catch (error) {
                console.error('Failed to fetch challenges:', error);
            }
        };

        fetchChallenges();
    }, []);

    useEffect(() => {
        // 날짜가 변경될 때마다 해당 날짜의 챌린지 완료 여부를 불러온다
        const fetchChallengeStatus = async () => {
            try {
                const formattedDate = format(date, 'yyyy-MM-dd');
                const response = await axios.get(`http://localhost:5000/challengerecords/challenge-status?date=${formattedDate}`);
                console.log('Fetched challenge status:', response.data);

                // 서버 데이터로 로컬 상태 초기화 (서버 데이터가 로컬 상태를 덮어쓰지 않도록)
                setChallengeStatus(prevStatus => {
                    const newStatus = {
                        ...prevStatus,
                        [formattedDate]: response.data.reduce((acc, curr) => { //배열을 객체 형태로 변환
                            acc[curr.challenge_id] = true; // 서버에서 가져온 완료 상태
                            return acc;
                        }, {...(prevStatus[formattedDate] || {})}) // 현재 날짜에 대한 로컬 상태를 가져옴. 기존 상태 유지
                    };
                    console.log('Updated challenge status with server data:', newStatus);
                    return newStatus;
                });
            } catch (error) {
                console.error('Failed to fetch challenge status:', error);
            }
        };

        fetchChallengeStatus();
    }, [date]);

    const handleChallengeCheck = async (challengeId, participantId, checked) => {
        try {
            const completionDate = format(date, 'yyyy-MM-dd');
            if (checked) {
                // 체크된 경우에만 서버에 데이터 저장
                await axios.post('http://localhost:5000/challengerecords/update', {
                    participant_id: participantId,
                    challenge_id: challengeId,
                    completion_date: completionDate
                });
            } else {
                // 체크 해제된 경우에 데이터를 서버에서 삭제
                await axios.post('http://localhost:5000/challengerecords/delete', {
                    participant_id: participantId,
                    challenge_id: challengeId,
                    completion_date: completionDate
                });
            }

            // 로컬 상태 업데이트
            console.log('Updating local state with check:', { completionDate, challengeId, checked });
            setChallengeStatus(prevStatus => {
                const newStatus = {
                    ...prevStatus,
                    [completionDate]: {
                        ...prevStatus[completionDate],
                        [challengeId]: checked
                    }
                };
                console.log('Local state updated:', newStatus);
                return newStatus;
            });
        } catch (error) {
            console.error('Failed to update challenge status:', error);
        }
    };

    return (
        <div className="ChallengeDiary">
            <h2>Challenge Diary</h2>
            <Calendar onChange={setDate} value={date} />
            <p>{date.toDateString()}</p>
            <div className="challenge-list">
                {challenges.map(challenge => (
                    <div key={challenge.challenge_id} className="challenge-item">
                        <label>
                            {challenge.challenge_name}
                            <input
                                type="checkbox"
                                checked={(challengeStatus[format(date, 'yyyy-MM-dd')] && challengeStatus[format(date, 'yyyy-MM-dd')][challenge.challenge_id]) || false}
                                onChange={(e) => handleChallengeCheck(challenge.challenge_id, challenge.participant_id, e.target.checked)}
                            />
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChallengeDiary;
