# D1 데이터베이스 사용하기

Cloudflare D1은 서버리스 SQL 데이터베이스입니다. Hono와 함께 사용하면 강력한 백엔드를 만들 수 있습니다.

## D1이란?

### 기본 개념

D1은 SQLite 기반의 서버리스 데이터베이스입니다.

**특징:**
- SQL 쿼리 사용
- 관계형 데이터베이스
- 전 세계 엣지에서 실행
- 무료 플랜으로 시작

### KV vs D1

| 특징 | KV | D1 |
|------|----|----|
| 데이터 구조 | 키-값 | 테이블 (관계형) |
| 쿼리 | 단순 (키 조회만) | 복잡한 SQL 가능 |
| 적합한 용도 | 캐시, 간단한 저장 | 구조화된 데이터 |
| 성능 | 읽기 매우 빠름 | 균형잡힘 |

## 무료 플랜 한도

```
무료로 제공:
- 5GB 저장 공간
- 하루 500만 읽기
- 하루 10만 쓰기

대부분의 프로젝트에 충분!
```

## D1 데이터베이스 만들기

### 1. Wrangler로 생성

```bash
# D1 데이터베이스 생성
wrangler d1 create my-database

# 출력:
# ✅ Successfully created DB 'my-database'
#
# [[d1_databases]]
# binding = "DB"
# database_name = "my-database"
# database_id = "xxxx-xxxx-xxxx-xxxx"
```

### 2. wrangler.toml에 추가

출력된 설정을 `wrangler.toml`에 추가:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "xxxx-xxxx-xxxx-xxxx"
```

### 3. 스키마 생성

**schema.sql**
```sql
-- 사용자 테이블
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 게시물 테이블
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_users_email ON users(email);
```

### 4. 스키마 적용

```bash
# 로컬 DB에 적용 (개발용)
wrangler d1 execute my-database --local --file=./schema.sql

# 프로덕션 DB에 적용
wrangler d1 execute my-database --file=./schema.sql
```

## TypeScript 타입 설정

**src/types/env.ts**
```typescript
export type Env = {
  DB: D1Database;
};
```

## Hono로 CRUD API 만들기

### 기본 구조

**src/index.ts**
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import users from './routes/users';
import posts from './routes/posts';
import type { Env } from './types/env';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.get('/', (c) => {
  return c.json({ message: 'API is running' });
});

app.route('/api/users', users);
app.route('/api/posts', posts);

export default app;
```

### 사용자 CRUD

**src/routes/users.ts**
```typescript
import { Hono } from 'hono';
import type { Env } from '../types/env';

const users = new Hono<{ Bindings: Env }>();

// 모든 사용자 조회
users.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
  ).all();

  return c.json(results);
});

// 특정 사용자 조회
users.get('/:id', async (c) => {
  const id = c.req.param('id');

  const user = await c.env.DB.prepare(
    'SELECT id, name, email, created_at FROM users WHERE id = ?'
  ).bind(id).first();

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(user);
});

// 사용자 생성
users.post('/', async (c) => {
  const { name, email } = await c.req.json();

  if (!name || !email) {
    return c.json({ error: 'Name and email are required' }, 400);
  }

  try {
    const result = await c.env.DB.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?)'
    ).bind(name, email).run();

    return c.json({
      success: true,
      id: result.meta.last_row_id
    }, 201);
  } catch (error) {
    // 이메일 중복 등의 에러
    return c.json({ error: 'Failed to create user' }, 400);
  }
});

// 사용자 수정
users.put('/:id', async (c) => {
  const id = c.req.param('id');
  const { name, email } = await c.req.json();

  const result = await c.env.DB.prepare(
    'UPDATE users SET name = ?, email = ? WHERE id = ?'
  ).bind(name, email, id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ success: true });
});

// 사용자 삭제
users.delete('/:id', async (c) => {
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

### 게시물 CRUD (JOIN 포함)

**src/routes/posts.ts**
```typescript
import { Hono } from 'hono';
import type { Env } from '../types/env';

const posts = new Hono<{ Bindings: Env }>();

