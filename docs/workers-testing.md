# Workers 테스트 작성하기

API를 만들었다면 이제 제대로 동작하는지 확인하는 테스트를 작성해봅시다. AI가 테스트 코드를 작성하고 실행까지 도와줍니다!

## 왜 테스트가 필요한가요?

테스트 코드는 다음과 같은 이점이 있습니다:

- **버그 조기 발견**: 배포 전에 문제를 미리 발견
- **리팩토링 안전성**: 코드 수정 후에도 기능이 정상 작동하는지 확인
- **문서화**: 테스트 코드가 API 사용법을 보여줌
- **자신감**: 코드 변경이 기존 기능을 망가뜨리지 않았다는 확신

## AI로 테스트 환경 설정하기

### 1단계: 테스트 라이브러리 설치

**AI에게 요청:**
```
Workers 프로젝트에 테스트 환경을 설정하고 싶어.
Vitest를 사용해서 단위 테스트를 작성할 거야.
필요한 패키지를 설치하고 vitest.config.ts 파일을 만들어줘.
```

**Run 버튼 클릭!**

AI가 자동으로:
- Vitest와 관련 패키지 설치
- `vitest.config.ts` 설정 파일 생성
- `package.json`에 테스트 스크립트 추가

**생성된 파일 (vitest.config.ts):**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'miniflare',
  },
});
```

**업데이트된 package.json:**
```json
{
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest",
    "test:watch": "vitest --watch"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@cloudflare/vitest-pool-workers": "^0.1.0",
    "wrangler": "^3.0.0"
  }
}
```

### 2단계: 테스트 폴더 구조

AI가 추천하는 폴더 구조:

```
my-api/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   └── users.ts
│   └── utils/
│       └── auth.ts
├── tests/
│   ├── routes/
│   │   └── users.test.ts
│   └── utils/
│       └── auth.test.ts
├── vitest.config.ts
└── package.json
```

## AI로 단위 테스트 작성하기

### 예제 1: 간단한 함수 테스트

**상황:** 사용자 이메일 검증 함수가 있습니다.

**src/utils/validation.ts:**
```typescript
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

**AI에게 요청:**
```
src/utils/validation.ts의 isValidEmail 함수를 테스트하는 코드를 작성해줘.
tests/utils/validation.test.ts 파일을 만들어줘.

다음 케이스를 테스트해줘:
- 올바른 이메일 형식
- 잘못된 이메일 형식 (@ 없음, 도메인 없음 등)
- 빈 문자열
- 공백이 포함된 이메일
```

**Run 버튼 클릭!**

**AI가 생성한 코드 (tests/utils/validation.test.ts):**
```typescript
import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../../src/utils/validation';

describe('isValidEmail', () => {
  it('올바른 이메일 형식을 통과시켜야 함', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.kr')).toBe(true);
    expect(isValidEmail('test+tag@example.com')).toBe(true);
  });

  it('@ 기호가 없는 이메일을 거부해야 함', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
  });

  it('도메인이 없는 이메일을 거부해야 함', () => {
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('test@domain')).toBe(false);
  });

  it('빈 문자열을 거부해야 함', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('공백이 포함된 이메일을 거부해야 함', () => {
    expect(isValidEmail('test @example.com')).toBe(false);
    expect(isValidEmail('test@ example.com')).toBe(false);
  });
});
```

### 예제 2: API 엔드포인트 테스트

**상황:** 사용자 목록 조회 API를 테스트하고 싶습니다.

**src/routes/users.ts:**
```typescript
import { Hono } from 'hono';

const users = new Hono();

users.get('/', (c) => {
  return c.json([
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ]);
});

users.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const user = { id, name: 'Alice', email: 'alice@example.com' };
  return c.json(user);
});

export default users;
```

**AI에게 요청:**
```
src/routes/users.ts의 API 엔드포인트를 테스트하는 코드를 작성해줘.
tests/routes/users.test.ts 파일을 만들어줘.

테스트할 것:
1. GET /api/users - 사용자 목록 반환
2. GET /api/users/:id - 특정 사용자 반환
3. 응답 상태 코드 확인
4. 응답 데이터 형식 확인
```

**Run 버튼 클릭!**

