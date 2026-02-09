import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./profile.css";
import api from "../../api/api";
import { AuthContext } from "../../hooks/AuthContext";

function Profile() {
  const { user_id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [formData, setFormData] = useState({
    nickname: "",
    intro: "",
    profile_picture: "",
    profile_picture_url: "",
  });
  const navigate = useNavigate();
  const { currentUser, token } = useContext(AuthContext);

  console.log("curr", currentUser);
  console.log("token", token);
  console.log("user_id", user_id);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user_id) {
        setError("사용자 ID가 없습니다.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("로그인 정보가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/myPage/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setFormData({
          nickname: response.data.nickname,
          intro: response.data.intro,
          profile_picture: null,
          profile_picture_url: response.data.profile_picture,
        });
      } catch (error) {
        setError("사용자 정보를 가져오는 데 실패했습니다.");
        console.error(
          "API 호출 실패:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }

      console.log("Current User:", currentUser);
      console.log("user_id", user_id);
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, token]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewSrc(reader.result);
    };
    reader.readAsDataURL(file);
    setFormData({
      ...formData,
      profile_picture: file,
      profile_picture_url: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("nickname", formData.nickname);
      form.append("intro", formData.intro);
      if (formData.profile_picture) {
        form.append("profile_picture", formData.profile_picture);
      }

      const response = await api.put(`/api/update/${user_id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("업데이트 성공 응답:", response.data);

      setUserData(response.data);
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        setError(`프로필 업데이트 실패: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("프로필 업데이트에 실패했습니다. 서버로부터 응답이 없습니다.");
      } else {
        console.error("Error message:", error.message);
        setError(`프로필 업데이트에 실패했습니다: ${error.message}`);
      }
    }
  };

  const handleUpdateClick = async () => {
    await handleSubmit();

    navigate(`/myPage/${user_id}`);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  const pictureSource =
    previewSrc ||
    (userData?.profile_picture
      ? `http://localhost:5000/uploads/${userData.profile_picture}`
      : "");

  return (
    <div className="profile-container">
      <div className="profile">
        <div className="img-container">
          {pictureSource && (
            <img
              id="img-prev"
              className="profile_img"
              src={pictureSource}
              alt={`${userData.nickname}'s profile`}
            />
          )}
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="profile-details">
          <p className="profile-nickname">
            닉네임
            <input
              value={formData.nickname || ""}
              className="profile-input"
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
            />
          </p>
          <div className="challenge-info">
            <p className="challengeComplete">챌린지 달성: </p>
            <p className="completedCount">{userData.achievement_count} 개</p>
          </div>
          <textarea
            rows="3"
            cols="25"
            className="intro"
            value={formData.intro || ""}
            onChange={(e) =>
              setFormData({ ...formData, intro: e.target.value })
            }
          />
        </div>
        <button className="update" onClick={handleUpdateClick}>
          프로필 수정
        </button>
      </div>
    </div>
  );
}

export default Profile;
