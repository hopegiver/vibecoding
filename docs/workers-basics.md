# Workers로 백엔드 만들기

Cloudflare Workers와 Hono 프레임워크로 강력한 백엔드 API를 만들어봅시다.

## Workers란?

Cloudflare의 엣지 네트워크에서 실행되는 서버리스 백엔드입니다.

### 특징
- **빠른 응답**: 전 세계 엣지에서 실행
- **무료 시작**: 하루 10만 요청 무료
- **TypeScript 지원**: 타입 안전성
- **다양한 스토리지**: KV, D1, R2 등

### Pages Functions vs Workers

간단히 말하면:
- **Pages Functions**: 웹사이트 + API (초보자 추천)
- **Workers**: 순수 백엔드 API (개발자용)

Workers는 더 많은 제어와 유연성을 제공합니다.

## JavaScript vs TypeScript

Workers에서는 TypeScript를 사용하는 것을 강력히 권장합니다.

### TypeScript의 장점

**1. 타입 안전성**
```typescript
// JavaScript - 런타임에 에러 발생
function getUser(id) {
  return fetch(`/api/users/${id.toUpperCase()}`);  // id가 숫자면 에러!
}

// TypeScript - 작성 시점에 에러 발견
function getUser(id: number) {
  return fetch(`/api/users/${id}`);  // ✅ 안전
}
```

**2. 자동완성과 IntelliSense**
- IDE에서 코드 작성 시 자동 완성 제공
- 함수와 변수의 타입 정보를 즉시 확인
- AI도 타입 정보를 활용해 더 정확한 코드 생성

**3. 리팩토링 안전성**
- 변수명이나 함수명 변경 시 모든 참조를 안전하게 업데이트
- 타입 에러가 있으면 배포 전에 발견 가능

**4. AI와의 협업**
- AI가 타입 정보를 보고 더 정확한 코드 제안
- 복잡한 API도 타입 정의만 보고 바로 이해

### Wrangler의 자동 변환

걱정 마세요! TypeScript를 배울 필요 없습니다:
- Wrangler가 TypeScript를 자동으로 JavaScript로 변환
- 별도의 빌드 과정 불필요
- `.ts` 파일만 작성하면 나머지는 자동 처리

**따라서:**
- ✅ TypeScript로 작성 (AI가 도와줌)
- ✅ Wrangler가 자동 빌드
- ✅ 더 안전하고 유지보수 쉬운 코드

## AI로 Workers 프로젝트 시작하기

복잡한 설정은 AI에게 맡기고, Run 버튼만 클릭하세요!

### 1. Cursor에서 AI에게 요청

**AI 채팅 열기** (`Ctrl + L` 또는 `Cmd + L`)

```
Cloudflare Workers 프로젝트를 만들어줘.
Hono 프레임워크를 사용하고 TypeScript로 작성할 거야.
간단한 REST API를 만들 수 있도록 기본 구조를 잡아줘.
```

**AI가 제안하는 명령어:**
```bash
npm create hono@latest my-api
```

**Run 버튼 클릭!**

### 2. AI가 설정 완료

AI는 다음 작업을 자동으로 처리합니다:
- 프로젝트 폴더 생성
- 필요한 패키지 설치 (Hono, Wrangler 등)
- TypeScript 설정
- 기본 파일 구조 생성

### 3. 간단한 API 만들기

이제 AI에게 원하는 API를 요청하세요:

```
간단한 사용자 관리 API를 만들어줘.
GET /api/users - 사용자 목록 조회
GET /api/users/:id - 특정 사용자 조회
POST /api/users - 새 사용자 생성
```

**Run 버튼 클릭!**

AI가 코드를 생성하고 파일을 작성합니다.

### 4. 로컬에서 테스트

```
개발 서버를 실행해줘.
```

**AI가 제안하는 명령어:**
```bash
npm run dev
```

**Run 버튼 클릭!**

브라우저에서 `http://localhost:8787`로 접속하여 테스트하세요.

### 5. 배포하기

```
Cloudflare에 배포해줘.
```

**AI가 제안하는 명령어:**
```bash
wrangler login
wrangler deploy
```

**Run 버튼 클릭!**

