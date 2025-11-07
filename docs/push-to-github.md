# GitHub에 코드 올리기

완성된 웹사이트를 GitHub에 올려서 Cloudflare Pages로 배포할 준비를 합니다. 복잡한 명령어는 AI가 대신 실행해줍니다!

## 시작하기 전에

다음이 준비되어 있어야 합니다:
- ✅ Git 설치 완료
- ✅ GitHub CLI 설치 완료
- ✅ GitHub 계정 생성 완료
- ✅ Cursor에서 만든 웹사이트 파일

## 1단계: GitHub CLI 인증하기 (최초 1회)

GitHub에 코드를 올리려면 먼저 인증이 필요합니다. GitHub CLI를 사용하면 아주 쉽습니다!

### 먼저: GitHub 웹사이트에 로그인

인증을 시작하기 전에 **브라우저에서 GitHub에 미리 로그인**해두세요:

1. 브라우저 열기 (Chrome, Edge, Safari 등)
2. [github.com](https://github.com) 접속
3. 로그인

> **중요:** 미리 로그인해두면 인증 과정이 훨씬 간단해집니다! 코드 복사/붙여넣기가 필요 없습니다.

### Cursor에서 AI에게 인증 요청

1. **Cursor 열기**

2. **AI 채팅 열기**
   - `Ctrl + L` (Mac: `Cmd + L`)

3. **AI에게 요청**

```
GitHub CLI로 인증하고 싶어.
gh auth login 명령어를 실행해줘.
```

AI가 명령어를 제안하면 **Run 버튼 클릭!**

### 브라우저에서 인증하기

1. 터미널에 메시지가 나타납니다:
```
? What account do you want to log into?
> GitHub.com
  GitHub Enterprise Server
```
- 화살표 키로 **GitHub.com** 선택 → Enter

2. 프로토콜 선택:
```
? What is your preferred protocol for Git operations?
> HTTPS
  SSH
```
- 화살표 키로 **HTTPS** 선택 → Enter

3. 인증 방법 선택:
```
? How would you like to authenticate GitHub CLI?
> Login with a web browser
  Paste an authentication token
```
- **Login with a web browser** 선택 → Enter

4. **브라우저에서 녹색 버튼만 클릭!**
   - 이미 GitHub에 로그인되어 있으면:
     - 코드 입력 페이지가 아니라 **바로 승인 페이지**가 열립니다
     - 녹색 **"Authorize GitHub CLI"** 버튼 클릭
     - 한 번 더 녹색 버튼 클릭 (Authorize)
     - 완료!
   - 로그인되어 있지 않으면:
     - 로그인 화면 → 로그인
     - 코드 입력 → 승인

5. 성공 메시지 확인:
```
✓ Authentication complete.
✓ Logged in as your-username
```

**완료! 이제 GitHub에 코드를 올릴 수 있습니다.** 🎉

> **참고:**
> - 이 인증은 최초 1회만 하면 됩니다. 이후에는 자동으로 인증됩니다.
> - GitHub에 미리 로그인해두면 **녹색 버튼만 클릭**하면 끝! 매우 간단합니다.

## 2단계: GitHub 웹사이트에서 저장소 만들기

초보자에게 가장 쉽고 확실한 방법입니다.

### 1단계: GitHub에서 새 저장소 만들기

1. **GitHub 웹사이트 접속**
   - [github.com](https://github.com) 접속
   - 로그인

2. **새 저장소 생성**
   - 우측 상단 "+" 클릭 → "New repository" 선택

3. **저장소 설정**
   - **Repository name**: `my-website` (원하는 이름 입력)
   - **Description**: `내 첫 웹사이트` (선택사항)
   - **Public** 선택 (무료로 배포하려면 Public 필요)
   - ❌ **Add a README file 체크하지 않기** (중요!)
   - ❌ **Add .gitignore 체크하지 않기**
   - **Create repository** 클릭

4. **저장소 주소 복사**
   - 생성된 페이지에서 저장소 주소 복사
   - 예: `https://github.com/사용자명/my-website.git`
   - 또는 초록색 "Code" 버튼 클릭 → HTTPS 주소 복사

### 3단계: Cursor에서 AI에게 업로드 요청

1. **Cursor 열기**
   - 웹사이트 프로젝트 폴더 열기

2. **AI 채팅 열기**
   - `Ctrl + L` (Mac: `Cmd + L`)

3. **AI에게 요청하기**

복사한 저장소 주소와 함께 다음처럼 요청하세요:

```
내 프로젝트를 GitHub에 올려줘.
저장소 주소는 https://github.com/사용자명/my-website.git 이야.
```

> **참고:** 커밋 메시지는 AI가 자동으로 작성합니다. 따로 지정하지 않아도 됩니다!

### 4단계: AI가 제안한 명령어 실행

AI가 다음과 같은 명령어를 제안합니다:

```bash
git init
git add .
git commit -m "첫 웹사이트 업로드"
git branch -M main
git remote add origin https://github.com/사용자명/my-website.git
git push -u origin main
```

**중요: 터미널에 직접 입력하지 마세요!**

AI가 제안한 명령어 옆에 **"Run"** 또는 **"실행"** 버튼이 나타납니다:

1. **Run 버튼 클릭** - AI가 제안한 첫 번째 명령어 실행
2. 완료될 때까지 대기
3. 다음 명령어도 **Run 버튼 클릭**
4. 모든 명령어가 완료될 때까지 반복

또는 AI에게:
```
위의 모든 명령어를 한 번에 실행해줘
```
라고 요청하면 한 번에 실행할 수도 있습니다!

### 5단계: 확인

1. **GitHub 웹사이트**로 돌아가기
2. 내 저장소 새로고침
3. 파일들이 업로드되었는지 확인

성공! 🎉

## 수정사항 업데이트하기

이미 GitHub에 올린 웹사이트를 수정한 경우:

### AI에게 요청

```
파일을 수정했어.
변경사항을 GitHub에 업데이트해줘.
```

AI가 자동으로 적절한 커밋 메시지를 작성하고 명령어를 제안합니다:
```bash
git add .
git commit -m "AI가 자동 작성한 커밋 메시지"
git push
```

**Run 버튼을 차례대로 클릭**하면 끝!

## 실전 예시: 전체 대화

### 예시 1: 처음 올리기

**당신:**
```
내 웹사이트를 GitHub에 올리고 싶어.
저장소 주소: https://github.com/johndoe/company-website.git
```

**AI:**
```
네, GitHub에 코드를 올리겠습니다. 다음 명령어들을 실행하겠습니다:

1. Git 저장소 초기화
2. 모든 파일 추가
3. 커밋 생성
4. 원격 저장소 연결
5. 푸시

[Run 버튼]
```

**당신:** Run 버튼 클릭! ✅

AI가 자동으로 모든 작업을 수행합니다.

### 예시 2: 파일 수정 후 업데이트

**당신:**
```
index.html을 수정했어.
GitHub에 업데이트해줘.
```

**AI:**
```
수정사항을 GitHub에 푸시하겠습니다.

[Run 버튼]
```

**당신:** Run 버튼 클릭! ✅

완료!

## 더 편리한 AI 요청 방법

### 특정 파일만 올리기

```
index.html과 style.css만 GitHub에 업데이트해줘.
```

AI가 자동으로 변경 내용을 분석하고 적절한 커밋 메시지를 작성합니다.

### .gitignore 설정

```
node_modules 폴더는 GitHub에 올리지 않게
.gitignore 파일을 만들어줘.
```

AI가 .gitignore 파일을 생성하고 내용도 채워줍니다!

## 문제 해결

### 인증 오류가 나는 경우

**오류 메시지:**
```
remote: Support for password authentication was removed...
```

**해결 방법:**

GitHub CLI 인증을 다시 해보세요:

AI에게 요청:
```
gh auth login 다시 실행해줘.
인증이 필요해.
```

Run 버튼 클릭 → 브라우저에서 다시 인증

### 이미 저장소가 있다는 오류

**오류 메시지:**
```
fatal: remote origin already exists
```

**해결 방법:**

AI에게:
```
remote origin already exists 오류가 나.
해결해줘.
```

AI가 자동으로 해결합니다!

### 충돌(Conflict) 발생

**오류 메시지:**
```
CONFLICT (content): Merge conflict in index.html
```

**해결 방법:**

AI에게:
```
index.html에서 충돌이 발생했어.
해결 방법 알려줘.
```

AI가 충돌을 해결하는 방법을 단계별로 안내합니다.

## AI가 할 수 있는 Git 작업

### 기본 작업
- ✅ Git 저장소 초기화
- ✅ 파일 추가 및 커밋
- ✅ GitHub에 푸시
- ✅ 변경사항 확인

### 고급 작업
- ✅ 브랜치 생성 및 전환
- ✅ 브랜치 병합
- ✅ 이전 커밋으로 되돌리기
- ✅ 충돌 해결
- ✅ .gitignore 설정

**모두 AI에게 요청하고 Run 버튼만 클릭하면 됩니다!**

## 주의사항

### 개인정보 보호

다음 파일들은 GitHub에 올리지 마세요:
- `.env` (환경 변수 파일)
- 비밀번호가 포함된 파일
- API 키가 들어있는 파일

AI에게 물어보세요:
```
.env 파일이 있는데, 이걸 GitHub에 올리지 않게 설정해줘.
```

### GitHub CLI 인증 상태 확인

인증이 제대로 되었는지 확인하려면:

AI에게 요청:
```
gh auth status 명령어 실행해줘.
```

출력 예시:
```
✓ Logged in to github.com as your-username
✓ Git operations for github.com configured to use https protocol.
✓ Token: gho_****
```

✓ 표시가 있으면 정상입니다!

## 요약: 4단계로 끝내기

### 처음 올릴 때

1. **GitHub CLI 인증** (최초 1회만)
   - AI에게: "gh auth login 실행해줘"
   - Run 버튼 클릭 → 브라우저에서 인증
2. **GitHub 웹사이트에서 저장소 생성** → 주소 복사
3. **AI에게 요청**: "이 주소로 코드 올려줘: [주소]"
4. **Run 버튼 클릭** → 완료! 🎉

### 수정 후 업데이트

1. **AI에게 요청**: "수정사항 GitHub에 올려줘"
2. **Run 버튼 클릭** → 완료! 🎉

**핵심:**
- 명령어를 외울 필요 없습니다
- 터미널에 직접 입력할 필요 없습니다
- AI에게 요청하고 Run 버튼만 클릭하세요! 🚀

## 다음 단계

GitHub에 코드를 올렸다면 이제 [Pages 소개](pages-introduction.md)로 넘어가서 Cloudflare Pages와 연결해봅시다!
