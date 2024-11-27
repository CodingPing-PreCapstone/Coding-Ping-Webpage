import React, { useState } from 'react';
import FirestoreCollection from './FirestoreCollection';

const styles = {
  appContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#F9F9F9',
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
    border: '1px solid #F9F9F9',
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
    marginTop: '20px',
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
    boxSizing: 'border-box',
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  resultPlaceholder: {
    color: '#bbb',
    fontSize: '18px',
    lineHeight: '1.5',
    textAlign: 'center',
    display: 'flex',
    justityContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  messageBox: {
    width: '100%',
    maxWidth: '95%',
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

function AIMessageGenerator({ setInputMessage, popupWindow }) {
  const [message, setMessage] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [generatedMessages, setGeneratedMessages] = useState([]);
  const [buttonText, setButtonText] = useState('AI 문자 생성');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
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
	setButtonText('AI 문자 재생성');
      } else {
        popupWindow.alert('문자 생성 실패: ' + (data.error || '알 수 없는 오류'));
        setGeneratedMessages([]);
      }
    } catch (error) {
      console.error('오류 발생:', error);
      popupWindow.alert('서버 요청 중 오류가 발생했습니다.');
      setGeneratedMessages([]);
    } finally{
      setIsLoading(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && keywords.length < 3) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    } else if (keywords.length >= 3) {
      popupWindow.alert('최대 3개의 키워드만 추가할 수 있습니다.');
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
    popupWindow.alert("메시지가 메인 화면으로 전송되었습니다!");
  };

  const handleSaveMessage = async (msg) => {
    const firestoreCollection = new FirestoreCollection("latestMessage"); // 여기에서 객체 생성
    const user = "codingping";
    firestoreCollection.addMessageToArray(user, msg);
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.mainContainer}>
        <div style={styles.leftPanel}>
          <h1>AI 문자 생성</h1>
          <form onSubmit={handleFormSubmit} style={styles.form}>
            <label>메시지 생성 명령 입력</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ex) 신입생에게 입학을 환영한다는 문구"
              required
              style={{ ...styles.textArea, ...styles.largeTextArea }}
            />
            <label>(선택) 중요 키워드</label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <textarea
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="입력한 키워드가 생성 결과에 포함됩니다."
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
            <button type="submit" style={styles.addButton}>{buttonText}</button>
          </form>
        </div>

        <div style={styles.rightPanel}>
	  {isLoading ?(
            <div style={styles.resultPlaceholder}>
	      문자를 생성 중입니다...
	    </div>
	  ) : generatedMessages?.length === 0 ?(
	    <div style={styles.resultPlaceholder}>
              생성결과가 없습니다.<br />뿌리오 AI 기능을 이용해보세요!
            </div>
          ) : (
            generatedMessages.map((msg, index) => (
              <div key={index} style={styles.messageBox}>
                <p><strong>생성 결과:</strong></p>
                <p>{msg}</p>
                <div style={styles.buttonGroup}>
                  <button onClick={() => handleDeleteMessage(index)} style={styles.messageButton}>삭제</button>
                  <button onClick={() => handleSaveMessage(msg)} style={styles.messageButton}>내 문자함 저장</button>
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
