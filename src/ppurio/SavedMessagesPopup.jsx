import React from "react";

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
    width: "720px",
    minHeight: "800px",
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "20px",
    border: '1px solid #F9F9F9',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',	
    marginBottom: "5px",
    padding: "10px",
};

const gradientButton = {
    /*background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",*/
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

function SavedMessagesPopup({ messages, onAddMessage }) {
    return (
        <div style={container}>
            <div style={addressBookArea}>
                <h3>저장된 메시지</h3>
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            <p style={{ marginRight: "10px" }}>{message}</p>
                            <button style={individualButton} onClick={() => onAddMessage(message)}>Add</button>
                        </div>
                    ))
                ) : (
                    <p>저장된 메시지가 없습니다.</p>
                )}
                
            </div>
        </div>
    );
}

export default SavedMessagesPopup;
