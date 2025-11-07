# Git 설치하기

Git은 코드의 변경 이력을 관리하고, GitHub와 연동하여 코드를 저장하고 배포하는 데 필요한 도구입니다.

## Git을 왜 설치해야 하나요?

Git은 **코드의 타임머신**이라고 생각하면 쉽습니다.

### 실제 상황으로 이해하기

상상해보세요. 웹사이트를 만들다가 이런 일이 생깁니다:

```
😊 오늘: 홈페이지가 완성되었다!
😃 내일: 새 기능을 추가했다!
😰 모레: 어? 뭔가 망가졌는데... 어제는 잘 됐는데...
😱 글피: 언제부터 망가진 거지? 어떻게 되돌리지?
```

**Git이 없으면:**
- 매번 `웹사이트_최종.html`, `웹사이트_최종2.html`, `웹사이트_진짜최종.html` 같은 파일을 만들어야 합니다
- 뭘 고쳤는지 기억이 안 납니다
- 망가진 코드를 되돌릴 수 없습니다

**Git이 있으면:**
- 모든 변경사항이 자동으로 기록됩니다
- 언제든지 이전 상태로 돌아갈 수 있습니다
- "지난주 목요일 3시 버전"처럼 정확히 되돌릴 수 있습니다

### Git + GitHub + Cloudflare Pages = 자동 배포

더 중요한 이유가 있습니다:

1. **Cursor**에서 웹사이트 코드 수정
2. **Git**으로 변경사항 저장
3. **GitHub**에 업로드
4. **Cloudflare Pages**가 자동으로 감지하고 웹사이트 업데이트! ✨

Git 없이는 이 자동화 과정이 불가능합니다. Git은 단순한 도구가 아니라 **현대 웹 개발의 핵심 흐름**입니다.

## 윈도우 사용자

### 1. Git 다운로드

1. [git-scm.com](https://git-scm.com/download/win) 접속
2. 자동으로 다운로드가 시작됩니다
3. 다운로드가 시작되지 않으면 "Click here to download manually" 클릭

### 2. Git 설치

1. 다운로드한 설치 파일 실행
2. 설치 옵션은 대부분 기본값으로 진행
3. 중요한 설정:
   - **Choosing the default editor**: 원하는 에디터 선택 (기본값 유지 가능)
   - **Adjusting your PATH environment**: "Git from the command line and also from 3rd-party software" 선택 (기본값)
   - **Choosing HTTPS transport backend**: "Use the OpenSSL library" 선택 (기본값)
   - **Configuring the line ending conversions**: "Checkout Windows-style, commit Unix-style line endings" 선택 (기본값)

4. 설치 완료 후 "Finish" 클릭

### 3. 설치 확인

1. **명령 프롬프트**(cmd) 또는 **PowerShell** 열기
2. 다음 명령어 입력:

```bash
git --version
```

3. 버전 정보가 표시되면 설치 완료:

```
git version 2.43.0.windows.1
```

### 4. Git 초기 설정

사용자 정보를 설정합니다. GitHub 계정과 동일한 이름과 이메일을 사용하세요:

```bash
git config --global user.name "내이름"
git config --global user.email "내이메일@example.com"
```

### 5. GitHub CLI 설치 (선택사항)

GitHub CLI는 터미널에서 GitHub를 더 편리하게 사용할 수 있게 해주는 도구입니다.

1. [GitHub CLI 다운로드 페이지](https://cli.github.com/) 접속
2. "Download for Windows" 클릭
3. 설치 파일(.msi) 다운로드 후 실행
4. 설치 완료 후 명령 프롬프트에서 확인:

```bash
gh --version
```

5. GitHub 로그인:

```bash
gh auth login
```

6. 화살표 키로 선택하며 진행:
   - "GitHub.com" 선택
   - "HTTPS" 선택
   - "Login with a web browser" 선택
   - 표시되는 코드를 복사하고 Enter
   - 브라우저에서 코드 입력 후 인증

## 맥 사용자

### 1. Homebrew로 설치 (권장)

**Homebrew**가 없다면 먼저 설치:

1. **터미널** 열기 (응용 프로그램 > 유틸리티 > 터미널)
2. 다음 명령어 붙여넣기:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

3. Homebrew 설치 후 Git 설치:

```bash
brew install git
```

### 2. Xcode Command Line Tools로 설치

터미널에서 다음 명령어 실행:

```bash
git --version
```

Git이 설치되어 있지 않으면 자동으로 Xcode Command Line Tools 설치 창이 표시됩니다. "설치" 버튼을 클릭하세요.

### 3. 설치 확인

터미널에서 다음 명령어 입력:

```bash
git --version
```

버전 정보가 표시되면 설치 완료:

```
git version 2.43.0
```

### 4. Git 초기 설정

사용자 정보를 설정합니다. GitHub 계정과 동일한 이름과 이메일을 사용하세요:

```bash
git config --global user.name "내이름"
git config --global user.email "내이메일@example.com"
```

### 5. GitHub CLI 설치 (선택사항)

GitHub CLI는 터미널에서 GitHub를 더 편리하게 사용할 수 있게 해주는 도구입니다.

Homebrew로 설치:

```bash
brew install gh
```

설치 확인:

```bash
gh --version
```

GitHub 로그인:

```bash
gh auth login
```

화살표 키로 선택하며 진행:
- "GitHub.com" 선택
- "HTTPS" 선택
- "Login with a web browser" 선택
- 표시되는 코드를 복사하고 Enter
- 브라우저에서 코드 입력 후 인증

## 다음 단계

Git 설치가 완료되었으니 이제 [GitHub 계정 만들기](github-account.md)로 넘어가세요.

## 문제 해결

### 윈도우: 'git'이(가) 내부 또는 외부 명령... 오류

PATH 환경 변수에 Git이 추가되지 않은 경우입니다:

1. 컴퓨터를 재시작
2. 재시작 후에도 문제가 있다면 Git을 다시 설치

### 맥: xcrun: error 오류

Xcode Command Line Tools가 제대로 설치되지 않은 경우입니다:

```bash
xcode-select --install
```

명령어를 다시 실행하여 재설치하세요.
