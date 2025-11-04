# 실전: REST API 만들기

Workers와 Hono로 실제 프로덕션에서 사용할 수 있는 REST API를 만들어봅시다.

## 프로젝트 개요

**할 일 관리(Todo) API**를 만들어봅니다.

### 기능
- ✅ 할 일 목록 조회
- ✅ 할 일 생성
- ✅ 할 일 수정
- ✅ 할 일 삭제
- ✅ 할 일 완료 처리
- ✅ 인증 (API Key)
- ✅ 에러 처리
- ✅ 페이지네이션

### 사용 기술
- Hono (웹 프레임워크)
- D1 (데이터베이스)
- TypeScript

## 1. 프로젝트 설정

### 프로젝트 생성

```bash
# Hono 프로젝트 생성
npm create hono@latest todo-api
# ? Target: cloudflare-workers
# ? Template: basic

cd todo-api
npm install
```

### D1 데이터베이스 생성

```bash
# D1 데이터베이스 생성
wrangler d1 create todo-db

# 출력된 설정을 wrangler.toml에 추가
```

**wrangler.toml**
```toml
name = "todo-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "todo-db"
database_id = "your-database-id"
```

### 스키마 생성

**schema.sql**
```sql
-- 할 일 테이블
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT 0,
  priority INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created ON todos(created_at);
```

**스키마 적용**
```bash
# 로컬 DB
wrangler d1 execute todo-db --local --file=./schema.sql

# 프로덕션 DB
wrangler d1 execute todo-db --file=./schema.sql
```

## 2. 타입 정의

**src/types/env.ts**
```typescript
export type Env = {
  DB: D1Database;
  API_KEY: string;
};

export type Todo = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
};

export type CreateTodoRequest = {
  title: string;
  description?: string;
  priority?: number;
};

export type UpdateTodoRequest = {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: number;
};
```

## 3. 미들웨어

### 인증 미들웨어

**src/middleware/auth.ts**
```typescript
import { Context, Next } from 'hono';
import type { Env } from '../types/env';

export async function authMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next
) {
  const apiKey = c.req.header('X-API-Key');

  if (!apiKey) {
    return c.json({ error: 'API key required' }, 401);
  }

  if (apiKey !== c.env.API_KEY) {
    return c.json({ error: 'Invalid API key' }, 401);
  }

  await next();
}
```

### 에러 핸들러

**src/middleware/errorHandler.ts**
```typescript
import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

export function errorHandler(err: Error, c: Context) {
  console.error('Error:', err);

  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.message,
        status: err.status,
      },
      err.status
    );
  }

  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message,
    },
    500
  );
}
```

## 4. 라우트 구현

### Todo 라우트

**src/routes/todos.ts**
```typescript
import { Hono } from 'hono';
import type { Env, Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/env';

const todos = new Hono<{ Bindings: Env }>();

// 목록 조회 (페이지네이션)
todos.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const offset = (page - 1) * limit;

  // 데이터 조회
  const { results } = await c.env.DB.prepare(`
    SELECT * FROM todos
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  // 전체 개수
  const { count } = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM todos'
  ).first() as { count: number };

  return c.json({
    data: results as Todo[],
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  });
});

// 특정 Todo 조회
todos.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  const todo = await c.env.DB.prepare(
    'SELECT * FROM todos WHERE id = ?'
  ).bind(id).first() as Todo | null;

  if (!todo) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  return c.json(todo);
});

// Todo 생성
todos.post('/', async (c) => {
  const body: CreateTodoRequest = await c.req.json();

  // 유효성 검사
  if (!body.title || body.title.trim() === '') {
    return c.json({ error: 'Title is required' }, 400);
  }

  // 데이터 삽입
  const result = await c.env.DB.prepare(`
    INSERT INTO todos (title, description, priority)
    VALUES (?, ?, ?)
  `).bind(
    body.title,
    body.description || null,
    body.priority || 1
  ).run();

  // 생성된 Todo 조회
  const todo = await c.env.DB.prepare(
    'SELECT * FROM todos WHERE id = ?'
  ).bind(result.meta.last_row_id).first() as Todo;

  return c.json(todo, 201);
});

