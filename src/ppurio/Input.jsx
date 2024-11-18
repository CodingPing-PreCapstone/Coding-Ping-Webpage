import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import AIImageGenerator from "./AIImageGenerator";
import AIMessageGenerator from "./AIMessageGenerator";
import SavedImagesPopup from "./SavedImagesPopup";
import SavedMessagesPopup from "./SavedMessagesPopup";

function Input({
    inputMessage,
    setInputMessage,
    generatedImage,
    setGeneratedImage,
    savedMessages,
    setSavedMessages,
    savedImages,
    setSavedImages,
    title,
    setTitle,
}) {
    const imagePopupRef = useRef(null);
    const messagePopupRef = useRef(null);

    // 파일 시스템에서 이미지 선택 시 호출되는 함수 수정
    const handleImageSelect = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
            // 서버로 이미지 업로드 요청
                const response = await fetch(`${process.env.REACT_APP_API_URL}/send_message_api/upload_image`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();

                if (response.ok) {
                    const imageUrl = data.imageUrl; // 서버에서 반환된 이미지 URL
                    setGeneratedImage(imageUrl);
                    alert('이미지가 서버에 저장되었습니다.');
                } else {
                    alert('이미지 업로드 실패: ' + data.error);
                }
            } catch (error) {
                console.error('이미지 업로드 오류:', error);
                alert('이미지 업로드 중 오류가 발생했습니다.');
            }
        }
    };

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
                root.render(<AIMessageGenerator setInputMessage={setInputMessage} />);
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
            setSavedImages((prevImages) => [...prevImages, generatedImage]);
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
            root.render(<SavedImagesPopup images={savedImages} onAddImage={setGeneratedImage} />);
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

    const handleDeleteImage = () => {
        setGeneratedImage(null);
    }

    return (
        <div>
            <h3>{"AI 이미지&메세지 자동생성"}</h3>
            <textarea
                className="textarea"
                placeholder={"제목을 입력해주세요.(최대30byte, 발송관리용)"}
                cols={50}
                rows={1}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
            <button type="button" className="gradient-button" onClick={handleOpenImagePopup}>
                {"AI 이미지 자동생성"}
            </button>
            <button type="button" className="gradient-button" onClick={handleOpenMessagePopup}>
                {"AI 자동생성"}
            </button>
            <br />
            <button type="button" className="gradient-button" onClick={handleSaveMessage}>
                {"메세지 저장"}
            </button>
            <button type="button" className="gradient-button" onClick={handleOpenSavedMessagesPopup}>
                {"메세지 불러오기"}
            </button>
            <br />
            <br />
            <br />
            <br />
            <div
                className="generated-image-area"
                style={{
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                {generatedImage ? (
                    <img
                        src={generatedImage}
                        alt="Generated AI"
                        style={{
                            maxWidth: "80%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: "12px",
                        }}
                    />
                ) : (
                    <div className="placeholder" onClick={() => document.getElementById("fileInput").click()}>
                        <div className="plus-icon">+</div>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageSelect}
                        />
                    </div>
                )}
            </div>
            <button type="button" className="gradient-button" onClick={handleDeleteImage}>
                {"이미지 삭제"}
            </button>
            <button type="button" className="gradient-button" onClick={handleSaveImage}>
                {"이미지 저장"}
            </button>
            <button type="button" className="gradient-button" onClick={handleOpenSavedImagesPopup}>
                {"이미지 불러오기"}
            </button>
        </div>
    );
}

export default Input;
