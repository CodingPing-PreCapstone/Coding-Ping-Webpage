import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import MessageAI from "./MessageAI"; // MessageAI 컴포넌트 불러오기
import AIImageGenerator from "./AIImageGenerator";

function Input({ title, setTitle, content, setContent }) {
    const imagePopupRef = useRef(null);  // ImageAI 팝업 창을 참조하는 변수
    const messagePopupRef = useRef(null); // MessageAI 팝업 창을 참조하는 변수

    const handleOpenImagePopup = () => {
        if (!imagePopupRef.current || imagePopupRef.current.closed) {
            const newWindow = window.open("", "", "width=1600,height=1000");

            if (newWindow) {
                newWindow.document.title = "ImageAI 팝업 창";
                const div = newWindow.document.createElement("div");
                newWindow.document.body.appendChild(div);
                const root = createRoot(div);
                root.render(<AIImageGenerator />);
                imagePopupRef.current = newWindow;

                newWindow.onbeforeunload = () => {
                    imagePopupRef.current = null;
                };
            }
        } else {
            imagePopupRef.current.focus();
        }
    };

    const handleOpenMessagePopup = () => {
        if (!messagePopupRef.current || messagePopupRef.current.closed) {
            const newWindow = window.open("", "", "width=600,height=600");

            if (newWindow) {
                newWindow.document.title = "MessageAI 팝업 창";
                const div = newWindow.document.createElement("div");
                newWindow.document.body.appendChild(div);
                const root = createRoot(div);
                root.render(<MessageAI />);
                messagePopupRef.current = newWindow;

                newWindow.onbeforeunload = () => {
                    messagePopupRef.current = null;
                };
            }
        } else {
            messagePopupRef.current.focus();
        }
    };

    return (
        <div>
            <h3>{"AI 이미지&메세지 자동생성"}</h3>
            <textarea className="textarea" placeholder={"제목을 입력해주세요.(최대30byte, 발송관리용)"} value={title} onChange={(e) => setTitle(e.target.value)} cols={50} rows={1}></textarea>
            <br />
            <textarea className="textarea" placeholder={"메시지 내용을 입력해주세요."} value={content} onChange={(e) => setContent(e.target.value)} cols={50} rows={15}></textarea>
            <br />
            <button type="button" className="gradient-button" onClick={handleOpenImagePopup}>{"AI 이미지 자동생성"}</button>
            <button type="button" className="gradient-button" onClick={handleOpenMessagePopup}>{"AI 자동생성"}</button>
        </div>
    );
}

export default Input;
