import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import "./profile.css";
import axios from "axios";

function Profile() {
    const { user_id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user_id) {
                setError('사용자 ID가 없습니다.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/myPage/${user_id}`);
                setUserData(response.data);
            } catch (error) {
                setError('사용자 정보를 가져오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserData();
      }, [user_id]);


    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;
    
    const goEdit = () => {
        navigate(`/edit`);
    }

    const picture_source = userData?.profile_picture ? `http://localhost:5000/uploads/${userData.profile_picture}` : '';

    return (
        <div className="profile-container">
            {userData && (
                <div className="profile">
                    {picture_source && <img id="img-prev" className="profile_img" src={picture_source} alt={`${userData.nickname}'s profile`} />}
                    <div className="profile-details">
                        <p className="nickname">닉네임: {userData.nickname || "닉네임 없음"}</p>
                        <p className="challengeCompelete">챌린지 달성: </p><p className="compeletedCount">{userData.achievement_count} 개</p>
                        <textarea rows="3" cols="25" className="intro" readOnly>{userData.intro}</textarea>
                    </div>
                    <button className="update" onClick={goEdit}>프로필 수정</button>
                </div>
            )}
        </div>
    )
};

export default Profile;