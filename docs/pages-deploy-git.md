# Git 연결해서 자동 배포

GitHub 저장소를 Cloudflare Pages에 연결하여 자동 배포를 설정해봅시다.

## 사전 준비

시작하기 전에 필요한 것:
- GitHub 계정
- Cloudflare 계정
- GitHub에 프로젝트 저장소 (최소한 index.html 포함)

## 1단계: GitHub 저장소 준비

### 저장소 만들기

GitHub에서 새 저장소 생성:
1. GitHub 로그인
2. 오른쪽 위 `+` 클릭 > "New repository"
3. 저장소 이름 입력 (예: `my-website`)
4. Public 선택
5. "Create repository" 클릭

### 로컬 프로젝트와 연결

Cursor 터미널에서:
```bash
cd my-website
git init
git add .
git commit -m "첫 번째 커밋"
git branch -M main
git remote add origin https://github.com/사용자명/my-website.git
git push -u origin main
```

## 2단계: Cloudflare Pages 프로젝트 생성

### Pages 대시보드 접속

1. [Cloudflare 대시보드](https://dash.cloudflare.com) 로그인
2. 왼쪽 메뉴에서 "Workers & Pages" 클릭
3. "Create application" 버튼 클릭
4. "Pages" 탭 선택
5. "Connect to Git" 클릭

### GitHub 연결

1. "Connect GitHub" 버튼 클릭
2. GitHub 로그인 (필요시)
3. Cloudflare Pages 권한 승인
4. 저장소 선택:
   - "All repositories" 또는
   - "Only select repositories" 선택 후 원하는 저장소 체크
5. "Install & Authorize" 클릭

## 3단계: 프로젝트 설정

### 저장소 선택

1. 배포할 저장소 찾기
2. 저장소 이름 클릭

### 빌드 설정

대부분의 정적 사이트는 빌드 설정이 필요 없습니다:

```
Project name: my-website (자동 입력됨)
Production branch: main
Build command: (비워둠)
Build output directory: / 또는 비워둠
```

### 프레임워크별 설정

만약 프레임워크를 사용한다면:

#### React
```
Build command: npm run build
Build output directory: build
```

#### Vue
```
Build command: npm run build
Build output directory: dist
```

#### 순수 HTML
```
Build command: (비워둠)
Build output directory: (비워둠)
```

### 환경 변수 (선택)

필요한 경우 환경 변수 추가:
1. "Environment variables" 섹션
2. "Add variable" 클릭
3. 이름과 값 입력

예시:
```
API_KEY = abc123xyz
```

## 4단계: 배포 시작

1. "Save and Deploy" 버튼 클릭
2. 배포 과정 확인:
   - Initializing build
   - Cloning repository
   - Building application
   - Deploying to Cloudflare

보통 30초~2분 정도 걸립니다.

## 5단계: 배포 확인

### 성공 메시지

배포가 완료되면:
```
Success! Your site is live at:
https://my-website.pages.dev
```

### 사이트 확인

1. 제공된 URL 클릭
2. 브라우저에서 사이트 확인
3. 모든 페이지가 정상 작동하는지 테스트

## 배포 후 구조

```
GitHub 저장소
    ↓ (자동 감지)
Cloudflare Pages
    ↓ (빌드 & 배포)
https://프로젝트명.pages.dev
```

## 실전 예제: 회사 소개 페이지 배포

### 1. 저장소 준비
```bash
mkdir company-website
cd company-website
```

### 2. index.html 생성
Cursor에서 AI에게 요청:
```
회사 소개 페이지 만들어줘.
- 회사명: 맑은소프트
- 섹션: 회사소개, 서비스, 연락처
- 깔끔한 디자인
```

### 3. GitHub에 푸시
```bash
git init
git add .
git commit -m "회사 소개 페이지"
git branch -M main
git remote add origin https://github.com/사용자명/company-website.git
git push -u origin main
```

### 4. Cloudflare Pages 연결
1. Pages 대시보드 접속
2. "Connect to Git" 클릭
3. `company-website` 저장소 선택
4. "Save and Deploy" 클릭

### 5. 결과
```
https://company-website.pages.dev
```

## 흔한 문제 해결

### 저장소가 안 보여요
GitHub 권한 재확인:
1. Cloudflare Pages 설정
2. "Git configuration" 클릭
3. "Reconnect GitHub" 클릭

### 배포가 실패했어요
빌드 로그 확인:
1. 프로젝트 클릭
2. "View build" 클릭
3. 에러 메시지 확인

주요 원인:
- 빌드 명령어 오류
- 의존성 설치 실패
- 파일 경로 문제

### 페이지가 404 에러
`index.html` 파일이 루트에 있는지 확인:
```
프로젝트/
  ├── index.html  ← 반드시 루트에 있어야 함
  ├── style.css
  └── script.js
```

### CSS/JS 파일이 안 불러와져요
상대 경로 확인:
```html
<!-- 나쁜 예 -->
<link rel="stylesheet" href="/style.css">

<!-- 좋은 예 -->
<link rel="stylesheet" href="style.css">
```

## 배포 상태 확인

### 대시보드에서
1. Cloudflare Pages 대시보드
2. 프로젝트 클릭
3. "Deployments" 탭

확인 가능한 정보:
- 배포 시간
- 브랜치
- 커밋 메시지
- 배포 상태 (Success/Failed)

### 이메일 알림

배포 완료 시 이메일 받기:
1. 프로젝트 설정
2. "Notifications"
3. "Deployment notifications" 활성화

## 다음 단계

Git 연결을 완료했습니다. 이제 코드를 수정하고 푸시하면 자동으로 배포됩니다!
