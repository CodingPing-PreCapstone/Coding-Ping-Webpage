import React from "react";
import FirestoreCollection from "./FirestoreCollection.js";

const container = {
    /*background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",*/
    background: "#F9F9F9",
    minHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
};

const addressBookArea = {
    width: "360px",
    minHeight: "500px",
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    marginBottom: "5px",
    padding: "10px",
    border: '1px solid #F9F9F9',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
};

const gradientButton = {
/*    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",*/
    background: "#0055FF",
    color: "white",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    fontWeight: "bold",
    borderRadius: "5px",
    padding: "7px 14px",
    fontSize: "16px",
    margin: "7px auto 0 auto",
    display: "block",
};

const individualButton = {
    ...gradientButton,
    padding: "5px 10px",
    fontSize: "14px",
    marginLeft: "10px",
};

function AddressBook({ addressBook, setAddressBook, onClose, addAllToSubmittedTexts, addToSubmittedTexts }) {
    const handleAddContact = (contact) => {
        addToSubmittedTexts(contact); // 중복 여부는 addToSubmittedTexts에서 처리
    };

    const handleDeleteAllContacts = async () => {
       	try {
            const firestoreCollection = new FirestoreCollection("contact");
            const user = "codingping"; // 사용자 식별자
            await firestoreCollection.update(user, { number: [] });
            setAddressBook([]);
            alert("주소록이 초기화되었습니다.");
        } catch (error) {
            console.error("Error clearing address book in Firestore:", error);
            alert("주소록 초기화 중 오류가 발생했습니다.");
        }
    };
    return (
        <div style={container}>
            <div style={addressBookArea}>
                <h3>{"주소록"}</h3>
                <div className="address-book">
                    {addressBook.length > 0 ? (
                        addressBook.map((contact, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                <p style={{ margin: 0 }}>{contact}</p>
                                <button style={individualButton} onClick={() => handleAddContact(contact)}>
                                    Add
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>{"주소록이 비어 있습니다."}</p>
                    )}
                </div>
                <button style={gradientButton} onClick={() => addAllToSubmittedTexts(addressBook)}>Add All</button>
                <button
                    style={gradientButton}
                    onClick={() => {
                        handleDeleteAllContacts();
                    }}
                >
                    Delete All
                </button>
                <button style={gradientButton} onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default AddressBook;
