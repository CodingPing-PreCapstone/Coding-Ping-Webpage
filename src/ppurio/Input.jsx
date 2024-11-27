import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import AIImageGenerator from "./AIImageGenerator";
import AIMessageGenerator from "./AIMessageGenerator";
import SavedImagesPopup from "./SavedImagesPopup";
import SavedMessagesPopup from "./SavedMessagesPopup";
import FirestoreCollection from './FirestoreCollection';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./ppurio.css";

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
    const user = "codingping";
    const firestoreCollection = new FirestoreCollection("latestImage"); // "contact"는 Firestore 컬렉션 이름

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
                    //alert('이미지가 업로드 되었습니다.');
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
                root.render(<AIImageGenerator setGeneratedImage={setGeneratedImage} popupWindow={newWindow}/>);
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
                root.render(<AIMessageGenerator setInputMessage={setInputMessage} popupWindow={newWindow}/>);
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

            if (uploadResult) {
                //alert(`이미지 이름: ${imageName} 성공적으로 업로드되었습니다!`);

                // Firestore에서 해당 user의 기존 imagePathArray 가져오기
                const existingData = await firestoreCollection.read(user);
                const existingImagePaths = existingData.length > 0 
                    ? existingData[0].imagePathArray || [] 
                    : [];

                // 새로운 이미지 경로 추가 및 최대 10개 제한
                const updatedImagePaths = [...existingImagePaths, `AI_Image/${imageName}`].slice(-10);

                // Firestore에 업데이트
                const updates_latestImage = { imagePathArray: updatedImagePaths };
                try {
                    await firestoreCollection.update(user, updates_latestImage);
                    console.log("Firestore 업데이트 성공:", updates_latestImage);

                    // 상태 업데이트
                    setSavedImages((prevImages) => [...updatedImagePaths]);
                    //alert("Firestore에 업데이트가 성공적으로 완료되었습니다.");
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

    const handleSaveMessage = async () => {
        if (inputMessage.trim()) {
            const firestoreCollection = new FirestoreCollection("latestMessage"); // 여기에서 객체 생성
            const success = await firestoreCollection.addMessageToArray(user, inputMessage.trim());

            if (success) {
                setSavedMessages((prevMessages) => [...prevMessages, inputMessage.trim()]);
                setInputMessage("");
                //alert("메시지가 Firestore에 저장되었습니다!");
            } else {
                alert("Firestore에 메시지를 저장하는 중 오류가 발생했습니다.");
            }
        } else {
            alert("메시지를 입력해주세요!");
        }
    };

    const handleOpenSavedImagesPopup = async () => {
        const newWindow = window.open("", "", "width=1600,height=1000");
        if (newWindow) {
            newWindow.document.title = "저장된 이미지";

            // 새 div 생성 및 추가
            const div = newWindow.document.createElement("div");
            newWindow.document.body.appendChild(div);

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

    const handleOpenSavedMessagesPopup = async () => {
        const firestoreCollection = new FirestoreCollection("latestMessage");
        const savedMessagesFromDB = await firestoreCollection.getMessagesArray(user);
    
        const newWindow = window.open("", "", "width=1600,height=1000");
        if (newWindow) {
            newWindow.document.title = "저장된 메시지";
            const div = newWindow.document.createElement("div");
            newWindow.document.body.appendChild(div);
    
            const root = createRoot(div);
            root.render(
                <SavedMessagesPopup 
                    messages={savedMessagesFromDB} 
                    onAddMessage={setInputMessage} 
                />
            );
        }
    };

    const handleDeleteImage = () => {
        setGeneratedImage(null);
    };

    return (
        <div>
            <h3>{"AI 이미지&메시지 자동생성"}</h3>
            <textarea
                className="textarea"
                placeholder={"제목을 입력해주세요."}
                cols={50}
                rows={1}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            ></textarea>
            <br />
            <textarea
                name="input_keyword"
                className="textarea"
	        placeholder={"메시지 내용을 입력해주세요."}
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
	        {"메시지 저장"}
            </button>
            <button type="button" className="gradient-button" onClick={handleOpenSavedMessagesPopup}>
                {"메시지 불러오기"}
            </button>
            <br />
            <br />
            <br />
            <br />
	    <br />
	    <br />
	    <br />
            <div
                className="generated-image-area"
                style={{
                    maxWidth: "100%",
                    height: "200px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px solid #ddd",
                    borderRadius: "10px",
                    backgroundColor: "#FFFFFF",
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

