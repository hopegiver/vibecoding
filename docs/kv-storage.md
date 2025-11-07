# KV 스토리지로 데이터 저장하기

Cloudflare Workers KV는 간단하면서도 강력한 키-값 저장소입니다.

## AI로 KV 스토리지 시작하기

복잡한 설정은 AI에게 맡기세요! Run 버튼만 클릭하면 됩니다.

### 1. KV 네임스페이스 만들기

**AI에게 요청:**
```
Cloudflare KV 네임스페이스를 만들고 싶어.
wrangler kv:namespace create 명령어를 실행해줘.
네임스페이스 이름은 MY_DATA로 해줘.
```

**AI가 제안하는 명령어:**
```bash
wrangler kv:namespace create MY_DATA
```

**Run 버튼 클릭!**

터미널에 네임스페이스 ID가 표시됩니다:
```
{ binding = "MY_DATA", id = "abcdef123456" }
```

### 2. Workers에 KV 바인딩

**AI에게 요청:**
```
방금 만든 KV 네임스페이스를 Workers에 연결해줘.
wrangler.toml에 바인딩을 추가하고,
TypeScript 타입도 정의해줘.
```

**AI가 수정한 파일들:**

**wrangler.toml:**
```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "abcdef123456"
```

**src/types/env.ts:**
```typescript
export type Env = {
  MY_KV: KVNamespace;
};
```

### 3. KV 사용하는 API 만들기

**AI에게 요청:**
```
KV 스토리지를 사용하는 간단한 API를 만들어줘.

기능:
- POST /api/save : 데이터 저장
- GET /api/get : 데이터 조회
- DELETE /api/delete : 데이터 삭제
- GET /api/list : 모든 키 목록

JSON 형식으로 데이터를 저장하고 읽어줘.
```

**Run 버튼 클릭!**

AI가 완전한 API 코드를 생성합니다.

## KV란?

### 기본 개념

**KV (Key-Value)**: 키와 값으로 데이터를 저장
```
key: "user_123"
value: {"name": "홍길동", "email": "hong@example.com"}
```

### 특징

✅ **장점:**
- 영구 저장 (재배포해도 유지)
- 전 세계 빠른 읽기 속도
- 간단한 사용법
- 무료 플랜 관대함

⚠️ **제한사항:**
- 값 하나당 최대 25MB
- 쓰기는 느릴 수 있음 (읽기 최적화)
- 복잡한 쿼리 불가

### JSON 파일 vs KV

| 기능 | JSON 파일 | KV 스토리지 |
|------|-----------|------------|
| 영구 저장 | ❌ 재배포 시 초기화 | ✅ 영구 보관 |
| 속도 | 보통 | 매우 빠름 |
| 동시 수정 | ❌ 충돌 가능 | ✅ 안전 |
| 설정 | 불필요 | 약간의 설정 필요 |
| 적합한 용도 | 테스트, 프로토타입 | 실제 서비스 |

## 무료 플랜 한도

```
무료로 제공:
- 100,000 읽기/일
- 1,000 쓰기/일
- 1GB 저장 용량

대부분의 프로젝트에 충분!
```

## KV 네임스페이스 만들기

### 1단계: Cloudflare 대시보드 접속

1. https://dash.cloudflare.com 로그인
2. 왼쪽 메뉴에서 "Workers & Pages" 클릭
3. "KV" 탭 선택

### 2단계: 네임스페이스 생성

1. "Create a namespace" 클릭
2. 네임스페이스 이름 입력 (예: `MY_DATA`)
3. "Add" 클릭

**네임스페이스**: KV 저장소의 컨테이너. 프로젝트별로 분리해서 사용

### 3단계: Pages에 KV 바인딩

#### 방법 A: 대시보드에서 설정

1. "Workers & Pages" > 프로젝트 선택
2. "Settings" 탭
3. "Functions" 섹션
4. "KV namespace bindings" 찾기
5. "Add binding" 클릭
6. 설정:
   ```
   Variable name: MY_KV
   KV namespace: MY_DATA
   ```
7. "Save" 클릭

#### 방법 B: wrangler.toml 파일

프로젝트 루트에 `wrangler.toml` 생성:

```toml
name = "my-project"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "MY_KV"
id = "여기에_KV_네임스페이스_ID"
```

