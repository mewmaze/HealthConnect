import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../hooks/AuthContext";
import './ExerciseSet.css';

function ExerciseSet() {
    const { currentUser } = useContext(AuthContext); 

    const userId = currentUser?.user_id;

    const [basicInfo, setBasicInfo] = useState({ height: '', weight: '', bmi: '' });
    const [goal, setGoal] = useState({ height: '', weight: '', bmi: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                if (userId) {
                    const response = await axios.get(`http://localhost:5000/user/${userId}`);
                    setBasicInfo(response.data);
                    setGoal(response.data);
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
            await axios.put(`http://localhost:5000/user/${userId}`, {
                ...basicInfo,
                ...goal
            });
            setEditing(false);
            alert('정보가 성공적으로 업데이트되었습니다.');

        } catch (error) {
            console.error('Failed to update user information:', error);
            alert('정보 업데이트에 실패했습니다.');
        }
    };

    return (
            <div className="exerciseSet">
                <div className='exerciseSet-Top'>
                    <div className='Now'>
                        <div>현재 나의 상태</div>
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
                        <div>목표</div>
                        {editing ? (
                            <div>
                                <input 
                                    type="text" 
                                    name="height" 
                                    value={goal.height} 
                                    placeholder='목표 키를 입력해주세요'
                                    onChange={(e) => handleInputChange(e, 'goal')} 
                                />
                                <input 
                                    type="text" 
                                    name="weight" 
                                    value={goal.weight} 
                                    placeholder='목표 체중을 입력해주세요'
                                    onChange={(e) => handleInputChange(e, 'goal')} 
                                />
                                <input 
                                    type="text" 
                                    name="bmi" 
                                    value={goal.bmi} 
                                    placeholder='목표 BMI를 입력해주세요'
                                    onChange={(e) => handleInputChange(e, 'goal')} 
                                />
                            </div>
                        ) : (
                            <div>
                                <p>키 : {goal.height || '목표 키를 설정해 주세요'}</p>
                                <p>몸무게 : {goal.weight || '목표 몸무게를 설정해 주세요'}</p>
                                <p>BMI : {goal.bmi || '목표 BMI를 설정해 주세요'}</p>
                            </div>
                        )}
                    </div>
                </div>

                <button onClick={() => setEditing(!editing)}>
                    {editing ? '저장' : '수정'}
                </button>
            </div>
    );
}

export default ExerciseSet;
