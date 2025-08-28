import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import api from "../api/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AuthContext } from "../hooks/AuthContext";
import LeftNav from "../components/leftNav";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { FaPenAlt } from "react-icons/fa";
import "./ChallengeDiary.css";

const challengeColors = ["#FF6B6B", "#4ECDC4", "#556270", "#FFD700", "#C71585"]; // 챌린지별 색상 배열

function ChallengeDiary() {
  const [date, setDate] = useState(new Date()); // 현재 선택된 날짜
  const [challenges, setChallenges] = useState([]); // 사용자가 참여하고 있는 챌린지 목록
  const [challengeStatus, setChallengeStatus] = useState({}); // 날짜별 챌린지 완료 상태 관리
  const [selectedChallenge, setSelectedChallenge] = useState("all"); //필터링할 챌린지의 ID를 저장
  const [showModal, setShowModal] = useState(false); //모달의 표시 여부를 저장
  const [modalContent, setModalContent] = useState([]); //모달에 표시할 챌린지 데이터를 저장
  const { currentUser, token } = useContext(AuthContext); // 로그인 사용자 정보 가져오기

  const userId = currentUser ? currentUser.user_id : null; // 사용자 ID를 현재 로그인한 사용자 정보에서 가져옴

  const navigate = useNavigate();
  const exerciseNavItems = [
    { name: "운동 기록", path: "/exercise" },
    { name: "챌린지 기록", path: "/challengeDiary" },
    { name: "목표 설정", path: "/exerciseset" },
  ];

  const handleNavItemClick = (itemName) => {
    const item = exerciseNavItems.find((navItem) => navItem.name === itemName);
    if (item) {
      navigate(item.path, { replace: true });
    }
  };

  useEffect(() => {
    console.log("Current user:", currentUser);
    console.log("Token:", token);
    if (userId && token) {
      // 사용자가 로그인 되어 있을 때만 챌린지 목록 불러옴
      const fetchChallenges = async () => {
        try {
          const response = await api.get("/participants/user-challenges", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("challenges:", response.data);
          setChallenges(
            response.data.map((challenge, index) => ({
              //챌린지에 색상부여
              ...challenge,
              color: challengeColors[index % challengeColors.length],
            }))
          );
        } catch (error) {
          console.error("Failed to fetch challenges:", error);
        }
      };

      fetchChallenges();
    } else {
      console.log("UserId or token is missing");
    }
  }, [userId, token]);

  useEffect(() => {
    // 전체 챌린지 기록을 가져와서 상태를 초기화
    const fetchAllChallengeRecords = async () => {
      try {
        const response = await api.get(`/challengerecords/challenge-status`, {
          params: { user_id: userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allRecords = response.data;

        // 전체 기록을 날짜별로 그룹화
        const formattedRecords = allRecords.reduce((acc, record) => {
          const date = format(new Date(record.completion_date), "yyyy-MM-dd");
          if (!acc[date]) acc[date] = {};
          acc[date][record.challenge_id] = true;
          return acc;
        }, {});

        setChallengeStatus(formattedRecords);
      } catch (error) {
        console.error("Failed to fetch all challenge records:", error);
      }
    };

    if (userId && token) {
      fetchAllChallengeRecords();
    }
  }, [userId, token]);

  useEffect(() => {
    // 날짜가 변경될 때마다 해당 날짜의 챌린지 완료 여부를 불러온다
    const fetchChallengeStatus = async () => {
      try {
        const formattedDate = format(date, "yyyy-MM-dd"); // 'date' 값을 'yyyy-MM-dd' 형식으로 포맷팅

        // 날짜에 해당하는 기록이 challengeStatus에 없으면 fetch
        if (!challengeStatus[formattedDate]) {
          const response = await api.get(`/challengerecords/challenge-status`, {
            params: { user_id: userId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const allRecords = response.data;
          const newStatus = allRecords.reduce((acc, curr) => {
            const date = format(new Date(curr.completion_date), "yyyy-MM-dd");
            if (!acc[date]) acc[date] = {};
            acc[date][curr.challenge_id] = true;
            return acc;
          }, {});

          setChallengeStatus((prevStatus) => ({
            ...prevStatus,
            ...newStatus,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch challenge status:", error);
      }
    };

    fetchChallengeStatus();
  }, [date, userId, token]);

  // 체크박스 상태가 변경되면 서버에 상태를 업데이트하고 로컬 상태를 업데이트
  const handleChallengeCheck = async (challengeId, participantId, checked) => {
    try {
      const completionDate = format(date, "yyyy-MM-dd");
      if (checked) {
        // 체크된 경우에만 서버에 데이터 저장
        await api.post("/challengerecords/update", {
          participant_id: participantId,
          challenge_id: challengeId, // 어떤 챌린지가 체크되었는지를 식별하는 고유 ID
          completion_date: completionDate,
        });
      } else {
        // 체크 해제된 경우에 데이터를 서버에서 삭제
        await api.post("/challengerecords/delete", {
          participant_id: participantId,
          challenge_id: challengeId,
          completion_date: completionDate,
        });
      }

      // 로컬 상태 업데이트
      console.log("Updating local state with check:", {
        completionDate,
        challengeId,
        checked,
      });
      setChallengeStatus((prevStatus) => {
        const newStatus = {
          ...prevStatus,
          [completionDate]: {
            ...prevStatus[completionDate],
            [challengeId]: checked,
          },
        };
        console.log("Local state updated:", newStatus);
        return newStatus;
      });
    } catch (error) {
      console.error("Failed to update challenge status:", error);
    }
  };

  // 달력에 완료한 챌린지 표시
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = format(date, "yyyy-MM-dd");
      if (challengeStatus[formattedDate]) {
        // 특정 날짜에 완료된 챌린지의 ID 목록을 가져옴
        const completedChallenges = Object.keys(
          challengeStatus[formattedDate]
        ).filter((challengeId) => challengeStatus[formattedDate][challengeId]);

        // 필터링된 챌린지 ID
        const filteredChallenges =
          selectedChallenge === "all"
            ? completedChallenges
            : completedChallenges.filter(
                (challengeId) =>
                  Number(challengeId) === Number(selectedChallenge)
              );

        if (filteredChallenges.length > 0) {
          return (
            <div className="tile-content">
              {filteredChallenges.map((challengeId, index) => {
                const numericChallengeId = Number(challengeId); // 숫자형으로 변환
                const challenge = challenges.find(
                  (ch) => ch.challenge_id === numericChallengeId
                );
                return (
                  <div
                    key={index}
                    className="challenge-dot"
                    style={{
                      backgroundColor: challenge ? challenge.color : "#000",
                    }} //점에 챌린지 색상 설정
                  />
                );
              })}
            </div>
          );
        }
      }
    }
    return null;
  };

  // 날짜를 클릭하면 해당 날짜의 챌린지 목록을 모달에 표시
  const handleDateClick = (date) => {
    setDate(date);
    const formattedDate = format(date, "yyyy-MM-dd");
    if (challengeStatus[formattedDate]) {
      const challengesForDate = challengeStatus[formattedDate];
      const completedChallenges = challenges.filter(
        (challenge) => challengesForDate[challenge.challenge_id]
      );
      setModalContent(completedChallenges);
      setShowModal(true);
    }
  };

  const handleChallengeFilterChange = (e) => {
    setSelectedChallenge(e.target.value);
  };

  const getFilteredChallenges = () => {
    if (selectedChallenge === "all") {
      return challenges;
    }
    return challenges.filter(
      (challenge) => challenge.challenge_id === selectedChallenge
    );
  };

  return (
    <div className="ChallengeDiary">
      <div className="ChallengeDiary-nav">
        <LeftNav
          items={exerciseNavItems.map((item) => item.name)}
          onNavItemClick={handleNavItemClick}
        />
      </div>
      <div className="ChallengeDiary-content">
        <div className="Challenge-filter">
          <div className="Challenge-filter-top">
            <label>챌린지별 기록 보기</label>
            <select
              value={selectedChallenge}
              onChange={handleChallengeFilterChange}
            >
              <option value="all">전체</option>
              {challenges.map((challenge) => (
                <option
                  key={challenge.challenge_id}
                  value={challenge.challenge_id}
                >
                  {challenge.challenge_name}
                </option>
              ))}
            </select>
          </div>
          <div className="Challenge-filter-calendar">
            <Calendar
              onChange={setDate}
              value={date}
              tileContent={tileContent}
              onClickDay={handleDateClick}
              className="react-calendar"
            />
          </div>
        </div>

        <div className="challenge-list">
          <p>{format(date, "yyyy. M. d", { locale: ko })} 챌린지 기록하기</p>
          {getFilteredChallenges().map((challenge) => (
            <div key={challenge.challenge_id} className="challenge-item">
              <label style={{ color: challenge.color }}>
                {challenge.challenge_name}
              </label>
              <FaPenAlt
                className={`record-icon ${
                  challengeStatus[format(date, "yyyy-MM-dd")] &&
                  challengeStatus[format(date, "yyyy-MM-dd")][
                    challenge.challenge_id
                  ]
                    ? "checked"
                    : ""
                }`}
                onClick={() =>
                  handleChallengeCheck(
                    challenge.challenge_id,
                    challenge.participant_id,
                    !(
                      challengeStatus[format(date, "yyyy-MM-dd")] &&
                      challengeStatus[format(date, "yyyy-MM-dd")][
                        challenge.challenge_id
                      ]
                    )
                  )
                }
              />
            </div>
          ))}
        </div>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <h3>{format(date, "yyyy. M. d", { locale: ko })} 완료된 챌린지</h3>
            <ul>
              {modalContent.map((challenge) => (
                <li
                  key={challenge.challenge_id}
                  style={{ color: challenge.color }}
                >
                  {challenge.challenge_name}
                </li>
              ))}
            </ul>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default ChallengeDiary;
