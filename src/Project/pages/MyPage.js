import React, { useState, useEffect, useContext } from 'react';
import LeftNav from '../components/leftNav';
import Profile from '../components/profile';
import MyList from '../components/mylist';
import axios from "axios";
import "./MyPage.css";
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../hooks/AuthContext';

export default function MyPage() {
    const navigate = useNavigate();
    const { user_id } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // Get token from localStorage

            if (!token) {
                navigate('/login'); // Redirect if no token
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/myPage/${user_id}`, {
                    headers: { Authorization: `Bearer ${token}` } // Include token in headers
                });
                setUserProfile(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login'); // Redirect if there is an error
            }
        };

        if (user_id) {
            fetchUserData();
        } else {
            navigate('/login'); // Redirect if no user_id is present
        }
    }, [user_id, navigate]);
    
    const handleLogout = async () => {
        try {
            // 로컬 스토리지에서 JWT와 사용자 정보 삭제. localstorage에 토큰을 저장했으므로 클라이언트쪽에서만 지워주면된다.
            localStorage.removeItem('token'); 
            localStorage.removeItem('user');

            logout(); // AuthContext 상태 초기화

            navigate('/'); //로그아웃 후 메인페이지로
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="myPage">
            <div className="main-content">
                <LeftNav />
                <div className="profile-section">
                    <Profile userProfile={userProfile} />
                    <div>
                    {userProfile && <button className="logout-btn" onClick={handleLogout}>로그아웃</button>}
                    </div>
                </div>
                <MyList />
            </div>
        </div>
    );
}