import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from "./Input";
import PhoneSet from "./PhoneSet";
import './ppurio.css';

function Main(props) {
    const navigate = useNavigate();

    // 상태 변수 정의
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [fromNumber, setFromNumber] = useState("");
    const [toNumbers, setToNumbers] = useState([]);

    const handleLogout = () => {
        navigate('/');
    };

    const handleSendMessage = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/send_message`, {
                title,
                content,
                fromNumber,
                toNumbers,
            });
            alert(`Message sent! Message Key: ${response.data.messageKey}`);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message.");
        }
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
                    <div className="menu-item" onClick={() => alert('Home')}>Home</div>
                    <div className="menu-item">About</div>
                    <div className="menu-item">Services</div>
                    <div className="menu-item">Chat Bot</div>
                </div>
                <div className="main">
                    {/* Input 컴포넌트에 상태와 상태 업데이트 함수 전달 */}
                    <Input title={title} setTitle={setTitle} content={content} setContent={setContent} />
                    {/* PhoneSet 컴포넌트에 상태와 상태 업데이트 함수 전달 */}
                    <PhoneSet fromNumber={fromNumber} setFromNumber={setFromNumber} toNumbers={toNumbers} setToNumbers={setToNumbers} />
                    <button onClick={handleSendMessage} className="send-button">전송</button>
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
