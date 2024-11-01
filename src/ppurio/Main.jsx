import React from "react";
import { useNavigate } from 'react-router-dom';
import Input from "./Input";
import PhoneSet from "./PhoneSet";
import './ppurio.css';

function Main(props) {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <header className="header">
                <div className="header-content">
                    <h1>Coding-Ping</h1>
                    <button onClick={handleLogout} className="gradient-button">로그아웃</button>
                </div>
                <hr></hr>
            </header>
            <div className="menu">
                <div className="sidebar">
                    <h3>Menu</h3>
                    <div className="menu-item" onClick={()=>alert('Home')}>Home</div>
                    <div className="menu-item">About</div>
                    <div className="menu-item">Services</div>
                    <div className="menu-item">Chat Bot</div>
                </div>
                <div className="main">
                    <Input />
                    <PhoneSet />
                </div>
            </div>
            <footer className="footer">
                <hr></hr>
                <p>© 2024 Coding-Ping Project. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Main;