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
    width: "720px",
    minHeight: "800px",
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

function SavedImagesPopup({ images, onAddImage }) {
    return (
        <div style={container}>
            <div style={addressBookArea}>
                <h3>저장된 이미지</h3>
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            <img src={image} alt={`Saved Image ${index}`} style={{ maxWidth: "100px", marginRight: "10px" }} />
                            <button style={individualButton} onClick={() => onAddImage(image)}>Add</button>
                        </div>
                    ))
                ) : (
                    <p>저장된 이미지가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default SavedImagesPopup;
