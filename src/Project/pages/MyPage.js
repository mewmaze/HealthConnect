import React, { useState, useEffect } from 'react';
import LeftNav from '../components/leftNav';
import Profile from '../components/profile';
import MyList from '../components/mylist';
import axios from "axios";
import "./MyPage.css";
import { useNavigate, useParams } from 'react-router-dom';

export default function MyPage() {
    const navigate = useNavigate();
    const { user_id } = useParams();
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/myPage/${user_id}`);
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
            await axios.post('http://localhost:5000/auth/logout'); // Logout endpoint
            localStorage.removeItem('user'); // Clear user data
            navigate('/'); // Redirect to Home
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