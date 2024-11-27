import React, { useState, useRef, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./ppurio.css";
import AddressBook from "./AddressBook";
import axios from 'axios';
import FirestoreCollection from "./FirestoreCollection";
import RecentAddress from "./RecentAddress";

function PhoneSet({ inputMessage, generatedImage, submittedTexts, setSubmittedTexts, sender, setSender, title }) {
    const [text, setText] = useState("");
    const [sendertext, setSenderText] = useState("");
    const [addressBook, setAddressBook] = useState([]);
    const [fromNumber, setfromNumber] = useState("");
    const [submittedOriginalTexts, setSubmittedOriginalTexts] = useState([]);
    const recentAddressPopupRef = useRef(null);
    const addressBookPopupRef = useRef(null);


    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber.length === 11) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
        }
        return phoneNumber;
    };
    
    
    const user = "codingping";


    const activeEnter = (e, type) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const currentText = e.target.value.trim();
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

    
const saveAddressBook = async () => {
    const uniqueNumbers = submittedTexts.filter((number) => !addressBook.includes(number));

    if (uniqueNumbers.length > 0) {
        // Firestore에 저장
        try {
            const firestoreCollection = new FirestoreCollection("contact");

            // Firestore에서 기존 데이터를 읽어오기
            const documents = await firestoreCollection.read(user);
            let existingNumbers = documents.length > 0 ? documents[0].number || [] : [];

            console.log("Existing numbers in Firestore:", existingNumbers);

            // 새로운 번호 추가 및 중복 제거
            const updatedNumbers = [...new Set([...existingNumbers, ...uniqueNumbers])];

            console.log("Updated numbers to be saved:", updatedNumbers);

            // Firestore에 업데이트
            await firestoreCollection.update(user, { number: updatedNumbers });

            // 클라이언트 상태 업데이트
            setAddressBook((prevAddressBook) => [...new Set([...prevAddressBook, ...uniqueNumbers])]);

            //alert("주소록 저장 완료");
        } catch (error) {
            console.error("Error saving to Firestore:", error);
            alert("주소록 저장 중 오류가 발생했습니다.");
        }
    } else {
        //alert("새로운 번호가 없습니다.");
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
                //alert(`${contact}는 이미 추가되었습니다.`);
                return prevTexts;
            }
        });
    }, [setSubmittedTexts]);

    const handleOpenAddressBookPopup = async () => {
    try {
        const firestoreCollection = new FirestoreCollection("contact"); // "contact"는 Firestore 컬렉션 이름
        
        // Firestore에서 `number` 배열 불러오기
        const documents = await firestoreCollection.read(user);
        const numbersFromDB = documents.flatMap(doc => doc.number || []); // 모든 `number` 배열 병합
        setAddressBook(numbersFromDB); // 상태 업데이트

        // 팝업 창 열기
        if (!addressBookPopupRef.current || addressBookPopupRef.current.closed) {
            const newWindow = window.open("", "", "width=600,height=600");

            if (newWindow) {
                newWindow.document.title = "주소록 팝업 창";
                const div = newWindow.document.createElement("div");
                newWindow.document.body.appendChild(div);

                const root = createRoot(div);
                root.render(
                    <AddressBook
                        addressBook={numbersFromDB} // 불러온 데이터를 AddressBook으로 전달
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
    } catch (error) {
        console.error("Error fetching address book from Firestore:", error);
        alert("주소록을 불러오는 중 오류가 발생했습니다.");
    }
};

    const handleOpenRecentAddressPopup = async () => {
	try{
	const firestoreCollection = new FirestoreCollection("latest_contact"); // "contact"는 Firestore 컬렉>션 이름

        // Firestore에서 `number` 배열 불러오기
        const documents = await firestoreCollection.read(user);
        const numbersFromDB = documents.flatMap(doc => doc.latest_number || []); // 모든 `number` 배열 병합
        setAddressBook(numbersFromDB); // 상태 업데이트

        if (!recentAddressPopupRef.current || recentAddressPopupRef.current.closed) {
            const newWindow = window.open("", "", "width=600,height=600");

            if (newWindow) {
                newWindow.document.title = "최근 전송 팝업 창";
                const div = newWindow.document.createElement("div");
                newWindow.document.body.appendChild(div);

                const root = createRoot(div);
                root.render(
                    <RecentAddress
                        recentNumbers={numbersFromDB}
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
	} catch(error) {
	    console.error("Error fetching addressbook from Firestore:", error);
	    alert("주소록을 불러오는 중 오류가 발생했습니다.");
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
        // 수신 번호 배열
        const toNumbers = submittedOriginalTexts;

        // 메시지 전송 API 호출
        await axios.post(`${process.env.REACT_APP_API_URL}/send_message_api/send_message`, {
            title,
            fromNumber,
            toNumbers,
            inputMessage,
            generatedImage,
        });

        // Firestore의 latest_number 업데이트
        try {
            const firestoreCollection = new FirestoreCollection("latest_contact"); // Firestore 컬렉션 이름
            const user = "codingping"; // 사용자 식별자

            // Firestore에서 현재 latest_number 배열 가져오기
            const documents = await firestoreCollection.read(user);
            let latestNumbers = documents.length > 0 ? documents[0].latest_number || [] : [];
	   
	    toNumbers.forEach((num) => {
                // 기존 번호 제거 (오래된 번호를 배열에서 제거)
                latestNumbers = latestNumbers.filter((existingNum) => existingNum !== num);

                // 새 번호를 배열 끝에 추가
                latestNumbers.push(num);
            });

            // 새로운 번호 추가 및 중복 제거
            const newNumbers = toNumbers.filter((num) => !latestNumbers.includes(num));
            latestNumbers = [...latestNumbers, ...newNumbers];

            // 배열 길이가 10개를 초과하면 오래된 번호 제거
            if (latestNumbers.length > 10) {
                latestNumbers = latestNumbers.slice(latestNumbers.length -10); // 최신 10개 유지
            }
		
            // Firestore에 업데이트
            await firestoreCollection.update(user, { latest_number: latestNumbers });

            alert("메시지 전송 완료되었습니다!");
        } catch (error) {
            console.error("Error updating Firestore latest_number:", error);
            alert("Failed to update Firestore latest_number.");
        }
    } catch (error) {
        console.error("Error sending message:", error);
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
	    <br />
	    <br />
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
	    <br />
	    <br />

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
	    <br />
            <button type="button" className="gradient-button" onClick={handleSendMessage}>
	        {"메시지 전송"}
            </button>
        </div>
    );
}

export default PhoneSet;
