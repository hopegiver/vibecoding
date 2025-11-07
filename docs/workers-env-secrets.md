# 환경 변수와 Secrets 관리

API 키, 데이터베이스 연결 정보 같은 민감한 정보를 안전하게 관리하는 방법을 배워봅시다.

## 왜 환경 변수가 필요한가요?

코드에 직접 넣으면 안 되는 정보들:
- API 키 (OpenAI, Google Maps 등)
- 데이터베이스 비밀번호
- JWT 시크릿 키
- 외부 서비스 인증 정보

**나쁜 예시 (절대 이렇게 하지 마세요!):**
```typescript
// ❌ 코드에 직접 작성 - 위험!
const openaiKey = 'sk-abc123...';
const jwtSecret = 'my-secret-key';
```

**이렇게 하면:**
- GitHub에 올리면 누구나 볼 수 있음
- 해킹 위험
- 키를 바꾸려면 코드를 수정해야 함

## 환경 변수 vs Secrets

### 환경 변수 (일반 정보)
- 공개되어도 괜찮은 설정 값
- 예: API URL, 기본 설정값
- `wrangler.toml`에 저장

### Secrets (민감 정보)
- 절대 공개되면 안 되는 정보
- 예: API 키, 비밀번호
- Cloudflare에만 저장 (코드에 없음)

## AI로 환경 변수 설정하기

### 1. 일반 환경 변수 추가

공개되어도 괜찮은 설정 값을 추가합니다.

**AI에게 요청:**
```
wrangler.toml에 환경 변수를 추가하고 싶어.

변수:
- API_BASE_URL = "https://api.example.com"
- MAX_RETRIES = "3"
- LOG_LEVEL = "info"

TypeScript 타입도 정의해줘.
```

**Run 버튼 클릭!**

AI가 자동으로 파일을 수정합니다.

**wrangler.toml:**
```toml
[vars]
API_BASE_URL = "https://api.example.com"
MAX_RETRIES = "3"
LOG_LEVEL = "info"
```

**src/types/env.ts:**
```typescript
export type Env = {
  API_BASE_URL: string;
  MAX_RETRIES: string;
  LOG_LEVEL: string;

  // 기존 바인딩들...
  DB: D1Database;
  MY_KV: KVNamespace;
};
```

**코드에서 사용:**
```typescript
app.get('/api/data', async (c) => {
  const apiUrl = c.env.API_BASE_URL;
  const maxRetries = parseInt(c.env.MAX_RETRIES);

  return c.json({ apiUrl, maxRetries });
});
```

### 2. Secrets 추가하기

민감한 정보는 `wrangler secret` 명령어로 추가합니다.

#### 2-1. 프로덕션 Secret 추가

**AI에게 요청:**
```
Cloudflare Workers에 Secret을 추가하고 싶어.

Secret 이름: OPENAI_API_KEY

wrangler secret put 명령어 실행해줘.
```

**Run 버튼 클릭!**

AI가 명령어를 제안합니다:
```bash
wrangler secret put OPENAI_API_KEY
```

터미널에 메시지가 나타납니다:
```
Enter a secret value:
```

**실제 API 키를 입력** → Enter

```
✅ Success! Uploaded secret OPENAI_API_KEY
```

완료!

#### 2-2. TypeScript 타입 정의

**AI에게 요청:**
```
OPENAI_API_KEY Secret의 TypeScript 타입을 정의해줘.
src/types/env.ts를 수정해줘.
```

**Run 버튼 클릭!**

**src/types/env.ts:**
```typescript
export type Env = {
  // Secrets
  OPENAI_API_KEY: string;
  JWT_SECRET: string;

  // 환경 변수
  API_BASE_URL: string;

  // 바인딩
  DB: D1Database;
  MY_KV: KVNamespace;
};
```

#### 2-3. 코드에서 사용

**AI에게 요청:**
```
OpenAI API를 호출하는 엔드포인트를 만들어줘.
OPENAI_API_KEY Secret을 사용해서.
```

**Run 버튼 클릭!**

AI가 코드를 생성합니다:

```typescript
app.post('/api/chat', async (c) => {
  const { message } = await c.req.json();

  // Secret 사용
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  return c.json(data);
});
```

## 로컬 개발용 환경 변수

로컬에서 개발할 때는 `.dev.vars` 파일을 사용합니다.

### 1. .dev.vars 파일 만들기