KV 네임스페이스 ID는 대시보드의 KV 목록에서 확인 가능

## Workers + Hono에서 KV 사용하기

### 설정

**wrangler.toml**
```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-namespace-id"
```

**타입 정의**
```typescript
// src/types/env.ts
export type Env = {
  MY_KV: KVNamespace;
};
```

### 기본 작업

**src/index.ts**
```typescript
import { Hono } from 'hono';
import type { Env } from './types/env';

const app = new Hono<{ Bindings: Env }>();

// 1. 값 저장 (PUT)
app.post('/api/save', async (c) => {
  const body = await c.req.json();
  await c.env.MY_KV.put('myKey', JSON.stringify(body));

  return c.json({ success: true });
});

// 2. 값 읽기 (GET)
app.get('/api/get', async (c) => {
  const value = await c.env.MY_KV.get('myKey', { type: 'json' });
  return c.json(value);
});

// 3. 값 삭제 (DELETE)
app.delete('/api/delete', async (c) => {
  await c.env.MY_KV.delete('myKey');
  return c.json({ success: true });
});

// 4. 키 목록 조회 (LIST)
app.get('/api/list', async (c) => {
  const { keys } = await c.env.MY_KV.list();
  return c.json(keys);
});

export default app;
```

## Pages Functions에서 KV 사용하기

Functions에서도 KV를 사용할 수 있습니다 (초보자 추천).

### 기본 작업

#### 1. 값 저장 (PUT)

```javascript
// functions/api/save.js
export async function onRequestPost(context) {
    const { MY_KV } = context.env;
    const body = await context.request.json();

    // KV에 저장
    await MY_KV.put('myKey', JSON.stringify(body));

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
```

#### 2. 값 읽기 (GET)

```javascript
// functions/api/get.js
export async function onRequestGet(context) {
    const { MY_KV } = context.env;

    // KV에서 읽기
    const value = await MY_KV.get('myKey', { type: 'json' });

    return new Response(JSON.stringify(value), {
        headers: { 'Content-Type': 'application/json' }
    });
}
```

#### 3. 값 삭제 (DELETE)

```javascript
// functions/api/delete.js
export async function onRequestDelete(context) {
    const { MY_KV } = context.env;

    await MY_KV.delete('myKey');

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
```

#### 4. 키 목록 조회 (LIST)

```javascript
// functions/api/list.js
export async function onRequestGet(context) {
    const { MY_KV } = context.env;

    // 모든 키 목록
    const { keys } = await MY_KV.list();

    return new Response(JSON.stringify(keys), {
        headers: { 'Content-Type': 'application/json' }
    });
}
```

## 실전 예제: 댓글 시스템

### Workers + Hono 버전

**src/routes/comments.ts**
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from '../types/env';

const comments = new Hono<{ Bindings: Env }>();

// CORS 설정
comments.use('*', cors());

// 댓글 목록 조회
comments.get('/', async (c) => {
  const list = await c.env.MY_KV.get('comments', { type: 'json' }) || [];
  return c.json(list);
});

// 댓글 추가
comments.post('/', async (c) => {
  const { author, content } = await c.req.json();

  if (!author || !content) {
    return c.json({ error: 'Author and content are required' }, 400);
  }

  // 기존 댓글 가져오기
  let list = await c.env.MY_KV.get('comments', { type: 'json' }) || [];

  // 새 댓글 추가
  const newComment = {
    id: Date.now(),
    author,
    content,
    timestamp: new Date().toISOString()
  };
  list.unshift(newComment);

  // KV에 저장
  await c.env.MY_KV.put('comments', JSON.stringify(list));

  return c.json({ success: true, comment: newComment });
});

// 댓글 삭제
comments.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  let list = await c.env.MY_KV.get('comments', { type: 'json' }) || [];
  list = list.filter((comment: any) => comment.id !== id);

  await c.env.MY_KV.put('comments', JSON.stringify(list));

  return c.json({ success: true });
});

export default comments;
```

**src/index.ts**
```typescript
import { Hono } from 'hono';
import comments from './routes/comments';
import type { Env } from './types/env';

const app = new Hono<{ Bindings: Env }>();

app.route('/api/comments', comments);

