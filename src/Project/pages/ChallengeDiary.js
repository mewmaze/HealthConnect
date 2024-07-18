import React, {useState, useEffect} from "react";
import Calendar from "react-calendar";
import axios from "axios";

function ChallengeDiary(){
    const [date, setDate] = useState(new Date()); //날짜 상태 관리
    const [challenges, setChallenges] = useState([]); //사용자가 가입한 챌린지 목록상태 관리
    const [challengeStatus, setChallengeStatus] = useState({}); //날짜별 챌린지 완료상태 여부 관리

    useEffect(() => { //사용자가 가입한 챌린지 목록을 불러온다
        const fetchChallenges = async () => {
            try {
                const response = await axios.get('/api/participants/user-challenges');
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
                const response = await axios.get(`/api/user/challenge-status?date=${date.toISOString().split('T')[0]}`);
                setChallengeStatus(response.data);
            } catch (error) {
                console.error('Failed to fetch challenge status:', error);
            }
        };

        fetchChallengeStatus();
    }, [date]);

    const handleChallengeCheck = async (challengeId, checked) => {
        try {
            await axios.post(`/api/user/challenge-status`, {
                challengeId,
                date: date.toISOString().split('T')[0],
                checked
            });

            // 상태 업데이트
            setChallengeStatus(prevStatus => ({
                ...prevStatus,
                [challengeId]: checked
            }));
        } catch (error) {
            console.error('Failed to update challenge status:', error);
        }
    };

    return (
        <div className="ChallengeDiary">
            <h2>Challenge Diary</h2>
            <Calendar onChange={setDate} value={date} />
            <div className="challenge-list">
                {challenges.map(challenge => (
                    <div key={challenge.id} className="challenge-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={challengeStatus[challenge.id] || false}
                                onChange={(e) => handleChallengeCheck(challenge.id, e.target.checked)}
                            />
                            {challenge.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ChallengeDiary;