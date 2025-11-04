# 템플릿으로 빠르게 시작하기

맑은소프트에서 준비한 템플릿으로 프로젝트를 5분 안에 시작할 수 있습니다!

## 템플릿 종류

### 🌐 Pages Template - 웹사이트 만들기

**용도:**
- 회사 소개 페이지
- 제품 카탈로그
- 포트폴리오
- 랜딩 페이지
- FAQ 페이지

**포함 내용:**
- 깔끔한 HTML/CSS 구조
- 반응형 디자인
- 기본 JavaScript 기능
- GitHub Pages 자동 배포 설정

**템플릿 링크:**
🔗 https://github.com/hopegiver/pages-template

---

### 💻 Workers Template - API 서버 만들기

**용도:**
- REST API
- 데이터베이스 연동
- 파일 업로드/다운로드
- 인증 시스템
- 백엔드 서비스

**포함 내용:**
- Hono 프레임워크 설정
- TypeScript 설정 완료
- D1/KV/R2 바인딩 예제
- 미들웨어 (인증, CORS, 에러 처리)
- 배포 설정

**템플릿 링크:**
🔗 https://github.com/hopegiver/workers-template

---

## Pages Template 사용법

### 방법 1: GitHub에서 바로 시작 (추천)

**1단계: 템플릿 복사**

1. https://github.com/hopegiver/pages-template 접속
2. 녹색 **"Use this template"** 버튼 클릭
3. **"Create a new repository"** 선택
4. 저장소 이름 입력 (예: `my-website`)
5. **"Create repository"** 클릭

**2단계: Cloudflare Pages 연결**

1. https://dash.cloudflare.com 로그인
2. **Workers & Pages** 클릭
3. **"Create application"** → **"Pages"** → **"Connect to Git"** 선택
4. GitHub 계정 연결
5. 방금 만든 저장소 선택 (`my-website`)
6. **"Begin setup"** 클릭
7. **"Save and Deploy"** 클릭

**3단계: 완료!**

```
🎉 배포 완료!
URL: https://my-website.pages.dev

이제 GitHub에 푸시할 때마다 자동 배포됩니다.
```

### 방법 2: 로컬에서 개발

**1단계: 저장소 클론**

```bash
# 터미널에서 실행
git clone https://github.com/your-username/my-website.git
cd my-website
```

**2단계: Cursor로 열기**

```bash
cursor .
```

또는 Cursor 앱에서:
- **File** → **Open Folder**
- `my-website` 폴더 선택

**3단계: Live Server로 미리보기**

Cursor에서 `index.html` 우클릭 → **"Open with Live Server"**

브라우저에서 자동으로 열림: `http://127.0.0.1:5500`

**4단계: 수정하고 푸시**

```bash
# 수정 후
git add .
git commit -m "첫 수정"
git push
```

Cloudflare Pages가 자동으로 배포합니다!

---

## Workers Template 사용법

### 1단계: 템플릿 클론

```bash
# 로컬 폴더 생성
git clone https://github.com/hopegiver/workers-template.git my-api
cd my-api

# 의존성 설치
npm install
```

### 2단계: Cursor로 열기

```bash
cursor .
```

### 3단계: 환경 설정

**로컬 개발용 환경 변수 (.dev.vars)**

프로젝트 루트에 `.dev.vars` 파일 생성:

```bash
# .dev.vars
API_KEY=dev-secret-key-123
```

### 4단계: 로컬 개발 서버 실행

```bash
npm run dev
```

브라우저에서 테스트:
- http://localhost:8787

### 5단계: D1 데이터베이스 설정 (필요시)

```bash
# D1 데이터베이스 생성
wrangler d1 create my-database

# 출력된 설정을 wrangler.toml에 추가
```

**wrangler.toml에 추가**
```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "복사한-database-id"
```

**스키마 적용**
```bash
# 로컬
wrangler d1 execute my-database --local --file=./schema.sql

# 프로덕션
wrangler d1 execute my-database --file=./schema.sql
```

### 6단계: 배포

```bash
# Cloudflare 로그인 (처음 한 번만)
wrangler login

# 프로덕션 환경 변수 설정
wrangler secret put API_KEY
# 프롬프트에 실제 API 키 입력

# 배포
npm run deploy
```

**배포 완료!**
```
🎉 Published my-api
https://my-api.your-subdomain.workers.dev
```

---

## 템플릿 커스터마이징

### Pages Template 커스터마이징

**파일 구조:**
```
my-website/
├── index.html          # 메인 페이지
├── about.html          # 소개 페이지
├── css/
│   └── style.css       # 스타일
├── js/
│   └── main.js         # JavaScript
└── images/             # 이미지
```

**수정할 곳:**

1. **`index.html`** - 회사명, 내용 수정
2. **`css/style.css`** - 색상, 폰트 변경
3. **`js/main.js`** - 동적 기능 추가

**Cursor에게 요청:**
```
index.html에서 회사 이름을 "맑은소프트"로 바꿔줘.
색상 테마를 파란색에서 초록색으로 변경해줘.
```

### Workers Template 커스터마이징

