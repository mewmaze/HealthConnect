import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useContext } from "react";
import api from "../../api/api";
import ChallengeInfo from "../../components/ChallengeInfo";
import useChallengeActions from "../../hooks/useChallengeActions";
import { AuthContext } from "../../hooks/AuthContext";
import { DateTime } from "luxon";
import { ChallengeStateContext } from "../../App";
import "./ChallengeDetail.css";

function ChallengeDetail() {
  const { id } = useParams();
  // const challenges = useContext(ChallengeStateContext);
  const { joinChallenge, checkParticipant } = useChallengeActions();
  const { currentUser, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false); // 참가 여부 상태 추가

  const fetchChallenge = useCallback(async () => {
    try {
      console.log("Fetching challenge with ID:", id);
      const response = await api.get(`/challenges/${id}`);
      setChallenge(response.data);
      console.log("챌린지 데이터:", response.data); // response.data로 변경
    } catch (error) {
      console.error("Failed to fetch challenge:", error);
      setChallenge(null);
    }
  }, [id]);

  useEffect(() => {
    fetchChallenge(); // 컴포넌트가 마운트될 때 호출
  }, [fetchChallenge]);
  // useEffect(() => {
  //     const challengeDetail = challenges.find(challenge => challenge.challenge_id === parseInt(id, 10));
  //     if (challengeDetail) {
  //         setChallenge(challengeDetail);
  //     } else {
  //         fetchChallenge();
  //     }
  // }, [id, challenges, fetchChallenge]);

  useEffect(() => {
    const checkParticipation = async () => {
      if (currentUser) {
        const participantStatus = await checkParticipant(
          parseInt(id, 10),
          currentUser.user_id,
          token
        );
        setIsParticipant(participantStatus);
        console.log("participantStatus :", participantStatus);
      }
    };
    checkParticipation();
  }, [currentUser, id, checkParticipant, token]);

  const handleJoinChallenge = async () => {
    try {
      const userId = currentUser.user_id;
      await joinChallenge(
        parseInt(id, 10),
        userId,
        challenge.target_period,
        token
      );
      await fetchChallenge();
      setIsParticipant(true); // 참가 상태로 변경
      console.log("participant :", isParticipant);
    } catch (error) {
      console.error("Failed to join challenge:", error);
    }
  };

  const handleGoList = () => {
    navigate("/challenge", { replace: true });
  };

  if (!challenge) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

  const {
    challenge_name,
    description,
    participant_count,
    target_days,
    challenge_img,
    target_period,
    start_date,
    end_date,
  } = challenge;
  // UTC로 받은 start_date와 end_date를 로컬 시간대에 맞게 변환
  const localStartDate = DateTime.fromISO(start_date)
    .setZone("local")
    .toLocaleString(DateTime.DATE_MED);
  const localEndDate = DateTime.fromISO(end_date)
    .setZone("local")
    .toLocaleString(DateTime.DATE_MED);

  // React Calendar에서 사용할 수 있도록 "YYYY-MM-DD" 형식으로 변환
  const calendarStartDate = DateTime.fromISO(start_date).toISODate(); // 2024-05-01 형식
  const calendarEndDate = DateTime.fromISO(end_date).toISODate(); // 2024-05-01 형식

  return (
    <div className="ChallengeDetail">
      <div className="ChallengeTitle-name">{challenge_name}</div>
      <div className="ChallengeContent">
        <div className="ImageContainer">
          <img
            src={`${challenge_img}`}
            alt={challenge_name}
            className="challengeDetail-img"
          />
          <div className="ChallengeTitle-count">
            {participant_count}명 도전중
          </div>
        </div>
        <div className="ChallengeDetails">
          <div className="Challenge-Info">챌린지 설명</div>
          <div>{description}</div>
          <div className="Challenge-Info">챌린지 기간</div>
          <div>
            <span className="period_week">{target_period}주</span>
            {localStartDate}~{localEndDate}
          </div>
          <div className="Challenge-Info">달성조건</div>
          <div>주 {target_days}회</div>
        </div>
      </div>
      {isParticipant ? (
        <div className="ChallengeDetail-alert">참여중인 챌린지 입니다</div>
      ) : (
        <>
          <div className="testChallengeBox">오늘부터 챌린지에 참여한다면?</div>
          <div className="ChallengeInfoWrapper">
            <ChallengeInfo
              challenge={challenge}
              calendarStartDate={calendarStartDate}
              calendarEndDate={calendarEndDate}
              localStartDate={localStartDate}
              localEndDate={localEndDate}
            />
            <div className="ChallengeActions">
              <button
                className="joinbtn"
                type="button"
                onClick={handleJoinChallenge}
              >
                참여하기
              </button>
            </div>
          </div>
        </>
      )}

      <button className="golistbtn" type="button" onClick={handleGoList}>
        챌린지 목록 보기
      </button>
    </div>
  );
}

export default ChallengeDetail;
