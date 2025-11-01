# 간단한 API 만들기

Pages Functions를 사용해 실용적인 API를 만들어봅시다.

## 프로젝트: 할일 API

### 1단계: 프로젝트 구조

Cursor에게 요청:
```
할일 관리 API 만들어줘.

프로젝트 구조:
my-todo-api/
├── index.html          (API 테스트 UI)
├── functions/
│   └── api/
│       ├── todos.js    (목록 조회, 추가)
│       └── todos/
│           └── [id].js (개별 조회, 수정, 삭제)

먼저 파일 구조만 만들어줘.
```

### 2단계: 데이터 저장소 (메모리)

Cursor에게 요청:
```
functions/api/todos.js 만들어줘.

기능:
- GET: 모든 할일 조회
- POST: 새 할일 추가

메모리 배열로 간단히 구현:
let todos = [
  { id: 1, title: "첫 할일", completed: false },
  { id: 2, title: "두번째 할일", completed: true }
];

JSON 응답, CORS 헤더 포함
```

### 3단계: 개별 항목 관리

Cursor에게 요청:
```
functions/api/todos/[id].js 만들어줘.

기능:
- GET: 특정 할일 조회
- PUT: 할일 수정 (제목, 완료상태)
- DELETE: 할일 삭제

ID는 URL 파라미터로 받기.
존재하지 않으면 404 응답.
```

### 4단계: 테스트 UI

Cursor에게 요청:
```
index.html 만들어줘.

API 테스트용 간단한 UI:
1. 할일 목록 표시
2. 새 할일 추가 폼
3. 각 항목: 체크박스(완료), 제목, 삭제 버튼
4. fetch로 API 호출

깔끔한 카드 디자인으로.
```

## 고급 기능

### 필터링 기능

Cursor에게 요청:
```
todos.js에 필터링 기능 추가해줘.

쿼리 파라미터:
- ?completed=true: 완료된 항목만
- ?completed=false: 미완료 항목만
- 없으면: 전체

URL 예시: /api/todos?completed=true
```

### 페이지네이션

Cursor에게 요청:
```
todos.js에 페이지네이션 추가해줘.

쿼리 파라미터:
- ?page=1&limit=10

응답 형식:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

### 검색 기능

Cursor에게 요청:
```
검색 기능 추가해줘.

쿼리 파라미터:
- ?search=키워드

제목에서 검색 (대소문자 구분 없이)
```

## 에러 처리

Cursor에게 요청:
```
에러 처리 개선해줘.

1. 잘못된 JSON → 400 Bad Request
2. 존재하지 않는 ID → 404 Not Found
3. 필수 필드 없음 → 400 Bad Request
4. 서버 오류 → 500 Internal Server Error

에러 응답 형식:
{
  "error": "Todo not found",
  "code": "NOT_FOUND"
}
```

## 유효성 검증

Cursor에게 요청:
```
입력 검증 추가해줘.

POST/PUT 시:
- title: 필수, 1-100자
- completed: boolean

검증 실패 시 400 응답:
{
  "error": "Validation failed",
  "details": {
    "title": "제목은 필수입니다"
  }
}
```

## API 문서화

Cursor에게 요청:
```
API 문서 페이지 만들어줘.

docs.html:
- 모든 엔드포인트 설명
- 요청/응답 예시
- 에러 코드 설명
- 예제 코드 (fetch)

깔끔한 문서 형태로.
```

## 테스트

### 로컬 테스트
```bash
wrangler pages dev .
```

### 테스트 시나리오:
1. 할일 목록 조회
2. 새 할일 추가
3. 할일 수정
4. 할일 삭제
5. 존재하지 않는 ID 조회 (404 확인)

## 배포

```bash
git add .
git commit -m "Add Todo API"
git push
```

Cloudflare Pages에서 자동 배포!

## 다음 단계

이 API를 더 발전시키려면:
- KV 스토리지로 영구 저장
- 인증 추가
- 사용자별 할일 분리
- 카테고리 기능
