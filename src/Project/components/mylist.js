import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import axios from "axios";
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { AuthContext } from "../hooks/AuthContext";
import MyTabs from "../components/myTabs";
import Modal from "../components/Modal";
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
    const navigate = useNavigate();

    const userId = currentUser ? currentUser.user_id : null; // 사용자 ID를 현재 로그인한 사용자 정보에서 가져옴
    console.log('userId : ',userId);
    const goHome = () => {
        navigate(`/`); 
    }

    useEffect(() => {
        console.log('Current user:', currentUser);
        console.log('Token:', token);
        if (userId && token) {
            // 사용자가 로그인 되어 있을 때만 챌린지 목록 불러옴
            const fetchChallenges = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/participants/user-challenges', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('challenges:', response.data);
                    setChallenges(response.data.map((challenge, index) => ({ //챌린지에 색상부여
                        ...challenge,
                        color: challengeColors[index % challengeColors.length]
                    })));
                } catch (error) {
                    console.error('Failed to fetch challenges:', error);
                }
            };

            fetchChallenges();
        } else {
            console.log('UserId or token is missing');
        }
    }, [userId, token]);

    useEffect(() => {
        // 날짜가 변경될 때마다 해당 날짜의 챌린지 완료 여부를 불러온다
        const fetchChallengeStatus = async () => {
            try {
                const formattedDate = format(date, 'yyyy-MM-dd');
                const response = await axios.get(`http://localhost:5000/challengerecords/challenge-status?date=${formattedDate}`);
                console.log('Fetched challenge status:', response.data);

                // 서버 데이터로 로컬 상태 초기화 (서버 데이터가 로컬 상태를 덮어쓰지 않도록)
                setChallengeStatus(prevStatus => {
                    const newStatus = {
                        ...prevStatus,
                        [formattedDate]: response.data.reduce((acc, curr) => { //배열을 객체 형태로 변환
                            acc[curr.challenge_id] = true; // 서버에서 가져온 완료 상태
                            return acc;
                        }, {...(prevStatus[formattedDate] || {})}) // 현재 날짜에 대한 로컬 상태를 가져옴. 기존 상태 유지
                    };
                    console.log('Updated challenge status with server data:', newStatus);
                    return newStatus;
                });
            } catch (error) {
                console.error('Failed to fetch challenge status:', error);
            }
        };

        fetchChallengeStatus();
    }, [date]);

    // 체크박스 상태가 변경되면 서버에 상태를 업데이트하고 로컬 상태를 업데이트
    const handleChallengeCheck = async (challengeId, participantId, checked) => {
        try {
            const completionDate = format(date, 'yyyy-MM-dd');
            if (checked) {
                // 체크된 경우에만 서버에 데이터 저장
                await axios.post('http://localhost:5000/challengerecords/update', {
                    participant_id: participantId,
                    challenge_id: challengeId, // 어떤 챌린지가 체크되었는지를 식별하는 고유 ID
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

            // 로컬 상태 업데이트
            console.log('Updating local state with check:', { completionDate, challengeId, checked });
            setChallengeStatus(prevStatus => {
                const newStatus = {
                    ...prevStatus,
                    [completionDate]: {
                        ...prevStatus[completionDate],
                        [challengeId]: checked
                    }
                };
                console.log('Local state updated:', newStatus);
                return newStatus;
            });
        } catch (error) {
            console.error('Failed to update challenge status:', error);
        }
    };

    // 달력에 완료한 챌린지 표시
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = format(date, 'yyyy-MM-dd');
            if (challengeStatus[formattedDate]) {
                // 특정 날짜에 완료된 챌린지의 ID 목록을 가져옴
                const completedChallenges = Object.keys(challengeStatus[formattedDate])
                    .filter(challengeId => challengeStatus[formattedDate][challengeId]);

                // 필터링된 챌린지 ID
                const filteredChallenges = selectedChallenge === "all"
                    ? completedChallenges
                    : completedChallenges.filter(challengeId => Number(challengeId) === Number(selectedChallenge));


                if (filteredChallenges.length > 0) {
                    return (
                        <div className="tile-content">
                            {filteredChallenges.map((challengeId, index) => {
                                const numericChallengeId = Number(challengeId); // 숫자형으로 변환
                                const challenge = challenges.find(ch => ch.challenge_id === numericChallengeId);
                                return (
                                    <div
                                        key={index}
                                        className="challenge-dot"
                                        style={{ backgroundColor: challenge ? challenge.color : '#000' }} //점에 챌린지 색상 설정
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
    const handleDateClick = date => {
        setDate(date);
        const formattedDate = format(date, 'yyyy-MM-dd');
        if (challengeStatus[formattedDate]) {
            const challengesForDate = challengeStatus[formattedDate];
            const completedChallenges = challenges.filter(challenge => challengesForDate[challenge.challenge_id]);
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
        return challenges.filter(challenge => challenge.challenge_id === selectedChallenge);
    };

 return (
        <div className="ChallengeDiary">
            <nav className="topNav">
                <li className="Logo" onClick={goHome}>
                    <img className="imgLogo" src={require('../img/MainLogo.png')} alt="Logo" />
                </li>
                <li>
                    <MyTabs />
                </li>
            </nav>
            <h2>챌린지 기록</h2>
            <p>{format(date, 'yyyy년 M월 d일 EEEE', { locale: ko })}</p>
            <Calendar 
                onChange={setDate} 
                value={date} 
                tileContent={tileContent} 
                onClickDay={handleDateClick} 
                className="react-calendar" 
            />
            <h3>챌린지 목록</h3>
            <div>
                <label>챌린지 필터:</label>
                <select value={selectedChallenge} onChange={handleChallengeFilterChange}>
                    <option value="all">전체</option>
                    {challenges.map(challenge => (
                        <option key={challenge.challenge_id} value={challenge.challenge_id}>{challenge.challenge_name}</option>
                    ))}
                </select>
            </div>
            <div className="challenge-list">
                {getFilteredChallenges().map(challenge => (
                    <div key={challenge.challenge_id} className="challenge-item">
                        <label style={{color: challenge.color}}>
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
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h3>{format(date, 'yyyy년 M월 d일', { locale: ko })}의 완료된 챌린지</h3>
                    <ul>
                        {modalContent.map(challenge => (
                            <li key={challenge.challenge_id} style={{color: challenge.color}}>
                                {challenge.challenge_name}
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}
        </div>
    );
}

export default ChallengeDiary;