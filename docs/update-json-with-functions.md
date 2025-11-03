# JSON 파일 업데이트하기

Pages Functions를 사용해서 JSON 파일을 읽고 수정하는 방법을 배워봅시다.

## 개요

### 기본 개념

정적 사이트에서는 JSON 파일을 읽기만 할 수 있지만, Pages Functions를 사용하면:
- JSON 파일 읽기
- 데이터 추가/수정/삭제
- 변경된 내용을 파일에 저장

이 모든 것이 가능합니다!

### 주의사항

**중요**: Pages Functions에서 파일을 수정하면 GitHub 저장소의 파일이 직접 변경되지 않습니다. 배포된 환경에서만 변경됩니다.

진짜 데이터베이스처럼 사용하려면:
- KV 스토리지 사용 (8장에서 배움)
- 또는 외부 데이터베이스 연동

하지만 간단한 프로젝트에서는 JSON 파일만으로도 충분합니다!

## 프로젝트 구조

```
my-project/
├── index.html
├── data/
│   └── comments.json
└── functions/
    ├── api/
    │   ├── get-comments.js
    │   └── add-comment.js
```

## 실습: 댓글 시스템 만들기

### Cursor에게 요청하기

```
프로젝트 구조:
my-blog/
├── index.html
├── data/
│   └── comments.json
└── functions/
    └── api/
        ├── get-comments.js
        └── add-comment.js

댓글 시스템을 만들고 싶어.

1. data/comments.json 파일:
   - 댓글 배열 형태
   - 각 댓글: id, author, content, timestamp

2. functions/api/get-comments.js:
   - GET 요청
   - comments.json 파일 읽기
   - JSON 형태로 반환
   - CORS 헤더 포함

3. functions/api/add-comment.js:
   - POST 요청
   - body에서 author, content 받기
   - 새 댓글을 comments.json에 추가
   - id와 timestamp 자동 생성
   - 성공 응답 반환
   - CORS 헤더 포함

4. index.html:
   - 댓글 목록 표시
   - 댓글 작성 폼
   - 제출하면 API 호출해서 추가

실시간으로 동작하게 만들어줘.
```

### 예상 결과

#### data/comments.json
```json
[
  {
    "id": 1,
    "author": "홍길동",
    "content": "좋은 글 감사합니다!",
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
```

#### functions/api/get-comments.js
```javascript
export async function onRequestGet(context) {
    try {
        // comments.json 파일 읽기
        const response = await context.env.ASSETS.fetch(
            new Request('https://example.com/data/comments.json')
        );
        const comments = await response.json();

        return new Response(JSON.stringify(comments), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to load comments' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
```

#### functions/api/add-comment.js
```javascript
export async function onRequestPost(context) {
    try {
        // 요청 body 읽기
        const body = await context.request.json();
        const { author, content } = body;

        // 기존 댓글 읽기
        const response = await context.env.ASSETS.fetch(
            new Request('https://example.com/data/comments.json')
        );
        const comments = await response.json();

        // 새 댓글 추가
        const newComment = {
            id: comments.length + 1,
            author,
            content,
            timestamp: new Date().toISOString()
        };
        comments.push(newComment);

        // 여기서는 메모리에만 저장됨 (재배포 시 초기화)
        // 영구 저장하려면 KV 스토리지 사용 필요

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
        return new Response(JSON.stringify({ error: 'Failed to add comment' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// CORS preflight 처리
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

## HTML에서 API 사용하기

### Cursor에게 요청

```
index.html 만들어줘.

기능:
1. 페이지 로드 시 /api/get-comments 호출해서 댓글 목록 표시
2. 댓글 작성 폼 (작성자, 내용)
3. 제출하면 /api/add-comment로 POST 요청
4. 성공하면 댓글 목록 새로고침

디자인은 깔끔하게 부트스트랩 사용해서 만들어줘.
```

### 예상 HTML 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>댓글 시스템</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1>댓글</h1>

        <!-- 댓글 작성 폼 -->
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">댓글 작성</h5>
                <form id="commentForm">
                    <div class="mb-3">
                        <label for="author" class="form-label">작성자</label>
                        <input type="text" class="form-control" id="author" required>
                    </div>
                    <div class="mb-3">
                        <label for="content" class="form-label">내용</label>
                        <textarea class="form-control" id="content" rows="3" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">작성</button>
                </form>
            </div>
        </div>

        <!-- 댓글 목록 -->
        <div id="commentsList"></div>
    </div>

    <script>
        // 댓글 목록 로드
        async function loadComments() {
            try {
                const response = await fetch('/api/get-comments');
                const comments = await response.json();

                const commentsList = document.getElementById('commentsList');
                commentsList.innerHTML = comments.map(comment => `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">${comment.author}</h6>
                            <p class="card-text">${comment.content}</p>
                            <small class="text-muted">${new Date(comment.timestamp).toLocaleString('ko-KR')}</small>
                        </div>
                    </div>
                `).join('');
            } catch (error) {
                console.error('댓글 로드 실패:', error);
            }
        }

        // 댓글 작성
        document.getElementById('commentForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const author = document.getElementById('author').value;
            const content = document.getElementById('content').value;

            try {
                const response = await fetch('/api/add-comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ author, content })
                });

                if (response.ok) {
                    // 폼 초기화
                    document.getElementById('commentForm').reset();
                    // 댓글 목록 새로고침
                    loadComments();
                    alert('댓글이 작성되었습니다!');
                }
            } catch (error) {
                console.error('댓글 작성 실패:', error);
                alert('댓글 작성에 실패했습니다.');
            }
        });

        // 페이지 로드 시 댓글 로드
        loadComments();
    </script>
</body>
</html>
```

