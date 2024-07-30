import React, { useState, useEffect, useContext} from 'react';
import { Tabs } from '@mui/base/Tabs';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { styled } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../hooks/AuthContext';

function MyTabs() {
  const { currentUser, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user_id = currentUser ? currentUser.user_id : null;
  const nickname = currentUser ? currentUser.username : '닉네임';
  // const profileImage = currentUser ? currentUser.profile_img : '';
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(location.pathname || '/login');

  useEffect(() => {
    setSelectedTab(location.pathname);
  }, [location.pathname]);

  const handleTabChange = (newValue) => {
    if (newValue === '/myPage' && !user_id) {
      console.log("로그인을 하셔야 합니다.");
      navigate('/login');
    } else if (newValue === '/myPage') {
      navigate(`/myPage/${user_id}`);
    } else {
      setSelectedTab(newValue);
      navigate(newValue);
    }
  };

  const handleLogout = () => {
    try {
      // 로컬 스토리지에서 JWT와 사용자 정보 삭제
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  
      // AuthContext 상태 초기화
      logout();
      
      // 로그아웃 후 메인 페이지로 리다이렉션
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Tabs value={selectedTab} onChange={(e, newValue) => handleTabChange(newValue)}>
      <TabsContainer>
        <TabsList>
          <Tab value="/bests/:id">BEST</Tab>
          <Tab value="/communities">커뮤니티</Tab>
          <Tab value="/challenge">챌린지</Tab>
        </TabsList>
        <MyInfoTabsList>
          {user_id ? (
            <>
              <Tab value="/exercise">나의 운동 / 챌린지 기록</Tab>
              <Tab
                value="/myPage"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                {nickname} 님
                {dropdownOpen && (
                  <DropdownMenu>
                    <DropdownItem onClick={() => navigate(`/myPage/${currentUser.user_id}`)}>마이페이지</DropdownItem>
                    <DropdownItem onClick={() => navigate(`/myPage/${currentUser.user_id}`)}>프로필 보기</DropdownItem> 
                    <DropdownItem onClick={() => navigate('/myPosts')}>작성 글 보기</DropdownItem>
                    <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
                  </DropdownMenu>
                )}
              </Tab>
            </>
          ) : (
            <>
              <Tab value="/login">로그인</Tab>
              <Tab value="/signUp">회원가입</Tab>
            </>
          )}
        </MyInfoTabsList>
      </TabsContainer>
    </Tabs>
  );
}



// export default function UnstyledTabsRouting() {
//   const user_id = null; // Replace with actual user_id fetching logic

//   return (
//       <TabsWrapper>
//         <MyTabs />
//       </TabsWrapper>
//   );
// }

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const DropdownMenu = styled('div')`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  color: #000;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 1000;
`;

const DropdownItem = styled('div')`
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Tab = styled(BaseTab)`
  position: relative;  // 드롭다운 메뉴가 탭의 절대 위치에 위치하도록 설정
  font-family: 'IBM Plex Sans', sans-serif;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  background-color: transparent;
  width: 100%;
  padding: 8px 10px;
  margin: 6px;
  margin-top: -5px;
  margin-bottom: -5px;
  border: none;
  border-radius: 7px;
  display: inline-flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};
    padding: -6px;
    margin-top: -5px;
    margin-bottom: -5px;
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${blue[200]};
    padding: -6px;
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: ${blue[600]};
  }
`;

// const TabsWrapper = styled('div')`
//   background-color: ${blue[500]};
//   border-radius: 12px;
// `;

const TabsContainer = styled('div')`
  display: inline-flex;
  justify-content: space-between;
  align-items: left;
  width: 80%;
  position: inherit;
  background-color: ${blue[500]};
`;

const TabsList = styled(BaseTabsList)`
  min-width: 600px;
  background-color: ${blue[500]};
  position: inherit;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

const MyInfoTabsList = styled(BaseTabsList)`
  min-width: 600px;
  background-color: ${blue[500]};
  position: inherit;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  margin-left: 6%;
  padding: 10px;
`;

export default MyTabs;