**AI에게 요청:**
```
로컬 개발용 .dev.vars 파일을 만들어줘.

필요한 Secrets:
- OPENAI_API_KEY
- JWT_SECRET
- DATABASE_URL

그리고 .gitignore에 .dev.vars를 추가해서
GitHub에 올라가지 않게 해줘.
```

**Run 버튼 클릭!**

AI가 파일을 생성합니다.

**.dev.vars:**
```bash
# 로컬 개발용 환경 변수
OPENAI_API_KEY=sk-test-key-for-local-development
JWT_SECRET=local-jwt-secret-key
DATABASE_URL=http://localhost:8787
```

**.gitignore:**
```
# 환경 변수 파일 (절대 GitHub에 올리지 말것!)
.dev.vars
.env
.env.local
```

### 2. 로컬에서 테스트

**AI에게 요청:**
```
로컬 서버를 실행해줘.
```

**Run 버튼 클릭!**

```bash
npm run dev
```

`.dev.vars`의 값들이 자동으로 로드됩니다!

```
⎔ Starting local server...
⎔ Loaded .dev.vars file
✅ Ready on http://localhost:8787
```

## 실전 예제: 전체 워크플로우

### 예제 1: OpenAI API 키 설정

**1단계: 로컬 개발용 키 설정**

**AI에게 요청:**
```
.dev.vars 파일을 만들고
OPENAI_API_KEY를 추가해줘.
```

AI가 `.dev.vars` 파일을 생성합니다.

**직접 작업:** 파일을 열고 실제 API 키를 입력
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**2단계: TypeScript 타입 정의**

**AI에게 요청:**
```
OPENAI_API_KEY의 TypeScript 타입을 정의해줘.
```

**3단계: 프로덕션 Secret 추가**

**AI에게 요청:**
```
wrangler secret put OPENAI_API_KEY 실행해줘.
```

터미널에서 실제 프로덕션 API 키 입력

**4단계: 코드에서 사용**

**AI에게 요청:**
```
OpenAI API를 사용하는 챗봇 엔드포인트를 만들어줘.
```

완료! 로컬과 프로덕션 모두에서 작동합니다.

### 예제 2: JWT 인증 시스템

**AI에게 요청:**
```
JWT 인증 시스템을 만들고 싶어.

1. .dev.vars에 JWT_SECRET 추가
2. 프로덕션에 JWT_SECRET Secret 추가
3. TypeScript 타입 정의
4. JWT 토큰 생성/검증 함수 구현

각 단계마다 명령어 제안해줘.
```

**Run 버튼 클릭!**

AI가 단계별로 진행합니다:

1. `.dev.vars` 생성
2. `wrangler secret put JWT_SECRET` 실행
3. TypeScript 타입 정의
4. JWT 인증 코드 생성

### 예제 3: 여러 환경 관리 (개발/스테이징/프로덕션)

**AI에게 요청:**
```
개발, 스테이징, 프로덕션 환경을 분리하고 싶어.

wrangler.toml에 환경별 설정을 추가해줘:
- production: 실제 서비스
- staging: 테스트 서버
- development: 로컬 개발

각 환경마다 다른 API_BASE_URL을 사용하게 해줘.
```

**Run 버튼 클릭!**

AI가 `wrangler.toml`을 수정합니다:

```toml
name = "my-api"

# 프로덕션 환경 (기본)
[vars]
API_BASE_URL = "https://api.myapp.com"
ENVIRONMENT = "production"

# 스테이징 환경
[env.staging]
name = "my-api-staging"
vars = { API_BASE_URL = "https://staging-api.myapp.com", ENVIRONMENT = "staging" }

# 개발 환경
[env.development]
name = "my-api-dev"
vars = { API_BASE_URL = "http://localhost:3000", ENVIRONMENT = "development" }
```

**배포 명령어:**
```bash
# 프로덕션 배포
wrangler deploy

# 스테이징 배포
wrangler deploy --env staging

# 개발 배포
wrangler deploy --env development
```

## Secret 관리하기

### Secret 목록 보기

**AI에게 요청:**
```
현재 설정된 Secret 목록을 보여줘.
wrangler secret list 실행해줘.
```

**Run 버튼 클릭!**

```bash
wrangler secret list
```

출력:
```
[
  {
    "name": "OPENAI_API_KEY",
    "type": "secret_text"
  },
  {
    "name": "JWT_SECRET",
    "type": "secret_text"
  }
]
```

### Secret 삭제하기

**AI에게 요청:**
```
OLD_API_KEY Secret을 삭제하고 싶어.
wrangler secret delete 실행해줘.
```

**Run 버튼 클릭!**

```bash
wrangler secret delete OLD_API_KEY
```