**AI가 생성한 코드 (tests/routes/users.test.ts):**
```typescript
import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import users from '../../src/routes/users';

const app = new Hono();
app.route('/api/users', users);

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('사용자 목록을 반환해야 함', async () => {
      const res = await app.request('/api/users');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
    });

    it('올바른 사용자 데이터 형식을 반환해야 함', async () => {
      const res = await app.request('/api/users');
      const data = await res.json();

      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('email');
    });
  });

  describe('GET /api/users/:id', () => {
    it('특정 사용자를 반환해야 함', async () => {
      const res = await app.request('/api/users/1');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveProperty('id', 1);
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('email');
    });

    it('ID가 숫자로 파싱되어야 함', async () => {
      const res = await app.request('/api/users/42');
      const data = await res.json();

      expect(data.id).toBe(42);
      expect(typeof data.id).toBe('number');
    });
  });
});
```

### 예제 3: 인증 미들웨어 테스트

**상황:** JWT 인증 미들웨어를 테스트하고 싶습니다.

**AI에게 요청:**
```
JWT 인증 미들웨어를 테스트하는 코드를 작성해줘.
tests/middleware/auth.test.ts 파일을 만들어줘.

테스트할 것:
1. 유효한 토큰으로 접근 시 통과
2. 토큰 없이 접근 시 401 에러
3. 잘못된 토큰으로 접근 시 401 에러
4. 만료된 토큰으로 접근 시 401 에러
```

**Run 버튼 클릭!**

**AI가 생성한 코드 (tests/middleware/auth.test.ts):**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { authMiddleware } from '../../src/middleware/auth';

const app = new Hono();
const SECRET = 'test-secret';

app.use('/protected/*', authMiddleware);
app.get('/protected/data', (c) => c.json({ message: 'Protected data' }));