// Todo 수정
todos.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const body: UpdateTodoRequest = await c.req.json();

  // 기존 Todo 확인
  const existing = await c.env.DB.prepare(
    'SELECT * FROM todos WHERE id = ?'
  ).bind(id).first();

  if (!existing) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  // 업데이트할 필드만 수정
  const updates: string[] = [];
  const values: any[] = [];

  if (body.title !== undefined) {
    updates.push('title = ?');
    values.push(body.title);
  }

  if (body.description !== undefined) {
    updates.push('description = ?');
    values.push(body.description);
  }

  if (body.completed !== undefined) {
    updates.push('completed = ?');
    values.push(body.completed ? 1 : 0);
  }

  if (body.priority !== undefined) {
    updates.push('priority = ?');
    values.push(body.priority);
  }

  if (updates.length === 0) {
    return c.json({ error: 'No fields to update' }, 400);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  // 업데이트 실행
  await c.env.DB.prepare(`
    UPDATE todos
    SET ${updates.join(', ')}
    WHERE id = ?
  `).bind(...values).run();

  // 수정된 Todo 조회
  const todo = await c.env.DB.prepare(
    'SELECT * FROM todos WHERE id = ?'
  ).bind(id).first() as Todo;

  return c.json(todo);
});

// Todo 삭제
todos.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  const result = await c.env.DB.prepare(
    'DELETE FROM todos WHERE id = ?'
  ).bind(id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  return c.json({ success: true });
});