### Secret 값 변경하기

기존 Secret의 값을 변경하려면 다시 `put` 명령어를 사용합니다.

**AI에게 요청:**
```
OPENAI_API_KEY를 새 키로 변경하고 싶어.
wrangler secret put 실행해줘.
```

**Run 버튼 클릭!**

```bash
wrangler secret put OPENAI_API_KEY
```

새 API 키 입력 → Enter

## 보안 모범 사례

### ✅ 해야 할 것

1. **Secrets는 절대 코드에 넣지 않기**
```typescript
// ✅ 좋은 방법
const apiKey = c.env.OPENAI_API_KEY;

// ❌ 나쁜 방법
const apiKey = 'sk-abc123...';
```

2. **.dev.vars를 .gitignore에 추가**
```
# .gitignore
.dev.vars
.env
```

3. **TypeScript 타입 정의하기**
```typescript
export type Env = {
  OPENAI_API_KEY: string;  // Secret
  API_BASE_URL: string;    // 환경 변수
};
```

4. **로컬과 프로덕션 키 분리**
- `.dev.vars`: 테스트용 키
- Cloudflare Secret: 실제 프로덕션 키

### ❌ 하지 말아야 할 것

1. **GitHub에 Secret 올리기**
```bash
# ❌ 절대 커밋하지 마세요!
git add .dev.vars
git commit -m "환경 변수 추가"
```

2. **로그에 Secret 출력**
```typescript
// ❌ Secret이 로그에 노출됨
console.log('API Key:', c.env.OPENAI_API_KEY);

// ✅ 안전한 로그
console.log('API Key:', '***hidden***');
```

3. **클라이언트에 Secret 전송**
```typescript
// ❌ 프론트엔드로 전송하면 안 됨
return c.json({
  apiKey: c.env.OPENAI_API_KEY
});
```

## 문제 해결

### Secret이 인식되지 않아요

**증상:**
```
ReferenceError: OPENAI_API_KEY is not defined
```

**해결 방법:**

1. **TypeScript 타입 확인**

**AI에게 요청:**
```
src/types/env.ts에 OPENAI_API_KEY 타입이 있는지 확인해줘.
없으면 추가해줘.
```

2. **프로덕션 Secret 확인**

**AI에게 요청:**
```
wrangler secret list 실행해서
OPENAI_API_KEY가 있는지 확인해줘.
```

3. **로컬 .dev.vars 확인**

`.dev.vars` 파일이 있고, 올바른 형식인지 확인:
```bash
OPENAI_API_KEY=your-key-here
```

### .dev.vars가 로드되지 않아요

**해결 방법:**

**AI에게 요청:**
```
로컬 서버를 재시작해줘.
npm run dev 실행해줘.
```

출력에서 확인:
```
✅ Loaded .dev.vars file  ← 이 메시지가 보여야 함
```

### GitHub에 Secret을 올렸어요!

**긴급 조치:**

1. **즉시 API 키 변경**
   - OpenAI, Google 등 서비스에서 키를 즉시 취소
   - 새 키 발급

2. **GitHub에서 제거**

**AI에게 요청:**
```
.dev.vars 파일을 GitHub 히스토리에서 완전히 제거하고 싶어.

1. .gitignore에 .dev.vars 추가
2. Git 히스토리에서 .dev.vars 제거
3. 강제 푸시

명령어 제안해줘.
```

## 환경 변수 체크리스트

배포 전에 확인하세요:

- [ ] 모든 Secret이 `wrangler secret put`으로 추가됨
- [ ] TypeScript 타입 정의 완료
- [ ] `.dev.vars` 파일이 `.gitignore`에 추가됨
- [ ] 로컬에서 테스트 완료
- [ ] 프로덕션 키와 로컬 키가 분리됨
- [ ] 코드에 하드코딩된 Secret이 없음

## 다음 단계

환경 변수와 Secrets를 마스터했습니다! 이제:

- **[로깅과 모니터링](./workers-logging.md)** - 에러 추적하기
- **[실전: REST API 만들기](./workers-rest-api.md)** - 완전한 API 구축
- **[사용자 인증 (JWT)](./workers-auth.md)** - JWT_SECRET 활용

## 참고 자료

- [Wrangler Secrets 문서](https://developers.cloudflare.com/workers/wrangler/commands/#secret)
- [환경 변수 가이드](https://developers.cloudflare.com/workers/configuration/environment-variables/)
- [보안 모범 사례](https://developers.cloudflare.com/workers/platform/security/)
