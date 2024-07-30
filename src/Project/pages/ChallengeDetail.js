import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import ChallengeInfo from "../components/ChallengeInfo";
import useChallengeActions from "../hooks/useChallengeActions";
import { AuthContext } from "../hooks/AuthContext";
import { ChallengeStateContext } from "../App";
import './ChallengeDetail.css';

function ChallengeDetail() {
    const { id } = useParams();
    const challenges = useContext(ChallengeStateContext);
    const { joinChallenge, checkParticipant } = useChallengeActions();
    const { currentUser, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [isParticipant, setIsParticipant] = useState(false); // 참가 여부 상태 추가

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

    useEffect(() => {
        const checkParticipation = async () => {
            if (currentUser) {
                const participantStatus = await checkParticipant(parseInt(id, 10), currentUser.user_id, token);
                setIsParticipant(participantStatus);
                console.log('participantStatus :',participantStatus)
            }
        };
        checkParticipation();
    }, [currentUser, id, checkParticipant, token]);


    const handleJoinChallenge = async () => {
        try {
            const userId = currentUser.user_id;
            await joinChallenge(parseInt(id, 10), userId, challenge.target_period, token);
            await fetchChallenge();
            setIsParticipant(true); // 참가 상태로 변경
            console.log('participant :',isParticipant)
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

    return (
        <div className="ChallengeDetail">
            <div className="ChallengeTitle-name">{challenge_name}</div>
            <div className="ChallengeContent">
                <div className="ImageContainer">
                    <img src={`${challenge_img}`} alt={challenge_name} className="challengeDetail-img" />
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
                {isParticipant ? (
                    <div>참여중인 챌린지 입니다</div>
                    ) : (
                        <>
                            <div className="ChallengeInfoWrapper">
                                <div className="testChallengeBox">오늘부터 챌린지에 참여한다면?</div>
                                <ChallengeInfo challenge={challenge} />
                                <div className="ChallengeActions">
                                    <button type="button" onClick={handleJoinChallenge}>참여하기</button>
                                </div>
                            </div>
                        </>
                    )}

            <button type="button" onClick={handleGoList}>챌린지 목록 보기</button>
        </div>
    );
}

export default ChallengeDetail;