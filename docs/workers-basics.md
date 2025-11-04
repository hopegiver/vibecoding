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

## 프로젝트 시작하기

### 1. 프로젝트 생성

```bash
# Hono Workers 템플릿으로 생성
npm create hono@latest my-api

# 프롬프트 선택:
# ? Target: cloudflare-workers
# ? Template: basic
```

또는 직접 생성:

```bash
mkdir my-api
cd my-api
npm init -y
npm install hono
npm install -D wrangler
```

### 2. 프로젝트 구조

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

### 3. 기본 설정 파일

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

## 기본 예제

### 간단한 API

**src/index.ts**
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

### 라우트 분리

**src/routes/users.ts**
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

**src/index.ts**
```typescript
import { Hono } from 'hono';
import users from './routes/users';

const app = new Hono();

app.route('/api/users', users);

export default app;
```

## Wrangler 사용법

### 로컬 개발

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 테스트
# http://localhost:8787
```

### 환경 변수 설정

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

# 민감한 정보는 secret으로 설정
```

**Secret 설정 (CLI)**
```bash
# Secret 추가 (암호화되어 저장)
wrangler secret put API_KEY
# 프롬프트에 값 입력

# Secret 목록 확인
wrangler secret list
```

**코드에서 사용**
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

### 바인딩 설정

**KV 바인딩**
```toml
# wrangler.toml
[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-namespace-id"
```

**D1 바인딩**
```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "your-database-id"
```

**R2 바인딩**
```toml
# wrangler.toml
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-files"
```

**TypeScript 타입 정의**
```typescript
// src/types/env.ts
export type Env = {
  // Variables
  API_KEY: string;
  ENVIRONMENT: string;

  // Bindings
  MY_KV: KVNamespace;
  DB: D1Database;
  MY_BUCKET: R2Bucket;
};
```

**사용 예제**
```typescript
import { Hono } from 'hono';
import type { Env } from './types/env';

const app = new Hono<{ Bindings: Env }>();

app.get('/api/data', async (c) => {
  // KV 사용
  const value = await c.env.MY_KV.get('key');

  // D1 사용
  const users = await c.env.DB.prepare('SELECT * FROM users').all();

  // R2 사용
  const file = await c.env.MY_BUCKET.get('file.txt');

  return c.json({ value, users, file });
});
```

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

## 배포하기

### 1. Cloudflare 로그인

```bash
# 처음 한 번만 실행
wrangler login
```

브라우저가 열리고 Cloudflare 계정으로 인증합니다.

### 2. 배포

```bash
# 프로덕션 배포
npm run deploy

# 출력:
# Published my-api (1.23 sec)
#   https://my-api.your-subdomain.workers.dev
```

### 3. 로그 확인

```bash
# 실시간 로그 스트리밍
npm run tail

# 특정 메서드만 필터링
wrangler tail --status=error
```

### 4. 배포 관리

```bash
# 현재 배포된 Workers 목록
wrangler deployments list

# 특정 버전으로 롤백
wrangler rollback [deployment-id]
```

## 미들웨어 활용

### CORS 설정

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

**src/middleware/auth.ts**
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

**사용**
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

## 에러 핸들링

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

이제 기본 설정이 완료되었습니다! 스토리지별 가이드를 참고하세요:

- [KV 스토리지](./kv-storage.md) - 키-값 저장소
- [D1 데이터베이스](./d1-database.md) - SQL 데이터베이스
- [R2 스토리지](./r2-storage.md) - 파일 스토리지

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