// 모든 게시물 조회 (작성자 정보 포함)
posts.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT
      posts.id,
      posts.title,
      posts.content,
      posts.created_at,
      users.name as author_name,
      users.email as author_email
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `).all();

  return c.json(results);
});

// 특정 사용자의 게시물 조회
posts.get('/user/:userId', async (c) => {
  const userId = c.req.param('userId');

  const { results } = await c.env.DB.prepare(`
    SELECT id, title, content, created_at
    FROM posts
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).bind(userId).all();

  return c.json(results);
});

// 게시물 생성
posts.post('/', async (c) => {
  const { user_id, title, content } = await c.req.json();

  if (!user_id || !title || !content) {
    return c.json({ error: 'user_id, title, and content are required' }, 400);
  }

  const result = await c.env.DB.prepare(
    'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)'
  ).bind(user_id, title, content).run();

  return c.json({
    success: true,
    id: result.meta.last_row_id
  }, 201);
});

// 게시물 수정
posts.put('/:id', async (c) => {
  const id = c.req.param('id');
  const { title, content } = await c.req.json();

  const result = await c.env.DB.prepare(
    'UPDATE posts SET title = ?, content = ? WHERE id = ?'
  ).bind(title, content, id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'Post not found' }, 404);
  }

  return c.json({ success: true });
});

// 게시물 삭제
posts.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const result = await c.env.DB.prepare(
    'DELETE FROM posts WHERE id = ?'
  ).bind(id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'Post not found' }, 404);
  }

  return c.json({ success: true });
});