## 로컬에서 테스트하기

### Wrangler 사용

```bash
# 프로젝트 폴더에서
npx wrangler pages dev .
```

브라우저에서 접속:
```
http://localhost:8788
```

### 테스트 절차

1. 페이지 열기
2. 댓글 작성 폼 작성
3. 제출 버튼 클릭
4. 댓글이 목록에 추가되는지 확인

## 배포하기

### GitHub에 푸시

```bash
git add .
git commit -m "Add comment system with Functions"
git push
```

Cloudflare Pages가 자동으로 배포합니다!

## 한계와 해결책

### 현재 방식의 한계

**문제**: 배포된 환경에서 JSON 파일 수정이 영구적이지 않음
- 재배포 시 원래 파일로 되돌아감
- 여러 사용자가 동시에 수정하면 충돌 가능

### 해결책

#### 1. KV 스토리지 사용 (추천)
```
8장 "KV 스토리지로 데이터 저장하기" 참고
- 영구 저장
- 빠른 읽기/쓰기
- 무료 플랜 충분
```

#### 2. GitHub API로 파일 직접 수정
```javascript
// GitHub API 사용
// 복잡하고 권한 설정 필요
// 초보자에게는 비추천
```

#### 3. 외부 데이터베이스 연동
```
- Firebase
- Supabase
- MongoDB Atlas
무료 플랜 있음
```

## 실전 예제들

### 예제 1: 방명록

Cursor에게 요청:
```
방명록 만들어줘.

기능:
- 이름, 메시지 입력
- 작성 시간 자동 기록
- 최신 순으로 표시
- 간단한 디자인

Functions로 JSON 파일 업데이트하는 방식으로.
```

### 예제 2: 간단한 게시판

Cursor에게 요청:
```
간단한 게시판 만들어줘.

기능:
- 글 목록 보기
- 글 작성 (제목, 작성자, 내용)
- 글 상세 보기
- 작성 시간 표시

Functions로 posts.json 파일 관리하는 방식으로.
```

### 예제 3: 투표 시스템

Cursor에게 요청:
```
간단한 투표 시스템 만들어줘.

기능:
- 투표 항목 목록 표시
- 버튼 클릭으로 투표
- 실시간 결과 그래프 표시
- 한 사람당 한 번만 투표 (브라우저 localStorage 사용)

Functions로 votes.json 업데이트하는 방식으로.
```

## CORS 에러 해결

### 문제

```
Access to fetch at '...' has been blocked by CORS policy
```

### 해결: 모든 Functions에 CORS 헤더 추가

#### functions/_middleware.js 만들기

Cursor에게 요청:
```
functions/_middleware.js 만들어줘.

모든 API 응답에 CORS 헤더를 자동으로 추가하는 미들웨어.

헤더:
- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
- Access-Control-Allow-Headers: Content-Type
```

## 보안 고려사항

### 기본 검증

```javascript
export async function onRequestPost(context) {
    const body = await context.request.json();

    // 필수 필드 검증
    if (!body.author || !body.content) {
        return new Response(JSON.stringify({
            error: 'Author and content are required'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 길이 제한
    if (body.content.length > 1000) {
        return new Response(JSON.stringify({
            error: 'Content too long'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // XSS 방지 (간단한 처리)
    const safeContent = body.content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // ... 댓글 추가 로직
}
```

### Rate Limiting

Cursor에게 요청:
```
간단한 rate limiting 추가해줘.

IP당 분당 10회 요청 제한.
초과하면 429 에러 반환.
```

## 다음 단계

이제 Functions로 JSON을 업데이트하는 방법을 배웠습니다!

더 강력한 데이터 저장이 필요하다면:
- **8장 "KV 스토리지로 데이터 저장하기"** 배우기
- 영구 저장
- 더 빠른 성능
- 더 큰 데이터 처리

**연습 과제:**

Cursor에게 요청해보세요:
```
간단한 할일 목록(Todo List) 만들어줘.

기능:
- 할일 추가
- 완료 체크/해제
- 할일 삭제
- LocalStorage와 Functions 둘 다 사용
  (로컬에는 빠르게 저장, 서버에도 백업)

todos.json 파일로 관리.
```
