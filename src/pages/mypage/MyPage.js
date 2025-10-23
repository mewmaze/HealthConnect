import React, { useState, useEffect, useContext } from "react";
import LeftNav from "../../components/leftNav";
import Profile from "../../components/profile/profile";
import MyList from "../../components/mylist";
import api from "../../api/api";
import "./MyPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../hooks/AuthContext";

export default function MyPage() {
  const myPageNavItems = [
    "프로필",
    "나의 챌린지",
    "작성 글 목록",
    "작성 댓글 목록",
    "내 정보",
  ];

  const navigate = useNavigate();
  const { user_id } = useParams();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        navigate("/login"); // Redirect if no token
        return;
      }

      try {
        const response = await api.get(`/api/myPage/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` }, // Include token in headers
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirect if there is an error
      }
    };

    if (user_id) {
      fetchUserData();
    } else {
      navigate("/login"); // Redirect if no user_id is present
    }
  }, [user_id, navigate]);

  return (
    <div className="myPage">
      <div className="main-content">
        <LeftNav items={myPageNavItems} />
        <div className="profile-section">
          <Profile userProfile={userProfile} />
        </div>
        <MyList />
      </div>
    </div>
  );
}
