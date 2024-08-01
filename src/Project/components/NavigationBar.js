// src/Project/components/NavigationBar.js
import React from 'react';
import { Tabs as BaseTabs, Tab as BaseTab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 현재 경로를 탭의 value로 설정
    const currentTabValue = location.pathname;

    const handleTabChange = (event, newValue) => {
        navigate(newValue);
    };

    return (
        <StyledTabs
            value={currentTabValue}  // 현재 경로를 value로 설정
            onChange={handleTabChange}  // 탭이 변경될 때 호출
            aria-label="navigation tabs"
            TabIndicatorProps={{
                style: {
                    backgroundColor: '#FFAA46', // 인디케이터 색상
                    height: '3px', // 인디케이터 두께
                },
            }}
        >
            <StyledTab value="/bests" label="BEST" />
            <StyledTab value="/communities" label="커뮤니티" />
            <StyledTab value="/challenge" label="챌린지" />
            <SearchContainer>
                <SearchInput placeholder="검색..." />
            </SearchContainer>
        </StyledTabs>
    );
};



const StyledTabs = styled(BaseTabs)`
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    height: 40px; /* 원하는 높이로 설정 */
    min-height: 40px; /* 최소 높이 설정 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
    z-index: 1000; /* 높은 z-index 값으로 설정하여 다른 요소들 위에 표시 */
    position: relative; /* z-index가 작동하도록 설정 */
    padding-left: 180px;
`;

const StyledTab = styled(BaseTab)(({ theme }) => ({
    fontFamily: 'IBM Plex Sans, sans-serif',
    color: '#000',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    height: '40px',
    maxHeight: '40px',
    minHeight: '40px', 
    backgroundColor: 'transparent',
    padding: '6px 22px',
    margin: '6px',
    borderRadius: '7px',
    display: 'inline-flex',
    justifyContent: 'center',
    margin: '0 20px',
    '&:hover': {
        backgroundColor: 'transparent',
    },
    '&.Mui-selected': {
        color: '#000', // 선택된 탭의 글자색
    },
    '&:focus': {
        color: '#000',
        outline: 'none', // 포커스 아웃라인 색상
    },
}));

// 검색창을 감싸는 컨테이너
const SearchContainer = styled('div')`
    display: flex;
    align-items: center;
    margin-left: auto; /* 검색창을 오른쪽으로 이동 */
    margin-right: 110px;
    
`;

// 검색창 스타일
const SearchInput = styled('input')`
    width: 320px;
    padding: 8px ;
    font-size: 0.875rem;
    border: 2px solid #000;
    border-radius: 100px;
    outline: none;
    transition: border-color 0.3s ease;
    box-sizing: border-box; /* 패딩과 보더를 포함하여 전체 크기를 유지 */
    padding-left: 16px; /* 왼쪽 패딩 조정 */
    &:focus {
        border-color: #FFAA46;
    }
`;


export default NavigationBar;
