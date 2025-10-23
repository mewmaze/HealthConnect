import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/api";
import "./LangkingList.css";

function LangkingList() {
  const [profiles, setProfiles] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get("/api");
        console.log("Fetched 프로필들", response.data);
        setProfiles(response.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch Profiles:", error); // 상위 5개의 프로필만 설정
      }
    };
    fetchProfiles();
  }, []);

  return (
    <div className="LangkingList">
      <ul className="LangkingList-lank">
        {profiles.map((profile, index) => (
          <li key={profile.id} className="LangkingList-box">
            <div className="Langking-number">{index + 1}</div>
            <div className="LangkingList-content">
              <img
                src={`${API_BASE_URL}/uploads/${profile.User.profile_picture}`}
                alt={`${profile.User.nickname}'s profile`}
                width="50"
                height="50"
              />
              <div className="Langking-name">{profile.User.nickname}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default LangkingList;
