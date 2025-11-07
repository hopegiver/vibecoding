# 로깅과 모니터링

Workers 애플리케이션의 로그를 확인하고 문제를 빠르게 찾아내는 방법을 배워봅시다.

## 왜 로깅이 중요한가요?

로그를 통해 다음을 알 수 있습니다:
- 어떤 에러가 발생했는지
- API가 얼마나 빠른지
- 사용자가 어떻게 사용하는지
- 어디서 문제가 생겼는지

## 기본 로깅

### console.log 사용하기

가장 간단한 방법입니다.

**AI에게 요청:**
```
사용자 생성 API에 로그를 추가하고 싶어.

로그 내용:
- 요청 받음
- 사용자 생성 성공
- 생성된 사용자 정보

src/routes/users.ts를 수정해줘.
```

**Run 버튼 클릭!**

AI가 코드를 수정합니다:

```typescript
app.post('/api/users', async (c) => {
  console.log('POST /api/users - 사용자 생성 요청 받음');

  const { name, email } = await c.req.json();

  console.log('입력 데이터:', { name, email });

  const result = await c.env.DB.prepare(
    'INSERT INTO users (name, email) VALUES (?, ?)'
  ).bind(name, email).run();

  console.log('사용자 생성 성공:', {
    id: result.meta.last_row_id,
    name,
    email
  });

  return c.json({
    id: result.meta.last_row_id,
    name,
    email
  }, 201);
});
```

### 다양한 로그 레벨

```typescript
console.log('일반 정보');      // 정보
console.warn('경고 메시지');    // 경고
console.error('에러 발생!');    // 에러
console.debug('디버그 정보');   // 디버깅
```

## AI로 로컬 로그 확인하기

### 방법 1: 개발 서버에서 바로 보기

**AI에게 요청:**
```
로컬 서버를 실행해줘.
npm run dev
```

**Run 버튼 클릭!**

터미널에 로그가 실시간으로 표시됩니다:
```
[wrangler] POST /api/users - 사용자 생성 요청 받음
[wrangler] 입력 데이터: { name: 'Alice', email: 'alice@example.com' }
[wrangler] 사용자 생성 성공: { id: 1, name: 'Alice', email: 'alice@example.com' }
```

### 방법 2: wrangler tail로 실시간 모니터링

**AI에게 요청:**
```
배포된 Workers의 로그를 실시간으로 보고 싶어.
wrangler tail 실행해줘.
```

**Run 버튼 클릭!**

```bash
wrangler tail
```

실시간 로그가 표시됩니다:
```
GET https://my-api.workers.dev/api/users 200 OK
POST /api/users - 사용자 생성 요청 받음
사용자 생성 성공: { id: 5, name: 'Bob' }
```

**특정 환경의 로그 보기:**
```bash
# 스테이징 환경
wrangler tail --env staging

# 프로덕션 환경
wrangler tail --env production
```

## 구조화된 로깅

### 로깅 헬퍼 함수 만들기

**AI에게 요청:**
```
구조화된 로깅 헬퍼 함수를 만들어줘.

src/utils/logger.ts 파일을 만들어서:
- 로그 레벨 (info, warn, error, debug)
- 타임스탬프 자동 추가
- JSON 형식으로 출력
- 요청 ID 추가

사용하기 쉽게 만들어줘.
```

**Run 버튼 클릭!**

AI가 파일을 생성합니다:

**src/utils/logger.ts:**
```typescript
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogContext {
  requestId?: string;
  userId?: string;
  [key: string]: any;
}

export class Logger {
  constructor(private context: LogContext = {}) {}

  private log(level: LogLevel, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...(data && { data })
    };

    const logFn = level === 'error' ? console.error :
                  level === 'warn' ? console.warn :
                  console.log;

    logFn(JSON.stringify(logEntry));
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  // 새로운 컨텍스트로 Logger 생성
  child(context: LogContext) {
    return new Logger({ ...this.context, ...context });
  }
}
```

### 로거 사용하기

