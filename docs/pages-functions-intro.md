# Pages Functions 소개

Cloudflare Pages Functions를 사용하면 서버 없이도 동적인 기능을 추가할 수 있습니다.

## Pages Functions란?

### 정적 사이트의 한계
지금까지 우리는 정적 웹사이트를 만들었습니다:
```
HTML + CSS + JavaScript
↓
브라우저에서만 실행
↓
서버 기능 없음
```

### Pages Functions로 할 수 있는 것
```
정적 사이트 + Functions
↓
서버 코드 실행
↓
API, 폼 처리, 인증 등
```

## 기본 개념

### 1. 어디서 실행되나요?
```
사용자 요청
↓
Cloudflare Edge (전 세계 서버)
↓
Functions 실행
↓
응답
```

**특징:**
- 서버 관리 불필요
- 전 세계 빠른 응답
- 자동 확장
- 무료 요청 10만 건/월

### 2. 파일 위치
```
my-project/
├── index.html
├── style.css
└── functions/          ← 이 폴더!
    ├── hello.js        → /hello
    ├── api/
    │   └── data.js     → /api/data
    └── [[route]].js    → 모든 경로
```

**규칙:**
- `functions/` 폴더에 `.js` 파일
- 파일 경로 = URL 경로
- `hello.js` → `/hello`
- `api/user.js` → `/api/user`

### 3. 기본 함수 구조
```javascript
// functions/hello.js
export async function onRequest(context) {
    return new Response("Hello World!");
}
```

**HTTP 메서드별로 분리:**
```javascript
// GET 요청만
export async function onRequestGet(context) {
    return new Response("GET 요청");
}

// POST 요청만
export async function onRequestPost(context) {
    return new Response("POST 요청");
}
```

## 첫 번째 Function 만들기

### Cursor에서 시작하기

#### 1단계: 프로젝트 준비
```
기존 Cloudflare Pages 프로젝트에
functions 폴더를 추가하고 싶어.

프로젝트 구조:
my-site/
├── index.html
├── functions/
│   └── hello.js

간단한 "Hello World" function 만들어줘.
```

#### 2단계: 테스트하기

**로컬 테스트:**
```bash
npx wrangler pages dev .
```

브라우저에서 접속:
```
http://localhost:8788/hello
```

#### 3단계: 배포하기
```bash
git add functions/
git commit -m "Add first function"
git push
```

자동으로 Cloudflare Pages에 배포됩니다!

## 실용적인 예제

### 예제 1: 현재 시간 API

Cursor에게 요청:
```
functions/api/time.js 만들어줘.

기능:
- GET 요청
- 현재 서버 시간 반환
- JSON 형식
- CORS 헤더 추가 (브라우저에서 접근 가능)

응답 예시:
{
  "time": "2024-01-15T10:30:00Z",
  "timezone": "UTC"
}
```

**사용하기:**
```javascript
// index.html의 script
fetch('/api/time')
    .then(response => response.json())
    .then(data => {
        console.log('서버 시간:', data.time);
    });
```

### 예제 2: 랜덤 명언 API

Cursor에게 요청:
```
functions/api/quote.js 만들어줘.

기능:
- 명언 배열 준비 (10개)
- 랜덤으로 하나 선택해서 반환
- JSON 형식

응답 예시:
{
  "quote": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs"
}
```

### 예제 3: 간단한 카운터

Cursor에게 요청:
```
functions/api/counter.js 만들어줘.

기능:
- GET: 현재 카운트 반환
- POST: 카운트 증가

KV 스토리지는 아직 사용하지 말고
메모리 변수로 간단히 구현해줘.

주의: 메모리는 휘발성이므로 재배포 시 초기화됨
```

## Context 객체 이해하기

### context에 들어있는 것
```javascript
export async function onRequest(context) {
    const {
        request,      // 요청 정보
        env,          // 환경 변수
        params,       // URL 파라미터
        data,         // 공유 데이터
        next,         // 다음 핸들러
    } = context;
}
```

### 1. request - 요청 정보
```javascript
export async function onRequestPost(context) {
    const { request } = context;

    // HTTP 메서드
    console.log(request.method); // "POST"

    // URL
    console.log(request.url); // "https://example.com/api/data"

    // 헤더
    const userAgent = request.headers.get('User-Agent');

    // Body 읽기
    const body = await request.json();
    console.log(body);

    return new Response("OK");
}
```

