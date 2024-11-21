import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ppurio.css';
import FirestoreCollection from './FirestoreCollection'; // FirestoreCollection 클래스 임포트

const Loginppurio = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // FirestoreCollection 인스턴스 생성
    const userCollection = new FirestoreCollection('user');

    const handleLogin = async () => {
        if (id === 'codingping' && password === '1234') {
            try {
                // Firestore에 유저 데이터 추가
                const newUser = { user: id, createdAt: new Date() };
                const result = await userCollection.create(newUser);

                if (result) {
                    console.log('Firestore에 사용자 데이터가 성공적으로 저장되었습니다.');
                } else {
                    console.log('Firestore에 데이터가 이미 존재합니다.');
                }

                navigate('/welcome');
            } catch (error) {
                console.error('Firestore 작업 중 오류 발생:', error);
                alert('로그인 중 문제가 발생했습니다. 다시 시도해주세요.');
            }
        } else {
            alert('Invalid ID or Password');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="container-login">
            <div className="login-box">
                <h2>Login</h2>
                <input
                    className="textarea-login"
                    type="text"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <br />
                <input
                    className="textarea-login"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <br />
                <button onClick={handleLogin} className="gradient-button-login">Login</button>
            </div>
        </div>
    );
};

export default Loginppurio;
