from flask import Blueprint, request, jsonify, send_from_directory
import openai
import os
import re
from dotenv import load_dotenv

generate_message_api = Blueprint('generate_message_api', __name__)
# OpenAI API 키 설정 (환경 변수에서 가져오기)
openai.api_key = os.getenv("OPENAI_API_KEY")

print("환경 변수 로드 시도...")  # 환경 변수 로드 시작 로그
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../.env'))
print("환경 변수 로드 완료")  # 로드 완료 로그
print(f"로드된 API 키: {os.getenv('OPENAI_API_KEY')}")  # API 키 출력

# HTML 파일 경로 설정
HTML_FOLDER = os.path.join(os.getcwd(), 'static', 'html')
STATIC_FOLDER = os.path.join(os.getcwd(), 'static')

def translate_result_message(message, keywords, num_examples=3):
    valid_keywords = [kw for kw in keywords if kw and kw != '키워드 없음']

    # 키워드가 있을 경우 프롬프트에 추가
    if valid_keywords:
        keywords_prompt = f"The message must use the keywords {', '.join(f'\'{kw}\'' for kw in valid_keywords)}."
    else:
        keywords_prompt = ""
    # 프롬프트 생성
    prompt = (
        f"Write a single message for '{message}'. "
        f"{keywords_prompt} "
        f"The message must contain exactly 7 sentences."
    )    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response['choices'][0]['message']['content'].strip()  # 배열 반환

# 문자 자동 생성 API
@generate_message_api.route('/generate', methods=['POST'])
def generate_text():
    try:
        data = request.json
        message = data.get('message', '제목 없음')
        keywords = data.get('keywords', [])

        # 리스트 형태가 아닐 경우 기본값 설정
        if not isinstance(keywords, list):
            keywords = ['키워드 없음', '키워드 없음', '키워드 없음']
        elif len(keywords) < 3:
            keywords.extend(['키워드 없음'] * (3 - len(keywords)))
        
        print(f"요청받은 데이터 - 제목: {message}, 키워드: {keywords[0], keywords[1], keywords[2]}")  # 요청 데이터 로그 출력
        
        # 문자 생성 로직
        result_message = translate_result_message(message, keywords)
       
        
        # 생성된 메시지를 반환
        return jsonify({'result_message': [result_message]}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
