import React from "react";
import { useState } from 'react';
import './ppurio.css';

function Input(props) {
    const [text, setText] = useState('');
    const [submittedTexts, setSubmittedTexts] = useState([]);

    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber.length === 11) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
          }
          return phoneNumber;
    }
    const activeEnter = (e) =>{
        if(e.key === "Enter"){
            e.preventDefault();
            const currentText = e.target.value.trim();
            alert("수신창 입력");
            const isValidPhoneNumber = /^\d{11}$/.test(currentText);

            if (!isValidPhoneNumber) {
                // 전화번호가 11자리 숫자가 아니면 경고창 띄우기
                alert('전화번호는 숫자 11자리여야 합니다. 다시 입력하세요.');
                // 입력창 초기화
                setText('');
                return;
            }

            // 11자리 숫자인 경우에만 포맷팅 후 저장
            const formattedText = formatPhoneNumber(currentText); // 전화번호 포맷팅
            setSubmittedTexts((prevTexts) => [...prevTexts, formattedText]);

            // textarea 초기화
            setText('');
        }
    }
    const divClear = () =>{
        setSubmittedTexts([]);
    }
    return (
        <div>
            <h3>{"AI 이미지&메세지 자동생성"}</h3>
            <textarea className="textarea" placeholder={"제목을 입력해주세요.(최대30byte, 발송관리용)"} cols={50} rows={1}></textarea>
            <br></br>
            <textarea name="input_keyword" className="textarea" cols={50} rows={15}></textarea>
            <br></br>
            <button type="button" className="gradient-button" onClick={()=>alert('이미지 생성완료')}>{"AI 이미지 자동생성"}</button>
            <button type="button" className="gradient-button" onClick={()=>alert('생성완료')}>{"AI 자동생성"}</button>
            <br></br>
            <h3>{"발신번호 설정"}</h3>
            <textarea className="textarea" placeholder={"발신 번호를 등록해주세요"} cols={50} rows={1}></textarea>
            <h3>{"수신번호 입력"}</h3>
            <textarea className="textarea" value={text} placeholder={"수신 번호를 입력해주세요(예시:01012345678)"} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => activeEnter(e)} cols={50} rows={1}></textarea>
            <h3>{"받는 사람"}</h3>
            <div className="receiver">
                {submittedTexts.map((text, index) => (
                    <p key={index}>{text}</p>
                ))}
            </div>
            <button type="button" className="gradient-button" onClick={()=>divClear()}>{"전체삭제"}</button>
        </div>
    )
}

export default Input;