완료! 이제 실제 인터넷에서 API에 접속할 수 있습니다.

## Hono 프레임워크

Hono는 Cloudflare Workers를 위한 초경량 웹 프레임워크입니다.

### 왜 Hono인가?

```typescript
// Hono 없이 (Vanilla Workers)
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.pathname === '/api/users' && request.method === 'GET') {
      // 라우팅 로직...
    }
    if (url.pathname === '/api/users' && request.method === 'POST') {
      // 라우팅 로직...
    }
    // 복잡하고 반복적...
  }
}

// Hono 사용
import { Hono } from 'hono';

const app = new Hono();

app.get('/api/users', (c) => c.json({ users: [] }));
app.post('/api/users', (c) => c.json({ success: true }));

export default app;
```

**장점:**
- Express.js와 비슷한 문법
- 간결한 라우팅
- 미들웨어 지원
- TypeScript 완벽 지원

## 생성된 코드 이해하기

AI가 생성한 프로젝트를 살펴봅시다.

### 1. 프로젝트 구조

```
my-api/
├── src/
│   ├── index.ts          # 메인 진입점
│   ├── routes/           # 라우트 모듈
│   │   ├── users.ts
│   │   └── posts.ts
│   ├── middleware/       # 미들웨어
│   │   └── auth.ts
│   └── types/            # TypeScript 타입
│       └── env.ts
├── wrangler.toml         # Workers 설정
├── package.json
└── tsconfig.json
```

### 2. 기본 설정 파일

AI가 자동으로 생성한 설정 파일들입니다.

**wrangler.toml**
```toml
name = "my-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# 개발 서버 설정
[dev]
port = 8787

# 환경 변수 (로컬 개발용)
[vars]
ENVIRONMENT = "development"
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ES2022",
    "lib": ["ES2021"],
    "moduleResolution": "bundler",
    "types": ["@cloudflare/workers-types"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

**package.json**
```json
{
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "tail": "wrangler tail"
  },
  "dependencies": {
    "hono": "^4.0.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.0.0",
    "wrangler": "^3.0.0"
  }
}
```

## AI로 API 기능 추가하기

기본 프로젝트에 더 많은 기능을 추가해봅시다.

### 예제 1: 간단한 API 추가

**AI에게 요청:**
```
src/index.ts에 다음 API를 추가해줘:
- GET / : 헬스체크 엔드포인트
- GET /api/users : 사용자 목록 반환
- GET /api/users/:id : 특정 사용자 조회
- POST /api/users : 새 사용자 생성

CORS와 로거 미들웨어도 추가해줘.
```

**AI가 생성한 코드 (src/index.ts):**
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

// 미들웨어
app.use('*', logger());
app.use('*', cors());

// 헬스체크
app.get('/', (c) => {
  return c.json({
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// 사용자 목록
app.get('/api/users', (c) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
  return c.json(users);
});

// 사용자 조회
app.get('/api/users/:id', (c) => {
  const id = c.req.param('id');
  return c.json({
    id: parseInt(id),
    name: 'Alice'
  });
});

// 사용자 생성
app.post('/api/users', async (c) => {
  const body = await c.req.json();
  return c.json({
    success: true,
    user: body
  }, 201);
});

export default app;
```

### 예제 2: 라우트 분리하기

코드가 길어지면 파일을 나누는 것이 좋습니다.

**AI에게 요청:**
```
사용자 관련 라우트를 별도 파일로 분리해줘.
src/routes/users.ts 파일을 만들고
모든 사용자 API를 거기로 옮겨줘.
그리고 index.ts에서 import해서 사용하도록 해줘.
```

**AI가 생성한 코드 (src/routes/users.ts):**
```typescript
import { Hono } from 'hono';

const users = new Hono();

users.get('/', (c) => {
  return c.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

users.get('/:id', (c) => {
  const id = c.req.param('id');
  return c.json({
    id: parseInt(id),
    name: 'Alice'
  });
});

users.post('/', async (c) => {
  const body = await c.req.json();
  return c.json({ success: true, user: body }, 201);
});

export default users;
```

