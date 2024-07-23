import React, { useState, useEffect, useContext, createContext } from 'react';
import { Tabs } from '@mui/base/Tabs';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { styled } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';

// Context to provide and consume user_id
const UserContext = createContext(null);

function MyTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState('/myPage');
  const { user_id } = useContext(UserContext);

  useEffect(() => {
    setSelectedTab(location.pathname);
  }, [location.pathname]);

  const handleTabChange = (newValue) => {
    if (newValue === '/myPage' && !user_id) {
      console.log("로그인을 하셔야 합니다.");
      navigate('/login');
    } else {
      setSelectedTab(newValue);
      navigate(newValue);
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
          <Tab value="/exercise">나의 운동 기록</Tab>
          <Tab value="/myPage">닉네임 님</Tab>
        </MyInfoTabsList>
      </TabsContainer>
    </Tabs>
  );
}

export default function UnstyledTabsRouting() {
  const user_id = null; // Replace with actual user_id fetching logic

  return (
    <UserContext.Provider value={{ user_id }}>
      <TabsWrapper>
        <MyTabs />
      </TabsWrapper>
    </UserContext.Provider>
  );
}

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

const Tab = styled(BaseTab)`
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

const TabsWrapper = styled('div')`
  background-color: ${blue[500]};
  border-radius: 12px;
`;

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