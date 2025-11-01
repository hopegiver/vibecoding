# Pages가 뭔가요?

Cloudflare Pages는 내가 만든 웹사이트를 인터넷에 공개하는 서비스입니다.

## Pages란?

내 컴퓨터에 있는 HTML, CSS, JavaScript 파일을 업로드하면 전 세계 어디서나 접속할 수 있는 웹사이트가 됩니다.

## 왜 Cloudflare Pages를 쓰나요?

### 1. 완전 무료
- 트래픽 무제한
- 배포 횟수 무제한
- SSL 인증서 자동 제공 (https://)

### 2. 엄청 빠름
- 전 세계 300개 이상의 서버에 자동 배포
- 사용자가 가장 가까운 서버에서 페이지를 받아봄
- CDN이 자동으로 적용됨

### 3. GitHub과 자동 연결
- GitHub에 코드를 푸시하면 자동으로 배포
- 별도 작업 필요 없음
- 실수해도 이전 버전으로 쉽게 롤백

### 4. 개발자가 아니어도 쉬움
- 복잡한 서버 설정 불필요
- 클릭 몇 번이면 배포 완료
- Git만 알면 됨

## Pages vs 다른 서비스

### GitHub Pages
- 장점: 무료, 간단
- 단점: 느림, 기능 제한적

### Netlify
- 장점: 기능 많음
- 단점: 무료 플랜 제한적

### Cloudflare Pages
- 장점: 빠름, 무료, 제한 거의 없음
- 단점: 비교적 새로운 서비스

## Pages로 뭘 만들 수 있나요?

### 정적 웹사이트
- 회사 소개 페이지
- 포트폴리오
- 블로그
- 제품 카탈로그
- FAQ 페이지

### 간단한 웹 앱
- 계산기
- To-Do 리스트
- 설문조사 페이지
- 직원 명부

### JSON 파일을 활용한 사이트
- 제품 목록 (products.json)
- 직원 리스트 (employees.json)
- 블로그 글 (posts.json)

## Pages로 못 만드는 것

### 데이터베이스가 필요한 것
- 회원가입/로그인 (해결: Workers 사용)
- 댓글 시스템 (해결: 외부 서비스 연동)
- 실시간 채팅 (해결: Workers 사용)

하지만 JSON 파일로 대부분 해결 가능합니다!

## Pages의 구조

```
내 컴퓨터                    GitHub                 Cloudflare Pages
├── index.html    →    저장소에 푸시    →    자동 배포
├── style.css                                    ↓
└── script.js                              https://내사이트.pages.dev
```

## Pages 배포 과정

1. 로컬에서 개발 (Cursor 사용)
2. GitHub에 푸시
3. Cloudflare Pages가 자동 감지
4. 자동으로 빌드 & 배포
5. URL로 접속 가능

보통 **30초~1분** 정도 걸립니다!

## Pages의 URL 형식

### 기본 URL
```
https://프로젝트명.pages.dev
```

예시:
```
https://my-website.pages.dev
https://company-intro.pages.dev
```

### 커스텀 도메인 (선택)
```
https://www.example.com
```

내가 가진 도메인도 연결 가능합니다.

## 비용

### 무료 플랜
- 월 500회 빌드
- 무제한 트래픽
- 무제한 사이트
- SSL 인증서

대부분의 경우 무료 플랜이면 충분합니다!

### 유료 플랜 (월 $20)
- 5,000회 빌드
- 우선 지원
- 고급 분석

## 다음 단계

이제 GitHub 저장소를 Cloudflare Pages에 연결해봅시다!