### 2. params - URL 파라미터
```javascript
// functions/user/[id].js
export async function onRequest(context) {
    const { params } = context;

    return new Response(`User ID: ${params.id}`);
}

// /user/123 접속 → "User ID: 123"
```

### 3. env - 환경 변수
```javascript
export async function onRequest(context) {
    const { env } = context;

    // 환경 변수 사용
    const apiKey = env.MY_API_KEY;

    return new Response("OK");
}
```

## 응답 만들기

### 1. 텍스트 응답
```javascript
export async function onRequest() {
    return new Response("Hello World");
}
```

### 2. JSON 응답
```javascript
export async function onRequest() {
    const data = {
        message: "Success",
        timestamp: Date.now()
    };

    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
```

### 3. HTML 응답
```javascript
export async function onRequest() {
    const html = `
        <!DOCTYPE html>
        <html>
        <body>
            <h1>생성된 페이지</h1>
        </body>
        </html>
    `;

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}
```

### 4. 리다이렉트
```javascript
export async function onRequest() {
    return Response.redirect('https://example.com', 302);
}
```

### 5. 에러 응답
```javascript
export async function onRequest() {
    return new Response("Not Found", {
        status: 404
    });
}
```

## 헤더 다루기

### CORS 활성화
```javascript
export async function onRequest() {
    const data = { message: "Hello" };

    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
        }
    });
}
```

**Cursor에게 요청:**
```
CORS 헤더를 추가하는 헬퍼 함수 만들어줘.
모든 Functions에서 재사용할 수 있게.

functions/_middleware.js에 작성해줘.
```

## 동적 라우팅

### 1. 단일 파라미터
```javascript
// functions/user/[id].js
export async function onRequest({ params }) {
    return new Response(`User: ${params.id}`);
}

// /user/123 → "User: 123"
// /user/abc → "User: abc"
```

### 2. 다중 파라미터
```javascript
// functions/blog/[year]/[month]/[slug].js
export async function onRequest({ params }) {
    const { year, month, slug } = params;

    return new Response(`${year}년 ${month}월 - ${slug}`);
}

// /blog/2024/01/my-post
// → "2024년 01월 - my-post"
```

### 3. 모든 경로 캐치
```javascript
// functions/[[route]].js
export async function onRequest({ params }) {
    // params.route는 배열
    const path = params.route.join('/');

    return new Response(`Path: ${path}`);
}
```

## 로컬 개발

### Wrangler 설치
```bash
npm install -g wrangler
```

### 로컬 서버 실행
```bash
wrangler pages dev .
```

**포트 변경:**
```bash
wrangler pages dev . --port 3000
```

**환경 변수 설정:**
```bash
wrangler pages dev . --binding MY_VAR=value
```

## 제한사항

### 알아두어야 할 것:

1. **실행 시간**
   - 최대 30초

2. **메모리**
   - 128MB

3. **요청 크기**
   - 최대 100MB

4. **응답 크기**
   - 무제한 (스트리밍 가능)

5. **요청 횟수**
   - 무료 플랜: 월 10만 건 (대부분의 프로젝트에 충분)

### 메모리 주의사항
```javascript
// ❌ 나쁜 예: 메모리 변수는 휘발성
let counter = 0;

export async function onRequest() {
    counter++;  // 재배포 시 초기화됨!
    return new Response(`Count: ${counter}`);
}

// ✅ 좋은 예: 영구 저장이 필요하면 KV 사용
// (다음 섹션에서 배움)
```

## 다음 단계

이제 Pages Functions의 기본을 이해했습니다!

다음에 배울 것:
- 간단한 API 만들기
- 폼 데이터 처리
- KV 스토리지 사용
- 인증 추가

**연습 문제:**

Cursor에게 요청해보세요:
```
functions/api/random.js 만들어줘.

기능:
- 1부터 100까지 랜덤 숫자 생성
- JSON으로 반환
- CORS 헤더 포함

응답 예시:
{
  "number": 42,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

완성했다면 실제로 배포해보세요!
