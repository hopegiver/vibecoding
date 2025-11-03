# Workers와 Pages Functions 비교

Workers와 Pages Functions, 언제 무엇을 사용해야 할까요?

## 한눈에 비교

| 특징 | Pages Functions | Workers |
|------|----------------|---------|
| **용도** | 정적 사이트 + 동적 기능 | 순수 백엔드/API |
| **배포** | GitHub 자동 배포 | wrangler CLI 또는 대시보드 |
| **파일 위치** | `functions/` 폴더 | 단일 `worker.js` 파일 |
| **라우팅** | 파일 기반 (파일명 = URL) | 코드로 직접 구현 |
| **정적 파일** | ✅ 함께 배포 | ❌ 별도 설정 필요 |
| **설정** | 거의 없음 | 상대적으로 많음 |
| **학습 난이도** | 쉬움 | 중간 |

## Pages Functions

### 개념

```
정적 사이트 (HTML/CSS/JS) + 서버 기능
↓
하나의 프로젝트로 관리
```

### 프로젝트 구조

```
my-site/
├── index.html          ← 정적 파일
├── style.css
├── script.js
└── functions/          ← 서버 코드
    ├── api/
    │   ├── hello.js    → /api/hello
    │   └── data.js     → /api/data
    └── _middleware.js
```

### 장점

✅ **초보자 친화적**
- 파일 만들면 자동으로 엔드포인트 생성
- GitHub 푸시만 하면 배포
- 복잡한 설정 불필요

✅ **정적 사이트와 통합**
- HTML과 API가 같은 도메인
- CORS 문제 없음
- 관리 편리

✅ **간단한 구조**
- 파일 기반 라우팅
- 직관적
- 유지보수 쉬움

### 단점

❌ **제한적인 라우팅**
- 동적 라우팅 제한적
- 복잡한 URL 패턴 어려움

❌ **정적 사이트 필수**
- 순수 API만 만들기는 비효율적
- 정적 파일 없으면 Workers가 나음

### 적합한 경우

✅ 웹사이트 + API 같이 필요
✅ GitHub 자동 배포 원함
✅ 간단한 백엔드 기능
✅ 초보자/비개발자

### 예제: 블로그 + 댓글 API

```
my-blog/
├── index.html          ← 블로그 메인
├── post.html           ← 글 보기
└── functions/
    └── api/
        ├── comments.js  ← 댓글 목록
        └── add.js       ← 댓글 추가
```

## Workers

### 개념

```
순수 백엔드 서비스
↓
API만 제공
```

### 프로젝트 구조

```
my-worker/
├── src/
│   └── index.js        ← 모든 로직
├── wrangler.toml       ← 설정 파일
└── package.json
```

### 장점

✅ **유연한 라우팅**
- 코드로 모든 URL 처리
- 복잡한 패턴 가능
- 동적 라우팅 자유로움

✅ **강력한 기능**
- 미들웨어 체인
- 고급 에러 처리
- WebSocket 지원

✅ **독립적 API**
- 여러 프론트엔드에서 사용
- 마이크로서비스 구조
- 버전 관리 용이

### 단점

❌ **학습 곡선**
- 라우팅 직접 구현
- 설정 복잡
- CLI 도구 필요

❌ **배포 복잡**
- GitHub 자동 배포 없음
- wrangler CLI 필요
- 별도 배포 프로세스

❌ **정적 파일 별도**
- HTML/CSS/JS 따로 배포
- 도메인 분리 필요

### 적합한 경우

✅ 순수 API 서비스
✅ 복잡한 백엔드 로직
✅ 여러 프론트엔드에서 사용
✅ 개발자/고급 사용자

### 예제: REST API

```javascript
// src/index.js
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 라우팅
        if (url.pathname === '/api/users') {
            return handleUsers(request, env);
        }
        if (url.pathname.startsWith('/api/posts')) {
            return handlePosts(request, env);
        }

        return new Response('Not Found', { status: 404 });
    }
};
```

## 코드 비교

### 간단한 API 만들기

#### Pages Functions
```javascript
// functions/api/hello.js
export async function onRequestGet() {
    return new Response(JSON.stringify({ message: 'Hello' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
```

**배포:**
```bash
git push  # 끝!
```

#### Workers
```javascript
// src/index.js
export default {
    async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname === '/api/hello' && request.method === 'GET') {
            return new Response(JSON.stringify({ message: 'Hello' }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response('Not Found', { status: 404 });
    }
};
```

**배포:**
```bash
wrangler deploy
```

### 동적 라우팅

#### Pages Functions
```javascript
// functions/api/user/[id].js
export async function onRequestGet(context) {
    const { id } = context.params;
    return new Response(`User: ${id}`);
}
```

**URL:** `/api/user/123` → `User: 123`

#### Workers
```javascript
// src/index.js
export default {
    async fetch(request) {
        const url = new URL(request.url);
        const match = url.pathname.match(/^\/api\/user\/(\d+)$/);

        if (match) {
            const id = match[1];
            return new Response(`User: ${id}`);
        }

        return new Response('Not Found', { status: 404 });
    }
};
```

더 복잡하지만 유연함

### KV 스토리지 사용

#### Pages Functions
```javascript
// functions/api/data.js
export async function onRequestGet(context) {
    const { MY_KV } = context.env;
    const data = await MY_KV.get('key', { type: 'json' });
    return new Response(JSON.stringify(data));
}
```

#### Workers
```javascript
// src/index.js
export default {
    async fetch(request, env) {
        if (request.url.endsWith('/api/data')) {
            const data = await env.MY_KV.get('key', { type: 'json' });
            return new Response(JSON.stringify(data));
        }
        return new Response('Not Found', { status: 404 });
    }
};
```

