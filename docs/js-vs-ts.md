# JavaScript vs TypeScript 선택 가이드

Workers 개발 시 JavaScript와 TypeScript 중 어떤 것을 선택해야 할까요?

## 빠른 결론

**Workers 개발이라면 TypeScript를 추천합니다!**

이유:
- ✅ Wrangler가 자동으로 빌드 (설정 간단)
- ✅ 바인딩 타입 자동완성 (MY_KV, DB, R2)
- ✅ Hono가 TypeScript 완벽 지원
- ✅ 실수 방지 및 개발 속도 향상

## JavaScript (JS)

### 장점

✅ **즉시 실행**
```javascript
// 작성 즉시 실행 가능
export default {
  async fetch(request) {
    return new Response('Hello!');
  }
};
```

✅ **학습 곡선 낮음**
- 문법이 간단하고 배우기 쉬움
- 타입 신경 쓸 필요 없음

✅ **설정 불필요**
- 추가 도구나 컴파일러 필요 없음
- 바로 시작 가능

✅ **유연함**
- 타입 제약 없이 자유롭게 코딩
- 빠른 프로토타이핑

✅ **빠른 프로토타이핑**
```javascript
// 빠르게 테스트
const data = { name: 'Alice' };
console.log(data.name); // 바로 실행
```

### 단점

❌ **런타임 에러**
```javascript
function greet(user) {
  return `Hello, ${user.name}`;
}

greet({ nmae: 'Alice' });
// 실행 전까지 오류 모름!
// 실행 시: "Hello, undefined"
```

❌ **타입 실수**
```javascript
const users = await env.MY_KV.get('users');
// users가 null인지, 배열인지, 객체인지 모름
users.forEach(user => console.log(user)); // 💥 런타임 에러 가능
```

❌ **자동완성 부족**
```javascript
app.get('/api/data', async (c) => {
  const value = await c.env.MY_KV.get('key');
  // c.env. 입력해도 자동완성 안 됨
  // MY_KV? DB? R2? 기억해야 함
});
```

❌ **리팩토링 어려움**
```javascript
// user → member로 변경하려면
// 모든 파일에서 수동으로 찾아서 변경
const user = getUser();
console.log(user.name);
updateUser(user);
```

❌ **대규모 프로젝트 힘듦**
- 코드가 많아지면 관리 어려움
- 어떤 함수가 어떤 값을 반환하는지 헷갈림

## TypeScript (TS)

### 장점

✅ **컴파일 타임 에러**
```typescript
interface User {
  name: string;
}

function greet(user: User) {
  return `Hello, ${user.name}`;
}

greet({ nmae: 'Alice' });
// ❌ 컴파일 에러: Property 'nmae' does not exist.
//    Did you mean 'name'?
```

✅ **타입 안전성**
```typescript
type Env = {
  MY_KV: KVNamespace;
};

app.get('/api/data', async (c) => {
  const value = await c.env.MY_KV.get('key');
  // MY_KV가 KVNamespace임을 알기 때문에
  // get 메서드 자동완성 제공
});
```

✅ **강력한 자동완성**
```typescript
// c.env. 입력하면
// → MY_KV, DB, MY_BUCKET 자동 표시
// → 메서드도 자동완성 (get, put, delete 등)

const app = new Hono<{ Bindings: Env }>();

app.get('/api/data', async (c) => {
  c.env. // ← 여기서 자동완성!
  // MY_KV
  // DB
  // MY_BUCKET
});
```

✅ **리팩토링 쉬움**
```typescript
// User → Member로 타입명 변경
// → VSCode가 모든 사용처 자동 변경
type User = {  // ← 이름 변경
  name: string;
};

const user: User = getUser();
// 모든 User가 자동으로 Member로 변경됨
```

✅ **대규모 프로젝트 유리**
```typescript
// 함수 시그니처만 봐도 입출력 타입 알 수 있음
async function getUser(id: number): Promise<User | null> {
  // 반환: User 객체 또는 null
}

const user = await getUser(123);
// user가 User | null 타입임을 IDE가 알고 있음
```

✅ **문서화 자동**
```typescript
// 타입이 곧 문서
interface CreateUserRequest {
  name: string;      // 필수
  email: string;     // 필수
  age?: number;      // 선택
}

// 함수 호출 시 IDE가 필요한 속성 알려줌
```

### 단점

❌ **학습 곡선**
```typescript
// 타입 시스템 이해 필요
type Env = {
  MY_KV: KVNamespace;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();
// 제네릭, 인터페이스 등 개념 필요
```

❌ **초기 설정**
```json
// tsconfig.json 필요
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ES2022",
    // ...
  }
}
```

❌ **코드 양 증가**
```typescript
// JavaScript
function add(a, b) {
  return a + b;
}

// TypeScript
function add(a: number, b: number): number {
  return a + b;
}
// 타입 정의로 코드가 길어짐
```

❌ **컴파일 필요**
- TypeScript → JavaScript 변환 과정 필요
- (단, Wrangler는 자동으로 해줌!)

❌ **작은 프로젝트엔 과함**
```typescript
// 간단한 Hello World에 타입이 필요할까?
const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => c.text('Hello!'));
// 오버엔지니어링일 수 있음
```

## 비교표

| 항목 | JavaScript | TypeScript |
|------|-----------|-----------|
| **타입 체크** | 런타임에만 | 컴파일 시 |
| **에러 발견** | 실행 후 | 코드 작성 중 |
| **학습 난이도** | ⭐ 쉬움 | ⭐⭐ 중간 |
| **자동완성** | ⭐⭐ 보통 | ⭐⭐⭐ 강력 |
| **프로젝트 규모** | 소~중 | 중~대 |
| **설정 복잡도** | 없음 | 약간 있음 |
| **Workers 추천** | ⭐⭐ | ⭐⭐⭐ |

