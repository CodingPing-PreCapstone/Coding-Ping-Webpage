import React from "react";

const container = {
    background: "linear-gradient(#4A90E2, #C5D3FE)",  // 문자열로 감싸야 함
    minHeight: "90vh",
    display: "flex",
    flexDirection: "column",  // camelCase로 변경
    padding: "20px",  // 좌우 패딩 추가
};

const imageContainer = {
    width: "80%",  // 컨테이너 너비
    height: "400px",  // 고정된 높이 (이미지 높이에 따라 조절 가능)
    border: "2px dashed #ccc",  // 이미지를 넣을 수 있는 공간을 시각적으로 표시 (점선)
    display: "flex",
    justifyContent: "center",  // 수평 가운데 정렬
    alignItems: "center",  // 수직 가운데 정렬
    marginTop: "20px",  // 제목과의 간격
};

function ImageAI(props) {
    return (
        <div style={container}>
            <h3>{"AI 이미지 자동생성 결과"}</h3>
            <div style={imageContainer}>
                {/* 이미지가 들어갈 공간 */}
                <p>이미지가 여기에 표시됩니다.</p>
            </div>
        </div>
    )
}

export default ImageAI;