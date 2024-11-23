import React from "react";

const container = {
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
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
};

const gradientButton = {
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
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

function RecentAddress({ recentNumbers, onClose, addToSubmittedTexts, addAllToSubmittedTexts }) {
    const handleAddContact = (contact) => {
        addToSubmittedTexts(contact); // 중복 여부는 addToSubmittedTexts에서 처리
    };

    const handleClearRecentNumbers = () => {
        if (recentNumbers.length === 0) {
            alert("최근 전송 목록이 비어 있습니다.");
            return;
        }
        const confirmClear = window.confirm("최근 전송 목록을 삭제하시겠습니까?");
        if (confirmClear) {
            addAllToSubmittedTexts([]); // Clear all recent numbers
        }
    };

    return (
        <div style={container}>
            <div style={addressBookArea}>
                <h3>{"최근 전송"}</h3>
                <div className="recent-numbers">
                    {recentNumbers.length > 0 ? (
                        recentNumbers.map((contact, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                <p style={{ margin: 0 }}>{contact}</p>
                                <button style={individualButton} onClick={() => handleAddContact(contact)}>
                                    Add
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>{"최근 전송된 번호가 없습니다."}</p>
                    )}
                </div>
                <button style={gradientButton} onClick={() => addAllToSubmittedTexts(recentNumbers)}>
                    Add All
                </button>
                <button style={gradientButton} onClick={handleClearRecentNumbers}>
                    Delete All
                </button>
                <button style={gradientButton} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default RecentAddress;
