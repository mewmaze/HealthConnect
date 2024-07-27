import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import ChallengeInfo from "../components/ChallengeInfo";
import useChallengeActions from "../hooks/useChallengeActions";
import useChallengeUtils from "../hooks/useChallengeUtils";
import { AuthContext } from "../hooks/AuthContext";
import { ChallengeStateContext } from "../App";
import './ChallengeDetail.css';

function ChallengeDetail() {
    const { id } = useParams();
    const challenges = useContext(ChallengeStateContext);
    const { joinChallenge } = useChallengeActions();
    const { currentUser, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
    const { calculateEndDate } = useChallengeUtils();

    const fetchChallenge = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/challenges/${id}`);
            setChallenge(response.data);
        } catch (error) {
            console.error("Failed to fetch challenge:", error);
            setChallenge(null);
        }
    }, [id]);

    useEffect(() => {
        const challengeDetail = challenges.find(challenge => challenge.challenge_id === parseInt(id, 10));
        if (challengeDetail) {
            setChallenge(challengeDetail);
        } else {
            fetchChallenge();
        }
    }, [id, challenges, fetchChallenge]);

    const handleJoinChallenge = async () => {
        try {
            const userId = currentUser.user_id;
            await joinChallenge(parseInt(id, 10), userId, challenge.target_period, token);
            await fetchChallenge();
        } catch (error) {
            console.error("Failed to join challenge:", error);
        }
    };

    const handleGoList = () => {
        navigate('/challenge', { replace: true });
    };

    if (!challenge) {
        return <div>프로젝트를 찾을 수 없습니다.</div>;
    }

    const { challenge_name, description, participant_count, target_days, challenge_img, target_period, start_date,end_date } = challenge;
    const formattedTestDate = new Date(testDate).toLocaleDateString();

    return (
        <div className="ChallengeDetail">
            <div className="ChallengeTitle-name">{challenge_name}</div>
            <div className="ChallengeContent">
                <div className="ImageContainer">
                    <img src={`http://localhost:5000/${challenge_img}`} alt={challenge_name} className="challengeDetail-img" />
                    <div className="ChallengeTitle-count">{participant_count}명 도전중</div>
                </div>
                <div className="ChallengeDetails">
                    <div className="Challenge-Info">챌린지 설명</div>
                    <div>{description}</div>
                    <div className="Challenge-Info">챌린지 기간</div>
                    <div><span className="period_week">{target_period}주</span>{start_date.split('T')[0]}~{end_date.split('T')[0]}</div>
                    <div className="Challenge-Info">달성조건</div>
                    <div>주 {target_days}회</div>
                </div>
            </div>
            <div className="testChallengeBox">오늘부터 챌린지에 참여한다면?</div>
            <div className="ChallengeInfoWrapper">
                <div className="ChallengeInfo-container">
                    <label>
                        챌린지 시작 날짜 선택
                        <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} />
                    </label>
                    {testDate && (
                        <ChallengeInfo 
                            challenge={challenge} 
                            testDate={formattedTestDate}
                            start_date={new Date(start_date).toLocaleDateString()}
                        />
                    )}
                </div>
                <div className="ChallengeActions">
                    {testDate && (
                        <button type="button" onClick={handleJoinChallenge}>참여하기</button>
                    )}
                </div>
            </div>
            <button type="button" onClick={handleGoList}>챌린지 목록 보기</button>
        </div>
    );
}

export default ChallengeDetail;