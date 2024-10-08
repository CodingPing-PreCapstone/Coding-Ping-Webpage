import React from "react";
import './ppurio.css';

function Result(props) {
    return (
        <div>
            <h3>{"AI 메세지 자동생성 결과"}</h3>
            <textarea name="input_keyword" className="textarea" cols={50} rows={15}></textarea>
            <br></br>
            <h3>{"AI 이미지 자동생성 결과"}</h3>
        </div>
    )
}

export default Result;