import React, { useState, useRef, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./ppurio.css";
import AddressBook from "./AddressBook";

function PhoneSet({ inputMessage, generatedImage, submittedTexts, setSubmittedTexts, sender, setSender, title }) {
    const [text, setText] = useState("");
    const [sendertext, setSenderText] = useState("");
    const [addressBook, setAddressBook] = useState([]);
    const addressBookPopupRef = useRef(null);

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
                setSenderText("");
            } else {
                if (!submittedTexts.includes(formattedText)) {
                    setSubmittedTexts((prevTexts) => [...prevTexts, formattedText]);
                }
                setText("");
            }
        }
    };

    const divClear = () => {
        setSubmittedTexts([]); // 수신 번호 배열 초기화
    };

    const saveAddressBook = () => {
        const uniqueNumbers = submittedTexts.filter((number) => !addressBook.includes(number));
        if (uniqueNumbers.length > 0) {
            setAddressBook((prevAddressBook) => [...prevAddressBook, ...uniqueNumbers]);
            alert("주소록 저장 완료");
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

    const handleSendMessage = () => {
        if (!sender || submittedTexts.length === 0 || !inputMessage || !generatedImage || !title) {
            alert("메세지를 보낼 때 필요한 정보가 충분하지 않습니다.");
            return;
        }

        const receiverText = submittedTexts.join(", ");
        const messageContent = `
            제목: ${title}
            발신 번호: ${sender}
            수신 번호: ${receiverText}
            메시지 내용: ${inputMessage}
            생성된 이미지 URL: ${generatedImage}
        `;

        alert(messageContent);
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
