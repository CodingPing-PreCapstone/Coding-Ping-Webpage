import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ppurio.css';

const Loginppurio = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (id === 'codingping' && password === '1234') {
            navigate('/welcome');
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
