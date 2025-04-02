import React, { useState, useEffect, useContext } from "react";
import { Tabs } from "@mui/base/Tabs";
import { Tab as BaseTab, tabClasses } from "@mui/base/Tab";
import { TabsList as BaseTabsList } from "@mui/base/TabsList";
import { styled } from "@mui/system";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";

function MyTabs() {
  const { currentUser, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user_id = currentUser ? currentUser.user_id : null;
  const nickname = currentUser ? currentUser.username : "닉네임";
  // const profileImage = currentUser ? currentUser.profile_img : '';
  const navigate = useNavigate();
  const location = useLocation();

  const validTabs = [
    "/exercise",
    user_id ? `/myPage/${user_id}` : "/myPage",
    "/login",
    "/signUp",
  ];

  // 메인 홈페이지인 경우 아무것도 선택되지 않은 상태로 설정
  const initialTab =
    location.pathname === "/"
      ? null
      : validTabs.includes(location.pathname)
      ? location.pathname
      : "/login";
  const [selectedTab, setSelectedTab] = useState(initialTab);

  useEffect(() => {
    const newTab =
      location.pathname === "/"
        ? null
        : validTabs.includes(location.pathname)
        ? location.pathname
        : "/login";
    setSelectedTab(newTab);
  }, [location.pathname, user_id]);

  const handleTabChange = (event, newValue) => {
    if (newValue === "/myPage" && !user_id) {
      console.log("로그인을 하셔야 합니다.");
      navigate("/login");
    } else if (newValue === "/myPage") {
      navigate(`/myPage/${user_id}`);
    } else {
      setSelectedTab(newValue);
      navigate(newValue);
    }
  };

  const handleDropdownClick = (path) => {
    handleTabChange(null, path);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    try {
      // 로컬 스토리지에서 JWT와 사용자 정보 삭제
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // AuthContext 상태 초기화
      logout();

      // 로그아웃 후 메인 페이지로 리다이렉션
      navigate("/login");
      setSelectedTab("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Tabs value={selectedTab} onChange={handleTabChange}>
      <TabsContainer>
        <MyInfoTabsList>
          {user_id ? (
            <>
              <Tab value="/exercise">나의 기록</Tab>
              <Tab
                value="/myPage"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                {nickname} 님
                {dropdownOpen && (
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => handleDropdownClick(`/myPage/${user_id}`)}
                    >
                      마이페이지
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleDropdownClick(`/myPage/${user_id}`)}
                    >
                      프로필 보기
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleDropdownClick("/myPosts")}
                    >
                      작성 글 보기
                    </DropdownItem>
                    <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
                  </DropdownMenu>
                )}
              </Tab>
            </>
          ) : (
            <>
              <LoginTab value="/login">로그인</LoginTab>
              <Tab value="/signUp">회원가입</Tab>
            </>
          )}
        </MyInfoTabsList>
      </TabsContainer>
    </Tabs>
  );
}

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#80BFFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
  800: "#004C99",
  900: "#003A75",
};

const DropdownMenu = styled("div")`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fbfafa;
  color: #000;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 1005;
  padding: 8px 0;
  min-width: 180px;
`;

const DropdownItem = styled("div")`
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Tab = styled(BaseTab)`
  position: relative; // 드롭다운 메뉴가 탭의 절대 위치에 위치하도록 설정
  font-family: "IBM Plex Sans", sans-serif;
  color: #000;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  background-color: #fff;
  width: 130px;
  padding: 8px 10px;
  margin: 6px;
  margin-top: -5px;
  margin-bottom: -5px;
  border: none;
  border-radius: 7px;
  display: inline-flex;
  justify-content: center;

  // 기본 상태
  &:not(.${tabClasses.selected}) {
    background-color: #000;
    color: #fff;
  }

  // 선택된 상태
  &.${tabClasses.selected} {
    background-color: #000;
    color: #ffaa46;
  }

  // 호버 상태
  &:hover {
    // background-color: #f0f0f0;
    color: #ffaa46;
    background-color: #000;
  }
`;

const LoginTab = styled(Tab)`
  color: white;
  background-color: black;
`;

// const TabsWrapper = styled('div')`
//   background-color: ${blue[500]};
//   border-radius: 12px;
// `;

const TabsContainer = styled("div")`
  display: inline-flex;
  justify-content: flex-start;
  align-items: left;
  width: 100%;
  height: 64px;
  position: inherit;
  background-color: #fff;
`;

// const TabsList = styled(BaseTabsList)`
//   min-width: 600px;
//   background-color: #fff;
//   position: inherit;
//   border-radius: 12px;
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   align-content: space-between;
// `;

const MyInfoTabsList = styled(BaseTabsList)`
  min-width: 600px;
  background-color: #fff;
  position: inherit;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

export default MyTabs;