export default app;
```

### Pages Functions 버전

Cursor에게 요청:
```
KV 스토리지를 사용하는 댓글 시스템 만들어줘.

KV 네임스페이스: MY_KV (이미 바인딩됨)

기능:
1. functions/api/comments/list.js
   - GET 요청
   - KV에서 "comments" 키로 저장된 댓글 목록 반환
   - 없으면 빈 배열 반환

2. functions/api/comments/add.js
   - POST 요청
   - body: { author, content }
   - 기존 댓글 목록 가져오기
   - 새 댓글 추가 (id, timestamp 자동 생성)
   - KV에 다시 저장
   - 새 댓글 반환

3. index.html
   - 댓글 목록 표시
   - 댓글 작성 폼
   - 실시간 업데이트

CORS 헤더 포함해줘.
```

### 예상 코드 (Pages Functions)

#### functions/api/comments/list.js
```javascript
export async function onRequestGet(context) {
    const { MY_KV } = context.env;

    try {
        // KV에서 댓글 목록 가져오기
        const comments = await MY_KV.get('comments', { type: 'json' }) || [];

        return new Response(JSON.stringify(comments), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
```

#### functions/api/comments/add.js
```javascript
export async function onRequestPost(context) {
    const { MY_KV } = context.env;

    try {
        const body = await context.request.json();
        const { author, content } = body;

        // 유효성 검사
        if (!author || !content) {
            return new Response(JSON.stringify({
                error: 'Author and content are required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 기존 댓글 가져오기
        let comments = await MY_KV.get('comments', { type: 'json' }) || [];

        // 새 댓글 추가
        const newComment = {
            id: Date.now(),
            author,
            content,
            timestamp: new Date().toISOString()
        };
        comments.unshift(newComment); // 최신 순

        // KV에 저장
        await MY_KV.put('comments', JSON.stringify(comments));

        return new Response(JSON.stringify({
            success: true,
            comment: newComment
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
```

## 고급 기능

### 만료 시간 설정 (TTL)

```javascript
// 1시간 후 자동 삭제
await MY_KV.put('tempKey', 'value', {
    expirationTtl: 3600  // 초 단위
});

// 특정 시간에 자동 삭제
const expirationTime = Math.floor(Date.now() / 1000) + 3600;
await MY_KV.put('tempKey', 'value', {
    expiration: expirationTime
});
```

**사용 예시:**
- 임시 인증 토큰
- 세션 데이터
- 캐시 데이터

### 메타데이터 저장

```javascript
// 메타데이터와 함께 저장
await MY_KV.put('user_123', JSON.stringify(userData), {
    metadata: {
        created: new Date().toISOString(),
        type: 'user'
    }
});

// 메타데이터와 함께 읽기
const { value, metadata } = await MY_KV.getWithMetadata('user_123', { type: 'json' });
console.log(metadata); // { created: "...", type: "user" }
```

### 키 prefix로 필터링

```javascript
// "user_"로 시작하는 키만 조회
const { keys } = await MY_KV.list({ prefix: 'user_' });

// 결과: ["user_123", "user_456", ...]
```

### 페이지네이션

```javascript
// 한 번에 10개씩
const { keys, cursor } = await MY_KV.list({ limit: 10 });

// 다음 페이지
if (cursor) {
    const nextPage = await MY_KV.list({ cursor });
}
```

## 실전 프로젝트 예제

### 예제 1: 조회수 카운터

Cursor에게 요청:
```
페이지 조회수 카운터 만들어줘.

functions/api/views.js:
- GET: 현재 조회수 반환
- POST: 조회수 1 증가

KV에 "page_views" 키로 숫자 저장.
초기값 0.
```

### 예제 2: 좋아요 시스템

Cursor에게 요청:
```
게시물 좋아요 시스템 만들어줘.

functions/api/likes/[postId].js:
- GET: 해당 게시물의 좋아요 수 반환
- POST: 좋아요 1 증가

KV에 "likes_postId" 형식으로 저장.
예: "likes_post1", "likes_post2"
```

### 예제 3: 간단한 설문조사

Cursor에게 요청:
```
설문조사 시스템 만들어줘.

질문: "좋아하는 과일은?"
선택지: 사과, 바나나, 오렌지

functions/api/vote.js:
- GET: 각 선택지의 투표 수 반환
- POST: 선택한 항목에 투표

KV에 각 선택지별로 저장:
- "vote_apple"
- "vote_banana"
- "vote_orange"

index.html에서 실시간 결과 그래프로 표시.
```

## 로컬 테스트

### 로컬 KV 시뮬레이션

```bash
# .dev.vars 파일 생성
MY_KV=local_kv_for_development

# 로컬 서버 실행
npx wrangler pages dev . --kv MY_KV
```

로컬에서는 임시 KV를 사용 (재시작 시 초기화)

### 실제 KV로 테스트

```bash
# 프로덕션 KV 사용
npx wrangler pages dev . --kv MY_KV=실제_KV_ID
```

## 모범 사례

### 1. 키 네이밍 규칙

```javascript
// ✅ 좋은 예
"user:123"
"post:456:comments"
"cache:homepage:20240115"

// ❌ 나쁜 예
"123"
"data"
"temp"
```

### 2. 에러 처리

```javascript
export async function onRequest(context) {
    const { MY_KV } = context.env;

    try {
        const data = await MY_KV.get('key', { type: 'json' });

        if (data === null) {
            // 키가 없는 경우
            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        // KV 오류
        return new Response(JSON.stringify({ error: 'Internal error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
```

### 3. 동시성 문제 해결

```javascript
// 카운터 증가 (안전한 방법)
async function incrementCounter(kv, key) {
    let retries = 3;
    while (retries > 0) {
        try {
            const current = await kv.get(key) || '0';
            const newValue = (parseInt(current) + 1).toString();
            await kv.put(key, newValue);
            return newValue;
        } catch (error) {
            retries--;
            if (retries === 0) throw error;
            // 잠시 대기 후 재시도
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}
```

## 비용 관리

### 무료 한도 확인

대시보드에서 확인:
1. "Workers & Pages"
2. "KV"
3. 사용량 그래프 확인

### 비용 절감 팁

1. **캐싱 활용**
```javascript
// 자주 읽는 데이터는 메모리 캐시
let cache = null;
let cacheTime = 0;

export async function onRequestGet(context) {
    const now = Date.now();

    // 1분 동안 캐시 유지
    if (cache && now - cacheTime < 60000) {
        return new Response(JSON.stringify(cache), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // KV에서 읽기
    cache = await context.env.MY_KV.get('data', { type: 'json' });
    cacheTime = now;

    return new Response(JSON.stringify(cache), {
        headers: { 'Content-Type': 'application/json' }
    });
}
```

2. **배치 작업**
```javascript
// 여러 데이터를 하나의 키에 저장
const batch = {
    user1: userData1,
    user2: userData2,
    user3: userData3
};
await MY_KV.put('users:batch1', JSON.stringify(batch));
```

## 문제 해결

### KV가 비어있어요

```javascript
// 초기 데이터 설정
export async function onRequestGet(context) {
    const { MY_KV } = context.env;

    let data = await MY_KV.get('myData', { type: 'json' });

    if (!data) {
        // 초기 데이터 생성
        data = [];
        await MY_KV.put('myData', JSON.stringify(data));
    }

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}
```

### KV 바인딩 오류

```
Error: KV binding MY_KV not found
```

**해결:**
1. Pages 설정에서 KV 바인딩 확인
2. Variable name 정확히 입력했는지 확인
3. 재배포 필요

### 데이터가 갱신 안 돼요

KV는 **최종 일관성 (Eventually Consistent)**:
- 쓰기 후 전 세계 반영까지 약간의 지연
- 보통 몇 초 이내
- 급한 경우 응답에 최신 값 포함

## 다음 단계

이제 KV 스토리지 사용법을 마스터했습니다!

**더 배우기:**
- [Workers 기초](./workers-basics.md) - Workers에서 KV 사용
- [실전 프로젝트](./project-company-intro.md) - KV 적용해보기

**연습 과제:**

Cursor에게 요청해보세요:
```
방명록 만들어줘.

기능:
- 이름, 메시지 작성
- 작성 시간 자동 기록
- 최신 20개만 표시
- 전체 개수 표시

KV 스토리지 사용.
디자인 예쁘게.
```
