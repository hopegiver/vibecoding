# Workers에서 사용자 인증 구현하기

API를 만들 때 가장 중요한 것 중 하나가 **사용자 인증**입니다. 누가 API를 사용하는지 확인하고, 권한에 따라 접근을 제어해야 합니다. JWT(JSON Web Token)를 사용하면 쉽게 구현할 수 있습니다!

## AI로 JWT 인증 시작하기

복잡한 암호화 로직은 AI가 모두 처리해줍니다!

### 1. JWT 라이브러리 설치

**AI에게 요청:**
```
Hono Workers 프로젝트에 JWT 인증을 추가하고 싶어.
필요한 패키지를 설치해줘:
- hono의 jwt 미들웨어
- bcrypt 같은 암호화 라이브러리 (Workers 환경에서 동작하는 것)
```

**Run 버튼 클릭!**

AI가 다음 명령어를 실행합니다:
```bash
npm install hono
npm install -D @types/node
```

> Hono에는 JWT 기능이 내장되어 있어서 추가 패키지가 필요 없습니다!

### 2. JWT Secret 설정

**AI에게 요청:**
```
JWT 토큰을 생성할 때 사용할 시크릿 키를 설정하고 싶어.
Cloudflare Secret으로 JWT_SECRET을 추가해줘.
```

**AI가 제안하는 명령어:**
```bash
wrangler secret put JWT_SECRET
```

**Run 버튼 클릭!**

터미널에 시크릿 값을 입력합니다:
```
Enter a secret value: my-super-secret-key-change-this-in-production
```

> **중요:** 프로덕션에서는 강력하고 긴 랜덤 문자열을 사용하세요!

### 3. 사용자 테이블 생성

**AI에게 요청:**
```
D1 데이터베이스에 사용자 인증을 위한 테이블을 만들어줘.

테이블: users
- id (자동 증가 primary key)
- email (이메일, 고유값)
- username (사용자명, 고유값)
- password_hash (암호화된 비밀번호)
- role (역할: 'user' 또는 'admin')
- created_at (생성 시각)

migrations 폴더에 SQL 파일을 생성하고,
로컬과 프로덕션 DB에 적용해줘.
```

**Run 버튼 클릭!**

AI가 생성한 마이그레이션 파일 (migrations/0001_create_users_table.sql):
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

AI가 자동으로 로컬과 프로덕션에 적용합니다.

### 4. 회원가입 API 만들기

**AI에게 요청:**
```
회원가입 API를 만들어줘.

POST /api/auth/register
요청 데이터:
- email
- username
- password

처리 과정:
1. 이메일과 사용자명 중복 확인
2. 비밀번호를 bcrypt로 암호화
3. D1에 사용자 저장
4. JWT 토큰 생성해서 반환

src/routes/auth.ts 파일을 만들어줘.
Workers 환경에서 동작하는 bcrypt 대안을 사용해줘.
```

**Run 버튼 클릭!**

AI가 생성한 코드 (src/routes/auth.ts):
```typescript
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { Env } from '../types/env';

const auth = new Hono<{ Bindings: Env }>();

// 비밀번호 해시 함수 (Web Crypto API 사용)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 비밀번호 검증 함수
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// 회원가입
auth.post('/register', async (c) => {
  try {
    const { email, username, password } = await c.req.json();

    // 입력 검증
    if (!email || !username || !password) {
      return c.json({ error: 'Email, username, and password are required' }, 400);
    }

    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }

    // 중복 확인
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ? OR username = ?'
    ).bind(email, username).first();

    if (existingUser) {
      return c.json({ error: 'Email or username already exists' }, 409);
    }

    // 비밀번호 해시화
    const passwordHash = await hashPassword(password);

    // 사용자 생성
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, username, password_hash, role) VALUES (?, ?, ?, ?)'
    ).bind(email, username, passwordHash, 'user').run();

    const userId = result.meta.last_row_id;

    // JWT 토큰 생성
    const token = await sign(
      {
        sub: userId,
        email,
        username,
        role: 'user',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7일
      },
      c.env.JWT_SECRET
    );

    return c.json({
      success: true,
      user: {
        id: userId,
        email,
        username,
        role: 'user'
      },
      token
    }, 201);
  } catch (error: any) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

export default auth;
```

