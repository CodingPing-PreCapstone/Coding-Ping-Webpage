import React from "react";
import Input from "./Input";
import Result from "./Result";
import './ppurio.css';

function Main(props) {
    return (
        <div className="container">
            <header className="header">
                <h1>Coding-Ping</h1>
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
                    <Result />
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