본질적으로 비슷, 구조만 다름

## 의사결정 트리

```
백엔드 기능이 필요하다
↓
질문 1: 웹사이트(HTML)도 만들까요?
├─ YES → Pages Functions 사용
└─ NO → 질문 2로

질문 2: 복잡한 라우팅이 필요한가요?
├─ YES → Workers 사용
└─ NO → 질문 3으로

질문 3: 여러 프론트엔드에서 사용하나요?
├─ YES → Workers 사용
└─ NO → Pages Functions도 가능

질문 4: 초보자인가요?
├─ YES → Pages Functions 추천
└─ NO → Workers 사용해도 좋음
```

## 실전 시나리오

### 시나리오 1: 회사 웹사이트 + 문의 폼

**요구사항:**
- 회사 소개 페이지 (HTML)
- 문의 폼 제출 처리
- 이메일 발송

**선택: Pages Functions** ✅
- 웹사이트와 API 함께 관리
- GitHub 자동 배포
- 간단한 설정

```
company-site/
├── index.html
├── about.html
├── contact.html
└── functions/
    └── api/
        └── contact.js  ← 폼 처리
```

### 시나리오 2: 모바일 앱용 REST API

**요구사항:**
- 사용자 인증
- 데이터 CRUD
- 여러 앱에서 사용

**선택: Workers** ✅
- 순수 API만 필요
- 복잡한 로직
- 독립적 서비스

```
api-worker/
└── src/
    ├── index.js      ← 라우팅
    ├── auth.js       ← 인증
    └── handlers/
        ├── users.js
        └── posts.js
```

### 시나리오 3: 블로그 + 댓글 시스템

**요구사항:**
- 블로그 글 표시 (HTML)
- 댓글 CRUD
- 실시간 업데이트

**선택: Pages Functions** ✅
- 블로그와 댓글 API 통합
- 간단한 구조
- 빠른 개발

```
blog/
├── index.html
├── post.html
└── functions/
    └── api/
        ├── comments/
        │   ├── list.js
        │   └── add.js
```

### 시나리오 4: 여러 서비스의 중앙 API

**요구사항:**
- 웹사이트, 앱, 파트너에게 API 제공
- 복잡한 비즈니스 로직
- 버전 관리

**선택: Workers** ✅
- 독립적 API
- 유연한 구조
- 확장 가능

```
central-api/
└── src/
    ├── index.js
    ├── v1/
    │   └── routes.js
    └── v2/
        └── routes.js
```

## 함께 사용하기

Pages Functions와 Workers를 같이 쓸 수도 있습니다!

### 예시: 블로그 + 인증 API

**Pages Functions (blog.pages.dev):**
```
blog/
├── index.html          ← 블로그
└── functions/
    └── api/
        └── posts.js    ← 간단한 API
```

**Workers (api.example.com):**
```
auth-worker/
└── src/
    └── index.js        ← 인증 API
```

블로그에서 Workers API 호출:
```javascript
// blog의 script.js
const response = await fetch('https://api.example.com/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
});
```

## 전환하기

### Pages Functions → Workers

이런 경우 고려:
- API가 점점 복잡해짐
- 정적 파일 필요 없어짐
- 더 많은 제어 필요

**마이그레이션:**
```javascript
// 기존 functions/api/hello.js
export async function onRequestGet() {
    return new Response('Hello');
}

// 새 Workers src/index.js
export default {
    async fetch(request) {
        if (request.url.endsWith('/api/hello')) {
            return new Response('Hello');
        }
        return new Response('Not Found', { status: 404 });
    }
};
```

### Workers → Pages Functions

이런 경우 고려:
- 웹사이트 추가하고 싶음
- 복잡한 라우팅 불필요
- 관리 단순화

**마이그레이션:**
```javascript
// 기존 Workers
export default {
    async fetch(request) {
        if (request.url.endsWith('/api/hello')) {
            return new Response('Hello');
        }
    }
};

// 새 functions/api/hello.js
export async function onRequestGet() {
    return new Response('Hello');
}
```

## 성능 차이

실제로는 **거의 차이 없음**:
- 둘 다 Cloudflare Edge에서 실행
- 같은 런타임 사용
- 속도 거의 동일

선택 기준은 **프로젝트 구조**와 **개발 편의성**

## 추천 가이드

### 초보자라면

**Pages Functions부터 시작** ✅
1. 쉬운 구조
2. GitHub 자동 배포
3. 빠른 학습

나중에 필요하면 Workers로 전환

### 개발자라면

**프로젝트에 따라 선택**
- 웹사이트 + API → Pages Functions
- 순수 API → Workers
- 복잡한 로직 → Workers

### 회사 프로젝트라면

**Pages Functions 추천** ✅
- 팀원 모두 쉽게 이해
- 유지보수 편함
- 충분한 기능

## 다음 단계

**Pages Functions 더 배우기:**
- [Pages Functions 소개](./pages-functions-intro.md)
- [간단한 API 만들기](./simple-api.md)
- [JSON 파일 업데이트하기](./update-json-with-functions.md)

**Workers 배우기:**
- [Workers 기초](./workers-basics.md)
- [KV 스토리지로 데이터 저장하기](./kv-storage.md)

**실전 프로젝트:**
- [회사 소개 페이지](./project-company-intro.md) - Pages Functions
- [제품 카탈로그](./project-product-catalog.md) - Pages Functions

---

**요약:**

🎯 **대부분의 경우 Pages Functions면 충분합니다!**

Workers는 정말 필요할 때만 사용하세요.
