import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import PhoneSet from "./PhoneSet";
import "./ppurio.css";

function Main() {
    const navigate = useNavigate();

    // 공통 상태 정의
    const [inputMessage, setInputMessage] = useState("");
    const [generatedImage, setGeneratedImage] = useState(null);
    const [savedMessages, setSavedMessages] = useState([]);
    const [savedImages, setSavedImages] = useState([]);
    const [submittedTexts, setSubmittedTexts] = useState([]);
    const [sender, setSender] = useState("");
    const [title, setTitle] = useState(""); // 제목 상태 추가

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <div className="container">
            <header className="header">
                <div className="header-content">
                    <h1>Coding-Ping</h1>
                    <button onClick={handleLogout} className="gradient-button">로그아웃</button>
                </div>
                <hr />
            </header>
            <div className="menu">
                <div className="main">
                    <Input
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        generatedImage={generatedImage}
                        setGeneratedImage={setGeneratedImage}
                        savedMessages={savedMessages}
                        setSavedMessages={setSavedMessages}
                        savedImages={savedImages}
                        setSavedImages={setSavedImages}
                        title={title} // 제목 상태 전달
                        setTitle={setTitle}
                    />
                    <PhoneSet
                        inputMessage={inputMessage}
                        generatedImage={generatedImage}
                        submittedTexts={submittedTexts}
                        setSubmittedTexts={setSubmittedTexts}
                        sender={sender}
                        setSender={setSender}
                        title={title} // 제목 상태 전달
                    />
                </div>
            </div>
            <footer className="footer">
                <hr />
                <p>© 2024 Coding-Ping Project. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Main;