### 5. 로그인 API 만들기

**AI에게 요청:**
```
로그인 API를 auth.ts에 추가해줘.

POST /api/auth/login
요청 데이터:
- login (이메일 또는 사용자명)
- password

처리 과정:
1. 이메일 또는 사용자명으로 사용자 찾기
2. 비밀번호 검증
3. JWT 토큰 생성해서 반환
```

**Run 버튼 클릭!**

AI가 auth.ts에 추가한 코드:
```typescript
// 로그인
auth.post('/login', async (c) => {
  try {
    const { login, password } = await c.req.json();

    if (!login || !password) {
      return c.json({ error: 'Login and password are required' }, 400);
    }

    // 이메일 또는 사용자명으로 사용자 찾기
    const user = await c.env.DB.prepare(
      'SELECT id, email, username, password_hash, role FROM users WHERE email = ? OR username = ?'
    ).bind(login, login).first() as any;

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // 비밀번호 검증
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // JWT 토큰 생성
    const token = await sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7일
      },
      c.env.JWT_SECRET
    );

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});
```

### 6. JWT 인증 미들웨어 만들기

**AI에게 요청:**
```
JWT 토큰을 검증하는 미들웨어를 만들어줘.

src/middleware/auth.ts 파일을 만들어서:
1. Authorization 헤더에서 Bearer 토큰 추출
2. JWT 토큰 검증
3. 유효하면 사용자 정보를 context에 저장
4. 유효하지 않으면 401 에러 반환

그리고 관리자 전용 미들웨어도 만들어줘.
```

**Run 버튼 클릭!**

AI가 생성한 코드 (src/middleware/auth.ts):
```typescript
import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../types/env';

// JWT 페이로드 타입
export interface JWTPayload {
  sub: number;
  email: string;
  username: string;
  role: string;
  exp: number;
}

// Context에 사용자 정보 추가
declare module 'hono' {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

// 인증 미들웨어
export async function authMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next
) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.substring(7); // "Bearer " 제거

  try {
    const payload = await verify(token, c.env.JWT_SECRET) as JWTPayload;

    // 토큰 만료 확인
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new HTTPException(401, { message: 'Unauthorized: Token expired' });
    }

    // 사용자 정보를 context에 저장
    c.set('user', payload);

    await next();
  } catch (error) {
    throw new HTTPException(401, { message: 'Unauthorized: Invalid token' });
  }
}

// 관리자 전용 미들웨어
export async function adminMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next
) {
  // authMiddleware가 먼저 실행되어야 함
  const user = c.get('user');

  if (!user) {
    throw new HTTPException(401, { message: 'Unauthorized: Authentication required' });
  }

  if (user.role !== 'admin') {
    throw new HTTPException(403, { message: 'Forbidden: Admin access required' });
  }

  await next();
}
```

### 7. 인증이 필요한 라우트에 적용

**AI에게 요청:**
```
인증 미들웨어를 사용자 라우트에 적용하고 싶어.

src/routes/users.ts에서:
- GET /api/users (목록) : 인증 필요
- GET /api/users/:id : 인증 필요
- POST /api/users : 관리자만
- PUT /api/users/:id : 본인 또는 관리자만
- DELETE /api/users/:id : 관리자만

로직을 추가해줘.
```

**Run 버튼 클릭!**