describe('Auth Middleware', () => {
  let validToken: string;

  beforeEach(async () => {
    validToken = await sign(
      {
        sub: '1',
        email: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1시간 후 만료
      },
      SECRET
    );
  });

  it('유효한 토큰으로 보호된 라우트에 접근할 수 있어야 함', async () => {
    const res = await app.request('/protected/data', {
      headers: {
        Authorization: `Bearer ${validToken}`
      }
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('message');
  });

  it('토큰 없이 접근 시 401 에러를 반환해야 함', async () => {
    const res = await app.request('/protected/data');

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('잘못된 형식의 토큰으로 접근 시 401 에러를 반환해야 함', async () => {
    const res = await app.request('/protected/data', {
      headers: {
        Authorization: 'Bearer invalid-token'
      }
    });

    expect(res.status).toBe(401);
  });

  it('Bearer 접두사가 없는 토큰으로 접근 시 401 에러를 반환해야 함', async () => {
    const res = await app.request('/protected/data', {
      headers: {
        Authorization: validToken
      }
    });

    expect(res.status).toBe(401);
  });

  it('만료된 토큰으로 접근 시 401 에러를 반환해야 함', async () => {
    const expiredToken = await sign(
      {
        sub: '1',
        email: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) - 60 // 1분 전에 만료
      },
      SECRET
    );

    const res = await app.request('/protected/data', {
      headers: {
        Authorization: `Bearer ${expiredToken}`
      }
    });

    expect(res.status).toBe(401);
  });
});
```

### 예제 4: 데이터베이스 모킹 테스트

**상황:** D1 데이터베이스를 사용하는 API를 테스트하고 싶습니다.

**AI에게 요청:**
```
D1 데이터베이스를 사용하는 사용자 생성 API를 테스트하고 싶어.
데이터베이스는 모킹(mocking)해서 실제 DB 없이 테스트하고 싶어.

tests/routes/users-db.test.ts 파일을 만들어줘.

테스트할 것:
1. POST /api/users - 새 사용자 생성
2. 데이터베이스 INSERT 쿼리 실행 확인
3. 성공 응답 반환 확인
```

**Run 버튼 클릭!**

**AI가 생성한 코드 (tests/routes/users-db.test.ts):**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { Hono } from 'hono';
import users from '../../src/routes/users';

const app = new Hono<{ Bindings: { DB: D1Database } }>();

describe('Users API with Database', () => {
  it('새 사용자를 생성하고 DB에 저장해야 함', async () => {
    // D1 데이터베이스 모킹
    const mockDB = {
      prepare: vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnValue({
          run: vi.fn().mockResolvedValue({
            success: true,
            meta: { last_row_id: 1 }
          })
        })
      })
    };

    app.route('/api/users', users);

    const res = await app.request('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Alice',
        email: 'alice@example.com'
      })
    }, {
      DB: mockDB as unknown as D1Database
    });

    expect(res.status).toBe(201);

    // DB 쿼리가 실행되었는지 확인
    expect(mockDB.prepare).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users')
    );
  });

  it('중복된 이메일로 생성 시 에러를 반환해야 함', async () => {
    const mockDB = {
      prepare: vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnValue({
          run: vi.fn().mockRejectedValue({
            message: 'UNIQUE constraint failed: users.email'
          })
        })
      })
    };

    app.route('/api/users', users);

    const res = await app.request('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Bob',
        email: 'existing@example.com'
      })
    }, {
      DB: mockDB as unknown as D1Database
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toHaveProperty('error');
  });
});
```

## AI로 테스트 실행하기

### 테스트 실행

**AI에게 요청:**
```
작성한 모든 테스트를 실행해줘.
```

**AI가 제안하는 명령어:**
```bash
npm test
```

**Run 버튼 클릭!**

**출력 예시:**
```
✓ tests/utils/validation.test.ts (5)
  ✓ isValidEmail (5)
    ✓ 올바른 이메일 형식을 통과시켜야 함
    ✓ @ 기호가 없는 이메일을 거부해야 함
    ✓ 도메인이 없는 이메일을 거부해야 함
    ✓ 빈 문자열을 거부해야 함
    ✓ 공백이 포함된 이메일을 거부해야 함

✓ tests/routes/users.test.ts (4)
  ✓ Users API (4)
    ✓ GET /api/users (2)
    ✓ GET /api/users/:id (2)

✓ tests/middleware/auth.test.ts (5)

Test Files  3 passed (3)
     Tests  14 passed (14)
```

### Watch 모드로 테스트

코드를 수정할 때마다 자동으로 테스트를 실행하려면:

**AI에게 요청:**
```
Watch 모드로 테스트를 실행해줘.
코드가 변경될 때마다 자동으로 테스트를 다시 실행하게 해줘.
```

**AI가 제안하는 명령어:**
```bash
npm run test:watch
```

**Run 버튼 클릭!**

### 특정 테스트만 실행

**AI에게 요청:**
```
users.test.ts 파일만 테스트하고 싶어.
```

**AI가 제안하는 명령어:**
```bash
npm test users.test.ts
```

## AI로 테스트 커버리지 확인하기

테스트 커버리지는 코드의 몇 %가 테스트되었는지 보여줍니다.

**AI에게 요청:**
```
테스트 커버리지를 확인하고 싶어.
vitest.config.ts를 수정해서 커버리지 리포트를 생성하도록 해줘.
```

**Run 버튼 클릭!**

**AI가 수정한 vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'miniflare',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts']
    }
  },
});
```

**테스트 커버리지 실행:**

AI에게 요청:
```
커버리지 리포트를 생성해줘.
```

**AI가 제안하는 명령어:**
```bash
npm test -- --coverage
```

**출력 예시:**
```
File                     | % Stmts | % Branch | % Funcs | % Lines
-------------------------|---------|----------|---------|--------
src/routes/users.ts      |   95.23 |    85.71 |     100 |   94.73
src/utils/validation.ts  |     100 |      100 |     100 |     100
src/middleware/auth.ts   |   88.88 |    75.00 |     100 |   87.50
-------------------------|---------|----------|---------|--------
All files                |   94.44 |    83.33 |     100 |   93.75
```

## 실전 예제: 전체 API 테스트

**상황:** 블로그 API 전체를 테스트하고 싶습니다.

**AI에게 요청:**
```
블로그 API 전체를 테스트하는 코드를 작성해줘.

다음 API를 테스트할 거야:
1. 회원가입 API (POST /api/auth/register)
2. 로그인 API (POST /api/auth/login)
3. 게시물 생성 (POST /api/posts, 인증 필요)
4. 게시물 목록 조회 (GET /api/posts)
5. 게시물 상세 조회 (GET /api/posts/:id)

통합 테스트 형태로 작성해줘:
- 회원가입 → 로그인 → 토큰 받기 → 게시물 작성 → 조회

