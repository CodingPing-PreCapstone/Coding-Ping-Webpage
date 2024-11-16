from flask import Flask, request
from flask_cors import CORS
from .generate_image import generate_image_api
from .generate_message import generate_message_api
from .message_api import send_message_api

app = Flask(__name__)
CORS(app)

# Blueprint 등록
app.register_blueprint(generate_image_api, url_prefix='/generate_image_api')
app.register_blueprint(generate_message_api, url_prefix='/generate_message_api')
app.register_blueprint(send_message_api, url_prefix='/send_message_api')

# 메인 엔드포인트 (HTML 파일 제공)
@app.route('/')
def index():
    return "Flask Application Running"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)