AI가 수정한 코드 (src/routes/users.ts):
```typescript
import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import type { Env } from '../types/env';

const users = new Hono<{ Bindings: Env }>();

// 모든 사용자 라우트에 인증 필요
users.use('*', authMiddleware);

// 사용자 목록 조회 (인증된 사용자)
users.get('/', async (c) => {
  const user = c.get('user');

  const { results } = await c.env.DB.prepare(
    'SELECT id, email, username, role, created_at FROM users ORDER BY created_at DESC'
  ).all();

  return c.json(results);
});

// 특정 사용자 조회 (인증된 사용자)
users.get('/:id', async (c) => {
  const id = c.req.param('id');
  const currentUser = c.get('user');

  const user = await c.env.DB.prepare(
    'SELECT id, email, username, role, created_at FROM users WHERE id = ?'
  ).bind(id).first();

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(user);
});

// 사용자 생성 (관리자만)
users.post('/', adminMiddleware, async (c) => {
  const { email, username, password, role } = await c.req.json();

  if (!email || !username || !password) {
    return c.json({ error: 'Email, username, and password are required' }, 400);
  }

  // 비밀번호 해시화 로직 (auth.ts의 함수 재사용)
  // ... 생략 ...

  return c.json({ success: true }, 201);
});

// 사용자 수정 (본인 또는 관리자)
users.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const currentUser = c.get('user');

  // 본인 또는 관리자만 수정 가능
  if (currentUser.sub !== id && currentUser.role !== 'admin') {
    return c.json({ error: 'Forbidden: You can only update your own profile' }, 403);
  }

  const { email, username } = await c.req.json();

  const result = await c.env.DB.prepare(
    'UPDATE users SET email = ?, username = ? WHERE id = ?'
  ).bind(email, username, id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ success: true });
});

// 사용자 삭제 (관리자만)
users.delete('/:id', adminMiddleware, async (c) => {
  const id = c.req.param('id');

  const result = await c.env.DB.prepare(
    'DELETE FROM users WHERE id = ?'
  ).bind(id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ success: true });
});

export default users;
```

## 엔드포인트 분리하기

### 사용자 엔드포인트 vs 관리자 엔드포인트

**AI에게 요청:**
```
API를 두 가지로 분리하고 싶어:
1. /api/user/* - 일반 사용자용 (일부 인증 필요)
2. /api/admin/* - 관리자 전용 (기본적으로 모든 엔드포인트 인증 필요)

src/routes/admin/ 폴더를 만들어서 관리자 전용 라우트를 분리해줘.
그리고 index.ts에서 두 가지를 연결해줘.
```

**Run 버튼 클릭!**

AI가 생성한 코드 (src/routes/admin/users.ts):
```typescript
import { Hono } from 'hono';
import type { Env } from '../../types/env';

const adminUsers = new Hono<{ Bindings: Env }>();

// 모든 사용자 목록 (관리자용)
adminUsers.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT
      id,
      email,
      username,
      role,
      created_at,
      (SELECT COUNT(*) FROM posts WHERE user_id = users.id) as post_count
    FROM users
    ORDER BY created_at DESC
  `).all();

  return c.json(results);
});

// 사용자 역할 변경
adminUsers.put('/:id/role', async (c) => {
  const id = c.req.param('id');
  const { role } = await c.req.json();

  if (!['user', 'admin'].includes(role)) {
    return c.json({ error: 'Invalid role' }, 400);
  }

  const result = await c.env.DB.prepare(
    'UPDATE users SET role = ? WHERE id = ?'
  ).bind(role, id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ success: true });
});

// 사용자 계정 활성화/비활성화
adminUsers.put('/:id/status', async (c) => {
  const id = c.req.param('id');
  const { active } = await c.req.json();

  // 여기서는 users 테이블에 active 컬럼이 있다고 가정
  const result = await c.env.DB.prepare(
    'UPDATE users SET active = ? WHERE id = ?'
  ).bind(active ? 1 : 0, id).run();

  return c.json({ success: true });
});

