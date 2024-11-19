import React, { useState, useRef, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./ppurio.css";
import AddressBook from "./AddressBook";
import axios from 'axios';
import RecentAddress from "./RecentAddress";    

function PhoneSet({ inputMessage, generatedImage, submittedTexts, setSubmittedTexts, sender, setSender, title }) {
    const [text, setText] = useState("");
    const [sendertext, setSenderText] = useState("");
    const [addressBook, setAddressBook] = useState([]);
    const [fromNumber, setfromNumber] = useState("");
    const [submittedOriginalTexts, setSubmittedOriginalTexts] = useState([]);
    const [recentNumbers, setRecentNumbers] = useState([]);
    const recentAddressPopupRef = useRef(null);
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

    const handleOpenRecentAddressPopup = () => {
        if (!recentAddressPopupRef.current || recentAddressPopupRef.current.closed) {
            const newWindow = window.open("", "", "width=600,height=600");

            if (newWindow) {
                newWindow.document.title = "최근 전송 팝업 창";
                const div = newWindow.document.createElement("div");
                newWindow.document.body.appendChild(div);

                const root = createRoot(div);
                root.render(
                    <RecentAddress
                        recentNumbers={recentNumbers}
                        onClose={() => newWindow.close()}
                        addAllToSubmittedTexts={addAllToSubmittedTexts}
                        addToSubmittedTexts={addToSubmittedTexts}
                    />
                );

                recentAddressPopupRef.current = newWindow;

                newWindow.onbeforeunload = () => {
                    recentAddressPopupRef.current = null;
                };
            }
        } else {
            recentAddressPopupRef.current.focus();
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

            setRecentNumbers((prev) => [...new Set([...prev, ...submittedTexts])]);
            alert(`Message Sent!`);

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
            <button type="button" className="gradient-button" onClick={handleOpenRecentAddressPopup}>
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