import React, { useState, useRef, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./ppurio.css";
import AddressBook from "./AddressBook";
import axios from 'axios';
import FirestoreCollection from "./FirestoreCollection"; // FirestoreCollection.js 파일 import
import RecentAddress from "./RecentAddress";    

function PhoneSet({ inputMessage, generatedImage, submittedTexts, setSubmittedTexts, sender, setSender, title }) {
    const [text, setText] = useState("");
    const [sendertext, setSenderText] = useState("");
    const [addressBook, setAddressBook] = useState([]);
    const [fromNumber, setfromNumber] = useState("");
    const [submittedOriginalTexts, setSubmittedOriginalTexts] = useState([]);
    const addressBookPopupRef = useRef(null);

    let latestNumbers = [];

    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber.length === 11) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
        }
        return phoneNumber;
    };



    const activeEnter = (e, type) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const currentText = e.target.value.trim();
            alert("수신창 입력");
            const isValidPhoneNumber = /^\d{11}$/.test(currentText);

            if (!isValidPhoneNumber) {
                alert("전화번호는 숫자 11자리여야 합니다. 다시 입력하세요.");
                if (type === "sender") {
                    setSender("");
                } else {
                    setText("");
                }
                return;
            }

            const formattedText = formatPhoneNumber(currentText);

            if (type === "sender") {
                setSender(formattedText);
                setfromNumber(currentText);
                setSenderText("");
            } else {
                if (!submittedTexts.includes(formattedText)) {
                    setSubmittedTexts((prevTexts) => [...prevTexts, formattedText]);
                    setSubmittedOriginalTexts((prevOriginals) => [...prevOriginals, currentText]);
                }
                setText("");
            }
        }
    };

    const divClear = () => {
        setSubmittedTexts([]); // 수신 번호 배열 초기화
        latestNumbers = [];
    };

    const saveAddressBook = async () => {
        const uniqueNumbers = submittedTexts.filter((number) => !addressBook.includes(number));
        if (uniqueNumbers.length > 0) {
            setAddressBook((prevAddressBook) => [...prevAddressBook, ...uniqueNumbers]);

            // Firestore에 저장
            try {
                const firestoreCollection = new FirestoreCollection("contact"); // "contact"는 Firestore 컬렉션 이름
                const user = "defaultUser"; // 사용자 식별자
                const updates = { number: uniqueNumbers };

                // Firestore에 업데이트
                await firestoreCollection.update(user, updates);

                alert("주소록 저장 완료");
            } catch (error) {
                console.error("Error saving to Firestore:", error);
                alert("주소록 저장 중 오류가 발생했습니다.");
            }
        } else {
            alert("새로운 번호가 없습니다.");
        }
    };


    const addAllToSubmittedTexts = useCallback((allContacts) => {
        setSubmittedTexts((prevTexts) => {
            const uniqueContacts = allContacts.filter((contact) => !prevTexts.includes(contact));
            return [...prevTexts, ...uniqueContacts];
        });
    }, [setSubmittedTexts]);

    const addToSubmittedTexts = useCallback((contact) => {
        setSubmittedTexts((prevTexts) => {
            if (!prevTexts.includes(contact)) {
                return [...prevTexts, contact];
            } else {
                alert(`${contact}는 이미 추가되었습니다.`);
                return prevTexts;
            }
        });
    }, [setSubmittedTexts]);

    const handleOpenAddressBookPopup = () => {
        if (!addressBookPopupRef.current || addressBookPopupRef.current.closed) {
            const newWindow = window.open("", "", "width=600,height=600");

            if (newWindow) {
                newWindow.document.title = "주소록 팝업 창";
                const div = newWindow.document.createElement("div");
                newWindow.document.body.appendChild(div);

                const root = createRoot(div);
                root.render(
                    <AddressBook
                        addressBook={addressBook}
                        setAddressBook={setAddressBook}
                        onClose={() => newWindow.close()}
                        addAllToSubmittedTexts={addAllToSubmittedTexts}
                        addToSubmittedTexts={addToSubmittedTexts}
                    />
                );

                addressBookPopupRef.current = newWindow;

                newWindow.onbeforeunload = () => {
                    addressBookPopupRef.current = null;
                };
            }
        } else {
            addressBookPopupRef.current.focus();
        }
    };

    useEffect(() => {
        if (addressBookPopupRef.current && !addressBookPopupRef.current.closed) {
            const div = addressBookPopupRef.current.document.body.querySelector("div");
            const root = createRoot(div);
            root.render(
                <AddressBook
                    addressBook={addressBook}
                    setAddressBook={setAddressBook}
                    onClose={() => addressBookPopupRef.current.close()}
                    addAllToSubmittedTexts={addAllToSubmittedTexts}
                    addToSubmittedTexts={addToSubmittedTexts}
                />
            );
        }
    }, [addressBook, addAllToSubmittedTexts, addToSubmittedTexts]); // 의존성 배열에 추가

    const handleSendMessage = async () => {
        try {
            // 수신 번호들을 쉼표로 구분된 문자열로 변환
            const toNumbers = submittedOriginalTexts;

            // API 요청 보내기 (response 변수 제거)
            await axios.post(`${process.env.REACT_APP_API_URL}/send_message_api/send_message`, {
                title,
                fromNumber,
                toNumbers,
                inputMessage,
                generatedImage,
            });

            try {
                const firestoreCollection = new FirestoreCollection("latest_contact"); // "latest_contact" 컬렉션

                // 배열 길이가 10개를 초과하지 않도록 유지
                const newNumbers = toNumbers.filter((num) => !latestNumbers.includes(num));
                latestNumbers = [...latestNumbers, ...newNumbers];
                if (latestNumbers.length > 10) {
                    latestNumbers = latestNumbers.slice(latestNumbers.length - 10); // 최신 10개만 유지
                }

                // Firestore에 업데이트
                updates.latest_number = latestNumbers;
                await firestoreCollection.update(user, updates);

                alert(`Message Sent!`);

            } catch (error) {
                console.error("Error updating latest contact in Firestore:", error);
                alert("Failed to update latest numbers in Firestore.");
            }

        } catch (error) {
            console.error("Error sending message: ", error);
            alert("Failed to send Message");
        }
    };

    return (
        <div>
            {/* UI 그대로 유지 */}
            <h3>{"발신번호 설정"}</h3>
            <textarea
                className="textarea"
                value={sendertext}
                placeholder={"발신 번호를 등록해주세요(예시:01012345678)"}
                onChange={(e) => setSenderText(e.target.value)}
                onKeyDown={(e) => activeEnter(e, "sender")}
                cols={50}
                rows={1}
            ></textarea>
            <div className="sender">{sender && <p>{sender}</p>}</div>
            <button type="button" className="gradient-button" onClick={handleOpenAddressBookPopup}>
                {"주소록"}
            </button>
            <button type="button" className="gradient-button" onClick={handleOpenAddressBookPopup}>
                {"최근 전송"}
            </button>
            <h3>{"수신번호 입력"}</h3>
            <textarea
                className="textarea"
                value={text}
                placeholder={"수신 번호를 입력해주세요(예시:01012345678)"}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => activeEnter(e, "receiver")}
                cols={50}
                rows={1}
            ></textarea>

            <h3>{"받는 사람"}</h3>
            <div className="receiver">
                {submittedTexts.map((text, index) => (
                    <p key={index}>{text}</p>
                ))}
            </div>
            <button type="button" className="gradient-button" onClick={divClear}>
                {"전체삭제"}
            </button>
            <button type="button" className="gradient-button" onClick={saveAddressBook}>
                {"주소록 저장"}
            </button>
            <br />
            <br />
            <button type="button" className="gradient-button" onClick={handleSendMessage}>
                {"메세지 전송"}
            </button>
        </div>
    );
}

export default PhoneSet;