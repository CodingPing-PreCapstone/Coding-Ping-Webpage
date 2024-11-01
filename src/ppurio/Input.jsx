import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import MessageAI from "./MessageAI"; // MessageAI 컴포넌트 불러오기
import AIImageGenerator from "./AIImageGenerator";

function Input() {
    const imagePopupRef = useRef(null);  // ImageAI 팝업 창을 참조하는 변수
    const messagePopupRef = useRef(null); // MessageAI 팝업 창을 참조하는 변수

    // ImageAI 컴포넌트를 팝업 창에 렌더링하는 함수
    const handleOpenImagePopup = () => {
        // 창이 이미 열려 있는지 확인
        if (!imagePopupRef.current || imagePopupRef.current.closed) {
            const newWindow = window.open("", "", "width=1600,height=1000");

            if (newWindow) {
                newWindow.document.title = "ImageAI 팝업 창";

                // 새 창에 div 추가
                const div = newWindow.document.createElement("div");
                newWindow.document.body.appendChild(div);

                // React 컴포넌트를 새 창에 렌더링
                const root = createRoot(div);
                root.render(<AIImageGenerator />);  // ImageAI 컴포넌트를 렌더링

                imagePopupRef.current = newWindow;

                newWindow.onbeforeunload = () => {
                    imagePopupRef.current = null;
                };
            }
        } else {
            // 창이 이미 열려 있으면 포커스
            imagePopupRef.current.focus();
        }
    };

    // MessageAI 컴포넌트를 팝업 창에 렌더링하는 함수
    const handleOpenMessagePopup = () => {
        // 창이 이미 열려 있는지 확인
        if (!messagePopupRef.current || messagePopupRef.current.closed) {
            const newWindow = window.open("", "", "width=600,height=600");

            if (newWindow) {
                newWindow.document.title = "MessageAI 팝업 창";

                // 새 창에 div 추가
                const div = newWindow.document.createElement("div");
                newWindow.document.body.appendChild(div);

                // React 컴포넌트를 새 창에 렌더링
                const root = createRoot(div);
                root.render(<MessageAI />);  // MessageAI 컴포넌트를 렌더링

                messagePopupRef.current = newWindow;

                newWindow.onbeforeunload = () => {
                    messagePopupRef.current = null;
                };
            }
        } else {
            // 창이 이미 열려 있으면 포커스
            messagePopupRef.current.focus();
        }
    };

    return (
        <div>
            <h3>{"AI 이미지&메세지 자동생성"}</h3>
            <textarea className="textarea" placeholder={"제목을 입력해주세요.(최대30byte, 발송관리용)"} cols={50} rows={1}></textarea>
            <br />
            <textarea name="input_keyword" className="textarea" cols={50} rows={15}></textarea>
            <br />
            <button type="button" className="gradient-button" onClick={handleOpenImagePopup}>{"AI 이미지 자동생성"}</button>
            <button type="button" className="gradient-button" onClick={handleOpenMessagePopup}>{"AI 자동생성"}</button>
        </div>
    );
}

export default Input;
