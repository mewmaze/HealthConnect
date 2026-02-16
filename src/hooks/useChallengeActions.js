import { useContext } from "react";
import api from "../api/api";
import { ChallengeDispatchContext } from "../App";

const useChallengeActions = () => {
  const dispatch = useContext(ChallengeDispatchContext);

  const addChallenge = async (formData) => {
    try {
      const response = await api.post("/challenges", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({ type: "CREATE_CHALLENGE", data: response.data });
    } catch (error) {
      console.error("Failed to create challenge:", error);
      alert("챌린지 생성에 실패했습니다. 나중에 다시 시도해주세요.");
    }
  };

  const updateChallenge = async (id, formData) => {
    try {
      const response = await api.put(`/challenges/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({ type: "UPDATE_CHALLENGE", data: response.data });
    } catch (error) {
      console.error("Failed to update challenge:", error);
      alert("챌린지 업데이트에 실패했습니다. 나중에 다시 시도해주세요.");
    }
  };

  const deleteChallenge = async (id) => {
    try {
      await api.delete(`/challenges/${id}`);
      dispatch({ type: "DELETE_CHALLENGE", id });
    } catch (error) {
      console.error("Failed to delete challenge:", error);
      alert("챌린지 삭제에 실패했습니다. 나중에 다시 시도해주세요.");
    }
  };

  const joinChallenge = async (challengeId, userId, challenge, token) => {
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const progress = "not started"; // 기본 진행 상태 설정
    const response = await api.post(
      "/participants",
      {
        user_id: userId,
        challenge_id: challengeId,
        start_date: challenge.start_date,
        end_date: challenge.end_date,
        progress: progress,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
        },
      },
    );
    dispatch({ type: "JOIN_CHALLENGE", data: response.data });
  };

  const checkParticipant = async (challengeId, userId, token) => {
    try {
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.get(`/participants/${challengeId}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    checkParticipant,
  };
};

export default useChallengeActions;
