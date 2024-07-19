import React, {useState, useEffect} from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { format} from 'date-fns';

function ChallengeDiary(){
    const [date, setDate] = useState(new Date()); //날짜 상태 관리
    const [challenges, setChallenges] = useState([]); //사용자가 가입한 챌린지 목록상태 관리
    const [challengeStatus, setChallengeStatus] = useState({}); //날짜별 챌린지 완료상태 여부 관리
    const userId = 1; // 특정 사용자의 user_id. 테스트용

    useEffect(() => { //사용자가 가입한 챌린지 목록을 불러온다
        const fetchChallenges = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/participants/user-challenges?userId=${userId}`); //지금은 테스트용으로 userId를 쿼리 파라미터로 서버에 전달
                console.log('Fetched challenges:', response.data); // 응답 데이터 로그
                setChallenges(response.data);
            } catch (error) {
                console.error('Failed to fetch challenges:', error);
            }
        };

        fetchChallenges();
    }, []);

    useEffect(() => {
        // 날짜가 변경될 때마다 해당 날짜의 챌린지 완료 여부를 불러옵니다.
        const fetchChallengeStatus = async () => {
            try {
                const formattedDate = format(date, 'yyyy-MM-dd'); //date-fns의 format 함수를 사용하여 날짜를 로컬 시간대로 형식화
                const response = await axios.get(`http://localhost:5000/challengerecords/challenge-status?date=${date.toISOString().split('T')[0]}`);
                console.log('Fetched challenge status:', response.data);
                setChallengeStatus(prevStatus => ({
                    ...prevStatus,
                    [formattedDate]: response.data
                }));
            } catch (error) {
                console.error('Failed to fetch challenge status:', error);
            }
        };

        fetchChallengeStatus();
    }, [date]);

    const handleChallengeCheck = async (challengeId, participantId, checked) => {
        try {
            console.log(date.toISOString().split('T')[0]);
            console.log(date);
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

            // 상태 업데이트
            
            console.log('Updating local state');
            setChallengeStatus(prevStatus => {
                const newStatus = { ...prevStatus };
                if (!newStatus[completionDate]) {
                    newStatus[completionDate] = {};
                }
                newStatus[completionDate][challengeId] = checked;
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