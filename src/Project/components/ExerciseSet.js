import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../hooks/AuthContext";
import './ExerciseSet.css';

function ExerciseSet() {
    const { currentUser } = useContext(AuthContext); 
    const userId = currentUser?.user_id;

    const [basicInfo, setBasicInfo] = useState({ height: '', weight: '', bmi: '' });
    const [goal, setGoal] = useState({ goal_height: '', goal_weight: '', goal_bmi: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:5000/user/${userId}`);
                    setBasicInfo({
                        height: response.data.height,
                        weight: response.data.weight,
                        bmi: response.data.bmi
                    });
                    setGoal({
                        goal_height: response.data.goal_height,
                        goal_weight: response.data.goal_weight,
                        goal_bmi: response.data.goal_bmi
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user basicInfo or Goal:', error);
            }
        };

        fetchInfo();
    }, [userId]);

    const handleInputChange = (event, type) => {
        const { name, value } = event.target;
        if (type === 'basic') {
            setBasicInfo(prev => ({ ...prev, [name]: value }));
        } else if (type === 'goal') {
            setGoal(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            console.log('Sending data:', {
                basicInfo,  // 현재 상태 정보
                goal        // 목표 정보
            });

            const response = await axios.put(`http://localhost:5000/user/${userId}`, {
                height: basicInfo.height,
                weight: basicInfo.weight,
                bmi: basicInfo.bmi,
                goal_height: goal.goal_height,
                goal_weight: goal.goal_weight,
                goal_bmi: goal.goal_bmi
            });
            console.log('Server response:', response.data);

            setEditing(false);


        } catch (error) {
            console.error('Failed to update user information:', error);

        }
    };

    const handleEditToggle = () => {
        if (editing) {
            handleSave();  // 저장할 때 서버에 업데이트 요청
        } else {
            setEditing(true);
        }
    };

    return (
        <div className="exerciseSet">
            <div className='exerciseSet-Top'>
                <div className='Now'>
                    <div className='exerciseSet-title'>현재 나의 상태</div>
                    {editing ? (
                        <div>
                            <input 
                                type="text" 
                                name="height" 
                                value={basicInfo.height} 
                                onChange={(e) => handleInputChange(e, 'basic')} 
                            />
                            <input 
                                type="text" 
                                name="weight" 
                                value={basicInfo.weight} 
                                onChange={(e) => handleInputChange(e, 'basic')} 
                            />
                            <input 
                                type="text" 
                                name="bmi" 
                                value={basicInfo.bmi} 
                                onChange={(e) => handleInputChange(e, 'basic')} 
                            />
                        </div>
                    ) : (
                        <div>
                            <p>키 : {basicInfo.height || '키를 입력해 주세요'}</p>
                            <p>몸무게 : {basicInfo.weight || '체중을 입력해 주세요'}</p>
                            <p>BMI : {basicInfo.bmi || 'BMI를 입력해 주세요'}</p>
                        </div>
                    )}
                </div>
                <div className='Goal'>
                    <div className='exerciseSet-title'>목표</div>
                    {editing ? (
                        <div>
                            <input 
                                type="text" 
                                name="goal_height" 
                                value={goal.goal_height} 
                                placeholder='목표 키를 입력해주세요'
                                onChange={(e) => handleInputChange(e, 'goal')} 
                            />
                            <input 
                                type="text" 
                                name="goal_weight" 
                                value={goal.goal_weight} 
                                placeholder='목표 체중을 입력해주세요'
                                onChange={(e) => handleInputChange(e, 'goal')} 
                            />
                            <input 
                                type="text" 
                                name="goal_bmi" 
                                value={goal.goal_bmi} 
                                placeholder='목표 BMI를 입력해주세요'
                                onChange={(e) => handleInputChange(e, 'goal')} 
                            />
                        </div>
                    ) : (
                        <div>
                            <p>키 : {goal.goal_height || '목표 키를 설정해 주세요'}</p>
                            <p>몸무게 : {goal.goal_weight || '목표 몸무게를 설정해 주세요'}</p>
                            <p>BMI : {goal.goal_bmi || '목표 BMI를 설정해 주세요'}</p>
                        </div>
                    )}
                </div>
            </div>

            <button className='exerciseSet-btn' onClick={handleEditToggle}>
                {editing ? '저장' : '수정'}
            </button>
        </div>
    );
}

export default ExerciseSet;
