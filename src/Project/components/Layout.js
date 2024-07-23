import React from 'react';
import MyTabs from './myTabs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Layout.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/auth/logout'); // Logout endpoint
            localStorage.removeItem('user'); // Clear user data
            navigate('/'); // Redirect to Home
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const goHome = () => {
        navigate(`/`);
    };

    return (
        <div className="layout">
            <header>
                <nav className="topNav">
                    <li className="Logo" onClick={goHome}>
                        <img className="imgLogo" src={require('../img/MainLogo.png')} alt="Logo" />
                    </li>
                    <li>
                        <MyTabs />
                    </li>
                    <li>
                        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
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
