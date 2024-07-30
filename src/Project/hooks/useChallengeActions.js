import { useContext } from 'react';
import axios from 'axios';
import { ChallengeDispatchContext } from '../App';
import useChallengeUtils from './useChallengeUtils';
import { AuthContext } from './AuthContext';

const useChallengeActions = () => {
  const dispatch = useContext(ChallengeDispatchContext);
  const { token } = useContext(AuthContext);
  const { calculateEndDate } = useChallengeUtils();

  console.log("Dispatch: ", dispatch);

  const addChallenge = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/challenges', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch({ type: 'CREATE_CHALLENGE', data: response.data });
      console.log('챌린지 생성 성공');
    } catch (error) {
      console.error("Failed to create challenge:", error);
      alert("챌린지 생성에 실패했습니다. 나중에 다시 시도해주세요.");
    }
  };

  const updateChallenge = async (id, formData) => {
    try {
      const response = await axios.put(`http://localhost:5000/challenges/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch({ type: 'UPDATE_CHALLENGE', data: response.data });
    } catch (error) {
      console.error("Failed to update challenge:", error);
      alert("챌린지 업데이트에 실패했습니다. 나중에 다시 시도해주세요.");
    }
  };

  const deleteChallenge = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/challenges/${id}`);
      dispatch({ type: 'DELETE_CHALLENGE', id });
    } catch (error) {
      console.error("Failed to delete challenge:", error);
      alert("챌린지 삭제에 실패했습니다. 나중에 다시 시도해주세요.");
    }
  };

  const joinChallenge = async (challengeId, userId,target_period, token) => {
    try {
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const startDate = new Date().toISOString().split('T')[0]; // 현재 날짜를 시작 날짜로 설정
      const endDate = calculateEndDate(startDate, target_period); // 종료 날짜 계산 (calculateEndDate 함수를 사용)
      const progress = "not started"; // 기본 진행 상태 설정
      const response = await axios.post('http://localhost:5000/participants', { //참여 데이터 서버에 전송
        user_id: userId,
        challenge_id: challengeId,
        start_date: startDate,
        end_date: endDate,
        progress: progress
      }, {
        headers: {
          Authorization: `Bearer ${token}` // 토큰을 헤더에 추가
        }
      });
      dispatch({ type: 'JOIN_CHALLENGE', data: response.data });
    } catch (error) {
      console.error("Failed to join Challenge:", error);
    }
  };

  const checkParticipant = async (challengeId, userId, token) => {
    try {
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await axios.get(`http://localhost:5000/participants/${challengeId}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}` // 토큰을 헤더에 추가
        }
      });
      return response.data.isParticipant;
    } catch (error) {
      console.error("Failed to check participant status:", error);
      return false;
    }
  };

  return {
    addChallenge,
    updateChallenge,
    deleteChallenge,
    joinChallenge,
    checkParticipant
  };
};

export default useChallengeActions;