// 완료 처리
todos.patch('/:id/complete', async (c) => {
  const id = parseInt(c.req.param('id'));

  const result = await c.env.DB.prepare(`
    UPDATE todos
    SET completed = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  const todo = await c.env.DB.prepare(
    'SELECT * FROM todos WHERE id = ?'
  ).bind(id).first() as Todo;

  return c.json(todo);
});

// 완료 취소
todos.patch('/:id/uncomplete', async (c) => {
  const id = parseInt(c.req.param('id'));

  const result = await c.env.DB.prepare(`
    UPDATE todos
    SET completed = 0, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(id).run();

  if (result.meta.changes === 0) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  const todo = await c.env.DB.prepare(
    'SELECT * FROM todos WHERE id = ?'
  ).bind(id).first() as Todo;

  return c.json(todo);
});

export default todos;
```

## 5. 메인 앱

**src/index.ts**
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import todos from './routes/todos';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import type { Env } from './types/env';

const app = new Hono<{ Bindings: Env }>();

// 전역 미들웨어
app.use('*', logger());
app.use('*', cors());

// 에러 핸들러
app.onError(errorHandler);

// 헬스체크 (인증 불필요)
app.get('/', (c) => {
  return c.json({
    message: 'Todo API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API 라우트 (인증 필요)
const api = new Hono<{ Bindings: Env }>();
api.use('*', authMiddleware);
api.route('/todos', todos);

app.route('/api', api);

// 404 핸들러
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

export default app;
```

## 6. 환경 변수 설정

### 로컬 개발

**.dev.vars**
```bash
API_KEY=dev-secret-key-123
```

### 프로덕션

```bash
# Secret 설정
wrangler secret put API_KEY
# 입력: your-production-api-key
```

## 7. 테스트

### 로컬 개발 서버

```bash
npm run dev
# http://localhost:8787
```

### API 테스트

**헬스체크**
```bash
curl http://localhost:8787
```

**Todo 생성**
```bash
curl -X POST http://localhost:8787/api/todos \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-secret-key-123" \
  -d '{
    "title": "프로젝트 완성하기",
    "description": "Workers API 만들기",
    "priority": 1
  }'
```

**Todo 목록 조회**
```bash
curl http://localhost:8787/api/todos \
  -H "X-API-Key: dev-secret-key-123"
```

**페이지네이션**
```bash
curl "http://localhost:8787/api/todos?page=1&limit=5" \
  -H "X-API-Key: dev-secret-key-123"
```

**Todo 수정**
```bash
curl -X PUT http://localhost:8787/api/todos/1 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-secret-key-123" \
  -d '{
    "title": "프로젝트 배포하기",
    "completed": false
  }'
```

**완료 처리**
```bash
curl -X PATCH http://localhost:8787/api/todos/1/complete \
  -H "X-API-Key: dev-secret-key-123"
```

**Todo 삭제**
```bash
curl -X DELETE http://localhost:8787/api/todos/1 \
  -H "X-API-Key: dev-secret-key-123"
```

## 8. 배포

### 프로덕션 배포

```bash
# API Key Secret 설정 (한 번만)
wrangler secret put API_KEY

# D1 스키마 적용 (한 번만)
wrangler d1 execute todo-db --file=./schema.sql

# 배포
npm run deploy
```

### 배포 확인

```bash
# 로그 확인
wrangler tail

# API 테스트
curl https://todo-api.your-subdomain.workers.dev
```

## 9. 프론트엔드 연동

### JavaScript 예제

```html
<!DOCTYPE html>
<html>
<head>
  <title>Todo App</title>
</head>
<body>
  <h1>할 일 관리</h1>

  <form id="todoForm">
    <input type="text" id="title" placeholder="할 일" required>
    <input type="text" id="description" placeholder="설명">
    <button type="submit">추가</button>
  </form>

  <ul id="todoList"></ul>

  <script>
    const API_URL = 'https://todo-api.your-subdomain.workers.dev/api';
    const API_KEY = 'your-api-key';

    // Todo 목록 불러오기
    async function loadTodos() {
      const response = await fetch(`${API_URL}/todos`, {
        headers: {
          'X-API-Key': API_KEY,
        },
      });

      const { data } = await response.json();
      const list = document.getElementById('todoList');
      list.innerHTML = '';

      data.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
          <input type="checkbox"
                 ${todo.completed ? 'checked' : ''}
                 onchange="toggleTodo(${todo.id}, ${!todo.completed})">
          <span style="${todo.completed ? 'text-decoration: line-through' : ''}">
            ${todo.title}
          </span>
          <button onclick="deleteTodo(${todo.id})">삭제</button>
        `;
        list.appendChild(li);
      });
    }

    // Todo 추가
    document.getElementById('todoForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;

      await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({ title, description }),
      });

      document.getElementById('todoForm').reset();
      loadTodos();
    });

    // Todo 완료 토글
    async function toggleTodo(id, completed) {
      const endpoint = completed ? 'complete' : 'uncomplete';

      await fetch(`${API_URL}/todos/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'X-API-Key': API_KEY,
        },
      });

      loadTodos();
    }

    // Todo 삭제
    async function deleteTodo(id) {
      if (!confirm('정말 삭제하시겠습니까?')) return;

      await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': API_KEY,
        },
      });

      loadTodos();
    }

    // 초기 로드
    loadTodos();
  </script>
</body>
</html>
```

## 10. 개선 사항

### 검색 기능 추가

**src/routes/todos.ts에 추가**
```typescript
// 검색
todos.get('/search', async (c) => {
  const query = c.req.query('q') || '';

  const { results } = await c.env.DB.prepare(`
    SELECT * FROM todos
    WHERE title LIKE ? OR description LIKE ?
    ORDER BY created_at DESC
  `).bind(`%${query}%`, `%${query}%`).all();

  return c.json(results as Todo[]);
});
```

### 통계 API

```typescript
// 통계
todos.get('/stats', async (c) => {
  const stats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending
    FROM todos
  `).first();

  return c.json(stats);
});
```

### Rate Limiting (KV 사용)

**wrangler.toml에 KV 추가**
```toml
[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "your-kv-id"
```

**src/middleware/rateLimit.ts**
```typescript
import { Context, Next } from 'hono';
import type { Env } from '../types/env';

export async function rateLimitMiddleware(
  c: Context<{ Bindings: Env & { RATE_LIMIT: KVNamespace } }>,
  next: Next
) {
  const ip = c.req.header('cf-connecting-ip') || 'unknown';
  const key = `rate_limit:${ip}`;

  const count = await c.env.RATE_LIMIT.get(key);
  const current = count ? parseInt(count) : 0;

  if (current >= 100) { // 분당 100 요청 제한
    return c.json({ error: 'Rate limit exceeded' }, 429);
  }

  await c.env.RATE_LIMIT.put(key, (current + 1).toString(), {
    expirationTtl: 60, // 1분
  });

  await next();
}
```

## 다음 단계

이제 완전한 REST API를 만들었습니다!

**더 배우기:**
- [D1 데이터베이스](./d1-database.md) - 고급 쿼리
- [KV 스토리지](./kv-storage.md) - 캐싱, Rate Limiting
- [R2 스토리지](./r2-storage.md) - 파일 업로드

**실전 프로젝트:**
- 인증 시스템 (JWT)
- 파일 업로드 (R2)
- 실시간 알림 (WebSocket)

## 참고 자료

- [Hono 공식 문서](https://hono.dev)
- [D1 공식 문서](https://developers.cloudflare.com/d1)
- [REST API 디자인 가이드](https://restfulapi.net)