**업데이트된 src/index.ts:**
```typescript
import { Hono } from 'hono';
import users from './routes/users';

const app = new Hono();

app.route('/api/users', users);

export default app;
```

## AI로 환경 설정하기

### 환경 변수 추가

**AI에게 요청:**
```
개발 환경과 프로덕션 환경에서 사용할 환경 변수를 설정해줘.
.dev.vars 파일을 만들어서 로컬 개발용 변수를 넣고,
wrangler.toml에는 프로덕션 변수를 설정해줘.
```

**AI가 생성한 파일들:**

**개발 환경 (.dev.vars 파일)**
```bash
# .dev.vars (로컬 개발용)
API_KEY=dev-key-123
DATABASE_URL=http://localhost:3306
```

**프로덕션 환경 (wrangler.toml)**
```toml
[vars]
ENVIRONMENT = "production"
```

### Secret 추가 (민감한 정보)

비밀번호나 API 키 같은 민감한 정보는 Secret으로 관리합니다.

**AI에게 요청:**
```
API_KEY를 Cloudflare Secret으로 추가하고 싶어.
wrangler secret put 명령어를 실행해줘.
```

**AI가 제안하는 명령어:**
```bash
wrangler secret put API_KEY
```

**Run 버튼 클릭!**

터미널에 비밀 값을 입력하면 암호화되어 저장됩니다.

**코드에서 사용하기:**

AI에게 요청:
```
환경 변수를 사용하는 API를 만들어줘.
TypeScript 타입도 정의해줘.
```

**AI가 생성한 코드:**
```typescript
type Env = {
  API_KEY: string;
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/api/config', (c) => {
  const apiKey = c.env.API_KEY;
  return c.json({ apiKey });
});
```

## 스토리지 연결하기

Workers에서 KV, D1, R2 같은 스토리지를 사용할 수 있습니다. 각 스토리지의 자세한 사용법은 별도 가이드를 참고하세요:

- **[KV 스토리지](./kv-storage.md)** - 키-값 저장소, 간단한 데이터 저장
- **[D1 데이터베이스](./d1-database.md)** - SQL 데이터베이스, 관계형 데이터
- **[R2 파일 스토리지](./r2-storage.md)** - 파일 업로드 및 저장

## TypeScript 자동 빌드

### 별도 빌드 불필요!

Wrangler가 TypeScript를 **자동으로** 빌드합니다.

```bash
# ✅ TypeScript 파일 그대로 사용
wrangler dev       # 자동 빌드 + 개발 서버
wrangler deploy    # 자동 빌드 + 배포
```

**내부 동작:**
1. Wrangler가 `src/index.ts` 읽기
2. esbuild로 TypeScript → JavaScript 변환
3. 모든 import 번들링
4. 최적화 후 배포

**따라서:**
- ❌ `tsc` 명령 불필요
- ❌ `build` 스크립트 불필요
- ❌ `dist` 폴더 관리 불필요
- ✅ TypeScript 파일만 작성하면 끝!

### wrangler.toml 설정

```toml
name = "my-api"
main = "src/index.ts"    # TypeScript 파일 직접 지정
compatibility_date = "2024-01-01"
```

`main`에 `.ts` 파일을 바로 지정하면 Wrangler가 알아서 처리합니다.

## AI로 배포하기

### 1. Cloudflare 인증

**AI에게 요청:**
```
Cloudflare에 로그인하고 싶어.
wrangler login 명령어를 실행해줘.
```

**AI가 제안하는 명령어:**
```bash
wrangler login
```

**Run 버튼 클릭!**

브라우저가 열리고 Cloudflare 계정으로 인증합니다.

### 2. 배포하기

**AI에게 요청:**
```
내 Workers를 배포해줘.
```

**AI가 제안하는 명령어:**
```bash
npm run deploy
```

**Run 버튼 클릭!**

배포 완료! URL이 터미널에 표시됩니다:
```
Published my-api (1.23 sec)
  https://my-api.your-subdomain.workers.dev
```

### 3. 로그 확인

**AI에게 요청:**
```
실시간 로그를 보고 싶어.
wrangler tail 명령어를 실행해줘.
```

**AI가 제안하는 명령어:**
```bash
npm run tail
```

