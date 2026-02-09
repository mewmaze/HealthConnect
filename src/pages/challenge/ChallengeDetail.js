import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useContext } from "react";
import api from "../../api/api";
import ChallengeInfo from "../../components/challenge/ChallengeInfo";
import useChallengeActions from "../../hooks/useChallengeActions";
import { AuthContext } from "../../hooks/AuthContext";
import "./ChallengeDetail.css";

function ChallengeDetail() {
  const { id } = useParams();
  const { joinChallenge, checkParticipant } = useChallengeActions();
  const { currentUser, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);

  const fetchChallenge = useCallback(async () => {
    try {
      const response = await api.get(`/challenges/${id}`);
      setChallenge(response.data);
    } catch (error) {
      console.error("Failed to fetch challenge:", error);
      setChallenge(null);
    }
  }, [id]);

  useEffect(() => {
    fetchChallenge(); // 컴포넌트가 마운트될 때 호출
    console.log("challenge:", challenge);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      }
    };
    checkParticipation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.user_id, id]);

  const handleJoinChallenge = async () => {
    try {
      const userId = currentUser.user_id;
      await joinChallenge(parseInt(id, 10), userId, challenge, token);
      await fetchChallenge();
      setIsParticipant(true);
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
            {start_date}~{end_date}
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
            <ChallengeInfo challenge={challenge} />
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
