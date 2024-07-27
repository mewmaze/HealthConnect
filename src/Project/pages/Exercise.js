import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../hooks/AuthContext";
import LeftNav from '../components/leftNav';
import { useNavigate } from "react-router-dom";
import './Exercise.css';

function isEmptyGoal(goal) {
    return !goal || !goal.height || !goal.weight || !goal.BMI;
}

function Exercise() {
    const { currentUser } = useContext(AuthContext); 
    const [goal, setGoal] = useState(null);
    const navigate = useNavigate();

    // userId가 currentUser에서 가져온 사용자 ID
    const userId = currentUser?.user_id;

    const exerciseNavItems = [
        { name: "운동 기록", path: "/exercise" },
        { name: "챌린지 기록", path: "/challengeDiary" },
        { name: "목표 설정", path: "/exerciseset" }
    ];

    const handleNavItemClick = (itemName) => {
        const item = exerciseNavItems.find(navItem => navItem.name === itemName);
        if (item) {
            navigate(item.path, { replace: true });
        }
    };

    useEffect(() => {
        const fetchUserGoal = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:5000/user/${userId}`);
                    setGoal(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch user goal:', error);
            }
        };

        fetchUserGoal();
    }, [userId]); // userId가 변경될 때마다 fetchUserGoal 호출

    return (
        <div className="exerciseContainer">
            <LeftNav items={exerciseNavItems.map(item => item.name)} onNavItemClick={handleNavItemClick} />
            <div className="exerciseContent">
                <div className='Now'>
                    <div>현재 나의 상태</div>
                    {goal ? (
                        <div>
                            <div>키: {goal.height}</div>
                            <div>몸무게: {goal.weight}</div>
                        </div>
                    ) : (
                        <div>정보를 불러오는 중입니다...</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Exercise;
