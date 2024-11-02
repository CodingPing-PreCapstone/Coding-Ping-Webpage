import React, { useState } from "react";
import './ppurio.css';

function PhoneSet({ fromNumber, setFromNumber, toNumbers, setToNumbers }) {
    const [text, setText] = useState('');
    const [sendertext, setSenderText] = useState('');

    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber.length === 11) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
        }
        return phoneNumber;
    }

    const activeEnter = (e, type) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const currentText = e.target.value.trim();
            const isValidPhoneNumber = /^\d{11}$/.test(currentText);

            if (!isValidPhoneNumber) {
                alert('전화번호는 숫자 11자리여야 합니다. 다시 입력하세요.');
                type === 'sender' ? setSenderText('') : setText('');
                return;
            }

            const formattedText = formatPhoneNumber(currentText);

            if (type === 'sender') {
                setFromNumber(formattedText);
                setSenderText('');
            } else {
                setToNumbers((prevNumbers) => [...prevNumbers, formattedText]);
                setText('');
            }
        }
    }

    const divClear = () => {
        setToNumbers([]);
    }

    return (
        <div>
            <h3>{"발신번호 설정"}</h3>
            <textarea className="textarea" value={sendertext} placeholder={"발신 번호를 등록해주세요(예시:01012345678)"} onChange={(e) => setSenderText(e.target.value)} onKeyDown={(e) => activeEnter(e, 'sender')} cols={50} rows={1}></textarea>
            <div className="sender">
                {fromNumber && <p>{fromNumber}</p>}
            </div>
            <h3>{"수신번호 입력"}</h3>
            <textarea className="textarea" value={text} placeholder={"수신 번호를 입력해주세요(예시:01012345678)"} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => activeEnter(e, 'receiver')} cols={50} rows={1}></textarea>
            <h3>{"받는 사람"}</h3>
            <div className="receiver">
                {toNumbers.map((number, index) => (
                    <p key={index}>{number}</p>
                ))}
            </div>
            <button type="button" className="gradient-button" onClick={divClear}>{"전체삭제"}</button>
        </div>
    )
}

export default PhoneSet;