export default adminUsers;
```

AI가 수정한 메인 파일 (src/index.ts):
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import auth from './routes/auth';
import users from './routes/users';
import adminUsers from './routes/admin/users';
import { authMiddleware, adminMiddleware } from './middleware/auth';
import type { Env } from './types/env';

const app = new Hono<{ Bindings: Env }>();

// CORS 설정
app.use('*', cors());

// 공개 엔드포인트 (인증 불필요)
app.get('/', (c) => {
  return c.json({
    message: 'API is running',
    version: '1.0.0'
  });
});

// 인증 라우트 (회원가입, 로그인 - 인증 불필요)
app.route('/api/auth', auth);

// 사용자 라우트 (인증 필요 - 라우트 내부에서 처리)
app.route('/api/users', users);

// 관리자 라우트 (모든 엔드포인트에 인증 + 관리자 권한 필요)
const admin = new Hono<{ Bindings: Env }>();
admin.use('*', authMiddleware, adminMiddleware); // 모든 관리자 라우트에 적용
admin.route('/users', adminUsers);
app.route('/api/admin', admin);

// 에러 핸들링
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }

  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// 404 핸들링
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

export default app;
```

## 특정 엔드포인트만 인증 제외하기

관리자 엔드포인트에서 일부만 인증 없이 접근하려면:

**AI에게 요청:**
```
/api/admin 엔드포인트는 기본적으로 인증이 필요하지만,
/api/admin/stats 같은 특정 엔드포인트는 공개하고 싶어.

어떻게 하면 되지?
```

**Run 버튼 클릭!**

AI가 제안한 방법:

```typescript
// src/index.ts
const app = new Hono<{ Bindings: Env }>();

// 방법 1: 공개 엔드포인트를 먼저 정의
app.get('/api/admin/stats', async (c) => {
  // 인증 없이 접근 가능
  const stats = await c.env.DB.prepare(`
    SELECT
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM posts) as total_posts
  `).first();

  return c.json(stats);
});

// 그 다음 나머지 관리자 라우트 (인증 필요)
const admin = new Hono<{ Bindings: Env }>();
admin.use('*', authMiddleware, adminMiddleware);
admin.route('/users', adminUsers);
app.route('/api/admin', admin);

// 방법 2: 조건부 미들웨어 사용
const admin2 = new Hono<{ Bindings: Env }>();
admin2.use('*', async (c, next) => {
  // 특정 경로는 인증 제외
  if (c.req.path === '/api/admin/stats') {
    return next();
  }

  // 나머지는 인증 필요
  await authMiddleware(c, next);
  await adminMiddleware(c, next);
});
```

## 토큰 갱신 (Refresh Token)

**AI에게 요청:**
```
JWT 토큰이 만료되기 전에 새 토큰을 받을 수 있는
refresh token 시스템을 추가하고 싶어.

POST /api/auth/refresh 엔드포인트를 만들어줘.
```

**Run 버튼 클릭!**

AI가 auth.ts에 추가한 코드:

```typescript
// 토큰 갱신
auth.post('/refresh', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.substring(7);

    // 만료된 토큰도 검증 (페이로드 추출용)
    let payload;
    try {
      payload = await verify(token, c.env.JWT_SECRET) as JWTPayload;
    } catch (error) {
      // 토큰이 만료되었어도 페이로드는 추출 가능
      const parts = token.split('.');
      if (parts.length !== 3) {
        return c.json({ error: 'Invalid token' }, 401);
      }

      const payloadBase64 = parts[1];
      const payloadJson = atob(payloadBase64);
      payload = JSON.parse(payloadJson);
    }

    // 사용자 존재 확인
    const user = await c.env.DB.prepare(
      'SELECT id, email, username, role FROM users WHERE id = ?'
    ).bind(payload.sub).first() as any;

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // 새 토큰 생성
    const newToken = await sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      },
      c.env.JWT_SECRET
    );

    return c.json({ token: newToken });
  } catch (error) {
    console.error('Refresh error:', error);
    return c.json({ error: 'Token refresh failed' }, 500);
  }
});
```

## 현재 사용자 정보 조회

