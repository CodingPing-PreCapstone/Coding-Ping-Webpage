# Coding-Ping-Webpage
<br>

## 프로젝트 소개
**3학년 2학기 SW Pre-Capstone Design (뿌리오 - 다우기술)**  
AI 기술을 활용해 사용자의 요구사항에 알맞은 문자와 이미지를 생성한 후, 이를 뿌리오 문자 서비스와 통합하여 문자 전송이 가능하게 한 서비스입니다.
<br><br>

## 프로젝트 개요
AI 기술은 인간의 삶에 밀접한 영향을 미치며 다양한 기능을 편리하게 제공합니다.  
이에 단체 문자 전송 서비스인 뿌리오에도 AI 기술을 적용하여, 사용자가 전송하고자 하는 메시지에 어울리는 이미지를 자동으로 생성하고 첨부할 수 있는 서비스를 개발하였습니다.
<br><br>

## 실행 화면

### 1. 초기 화면
- 메시지 제목 및 내용 직접 입력
- 전송할 이미지 직접 첨부
- 메시지, 이미지, 주소록에 대한 데이터 저장 및 불러오기
- 발신 및 수신 번호 설정
<img width="1263" alt="초기 화면" src="https://github.com/user-attachments/assets/5cb11091-7367-4f1c-b7a3-0ac6a10a23a2">
<br>

### 2. AI 문자 생성 화면
- AI 기능을 활용한 문자 생성 요청
- 메시지 생성을 위한 주요 요구사항 작성
- 생성된 메시지에 포함하고자 하는 키워드 최대 3개 포함 기능
- 원하는 메시지가 생성되지 않았다면 재성성 버튼 클릭
- 생성된 메시지가 마음에 들면 메인 화면으로 전송
<img width="1263" alt="AI 문자 생성 화면" src="https://github.com/user-attachments/assets/a0396578-ee08-49f9-bc11-e3a9457c2ee1">
<br>

### 3. AI 이미지 생성 화면
- AI 기능을 활용한 이미지 생성 요청
- 키워드, 부가 설명, 화풍을 통한 이미지 생성 요구사항 작성
- 이미지 내 포함할 텍스트 및 스타일 설정 기능 제공
- 생성된 이미지가 마음에 들면 메인 화면으로 전송
<img width="1273" alt="AI 이미지 생성 화면" src="https://github.com/user-attachments/assets/00803adb-c57a-4fc8-af6a-fe39b6680115">
<br>

### 4. AI 이미지 수정 화면
- 생성된 이미지의 내부 텍스트와 스타일 직접 수정 가능
- 수정한 이미지가 마음에 들면 로컬에 다운로드 후 메인 화면에서 직접 첨부
<img width="1273" alt="AI 이미지 수정 화면" src="https://github.com/user-attachments/assets/036381cb-e1c0-4973-abda-164c6e777cdc">
<br>

### 5. 최종 메시지 전송 화면
- 모든 정보를 입력한 후, 메시지 전송 버튼을 통해 메시지 전송 완료
<img width="1273" alt="최종 메시지 전송 화면" src="https://github.com/user-attachments/assets/2d9db6c6-b71f-4451-986e-4b42f8cf1224">
<br>

## 기대 효과
- **AI를 활용한 이미지 생성**: 사용자가 전송하려는 문자에 적합한 이미지를 자동으로 생성
- **텍스트 출력 문제 해결**: AI 이미지 생성 시 한글 텍스트 출력 문제를 해결
- **서비스 만족도 향상**: 적절한 이미지를 직접 검색하거나, 이미지 내 텍스트를 별도로 삽입할 필요 없이 효율적인 문자 전송 가능
<br>

## 주요 적용 기술 및 구조
| **항목**             | **내용**                           |
|---------------------|-----------------------------------|
| **개발 언어**        | Python3, HTML, JavaScript         |
| **개발 도구**        | Visual Studio Code               |
| **데이터베이스**     | Firebase Firestore               |
| **서버**            | AWS EC2                          |
| **주요 기술 스택**    | React, Flask, OpenAI API, 뿌리오 API |
| **OpenAI 사용 버전** | DALL-E 3 (이미지 생성), GPT-4 Turbo (이미지 내 텍스트 생성), GPT-3.5 Turbo (메시지 생성) |
<img width="768" alt="시스템 아키텍처" src="https://github.com/user-attachments/assets/256b9a41-9183-4edb-a15d-4afa017ea458">
<br>

## 팀원 역할 분담
| **이름**  | **역할**                     |
|----------|-----------------------------|
| 엄지용     | UI 설계 및 구현                |
| 성유빈     | AI 이미지 생성 기능 구현          |
| 석종수     | DB 설계 및 구현                |
| 양희수     | DB 설계 및 구현                |
| 조석원     | API 설계 및 구현               |
<br>

## 실행 방법
### 사전 조건
- AWS EC2 인스턴스가 **실행 중**이어야 하며, 해당 인스턴스에 백엔드 서버와 프론트엔드 환경이 설정되어 있어야 합니다.
- EC2 인스턴스의 **퍼블릭 IP 주소** 또는 도메인이 구성되어 있어야 하며, 보안 그룹에 80, 3000, 5000번 포트가 열려 있어야 합니다.
1. **로컬 환경 구성**:
   - Python, Node.js, Firebase CLI 설치

2. **EC2 인스턴스 환경 확인 및 접속**:
   - AWS 콘솔에서 EC2 인스턴스가 실행 중인지 확인합니다.
   - SSH를 통해 EC2 인스턴스에 접속합니다.
   ```bash
   ssh -i <key-file.pem> ec2-user@<EC2-Public-IP>
   cd Coding-Ping-Webpage

3. **프론트엔드 환경 실행**:
   ```bash
   npm install
   npm install firebase
   npm start

4. **백엔드 서버 실행**:
   ```bash
   cd src/server/
   flask run --host=0.0.0.0 --port=5000
