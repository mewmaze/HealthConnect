import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useContext } from "react";
import { ChallengeStateContext } from "../App";
import axios from "axios";
import ChallengeInfo from "../components/ChallengeInfo";
import useChallengeActions from "../hooks/useChallengeActions";
import useChallengeUtils from "../hooks/useChallengeUtils";
import { AuthContext } from "../hooks/AuthContext";
import './ChallengeDetail.css';

function ChallengeDetail(){
    const {id} = useParams();
    const challenges = useContext(ChallengeStateContext); //중앙상태에서 challenges 가져옴
    const { joinChallenge } = useChallengeActions();
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null); // 로컬 상태로 특정 챌린지의 상세정보 관리
    const [testDate, setTestDate] = useState(""); // 테스트 날짜 상태 추가
    const { calculateEndDate } = useChallengeUtils();
    
    // 콘솔 로그로 currentUser 상태 확인
    console.log('Current User:', currentUser);

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
        if (challengeDetail) { //로컬 상태에서 챌린지를 찾은 경우
            setChallenge(challengeDetail);
        } else { //로컬 상태에서 찾을 수 없는경우, 서버에서 데이터를 가져온다
            fetchChallenge();
        }
    }, [id, challenges, fetchChallenge]);


    const handleJoinChallenge = async () => {
        try {
            const userId = currentUser.id; //현재 로그인한 사용자의 ID사용
            await joinChallenge(parseInt(id, 10), userId, challenge.target_period);

            await fetchChallenge();
        } catch (error) {
            console.error("Failed to join challenge:", error);
        }
       
    };

    const handleGoList = () => {
        navigate('/challenge', {replace:true})
    }

    if (!challenge){
        return <div>프로젝트를 찾을 수 없습니다.</div>
    }
    const {challenge_name,description,participant_count,target_days,challenge_img,target_period, start_date} = challenge;

    const startDate = new Date(start_date);// start_date를 Date 객체로 변환
    const ChallengeStartDate = startDate.toISOString().split('T')[0];    // ISO 형식으로 변환
    const ChallengeEndDate = calculateEndDate(start_date, target_period);

    return (
        <div>
            <div className="ChallengeDetail">
                <div className="ChallengeTitle">
                    <div className="ChallengeTitle-name">{challenge_name}</div>
                    <div className="ChallengeTitle-count">{participant_count}명 도전중</div>
                </div>
                <div className="ChallengeContent">
                    <img src={`http://localhost:5000/${challenge_img}`} alt={challenge_name} className="challengeDetail-img" />
                    <div className="ChallengeDetails">
                        <div>챌린지 설명 : {description}</div>
                        <div>달성기간 : {target_period}주</div>
                        <div>챌린지 기간 : {ChallengeStartDate}~{ChallengeEndDate}  {target_period}주</div>
                        <div>달성조건 : 주 {target_days}일</div>
                    </div>
                </div>
                <div className="ChallengeActions">
                    <label>
                        테스트 참여 날짜 설정:
                        <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} />
                    </label>
                    {/* 테스트용 */}
                    {testDate && (
                        <ChallengeInfo 
                            challenge={challenge} 
                            testDate={new Date(testDate)}
                            start_date={new Date(start_date)}
                        />
                    )}
                    {/* <ChallengeInfo challenge={challenge} /> 실제용 */}
                    <button type="button" onClick={handleJoinChallenge}>참여하기</button>
                    <button type="button" onClick={handleGoList}>챌린지 목록 보기</button>
                </div>
            </div>
        </div>
    );
}
export default ChallengeDetail;