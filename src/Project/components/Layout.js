import React, { useState, useEffect } from 'react';
import MyTabs from './myTabs';
import { useNavigate } from 'react-router-dom';
import './Layout.css';
import PopupAd from "./PopupAd"

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    const goHome = () => {
        navigate(`/`);
    };

    useEffect(() => {
        // 처음 마운트될 때 2초 후에 팝업 광고 표시
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 2000);

        // 타이머 클리너를 반환
        return () => clearTimeout(timer);
    }, []); // 빈 배열을 의존성 배열로 사용하여 최초 마운트 시에만 실행

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="layout">
            <header>
            {showPopup && <PopupAd onClose={handleClosePopup}/>}
                <nav className="topNav">
                    <li className="Logo" onClick={goHome}>
                        <img className="imgLogo" src={require('../img/MainLogo.png')} alt="Logo" />
                    </li>
                    <li>
                        <MyTabs />
                    </li>
                </nav>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