**AI에게 요청:**
```
현재 로그인한 사용자의 정보를 가져오는 API를 만들어줘.
GET /api/auth/me
```

**Run 버튼 클릭!**

```typescript
// 현재 사용자 정보
auth.get('/me', authMiddleware, async (c) => {
  const currentUser = c.get('user');

  const user = await c.env.DB.prepare(
    'SELECT id, email, username, role, created_at FROM users WHERE id = ?'
  ).bind(currentUser.sub).first();

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(user);
});
```

## 프론트엔드에서 사용하기

### 로그인 예시

```javascript
// 로그인
async function login(email, password) {
  const response = await fetch('https://your-api.workers.dev/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login: email,
      password: password
    })
  });

  const data = await response.json();

  if (data.token) {
    // 토큰을 localStorage에 저장
    localStorage.setItem('token', data.token);
    console.log('로그인 성공!');
  }
}

// 인증이 필요한 API 호출
async function fetchUsers() {
  const token = localStorage.getItem('token');

  const response = await fetch('https://your-api.workers.dev/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const users = await response.json();
  return users;
}

// 로그아웃
function logout() {
  localStorage.removeItem('token');
}
```

## 보안 모범 사례

### 1. 강력한 비밀번호 정책

**AI에게 요청:**
```
비밀번호 검증 로직을 추가해줘.
최소 8자, 대문자, 소문자, 숫자, 특수문자 포함.
```

### 2. Rate Limiting

**AI에게 요청:**
```
로그인 API에 rate limiting을 추가해줘.
같은 IP에서 5분에 5번만 시도 가능하게.
KV 스토리지를 사용해서 구현해줘.
```

### 3. HTTPS 사용

Cloudflare Workers는 기본적으로 HTTPS를 사용합니다.

### 4. 토큰 만료 시간

- Access Token: 짧게 (15분 ~ 1시간)
- Refresh Token: 길게 (7일 ~ 30일)

## 테스트하기

### Postman으로 테스트

**AI에게 요청:**
```
Postman에서 테스트할 수 있도록
API 엔드포인트 예시를 알려줘.
```

**1. 회원가입:**
```
POST https://your-api.workers.dev/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "password": "MyPassword123!"
}
```

**2. 로그인:**
```
POST https://your-api.workers.dev/api/auth/login
Content-Type: application/json

{
  "login": "test@example.com",
  "password": "MyPassword123!"
}

→ 응답에서 token 복사
```

**3. 인증이 필요한 API 호출:**
```
GET https://your-api.workers.dev/api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## TypeScript 타입 정의

**AI에게 요청:**
```
인증 관련 TypeScript 타입을 정리해줘.
src/types/auth.ts 파일을 만들어줘.
```

**Run 버튼 클릭!**

```typescript
// src/types/auth.ts
export interface User {
  id: number;
  email: string;
  username: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  login: string; // email or username
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: Omit<User, 'password_hash'>;
  token: string;
}

export interface JWTPayload {
  sub: number; // user id
  email: string;
  username: string;
  role: 'user' | 'admin';
  exp: number;
  iat?: number;
}
```

## 환경 변수 타입 추가

**AI에게 요청:**
```
src/types/env.ts에 JWT_SECRET을 추가해줘.
```

```typescript
// src/types/env.ts
export type Env = {
  DB: D1Database;
  MY_KV: KVNamespace;
  JWT_SECRET: string;
};
```

## 다음 단계

JWT 인증을 마스터했습니다! 이제 더 안전한 API를 만들어보세요:

- **[OpenAPI 문서 만들기](./workers-openapi.md)** - 인증 스펙 문서화
- **[D1 데이터베이스](./d1-database.md)** - 사용자 데이터 관리
- **[Workers 기초](./workers-basics.md)** - Hono 기본 사용법

## 참고 자료

- [Hono JWT 문서](https://hono.dev/middleware/builtin/jwt)
- [JWT 공식 사이트](https://jwt.io)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
