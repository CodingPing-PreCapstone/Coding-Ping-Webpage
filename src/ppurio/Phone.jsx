import React from "react";
import './ppurio.css';

function Phone(props) {
    return (
        <div>
            <h3>{"발신번호 설정"}</h3>
            <textarea className="textarea" placeholder={"발신 번호를 등록해주세요"} cols={50} rows={1}></textarea>
            <h3>{"수신번호 입력"}</h3>
            <textarea className="textarea" placeholder={"수신 번호를 입력해주세요"} cols={50} rows={1}></textarea>
            <h3>{"받는 사람"}</h3>
            <div className="receiver">

            </div>
        </div>
    )
}

export default Phone;