**파일 구조:**
```
my-api/
├── src/
│   ├── index.ts        # 메인 진입점
│   ├── routes/         # 라우트
│   │   └── example.ts
│   ├── middleware/     # 미들웨어
│   └── types/          # 타입 정의
│       └── env.ts
├── wrangler.toml       # Workers 설정
└── package.json
```

**수정할 곳:**

1. **`src/routes/`** - 새 API 엔드포인트 추가
2. **`src/types/env.ts`** - 환경 변수 타입 정의
3. **`wrangler.toml`** - 바인딩 설정

**Cursor에게 요청:**
```
/api/users 엔드포인트를 추가해줘.
GET으로 사용자 목록을 반환하고,
POST로 새 사용자를 생성하는 기능.

D1 데이터베이스 사용.
```

---

## 템플릿 vs 처음부터 만들기

### 템플릿 사용 (추천)

**장점:**
- ✅ **5분 안에 시작** - 즉시 개발 시작
- ✅ **검증된 구조** - 베스트 프랙티스 적용
- ✅ **설정 완료** - 복잡한 설정 불필요
- ✅ **예제 코드** - 참고할 코드 포함

**적합한 경우:**
- 빠르게 프로젝트 시작
- 구조를 처음 배우는 중
- 검증된 패턴 사용
- 시간이 부족할 때

### 처음부터 만들기

**장점:**
- ✅ **학습 효과** - 모든 과정 이해
- ✅ **완전한 제어** - 원하는 대로 커스터마이징
- ✅ **불필요한 코드 없음** - 필요한 것만 포함

**적합한 경우:**
- 학습이 목적
- 특별한 구조 필요
- 시간 여유 있음
- 경험 쌓기

---

## 추천 시작 방법

### 비개발자

**1단계: Pages Template으로 시작**
```
템플릿 복사 → Cloudflare 연결 → 내용 수정
```

**2단계: 가이드북 3-6장 학습**
- HTML/CSS/JavaScript 기초 이해
- 템플릿 코드가 어떻게 동작하는지 학습

**3단계: 점진적 개선**
- Cursor AI로 기능 추가
- 디자인 개선

### 개발자

**웹사이트:**
```bash
# Pages Template 클론
git clone https://github.com/hopegiver/pages-template.git my-site
cd my-site

# 로컬 개발
cursor .
# Live Server로 미리보기

# GitHub에 푸시 → Cloudflare 자동 배포
```

**API 서버:**
```bash
# Workers Template 클론
git clone https://github.com/hopegiver/workers-template.git my-api
cd my-api
npm install

# 로컬 개발
npm run dev

# 배포
npm run deploy
```

---

## 자주 묻는 질문

### Q1. 템플릿을 수정해도 되나요?

**A.** 네! 템플릿은 시작점일 뿐입니다. 자유롭게 수정하세요.

### Q2. 템플릿 업데이트는 어떻게 받나요?

**A.** 템플릿 저장소에서 최신 변경사항을 pull 받으면 됩니다:

```bash
# 원본 저장소 추가 (한 번만)
git remote add template https://github.com/hopegiver/pages-template.git

# 업데이트 받기
git fetch template
git merge template/main
```

### Q3. 두 템플릿을 함께 사용할 수 있나요?

**A.** 네! 웹사이트(Pages)와 API(Workers)를 별도 저장소로 관리하고 연동하면 됩니다.

**예시:**
- `my-website` (Pages) - 프론트엔드
- `my-api` (Workers) - 백엔드 API

프론트엔드에서 백엔드 API 호출:
```javascript
// my-website/js/main.js
const API_URL = 'https://my-api.workers.dev';

async function getUsers() {
  const response = await fetch(`${API_URL}/api/users`);
  const users = await response.json();
  return users;
}
```

### Q4. 템플릿 없이 배우는 게 더 좋지 않나요?

**A.** 학습 목적이라면 처음부터 만들어보는 것도 좋습니다. 하지만:

**추천 방법:**
1. **템플릿으로 빠르게 시작** - 동작하는 프로젝트 확보
2. **가이드북으로 기초 학습** - HTML/CSS/JS 이해
3. **템플릿 코드 분석** - 왜 이렇게 구조화했는지 이해
4. **처음부터 다시 만들기** - 학습 효과 극대화

### Q5. 상용 프로젝트에 사용해도 되나요?

**A.** 네! 템플릿은 실제 프로덕션 사용을 위해 만들어졌습니다.

---

## 다음 단계

템플릿으로 프로젝트를 시작했다면:

**Pages Template 사용자:**
- [HTML 기초](./html-basics.md) - 템플릿 코드 이해
- [CSS로 꾸미기](./css-basics.md) - 디자인 커스터마이징
- [JavaScript 소개](./javascript-intro.md) - 동적 기능 추가

**Workers Template 사용자:**
- [Workers 기초](./workers-basics.md) - Hono 프레임워크 이해
- [D1 데이터베이스](./d1-database.md) - 데이터 저장
- [실전: REST API](./workers-rest-api.md) - API 확장

---

## 도움말

**템플릿 관련 문의:**
- GitHub Issues: [Pages](https://github.com/hopegiver/pages-template/issues) / [Workers](https://github.com/hopegiver/workers-template/issues)
- 사내 Slack: #바이브-코딩 채널

**Happy Coding! 🚀**
