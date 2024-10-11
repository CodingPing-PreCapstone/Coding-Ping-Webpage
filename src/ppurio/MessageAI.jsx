import React from "react";

const textarea = {
    resize: "none",
    borderRadius: "10px",
    padding: "10px 10px 10px 10px",
    width: "80%",
}

const container = {
    background: "linear-gradient(#4A90E2, #C5D3FE)",  // 문자열로 감싸야 함
    minHeight: "90vh",
    display: "flex",
    flexDirection: "column",  // camelCase로 변경
    padding: "20px",  // 좌우 패딩 추가
};

function MessageAI(props) {
    return (
        <div style={container}>
            <h3>{"AI 메세지 자동생성 결과"}</h3>
            <textarea name="input_keyword" style={textarea} cols={50} rows={30}></textarea>
            <br></br>
        </div>
    )
}

export default MessageAI;