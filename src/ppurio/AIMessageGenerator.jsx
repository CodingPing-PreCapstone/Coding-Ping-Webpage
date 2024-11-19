import React, { useState } from 'react';

const styles = {
  appContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    fontFamily: "'Nunito', sans-serif",
  },
  mainContainer: {
    display: 'flex',
    width: '80%',
    height: '95%',
    maxHeight: '850px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  leftPanel: {
    width: '50%',
    backgroundColor: '#fff',
    padding: '40px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: '2px solid #f0f0f0',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  textArea: {
    width: '100%',
    margin: '10px 0',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    resize: 'none',
  },
  largeTextArea: {
    height: '200px',
  },
  smallTextArea: {
    height: '100px',
  },
  addButton: {
    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '8px',
    whiteSpace: 'nowrap',
  },
  keywordsContainer: {
    display: 'flex',
    gap: '5px',
    flexWrap: 'wrap',
  },
  keywordBox: {
    backgroundColor: 'aliceblue',
    borderRadius: '12px',
    padding: '5px 10px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  keywordRemove: {
    marginLeft: '8px',
    cursor: 'pointer',
    color: '#a9a9a9',
    fontWeight: 'bold',
  },
  rightPanel: {
    width: '50%',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  resultPlaceholder: {
    color: '#bbb',
    fontSize: '18px',
    lineHeight: '1.5',
    textAlign: 'center',
  },
  messageBox: {
    width: '100%',
    padding: '16px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    color: 'black',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '8px',
    marginTop: 'auto',
    color: 'black',
  },
  messageButton: {
    padding: '6px 8px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#d3d3d3',
    cursor: 'pointer',
  },
};

function AIMessageGenerator({ setInputMessage }) {
  const [message, setMessage] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [generatedMessages, setGeneratedMessages] = useState([]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate_message_api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, keywords }),
      });

      const data = await response.json();
      console.log('서버 응답:', data);

      if (response.ok && Array.isArray(data.result_message)) {
        setGeneratedMessages(data.result_message);
      } else {
        alert('문자 생성 실패: ' + (data.error || '알 수 없는 오류'));
        setGeneratedMessages([]);
      }
    } catch (error) {
      console.error('오류 발생:', error);
      alert('서버 요청 중 오류가 발생했습니다.');
      setGeneratedMessages([]);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && keywords.length < 3) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    } else if (keywords.length >= 3) {
      alert('최대 3개의 키워드만 추가할 수 있습니다.');
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleDeleteMessage = (index) => {
    setGeneratedMessages(generatedMessages.filter((_, i) => i !== index));
  };

  // "메시지 사용" 버튼 클릭 시 메인 화면으로 메시지 전송
  const handleUseMessage = (msg) => {
    setInputMessage(msg);
    alert("메시지가 메인 화면으로 전송되었습니다!");
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.mainContainer}>
        <div style={styles.leftPanel}>
          <h1>AI 문자 생성</h1>
          <form onSubmit={handleFormSubmit} style={styles.form}>
            <label>발송 목적 및 내용</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="문구 생성 명령 입력"
              required
              style={{ ...styles.textArea, ...styles.largeTextArea }}
            />
            <label>중요 키워드(선택)</label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <textarea
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="입력한 키워드가 생성 결과에 포함될 확률이 높아집니다."
                style={{ ...styles.textArea, ...styles.smallTextArea }}
              />
              <button type="button" onClick={addKeyword} style={styles.addButton}>추가</button>
            </div>
            <div style={styles.keywordsContainer}>
              {keywords.map((kw, index) => (
                <div key={index} style={styles.keywordBox}>
                  {kw}
                  <span onClick={() => removeKeyword(index)} style={styles.keywordRemove}>&times;</span>
                </div>
              ))}
            </div>
            <button type="submit" style={styles.addButton}>AI 문자 생성</button>
          </form>
        </div>

        <div style={styles.rightPanel}>
          {generatedMessages?.length === 0 ? (
            <div style={styles.resultPlaceholder}>
              생성결과가 없습니다.<br />뿌리오 AI 기능을 이용해보세요!
            </div>
          ) : (
            generatedMessages.map((msg, index) => (
              <div key={index} style={styles.messageBox}>
                <p><strong>예시 {index + 1}:</strong></p>
                <p>{msg}</p>
                <div style={styles.buttonGroup}>
                  <button onClick={() => handleDeleteMessage(index)} style={styles.messageButton}>삭제</button>
                  <button onClick={() => alert('메시지가 저장되었습니다!')} style={styles.messageButton}>내 문자함 저장</button>
                  <button onClick={() => handleUseMessage(msg)} style={styles.messageButton}>메시지 사용</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AIMessageGenerator;
