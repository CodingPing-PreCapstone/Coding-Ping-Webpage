#10월 29일 사진에서 키워드 수정할 수 있게 (생성된 이미지 + 생성된 이미지 위 입힌 텍스트 -> 총 2개)
#10/29 수정
from flask import Blueprint, request, jsonify, send_from_directory
from PIL import Image, ImageDraw, ImageFont
import openai
import os
import requests
from io import BytesIO
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../.env'))
# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

generate_image_api = Blueprint('generate_image_api', __name__)
# 정적 파일, HTML 파일, 폰트 경로 설정
STATIC_FOLDER = os.path.join(os.getcwd(), 'static')
HTML_FOLDER = os.path.join(STATIC_FOLDER, 'html')
FONTS_FOLDER = os.path.join(os.getcwd(), 'fonts')
FONT_PATH = os.path.join(FONTS_FOLDER, 'NanumBrush.ttf')

# 정적 폴더가 없는 경우 생성
if not os.path.exists(STATIC_FOLDER):
    os.makedirs(STATIC_FOLDER)

# 텍스트를 지정된 언어로 번역하는 함수
def translate_text(text, target_language):
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[{"role": "user", "content": f"Translate '{text}' to {target_language}. Just print out the results."}]
    )
    return response.choices[0].message['content'].strip()

# 메시지를 짧게 요약하는 함수
def generate_short_message(message):
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[{"role": "user", "content": f"{message}. within 20 letters"}]
    )
    return response.choices[0].message['content'].strip()

# 텍스트 위치를 계산하는 함수
def calculate_text_position(image, position_hint, text, font):
    draw = ImageDraw.Draw(image)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # 위치에 따라 x, y 좌표 계산
    if position_hint == 'top left':
        x, y = 10, 10
    elif position_hint == 'top right':
        x, y = image.width - text_width - 10, 10
    elif position_hint == 'bottom right':
        x, y = image.width - text_width - 10, image.height - text_height - 10
    elif position_hint == 'bottom left':
        x, y = 10, image.height - text_height - 10
    else:
        x = (image.width - text_width) / 2
        y = (image.height - text_height) / 2

    # 텍스트가 이미지 밖으로 나가지 않도록 조정
    return max(0, min(x, image.width - text_width)), max(0, min(y, image.height - text_height))

# 텍스트를 주어진 너비에 맞게 줄바꿈하는 함수
def wrap_text(text, font, max_width):
    """텍스트를 주어진 너비에 맞게 줄바꿈합니다."""
    lines = []
    words = text.split(' ')
    line = []

    for word in words:
        test_line = ' '.join(line + [word])
        width, _ = font.getbbox(test_line)[2:]

        # 텍스트의 너비가 최대 너비를 초과할 경우 줄바꿈
        if width <= max_width:
            line.append(word)
        else:
            lines.append(' '.join(line))
            line = [word]

    if line:
        lines.append(' '.join(line))

    return '\n'.join(lines)

@generate_image_api.route('/generate', methods=['POST'])
def generate_image():
    try:
        data = request.json
        title = data.get('title', '제목 없음')
        message = data.get('message', '내용 없음')
        instruction = data.get('instruction', '')
        font_name = data.get('font', 'NanumBrush.ttf')
        text_color = data.get('textColor', 'black')
        border_color = data.get('borderColor', 'white')
        position = data.get('position', 'center')
        font_size = data.get('fontSize', 50)
        painting_style = data.get('painting_style', '선택 안함')

        # 폰트 파일 경로 설정
        font_path = os.path.join(FONTS_FOLDER, font_name)

        # 텍스트 번역
        translated_title = translate_text(title, "English")
        translated_message = translate_text(message, "English")
        translated_instruction = translate_text(instruction, "English")

        # 메시지 요약 생성
        summarized_message = generate_short_message(translated_message)
        result_message = translate_text(summarized_message, "Korean")

        # DALL·E에 이미지 생성을 요청하는 프롬프트 생성
        prompt = (
            f"Create an artistic image in the style of {painting_style}. "
            f"The theme is: {translated_title}. "
            f"Exclude all text, letters, and symbols. Follow these additional instructions: {translated_instruction}"
        )

        # DALL·E API를 통해 이미지 생성
        dalle_response = openai.Image.create(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024"
        )

        # DALL·E가 반환한 이미지 URL로부터 이미지 다운로드
        image_url = dalle_response['data'][0]['url']
        image_response = requests.get(image_url)
        img = Image.open(BytesIO(image_response.content))

        # 기본 생성 이미지를 저장 (텍스트가 없는 원본 이미지)
        original_img_path = os.path.join(STATIC_FOLDER, 'original.png')
        img.save(original_img_path)

        # 폰트를 불러옴 (기본 폰트로 대체 가능)
        try:
            font = ImageFont.truetype(font_path, font_size)
        except IOError:
            font = ImageFont.load_default()

        # 텍스트 줄바꿈 처리
        wrapped_message = wrap_text(result_message, font, img.width - 20)

        # 텍스트 위치 계산
        x, y = calculate_text_position(img, position, wrapped_message, font)

        draw = ImageDraw.Draw(img)

        # 텍스트 테두리 그리기
        for offset in [-1, 1]:
            draw.text((x + offset, y), wrapped_message, font=font, fill=border_color)
            draw.text((x, y + offset), wrapped_message, font=font, fill=border_color)

        # 텍스트 그리기
        draw.text((x, y), wrapped_message, font=font, fill=text_color)

        # 텍스트가 추가된 이미지를 로컬에 저장 (최종 이미지)
        result_img_path = os.path.join(STATIC_FOLDER, 'result.png')
        img.save(result_img_path)

        # 화면에는 result.png의 URL만 반환
        return jsonify({'imageUrl': f'http://localhost:5000/static/result.png'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 정적 파일 제공
@generate_image_api.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(STATIC_FOLDER, filename)

# HTML 파일 제공
@generate_image_api.route('/')
def serve_index():
    return send_from_directory(HTML_FOLDER, 'index.html')

# 폰트 파일 제공
@generate_image_api.route('/fonts/<path:filename>')
def serve_fonts(filename):
    return send_from_directory('fonts', filename)
