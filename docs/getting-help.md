# 도움 받을 수 있는 곳

막혔을 때 도움을 받을 수 있는 방법을 알아봅시다.

## 1단계: Cursor AI 활용

### 효과적으로 질문하기
```
나쁜 질문:
"이거 왜 안 돼?"

좋은 질문:
"fetch로 데이터를 가져오려는데 콘솔에 이런 에러가 나와:
TypeError: Failed to fetch

코드는 이렇게 작성했어:
fetch('data.json')
  .then(response => response.json())
  .then(data => console.log(data));

뭐가 문제인지 확인하고 수정해줘."
```

### 에러 메시지 공유하기
1. F12 → Console 탭 열기
2. 에러 메시지 전체 복사
3. 관련 코드와 함께 Cursor에게 물어보기

## 2단계: 구글 검색

### 검색 팁
```
효과적인 검색어:
✅ "JavaScript fetch CORS error"
✅ "JSON unexpected token error"
✅ "Cloudflare Pages 404 error"

비효과적인 검색어:
❌ "왜 안 돼"
❌ "에러"
```

### 영어로 검색하기
대부분의 기술 문서는 영어로 더 많습니다.
- 한국어로 찾기 → 없으면 영어로 재검색

## 3단계: Stack Overflow

### Stack Overflow 사용법
1. stackoverflow.com 접속
2. 검색창에 에러 메시지 입력
3. 비슷한 질문 찾기
4. 답변 확인

### 질문 올리기
- 문제를 명확히 설명
- 최소한의 재현 가능한 코드 공유
- 시도한 해결 방법 언급

## 4단계: 공식 문서

### 주요 문서
- **MDN Web Docs** - JavaScript, HTML, CSS
  - developer.mozilla.org
- **Cloudflare Docs** - Pages, Workers
  - developers.cloudflare.com
- **GitHub Docs** - Git, GitHub
  - docs.github.com

## 5단계: 커뮤니티

### 한국어 커뮤니티
- **생활코딩 커뮤니티**
- **Okky** - okky.kr
- **인프런 질문 게시판**

### 영어 커뮤니티
- **Reddit r/webdev**
- **Dev.to**
- **Discord 서버** (Cloudflare, JavaScript 등)

## 6단계: 맑은소프트 동료

### 사내 도움 받기
1. 슬랙/이메일로 질문
2. 코드와 에러 메시지 공유
3. 스크린샷 첨부

### 질문 템플릿
```
제목: [Cursor/Cloudflare] 데이터 로딩 오류

안녕하세요,
JSON 파일을 읽는 중 에러가 발생했습니다.

【 에러 메시지 】
[에러 메시지 붙여넣기]

【 관련 코드 】
[코드 붙여넣기]

【 시도한 방법 】
1. 파일 경로 확인
2. console.log로 확인

도움 부탁드립니다.
```

## 도움 요청 체크리스트

질문하기 전에 확인:
- [ ] 에러 메시지 복사했나?
- [ ] 관련 코드를 정리했나?
- [ ] 파일 경로를 확인했나?
- [ ] 브라우저 콘솔을 확인했나?
- [ ] 구글 검색을 해봤나?
- [ ] Cursor AI에게 물어봤나?

## 효과적인 질문 만들기

### 포함할 내용
1. **문제 설명** - 무엇을 하려고 했는지
2. **에러 메시지** - 정확한 에러 내용
3. **코드** - 문제가 있는 부분
4. **시도한 방법** - 이미 해본 것들
5. **환경** - 브라우저, OS 등

### 예시
```
[제목]
Cloudflare Pages 배포 후 404 에러

[내용]
로컬에서는 잘 작동하는데 Cloudflare Pages에 배포하면
모든 페이지에서 404 에러가 발생합니다.

【 환경 】
- Cursor
- GitHub 연동
- Cloudflare Pages

【 프로젝트 구조 】
my-site/
├── index.html
├── about.html
└── style.css

【 에러 】
https://mysite.pages.dev/about.html
→ 404 Not Found

【 시도한 것 】
- GitHub에 파일이 제대로 올라갔는지 확인
- 대소문자 확인
- 재배포

도움 부탁드립니다!
```

## 학습 리소스

### 추가 학습
- 생활코딩 - 기초 강의
- MDN Web Docs - 레퍼런스
- freeCodeCamp - 무료 코스

## 다음 단계

막혔을 때 포기하지 마세요!
도움을 요청하는 것은 개발자의 중요한 스킬입니다.

이 가이드북을 완료했다면,
이제 여러분은 바이브 코딩을 시작할 준비가 되었습니다!

화이팅! 🚀