**Run 버튼 클릭!**

### 4. 배포 관리

**AI에게 요청:**
```
배포 목록을 확인하고 싶어.
```

**AI가 제안하는 명령어:**
```bash
wrangler deployments list
```

이전 버전으로 롤백하려면:
```
이전 버전으로 롤백해줘.
배포 ID는 [deployment-id]야.
```

## AI로 미들웨어 추가하기

### CORS 설정

**AI에게 요청:**
```
CORS 미들웨어를 추가해줘.
특정 도메인만 허용하고, GET/POST/PUT/DELETE 메서드를 허용해줘.
```

**AI가 생성한 코드:**

```typescript
import { cors } from 'hono/cors';

app.use('*', cors({
  origin: 'https://example.com',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
}));
```

### 인증 미들웨어

**AI에게 요청:**
```
JWT 토큰 기반 인증 미들웨어를 만들어줘.
Authorization 헤더를 확인하고,
유효한 토큰이 없으면 401 에러를 반환해줘.
src/middleware/auth.ts 파일로 만들어줘.
```

**AI가 생성한 코드 (src/middleware/auth.ts):**
```typescript
import { Context, Next } from 'hono';
import type { Env } from '../types/env';

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // 토큰 검증 로직
  if (token !== c.env.API_KEY) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  await next();
}
```

**미들웨어 사용하기:**

AI에게 요청:
```
인증 미들웨어를 /api/protected 라우트에 적용해줘.
인증된 사용자만 접근할 수 있도록 해줘.
```

**AI가 수정한 코드:**
```typescript
import { authMiddleware } from './middleware/auth';

// 특정 라우트에만 적용
app.get('/api/protected', authMiddleware, (c) => {
  return c.json({ message: 'Protected data' });
});

// 그룹으로 적용
const api = new Hono();
api.use('*', authMiddleware);
api.get('/users', (c) => c.json({ users: [] }));
app.route('/api', api);
```

## AI로 에러 핸들링 추가

**AI에게 요청:**
```
글로벌 에러 핸들러를 추가해줘.
404 에러와 500 에러를 처리하고,
HTTPException도 처리할 수 있도록 해줘.
```

**AI가 생성한 코드:**

```typescript
import { HTTPException } from 'hono/http-exception';

// 커스텀 에러
app.get('/api/error', (c) => {
  throw new HTTPException(404, { message: 'Custom error' });
});

// 글로벌 에러 핸들러
app.onError((err, c) => {
  console.error(err);

  if (err instanceof HTTPException) {
    return c.json({
      error: err.message
    }, err.status);
  }

  return c.json({
    error: 'Internal Server Error'
  }, 500);
});

// Not Found 핸들러
app.notFound((c) => {
  return c.json({
    error: 'Not Found'
  }, 404);
});
```

## 다음 단계

Workers 기초를 마스터했습니다! 이제 스토리지를 연결하거나 실전 프로젝트를 만들어보세요:

- **[KV 스토리지](./kv-storage.md)** - 간단한 데이터 저장
- **[D1 데이터베이스](./d1-database.md)** - SQL 데이터베이스
- **[R2 파일 스토리지](./r2-storage.md)** - 파일 업로드
- **[실전: REST API 만들기](./workers-rest-api.md)** - 완전한 API 구축

## 유용한 명령어 정리

```bash
# 개발
wrangler dev                    # 로컬 개발 서버
wrangler dev --remote           # 리모트 개발 (실제 바인딩 사용)

# 배포
wrangler deploy                 # 프로덕션 배포
wrangler deploy --dry-run       # 배포 시뮬레이션

# Secret 관리
wrangler secret put <KEY>       # Secret 추가
wrangler secret delete <KEY>    # Secret 삭제
wrangler secret list            # Secret 목록

# 로그
wrangler tail                   # 실시간 로그
wrangler tail --status=error    # 에러만 보기

# 배포 관리
wrangler deployments list       # 배포 목록
wrangler rollback               # 롤백
```

## 참고 자료

- [Hono 공식 문서](https://hono.dev)
- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers)
- [Wrangler CLI 문서](https://developers.cloudflare.com/workers/wrangler)
