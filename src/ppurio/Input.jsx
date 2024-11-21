import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import AIImageGenerator from "./AIImageGenerator";
import AIMessageGenerator from "./AIMessageGenerator";
import SavedImagesPopup from "./SavedImagesPopup";
import SavedMessagesPopup from "./SavedMessagesPopup";
import FirestoreCollection from './FirestoreCollection';
import { getStorage, ref, uploadBytes } from "firebase/storage";

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

    const latest_Images_url = [];
    const firestoreCollection = new FirestoreCollection("lastestImage"); // "contact"는 Firestore 컬렉션 이름


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
                    const uniqueUrl = `${data.imageUrl}?t=${new Date().getTime()}`;
                    setGeneratedImage(uniqueUrl);
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

    const handleSaveImage = async () => {
        if (generatedImage) {
            try {
                const storage = getStorage();
                const imageName = `image_${Date.now()}.jpg`; // 고유한 파일 이름 생성
                const storageRef = ref(storage, `AI_Image/${imageName}`);

                // Fetch 이미지를 Blob으로 변환
                const response = await fetch(generatedImage);
                const blob = await response.blob();

                // Firebase Storage에 업로드
                const uploadResult = await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });

                if (uploadResult) { // 업로드 성공 시 후속 작업 진행
                    // 업로드된 이미지 URL을 저장
                    setSavedImages((prevImages) => [...prevImages, generatedImage]);
                    alert(`이미지 이름: ${imageName} 성공적으로 업로드되었습니다!`);

                    latest_Images_url.push(`AI_Image/${imageName}`);
                    if (latest_Images_url.length > 10) { // 배열 길이가 10 초과인 경우
                        latest_Images_url.shift(); // 첫 번째 원소 삭제
                    }

                    // imagePathArray 필드에 latest_Images_url 배열 저장 후 업데이트
                    const updates_lastestImage = { imagePathArray: latest_Images_url };
                    const user = "defaultUser"
                    try {
                        const updateResult = await firestoreCollection.update(user, updates_lastestImage);
                        if (updateResult) {
                            console.log("Firestore 업데이트 성공:", updateResult);
                            alert("Firestore에 업데이트가 성공적으로 완료되었습니다.");
                        }
                    } catch (updateError) {
                        console.error("Firestore 업데이트 실패:", updateError);
                        alert("Firestore 업데이트에 실패했습니다.");
                    }
                }
            } catch (error) {
                console.error("이미지 업로드 실패:", error);
                alert("이미지 업로드에 실패했습니다.");
            }
        } else {
            alert("업로드할 이미지가 없습니다.");
        }
    };


    const handleSaveMessage = () => {
        if (inputMessage.trim()) {
            setSavedMessages((prevMessages) => [...prevMessages, inputMessage.trim()]);
            setInputMessage("");
        }
    };

    const handleOpenSavedImagesPopup = async () => {
        const newWindow = window.open("", "", "width=1600,height=1000");
        if (newWindow) {
            newWindow.document.title = "저장된 이미지";

            // 새 div 생성 및 추가
            const div = newWindow.document.createElement("div");
            newWindow.document.body.appendChild(div);

            // FirestoreCollection 객체 생성
            const firestoreCollection = new FirestoreCollection(); // FirestoreCollection 클래스 인스턴스 생성
            const user = "defaultUser"; // 사용자 지정

            try {
                // Firestore에서 user 필드가 "defaultUser"인 문서의 imagePathArray 가져오기
                const documents = await firestoreCollection.read(user);

                const images = []; // 다운로드된 이미지 URL 목록
                for (const doc of documents) {
                    const imagePathArray = doc.imagePathArray || [];
                    for (let imagePath of imagePathArray) {
                        if (imagePath) { // 빈 문자열 검사
                            const storageRef = ref(getStorage(), imagePath);
                            const url = await getDownloadURL(storageRef);
                            images.push(url); // URL 추가
                        }
                    }
                }

                // React DOM 루트 생성 및 렌더링
                const root = createRoot(div);
                root.render(
                    <SavedImagesPopup
                        images={images}
                        onAddImage={(selectedImage) => {
                            setGeneratedImage(selectedImage); // 선택한 이미지를 설정
                            newWindow.close(); // 팝업 닫기
                        }}
                    />
                );
            } catch (error) {
                console.error("Error downloading images:", error);
                newWindow.document.body.innerHTML = "<p>이미지를 불러오는데 실패했습니다.</p>";
            }
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