## 실전 비교

### JavaScript로 Workers

```javascript
// src/index.js
import { Hono } from 'hono';

const app = new Hono();

app.get('/api/users/:id', async (c) => {
  const id = c.req.param('id');

  // env에 뭐가 있는지 기억해야 함
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(id).first();

  // user가 null일 수 있음을 항상 체크해야 함
  if (!user) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(user);
});

export default app;
```

**문제점:**
- `c.env.DB`가 무엇인지 자동완성 없음
- `user`가 null일 수 있음을 까먹으면 버그
- 오타 입력 시 런타임에만 발견

### TypeScript로 Workers

```typescript
// src/types/env.ts
export type Env = {
  DB: D1Database;
  MY_KV: KVNamespace;
  MY_BUCKET: R2Bucket;
};

// src/index.ts
import { Hono } from 'hono';
import type { Env } from './types/env';

const app = new Hono<{ Bindings: Env }>();

app.get('/api/users/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  // c.env. 입력 시 DB, MY_KV, MY_BUCKET 자동완성!
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(id).first();

  // user가 null 가능성을 IDE가 경고
  if (!user) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(user);
});

export default app;
```

**장점:**
- `c.env.` 입력 시 바인딩 자동완성
- null 체크 누락 시 경고
- 오타 즉시 발견 (빨간 줄)

## Workers에서 TypeScript 설정

### 1. 프로젝트 생성

```bash
# Hono 템플릿 (TypeScript 기본)
npm create hono@latest my-api
# ? Target: cloudflare-workers
```

### 2. 타입 정의

**src/types/env.ts**
```typescript
export type Env = {
  // 환경 변수
  API_KEY: string;
  ENVIRONMENT: string;

  // 바인딩
  MY_KV: KVNamespace;
  DB: D1Database;
  MY_BUCKET: R2Bucket;
};
```

### 3. Hono에 타입 적용

**src/index.ts**
```typescript
import { Hono } from 'hono';
import type { Env } from './types/env';

const app = new Hono<{ Bindings: Env }>();

// 이제 c.env에서 자동완성!
app.get('/data', async (c) => {
  const value = await c.env.MY_KV.get('key');
  return c.json({ value });
});

export default app;
```

### 4. 개발 및 배포

```bash
# TypeScript 파일 그대로 사용
npm run dev      # Wrangler가 자동 빌드
npm run deploy   # 자동 빌드 후 배포
```

## 선택 가이드

### JavaScript 선택:

✅ **이런 경우:**
- Workers를 처음 배우는 중
- 간단한 프로토타입
- 혼자서 빠르게 테스트
- TypeScript 배우기 싫음

❌ **피해야 할 경우:**
- 팀 프로젝트
- 프로덕션 배포
- 여러 바인딩 사용 (KV + D1 + R2)

### TypeScript 선택:

✅ **이런 경우:**
- 프로덕션 배포 예정
- 팀 프로젝트
- 여러 바인딩 사용 (KV, D1, R2)
- 장기 유지보수 필요
- 안정성이 중요

❌ **피해야 할 경우:**
- 빠른 일회성 테스트
- TypeScript 학습 의지 없음

## 추천 학습 경로

### 초보자

1. **JavaScript로 시작** (1-2일)
   - Workers 기본 개념 이해
   - 간단한 API 만들어보기

2. **TypeScript로 전환** (3일차~)
   - 타입 정의 배우기
   - 자동완성의 편리함 경험
   - 실수 방지 체험

### 경험자

**바로 TypeScript 시작**
- JavaScript 경험 있으면 TypeScript 쉽게 습득
- 처음부터 타입 안전성 확보

## 실전 팁

### 1. 점진적 도입

```typescript
// 처음엔 any 사용 (JavaScript처럼)
const data: any = await fetch('...');

// 익숙해지면 구체적 타입
interface User {
  id: number;
  name: string;
}

const data: User = await fetch('...');
```

### 2. VSCode 활용

```typescript
// 마우스 올려보기
const user = await getUser(123);
// → User | null 타입 자동 표시

// 자동 import
import { Hono } from 'hono';
// → 자동으로 추가됨
```

### 3. 에러 메시지 읽기

```typescript
// TypeScript 에러는 친절함
Property 'nmae' does not exist on type 'User'.
Did you mean 'name'?
```

## 결론

**Workers 개발 = TypeScript 추천!**

### 이유:
1. ✅ Wrangler 자동 빌드 (설정 간단)
2. ✅ 바인딩 자동완성 (생산성 ↑)
3. ✅ 실수 사전 방지 (안정성 ↑)
4. ✅ 팀 협업 용이 (소통 ↑)
5. ✅ 장기 유지보수 쉬움

### 학습 투자:
- TypeScript 기본: 2-3시간
- Workers 타입: 1시간
- **총 반나절 투자로 평생 생산성 향상!**

## 다음 단계

- [Workers 기초](./workers-basics.md) - TypeScript로 시작하기
- [D1 데이터베이스](./d1-database.md) - 타입 안전한 SQL
- [KV 스토리지](./kv-storage.md) - KV 타입 정의

## 참고 자료

- [TypeScript 공식 문서](https://www.typescriptlang.org)
- [Hono TypeScript 가이드](https://hono.dev/getting-started/cloudflare-workers)
- [Cloudflare Workers Types](https://github.com/cloudflare/workers-types)
