import React, { useState } from 'react';

function AIImageGenerator() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [instruction, setInstruction] = useState('');
  const [font, setFont] = useState('Cafe24Dangdanghae-v2.0.ttf');
  const [textColor, setTextColor] = useState('#000000');
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [position, setPosition] = useState('center');
  const [fontSize, setFontSize] = useState(30);
  const [resultImage, setResultImage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate_image_api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          message,
          instruction,
          font,
          textColor,
          borderColor,
          position,
          fontSize,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const timestamp = new Date().getTime();
        const imageUrl = `${data.imageUrl}?t=${timestamp}`;
        setResultImage(imageUrl);
      } else {
        alert('이미지 생성 실패: ' + data.error);
      }
    } catch (error) {
      console.error('오류 발생:', error);
      alert('서버 요청 중 오류가 발생했습니다.');
    }
  };

  // CSS 스타일을 객체로 정의
  const styles = {
    html: {
      height: '100%',
    },
    body: {
      height: '100%',
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      fontFamily: 'Nunito, sans-serif',
    },
    container: {
      display: 'flex',
      width: '80%',
      height: '95%',
      maxHeight: '850px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
      borderRadius: '20px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
    },
    leftPanel: {
      width: '50%',
      backgroundColor: '#ffffff',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRight: '2px solid #f0f0f0',
      overflowY: 'auto',
    },
    rightPanel: {
      width: '50%',
      backgroundColor: '#f9f9f9',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      overflow: 'hidden',
    },
    form: {
      width: '100%',
      maxWidth: '400px',
    },
    input: {
      width: '100%',
      margin: '10px 0',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      margin: '10px 0',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      boxSizing: 'border-box',
      resize: 'none',
      height: '100px',
    },
    select: {
      width: '100%',
      margin: '10px 0',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      margin: '10px 0',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      color: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease-in-out',
    },
    buttonHover: {
      background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)',
    },
    img: {
      maxWidth: '100%',
      maxHeight: '100%',
      height: 'auto',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <h1>AI 이미지 생성기</h1>
          <form style={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="키워드 입력"
              required
              style={styles.input}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="문구 생성 명령 입력"
              required
              style={styles.textarea}
            />
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="이미지 생성 부가 명령 입력"
              style={styles.textarea}
            />
            <label htmlFor="font">폰트 선택:</label>
            <select
              id="font"
              value={font}
              onChange={(e) => setFont(e.target.value)}
              style={styles.select}
            >
              <option value="Cafe24Dangdanghae-v2.0.ttf">Cafe24Dangdanghae</option>
              <option value="Cafe24Ohsquare-v2.0.ttf">Cafe24Ohsquare</option>
              <option value="Cafe24Simplehae-v2.0.ttf">Cafe24Simplehae</option>
              <option value="NanumBarunGothic.ttf">NanumBarunGothic</option>
              <option value="NanumBrush.ttf">NanumBrush</option>
              <option value="NanumMyeongjoExtraBold.ttf">NanumMyeongjoExtraBold</option>
              <option value="NanumSquareRoundEB.ttf">NanumSquareRoundEB</option>
            </select>

            <label htmlFor="textColor">텍스트 색상:</label>
            <input
              type="color"
              id="textColor"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              style={styles.input}
            />

            <label htmlFor="borderColor">테두리 색상:</label>
            <input
              type="color"
              id="borderColor"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              style={styles.input}
            />

            <label htmlFor="position">텍스트 위치:</label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              style={styles.select}
            >
              <option value="center">중앙</option>
              <option value="top left">좌측 상단</option>
              <option value="top right">우측 상단</option>
              <option value="bottom left">좌측 하단</option>
              <option value="bottom right">우측 하단</option>
            </select>

            <label htmlFor="fontSize">텍스트 크기 (px):</label>
            <input
              type="number"
              id="fontSize"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              min="10"
              max="100"
              step="5"
              style={styles.input}
            />

            <button type="submit" style={styles.button}>
              AI 이미지 생성
            </button>
          </form>
        </div>

        <div style={styles.rightPanel}>
          {resultImage && (
            <img
              id="resultImage"
              src={resultImage}
              alt="생성된 이미지가 여기에 표시됩니다."
              style={styles.img}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AIImageGenerator;
