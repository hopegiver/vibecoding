# 자동 배포 설정하기

GitHub에 푸시만 하면 자동으로 배포되는 워크플로우를 알아봅시다.

## 자동 배포란?

코드를 수정하고 GitHub에 푸시하면:
1. Cloudflare Pages가 자동으로 감지
2. 새 버전을 빌드
3. 자동으로 배포
4. 1~2분 후 변경사항이 반영됨

별도 작업이 전혀 필요 없습니다!

## 자동 배포 과정

```
로컬 컴퓨터           GitHub              Cloudflare Pages
   ↓
코드 수정      →     git push    →    자동 감지
   ↓                                       ↓
저장 (Ctrl+S)                           빌드 시작
                                           ↓
                                       배포 완료
                                           ↓
                                  사이트 업데이트
```

## 실습: 첫 자동 배포

### 1단계: 파일 수정

Cursor에서 `index.html` 열기:
```html
<h1>환영합니다</h1>
```

내용 변경:
```html
<h1>환영합니다 - 업데이트됨!</h1>
```

`Ctrl + S`로 저장

### 2단계: Git 커밋

Cursor 터미널에서:
```bash
git add .
git commit -m "제목 업데이트"
git push
```

### 3단계: 배포 확인

1. Cloudflare Pages 대시보드 접속
2. 프로젝트 클릭
3. "Deployments" 탭에서 진행 상황 확인

빌드 로그를 보면:
```
Initializing build environment
Cloning repository
Building application
Deploying to Cloudflare's global network
Success!
```

### 4단계: 사이트 확인

1~2분 후:
1. 사이트 URL 접속
2. 새로고침 (Ctrl + F5)
3. 변경사항 확인

## 브랜치별 배포

### Production (메인)

`main` 브랜치 푸시 시:
```
https://my-website.pages.dev
```

### Preview (미리보기)

다른 브랜치 푸시 시:
```
https://브랜치명.my-website.pages.dev
```

예시:
```bash
git checkout -b feature/new-design
git push origin feature/new-design
```

배포 URL:
```
https://feature-new-design.my-website.pages.dev
```

## 배포 워크플로우 예제

### 시나리오: 회사 로고 변경

#### 1. 새 브랜치 생성
```bash
git checkout -b update-logo
```

#### 2. 로고 파일 교체
```bash
# 새 logo.png 파일을 프로젝트 폴더에 복사
```

#### 3. HTML 수정
```html
<img src="logo.png" alt="회사 로고">
```

#### 4. 푸시 & 미리보기
```bash
git add .
git commit -m "로고 업데이트"
git push origin update-logo
```

미리보기 URL:
```
https://update-logo.my-website.pages.dev
```

#### 5. 확인 후 메인에 병합
```bash
git checkout main
git merge update-logo
git push origin main
```

최종 배포:
```
https://my-website.pages.dev
```

## 빌드 설정 커스터마이징

### 빌드 명령어 추가

간단한 HTML 사이트는 불필요하지만, 필요시:

1. Cloudflare Pages 대시보드
2. 프로젝트 설정 클릭
3. "Builds & deployments" 탭
4. "Configure Production deployments" 클릭

### 환경별 설정

#### Production
```
Branch: main
Build command: (없음)
Build output: /
```

#### Preview
```
All other branches
Build command: (없음)
Build output: /
```

## 배포 알림 설정

### 이메일 알림

1. 프로젝트 설정
2. "Notifications" 탭
3. "Deployment notifications" 활성화

알림 받는 경우:
- 배포 성공
- 배포 실패
- 빌드 에러

### 슬랙 연동 (선택)

1. "Slack integration" 클릭
2. Workspace 선택
3. 채널 선택 (예: #deployments)
4. 권한 승인

## 배포 히스토리

### 이전 버전 보기

1. "Deployments" 탭
2. 배포 목록에서 원하는 버전 클릭
3. "View deployment" 클릭

각 배포마다 고유 URL:
```
https://abc123.my-website.pages.dev
```

### 롤백 (이전 버전으로 되돌리기)

문제가 생긴 경우:

#### 방법 1: 대시보드에서
1. 이전 성공 배포 클릭
2. "Rollback to this deployment" 클릭
3. 확인

#### 방법 2: Git으로
```bash
git revert HEAD
git push
```

## 배포 속도 최적화

### 파일 크기 줄이기

#### 이미지 압축
- 온라인 도구: TinyPNG, Squoosh
- 큰 이미지는 리사이징

#### CSS/JS 정리
- 사용하지 않는 코드 제거
- 공백, 주석 제거

### 캐싱 활용

Cloudflare가 자동으로 처리:
- 정적 파일 캐싱
- 이미지 최적화
- 자동 압축 (gzip, brotli)

## 실전 팁

### 자주 배포하기
작은 변경사항이라도 자주 푸시:
- 문제 발생 시 쉽게 롤백
- 변경사항 추적 용이

### 커밋 메시지 명확히
```bash
# 나쁜 예
git commit -m "수정"

# 좋은 예
git commit -m "연락처 페이지 이메일 주소 업데이트"
```

### 브랜치 전략
```
main          → 실제 서비스 (프로덕션)
develop       → 개발 중 (미리보기)
feature/*     → 새 기능 (임시 미리보기)
```

## 배포 시간

### 일반적인 소요 시간

정적 HTML 사이트:
```
빌드: 10~30초
배포: 20~40초
전체: 1분 이내
```

프레임워크 사용 시:
```
빌드: 1~3분
배포: 30초~1분
전체: 2~4분
```

### 배포 진행 상황 확인

터미널에서 실시간 확인:
```bash
git push
# 푸시 후 즉시 대시보드 확인
```

또는 이메일 알림 대기

## 흔한 문제 해결

### 배포가 자동으로 안 돼요

GitHub 연결 확인:
1. Cloudflare Pages 설정
2. "Git configuration"
3. "Reconnect" 클릭

### 변경사항이 안 보여요

브라우저 캐시 삭제:
- `Ctrl + Shift + R` (강력 새로고침)
- 또는 시크릿 모드로 확인

### 배포가 계속 실패해요

빌드 로그 확인:
1. 실패한 배포 클릭
2. "View build log" 클릭
3. 에러 메시지 확인

## 다음 단계

자동 배포를 설정했습니다. 이제 내 도메인을 연결해봅시다!