**AI에게 요청:**
```
방금 만든 Logger를 사용하도록 users API를 수정해줘.
각 요청마다 고유한 requestId를 생성해서 추가해줘.
```

**Run 버튼 클릭!**

```typescript
import { Logger } from '../utils/logger';

app.post('/api/users', async (c) => {
  // 요청마다 고유 ID 생성
  const requestId = crypto.randomUUID();
  const logger = new Logger({ requestId });

  logger.info('사용자 생성 요청 받음');

  try {
    const { name, email } = await c.req.json();

    logger.debug('입력 데이터 검증', { name, email });

    const result = await c.env.DB.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?)'
    ).bind(name, email).run();

    const userId = result.meta.last_row_id;

    logger.info('사용자 생성 성공', {
      userId,
      name,
      email
    });

    return c.json({ id: userId, name, email }, 201);

  } catch (error) {
    logger.error('사용자 생성 실패', {
      error: error.message,
      stack: error.stack
    });

    return c.json({ error: '사용자 생성 중 오류 발생' }, 500);
  }
});
```

**출력 예시:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "사용자 생성 요청 받음",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
{
  "timestamp": "2024-01-15T10:30:00.123Z",
  "level": "info",
  "message": "사용자 생성 성공",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "userId": 5,
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

## 에러 로깅

### 에러 핸들러 미들웨어

**AI에게 요청:**
```
모든 에러를 자동으로 로깅하는 미들웨어를 만들어줘.

src/middleware/errorLogger.ts 파일에:
- 모든 에러를 catch
- 에러 정보 로깅 (메시지, 스택, 요청 정보)
- 에러 응답 반환

Hono 미들웨어로 만들어줘.
```

**Run 버튼 클릭!**

**src/middleware/errorLogger.ts:**
```typescript
import { Context, Next } from 'hono';
import { Logger } from '../utils/logger';

export const errorLogger = async (c: Context, next: Next) => {
  const requestId = crypto.randomUUID();
  const logger = new Logger({ requestId });

  // 요청 정보 로깅
  logger.info('요청 시작', {
    method: c.req.method,
    path: c.req.path,
    userAgent: c.req.header('user-agent')
  });

  const startTime = Date.now();

  try {
    await next();

    // 응답 시간 로깅
    const duration = Date.now() - startTime;
    logger.info('요청 완료', {
      status: c.res.status,
      duration: `${duration}ms`
    });

  } catch (error) {
    const duration = Date.now() - startTime;

    // 에러 로깅
    logger.error('요청 처리 중 에러 발생', {
      error: error.message,
      stack: error.stack,
      method: c.req.method,
      path: c.req.path,
      duration: `${duration}ms`
    });

    // 에러 응답
    return c.json({
      error: '서버 오류가 발생했습니다',
      requestId  // 사용자에게 requestId 제공 (지원팀에 문의 시 사용)
    }, 500);
  }
};
```

**사용하기:**

**AI에게 요청:**
```
index.ts에 errorLogger 미들웨어를 추가해줘.
모든 요청에 적용되게.
```

**Run 버튼 클릭!**

```typescript
import { Hono } from 'hono';
import { errorLogger } from './middleware/errorLogger';

const app = new Hono();

// 에러 로거 미들웨어 추가
app.use('*', errorLogger);

// 라우트들...
app.get('/api/users', async (c) => {
  // ...
});
```

## Cloudflare 대시보드에서 로그 보기

### 1. 대시보드 접속

1. [dash.cloudflare.com](https://dash.cloudflare.com) 접속
2. 로그인
3. **Workers & Pages** 클릭
4. 내 Worker 선택

### 2. 로그 탭 확인

**"Logs" 탭 클릭**

실시간 로그 스트림이 표시됩니다:
```
2024-01-15 10:30:00 - INFO - 요청 시작
2024-01-15 10:30:01 - INFO - 사용자 생성 성공
2024-01-15 10:30:02 - ERROR - 데이터베이스 연결 실패
```

### 3. 로그 필터링

- **레벨로 필터:** 에러만 보기
- **시간 범위:** 최근 1시간, 24시간
- **검색:** 특정 키워드 찾기

## 성능 모니터링

### 응답 시간 측정

**AI에게 요청:**
```
API 응답 시간을 측정하는 미들웨어를 만들어줘.

측정할 것:
- 전체 요청 처리 시간
- 데이터베이스 쿼리 시간
- 외부 API 호출 시간

느린 요청은 경고 로그 출력.
```

**Run 버튼 클릭!**

```typescript
import { Context, Next } from 'hono';
import { Logger } from '../utils/logger';

export const performanceMonitor = async (c: Context, next: Next) => {
  const logger = new Logger({
    path: c.req.path,
    method: c.req.method
  });

  const startTime = Date.now();

  await next();

  const duration = Date.now() - startTime;
  const status = c.res.status;

  // 성능 로그
  const logData = {
    status,
    duration: `${duration}ms`
  };

  // 느린 요청 경고 (500ms 이상)
  if (duration > 500) {
    logger.warn('느린 요청 감지', logData);
  } else {
    logger.info('요청 완료', logData);
  }
};
```

### 데이터베이스 쿼리 시간 로깅

```typescript
app.get('/api/users', async (c) => {
  const logger = new Logger();

  // 쿼리 시작
  const queryStart = Date.now();

  const result = await c.env.DB.prepare(
    'SELECT * FROM users'
  ).all();

  // 쿼리 시간 측정
  const queryDuration = Date.now() - queryStart;

  logger.info('DB 쿼리 완료', {
    query: 'SELECT users',
    duration: `${queryDuration}ms`,
    rowCount: result.results.length
  });

  // 느린 쿼리 경고
  if (queryDuration > 100) {
    logger.warn('느린 쿼리 감지', {
      query: 'SELECT users',
      duration: `${queryDuration}ms`
    });
  }

  return c.json(result.results);
});
```

## 실전 예제

### 예제 1: API 에러 추적

**상황:** 사용자가 "500 에러가 났어요"라고 신고

**AI에게 요청:**
```
최근 1시간의 에러 로그를 확인하고 싶어.
wrangler tail 실행하되 에러만 필터링해줘.
```

**Run 버튼 클릭!**

```bash
wrangler tail --format pretty | grep ERROR
```

**출력:**
```json
{
  "timestamp": "2024-01-15T10:25:30.000Z",
  "level": "error",
  "message": "사용자 생성 실패",
  "requestId": "abc-123",
  "data": {
    "error": "UNIQUE constraint failed: users.email",
    "email": "duplicate@example.com"
  }
}
```

**문제 발견:** 중복 이메일 에러!

### 예제 2: 느린 API 찾기

**AI에게 요청:**
```
느린 요청만 로그에 남기도록 수정해줘.
500ms 이상 걸리는 요청만.
```

**Run 버튼 클릭!**

로그를 확인하면:
```json
{
  "level": "warn",
  "message": "느린 요청 감지",
  "path": "/api/posts",
  "duration": "1250ms"
}
```

**해결:** `/api/posts` API를 최적화해야 함

### 예제 3: 사용자 행동 분석

**AI에게 요청:**
```
사용자가 어떤 API를 가장 많이 사용하는지 로깅하고 싶어.
각 엔드포인트마다 호출 횟수를 로그에 기록해줘.
```

**Run 버튼 클릭!**

```typescript
// 간단한 카운터 (KV 사용)
app.use('*', async (c, next) => {
  const path = c.req.path;
  const key = `api_calls:${path}`;

  // 호출 횟수 증가
  const count = await c.env.MY_KV.get(key) || '0';
  await c.env.MY_KV.put(key, (parseInt(count) + 1).toString());

  await next();
});

// 통계 확인 엔드포인트
app.get('/api/stats', async (c) => {
  const logger = new Logger();

  const keys = await c.env.MY_KV.list({ prefix: 'api_calls:' });
  const stats = {};

  for (const key of keys.keys) {
    const count = await c.env.MY_KV.get(key.name);
    const path = key.name.replace('api_calls:', '');
    stats[path] = parseInt(count);
  }

  logger.info('API 사용 통계 조회', stats);

  return c.json(stats);
});
```

## 로그 레벨 관리

### 환경별 로그 레벨 설정

**AI에게 요청:**
```
환경별로 로그 레벨을 다르게 설정하고 싶어.

- 개발: debug 레벨 (모든 로그)
- 스테이징: info 레벨
- 프로덕션: warn 레벨 (경고와 에러만)

wrangler.toml과 logger.ts를 수정해줘.
```

**Run 버튼 클릭!**

**wrangler.toml:**
```toml
# 프로덕션
[vars]
LOG_LEVEL = "warn"

# 스테이징
[env.staging]
vars = { LOG_LEVEL = "info" }

# 개발
[env.development]
vars = { LOG_LEVEL = "debug" }
```

**src/utils/logger.ts:**
```typescript
export class Logger {
  constructor(
    private context: LogContext = {},
    private minLevel: LogLevel = 'info'
  ) {}

  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const minIndex = levels.indexOf(this.minLevel);
    const currentIndex = levels.indexOf(level);
    return currentIndex >= minIndex;
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (!this.shouldLog(level)) return;

    // 로그 출력...
  }
}

// 사용 예시
const logLevel = c.env.LOG_LEVEL as LogLevel || 'info';
const logger = new Logger({}, logLevel);
```

## 민감 정보 보호

### Secret을 로그에 남기지 않기

**AI에게 요청:**
```
로그에서 민감 정보를 자동으로 가리는 함수를 만들어줘.

가려야 할 정보:
- API 키
- 비밀번호
- 이메일 일부
- 전화번호

logger.ts에 추가해줘.
```

**Run 버튼 클릭!**

```typescript
function sanitize(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = Array.isArray(data) ? [] : {};
  const sensitiveKeys = ['password', 'apiKey', 'secret', 'token', 'authorization'];

  for (const [key, value] of Object.entries(data)) {
    const keyLower = key.toLowerCase();

    // 민감 키는 가리기
    if (sensitiveKeys.some(k => keyLower.includes(k))) {
      sanitized[key] = '***REDACTED***';
    }
    // 이메일은 앞부분만
    else if (typeof value === 'string' && value.includes('@')) {
      const [local, domain] = value.split('@');
      sanitized[key] = `${local.slice(0, 2)}***@${domain}`;
    }
    // 객체는 재귀적으로 처리
    else if (typeof value === 'object') {
      sanitized[key] = sanitize(value);
    }
    else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export class Logger {
  private log(level: LogLevel, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...(data && { data: sanitize(data) })  // 민감 정보 제거
    };

    console.log(JSON.stringify(logEntry));
  }
}
```

**사용 예시:**
```typescript
logger.info('사용자 로그인', {
  email: 'alice@example.com',
  password: 'secret123',
  apiKey: 'sk-abc123...'
});

// 출력:
// {
//   "email": "al***@example.com",
//   "password": "***REDACTED***",
//   "apiKey": "***REDACTED***"
// }
```

## 모니터링 체크리스트

배포 전에 확인하세요:

- [ ] 모든 API에 로깅 추가됨
- [ ] 에러 핸들러에 로깅 포함
- [ ] 성능 로깅 (응답 시간) 추가
- [ ] 민감 정보 보호 확인
- [ ] 로그 레벨 환경별로 설정
- [ ] requestId로 요청 추적 가능
- [ ] wrangler tail로 로그 확인 가능

## 다음 단계

로깅과 모니터링을 마스터했습니다! 이제:

- **[환경 변수와 Secrets](./workers-env-secrets.md)** - 안전한 설정 관리
- **[테스트 작성하기](./workers-testing.md)** - 자동화된 테스트
- **[실전: REST API 만들기](./workers-rest-api.md)** - 완전한 API 구축

## 참고 자료

- [Wrangler Tail 문서](https://developers.cloudflare.com/workers/wrangler/commands/#tail)
- [Workers Analytics](https://developers.cloudflare.com/workers/observability/analytics/)
- [로깅 모범 사례](https://developers.cloudflare.com/workers/observability/logging/)
