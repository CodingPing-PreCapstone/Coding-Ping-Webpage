import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import AIImageGenerator from "./AIImageGenerator";
import AIMessageGenerator from "./AIMessageGenerator";
import SavedImagesPopup from "./SavedImagesPopup";
import SavedMessagesPopup from "./SavedMessagesPopup";

function Input() {
    const imagePopupRef = useRef(null);
    const messagePopupRef = useRef(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [savedMessages, setSavedMessages] = useState([]);

    const handleOpenImagePopup = () => {
        if (!imagePopupRef.current || imagePopupRef.current.closed) {
            const newWindow = window.open("", "", "width=1600,height=1000");
            if (newWindow) {
                newWindow.document.title = "ImageAI 팝업 창";
                const div = newWindow.document.createElement("div");
                newWindow.document.body.appendChild(div);
                const root = createRoot(div);
                root.render(<AIImageGenerator setGeneratedImage={setGeneratedImage} />);
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
            const newWindow = window.open("", "", "width=1600,height=1000");
            if (newWindow) {
                newWindow.document.title = "MessageAI 팝업 창";
                const div = newWindow.document.createElement("div");
                newWindow.document.body.appendChild(div);
                const root = createRoot(div);
                root.render(<AIMessageGenerator />);
                messagePopupRef.current = newWindow;
                newWindow.onbeforeunload = () => {
                    messagePopupRef.current = null;
                };
            }
        } else {
            messagePopupRef.current.focus();
        }
    };

    const handleSaveImage = () => {
        if (generatedImage) {
            setGeneratedImages((prevImages) => [...prevImages, generatedImage]);
        }
    };

    const handleSaveMessage = () => {
        if (inputMessage.trim()) {
            setSavedMessages((prevMessages) => [...prevMessages, inputMessage.trim()]);
            setInputMessage("");
        }
    };

    const handleOpenSavedImagesPopup = () => {
        const newWindow = window.open("", "", "width=1600,height=1000");
        if (newWindow) {
            newWindow.document.title = "저장된 이미지";
            const div = newWindow.document.createElement("div");
            newWindow.document.body.appendChild(div);
            const root = createRoot(div);
            root.render(<SavedImagesPopup images={generatedImages} onAddImage={setGeneratedImage} />);
        }
    };

    const handleOpenSavedMessagesPopup = () => {
        const newWindow = window.open("", "", "width=1600,height=1000");
        if (newWindow) {
            newWindow.document.title = "저장된 메시지";
            const div = newWindow.document.createElement("div");
            newWindow.document.body.appendChild(div);
            const root = createRoot(div);
            root.render(<SavedMessagesPopup messages={savedMessages} onAddMessage={setInputMessage} />);
        }
    };

    return (
        <div>
            <h3>{"AI 이미지&메세지 자동생성"}</h3>
            <textarea
                className="textarea"
                placeholder={"제목을 입력해주세요.(최대30byte, 발송관리용)"}
                cols={50}
                rows={1}
            ></textarea>
            <br />
            <textarea
                name="input_keyword"
                className="textarea"
                cols={50}
                rows={15}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
            ></textarea>
            <br />
            <button type="button" className="gradient-button" onClick={handleOpenImagePopup}>{"AI 이미지 자동생성"}</button>
            <button type="button" className="gradient-button" onClick={handleOpenMessagePopup}>{"AI 자동생성"}</button>
            <br />
            <button type="button" className="gradient-button" onClick={handleSaveMessage}>{"메세지 저장"}</button>
            <button type="button" className="gradient-button" onClick={handleOpenSavedMessagesPopup}>{"메세지 불러오기"}</button>
            <br />
            <br />
            <br />
            <br />
            <div className="generated-image-area">
                {generatedImage ? (
                    <img src={generatedImage} alt="Generated AI" style={{ maxWidth: "100%" }} />
                ) : (
                    <div className="placeholder">
                        <div className="plus-icon">+</div>
                    </div>
                )}
            </div>
            <button type="button" className="gradient-button" onClick={handleSaveImage}>{"이미지 저장"}</button>
            <button type="button" className="gradient-button" onClick={handleOpenSavedImagesPopup}>{"이미지 불러오기"}</button>
        </div>
    );
}

export default Input;