tests/integration/blog-api.test.ts 파일로 만들어줘.
```

**Run 버튼 클릭!**

**AI가 생성한 코드 (tests/integration/blog-api.test.ts):**
```typescript
import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import app from '../../src/index';

describe('Blog API Integration Tests', () => {
  let authToken: string;
  let postId: number;

  it('1. 회원가입이 성공해야 함', async () => {
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      })
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('user');
    expect(data.user).toHaveProperty('email', 'test@example.com');
  });

  it('2. 로그인이 성공하고 토큰을 받아야 함', async () => {
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('token');

    authToken = data.token;
  });

  it('3. 인증된 사용자가 게시물을 작성할 수 있어야 함', async () => {
    const res = await app.request('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: '테스트 게시물',
        content: '이것은 테스트 내용입니다.',
        category: 'test'
      })
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('post');
    expect(data.post).toHaveProperty('id');

    postId = data.post.id;
  });

  it('4. 게시물 목록을 조회할 수 있어야 함', async () => {
    const res = await app.request('/api/posts');

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.posts)).toBe(true);
    expect(data.posts.length).toBeGreaterThan(0);
  });

  it('5. 특정 게시물을 조회할 수 있어야 함', async () => {
    const res = await app.request(`/api/posts/${postId}`);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.post).toHaveProperty('id', postId);
    expect(data.post).toHaveProperty('title', '테스트 게시물');
  });

  it('6. 인증 없이 게시물을 작성할 수 없어야 함', async () => {
    const res = await app.request('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '실패할 게시물',
        content: '내용'
      })
    });

    expect(res.status).toBe(401);
  });
});
```

## CI/CD에서 자동 테스트 실행

### GitHub Actions 설정

**AI에게 요청:**
```
GitHub Actions를 사용해서 코드를 푸시할 때마다 자동으로 테스트를 실행하고 싶어.
.github/workflows/test.yml 파일을 만들어줘.

다음 단계로 실행해줘:
1. Node.js 설치
2. 의존성 설치
3. 테스트 실행
4. 커버리지 리포트 생성
```

**Run 버튼 클릭!**

**AI가 생성한 파일 (.github/workflows/test.yml):**
```yaml
name: Run Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Generate coverage report
      run: npm test -- --coverage

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
```

## 테스트 작성 팁

### 1. 테스트는 독립적이어야 합니다

**AI에게 요청:**
```
각 테스트가 서로 독립적으로 실행되도록 beforeEach를 사용해서 초기화 코드를 작성해줘.
```

**예시:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Users API', () => {
  let app: Hono;

  beforeEach(() => {
    // 각 테스트 전에 새로운 앱 인스턴스 생성
    app = new Hono();
    app.route('/api/users', users);
  });

  it('테스트 1', async () => {
    // ...
  });

  it('테스트 2', async () => {
    // ...
  });
});
```

### 2. 의미 있는 테스트 이름 사용

```typescript
// ❌ 나쁜 예
it('test1', () => { /* ... */ });

// ✅ 좋은 예
it('이메일이 없으면 400 에러를 반환해야 함', () => { /* ... */ });
```

### 3. AAA 패턴 사용

```typescript
it('사용자를 생성해야 함', async () => {
  // Arrange (준비)
  const userData = {
    name: 'Alice',
    email: 'alice@example.com'
  };

  // Act (실행)
  const res = await app.request('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });

  // Assert (검증)
  expect(res.status).toBe(201);
  const data = await res.json();
  expect(data.user.name).toBe('Alice');
});
```

## 다음 단계

테스트 작성을 마스터했습니다! 이제 다른 고급 주제도 탐색해보세요:

- **[Workers 기초](./workers-basics.md)** - Hono 기본 사용법
- **[D1 데이터베이스](./d1-database.md)** - SQL 데이터베이스
- **[실전: REST API 만들기](./workers-rest-api.md)** - 완전한 API 구축
- **[OpenAPI 문서 만들기](./workers-openapi.md)** - API 문서화

## 참고 자료

- [Vitest 공식 문서](https://vitest.dev)
- [Hono Testing 가이드](https://hono.dev/guides/testing)
- [Cloudflare Workers Testing](https://developers.cloudflare.com/workers/testing)
- [Testing Best Practices](https://testingjavascript.com)