export default posts;
```

## 고급 쿼리

### 페이지네이션

```typescript
users.get('/list', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const offset = (page - 1) * limit;

  // 데이터 조회
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).bind(limit, offset).all();

  // 전체 개수 조회
  const { count } = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM users'
  ).first() as { count: number };

  return c.json({
    data: results,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  });
});
```

### 검색 기능

```typescript
users.get('/search', async (c) => {
  const query = c.req.query('q') || '';

  const { results } = await c.env.DB.prepare(`
    SELECT id, name, email, created_at
    FROM users
    WHERE name LIKE ? OR email LIKE ?
    ORDER BY created_at DESC
  `).bind(`%${query}%`, `%${query}%`).all();

  return c.json(results);
});
```

### 트랜잭션 (Batch)

```typescript
posts.post('/batch', async (c) => {
  const { user_id, posts } = await c.req.json();

  // 여러 쿼리를 한 번에 실행
  const statements = posts.map((post: any) =>
    c.env.DB.prepare(
      'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)'
    ).bind(user_id, post.title, post.content)
  );

  const results = await c.env.DB.batch(statements);

  return c.json({
    success: true,
    created: results.length
  });
});
```

### 집계 함수

```typescript
posts.get('/stats', async (c) => {
  const stats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as total_posts,
      COUNT(DISTINCT user_id) as total_authors,
      MAX(created_at) as latest_post
    FROM posts
  `).first();

  return c.json(stats);
});
```

## 로컬 개발

### 로컬 DB 사용

```bash
# 로컬 개발 서버 (로컬 D1 사용)
npm run dev

# 또는
wrangler dev --local
```

로컬 D1은 프로젝트의 `.wrangler/state/v3/d1/` 폴더에 저장됩니다.

### 로컬 데이터 조회

```bash
# 로컬 DB 쿼리 실행
wrangler d1 execute my-database --local --command="SELECT * FROM users"
```

### 테스트 데이터 삽입

**seed.sql**
```sql
-- 테스트 사용자
INSERT INTO users (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com'),
  ('Charlie', 'charlie@example.com');

-- 테스트 게시물
INSERT INTO posts (user_id, title, content) VALUES
  (1, '첫 번째 글', '안녕하세요!'),
  (1, '두 번째 글', 'D1 데이터베이스 사용기'),
  (2, 'Bob의 글', 'Workers로 API 만들기');
```

```bash
# 로컬 DB에 시드 데이터 삽입
wrangler d1 execute my-database --local --file=./seed.sql

# 프로덕션 DB에 시드 데이터 삽입
wrangler d1 execute my-database --file=./seed.sql
```

## 마이그레이션

### 마이그레이션 파일 생성

**migrations/001_add_users_bio.sql**
```sql
-- 사용자 프로필 추가
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN avatar_url TEXT;
```

### 마이그레이션 적용

```bash
# 로컬
wrangler d1 execute my-database --local --file=./migrations/001_add_users_bio.sql

# 프로덕션
wrangler d1 execute my-database --file=./migrations/001_add_users_bio.sql
```

## 배포

### 1. 프로덕션 DB에 스키마 적용

```bash
# 스키마 적용
wrangler d1 execute my-database --file=./schema.sql

# 시드 데이터 (선택사항)
wrangler d1 execute my-database --file=./seed.sql
```

### 2. Workers 배포

```bash
npm run deploy
```

### 3. 배포 확인

```bash
# API 테스트
curl https://your-worker.workers.dev/api/users

# 로그 확인
wrangler tail
```

## 모범 사례

### 1. Prepared Statements 사용 (SQL Injection 방지)

```typescript
// ✅ 좋은 예 - Prepared Statement
const user = await c.env.DB.prepare(
  'SELECT * FROM users WHERE email = ?'
).bind(email).first();

// ❌ 나쁜 예 - SQL Injection 위험
const user = await c.env.DB.prepare(
  `SELECT * FROM users WHERE email = '${email}'`
).first();
```

### 2. 에러 처리

```typescript
users.post('/', async (c) => {
  try {
    const { name, email } = await c.req.json();

    const result = await c.env.DB.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?)'
    ).bind(name, email).run();

    return c.json({ success: true, id: result.meta.last_row_id }, 201);
  } catch (error: any) {
    // UNIQUE constraint 위반
    if (error.message.includes('UNIQUE')) {
      return c.json({ error: 'Email already exists' }, 409);
    }

    console.error('Database error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
```

### 3. 인덱스 활용

```sql
-- 자주 검색하는 컬럼에 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- 복합 인덱스
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at);
```

### 4. SELECT 최적화

```typescript
// ✅ 필요한 컬럼만 선택
const { results } = await c.env.DB.prepare(
  'SELECT id, name, email FROM users'
).all();

// ❌ 모든 컬럼 선택 (느림)
const { results } = await c.env.DB.prepare(
  'SELECT * FROM users'
).all();
```

## 실전 예제: 블로그 API

전체 블로그 시스템 구현:

**src/routes/blog.ts**
```typescript
import { Hono } from 'hono';
import type { Env } from '../types/env';

const blog = new Hono<{ Bindings: Env }>();

// 게시물 목록 (페이지네이션 + 검색)
blog.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;
  const search = c.req.query('q') || '';

  let query = `
    SELECT
      posts.id,
      posts.title,
      posts.content,
      posts.created_at,
      users.name as author
    FROM posts
    JOIN users ON posts.user_id = users.id
  `;

  let params: any[] = [];

  if (search) {
    query += ' WHERE posts.title LIKE ? OR posts.content LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }

  query += ' ORDER BY posts.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  // 전체 개수
  let countQuery = 'SELECT COUNT(*) as count FROM posts';
  if (search) {
    countQuery += ' WHERE title LIKE ? OR content LIKE ?';
  }

  const { count } = await c.env.DB.prepare(countQuery)
    .bind(...(search ? [`%${search}%`, `%${search}%`] : []))
    .first() as { count: number };

  return c.json({
    posts: results,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  });
});

export default blog;
```

## 다음 단계

- [Workers 기초](./workers-basics.md) - Hono 기본 사용법
- [KV 스토리지](./kv-storage.md) - 캐싱에 D1과 함께 사용
- [R2 스토리지](./r2-storage.md) - 파일 업로드와 함께 사용

## 참고 자료

- [D1 공식 문서](https://developers.cloudflare.com/d1)
- [SQLite 문법](https://www.sqlite.org/lang.html)
- [Hono 문서](https://hono.dev)
