# Cloudflare 계정 만들기

Cloudflare는 웹사이트를 빠르고 안전하게 인터넷에 올려주는 서비스입니다. Pages 기능을 사용하면 무료로 웹사이트를 배포할 수 있습니다.

## Cloudflare Pages란?

- GitHub에 코드를 푸시하면 자동으로 웹사이트 업데이트
- 무료로 무제한 대역폭
- HTTPS 자동 적용 (보안 연결)
- 전 세계에서 빠른 속도
- 커스텀 도메인 연결 가능

## 1단계: Cloudflare 가입하기

### 회원가입
1. https://dash.cloudflare.com/sign-up 접속
2. 이메일 주소 입력
3. 비밀번호 입력 (8자 이상, 영문+숫자 조합)
4. "Create Account" 버튼 클릭

### 이메일 인증
1. 입력한 이메일 확인
2. Cloudflare에서 온 이메일 열기
3. "Verify email" 버튼 클릭
4. 이메일이 인증되었다는 메시지 확인

## 2단계: 대시보드 둘러보기

처음 로그인하면 Cloudflare 대시보드가 나타납니다.

### 주요 메뉴
- **Workers & Pages**: 웹사이트를 배포하는 곳 (우리가 주로 사용)
- **Domains**: 도메인 관리
- **Analytics**: 방문자 통계
- **Account**: 계정 설정

## 3단계: Pages 접속해보기

1. 좌측 메뉴에서 "Workers & Pages" 클릭
2. "Create application" 버튼 클릭
3. "Pages" 탭 선택
4. "Connect to Git" 옵션 확인

아직 저장소를 연결하지는 않습니다. 나중에 할 거예요!

## 4단계: 계정 설정 확인

### 프로필 설정
1. 우측 상단 프로필 아이콘 클릭
2. "My Profile" 선택
3. 다음 정보 확인/수정:
   - Name (이름)
   - Email (이메일)
   - Communication Preferences (알림 설정)

## 무료 플랜으로 할 수 있는 것

Cloudflare Pages는 무료 플랜이 매우 관대합니다:

### 무료 플랜 혜택
- 무제한 사이트
- 무제한 요청
- 무제한 대역폭
- 월 500회 빌드
- 동시 빌드 1개
- HTTPS 자동 적용
- 글로벌 CDN

### 유료 플랜 (Pro)
- 월 $20
- 월 5,000회 빌드
- 동시 빌드 5개
- 고급 빌드 설정

대부분의 프로젝트는 무료 플랜으로 충분합니다!

## Cloudflare vs 다른 서비스

### Cloudflare Pages 장점
- 완전 무료
- 무제한 대역폭
- 매우 빠른 속도
- 자동 HTTPS
- GitHub 자동 연동

### Netlify (유사 서비스)
- 무료 플랜: 월 100GB 대역폭 제한
- 유료 플랜: 월 $19

### Vercel (유사 서비스)
- 무료 플랜: 월 100GB 대역폭 제한
- 유료 플랜: 월 $20

Cloudflare가 가장 관대한 무료 플랜을 제공합니다!

## 보안 설정 (선택사항)

### 2단계 인증 활성화
1. 프로필 > Authentication 클릭
2. "Two-Factor Authentication" 섹션
3. 인증 앱 사용 (Google Authenticator, Authy 등)
4. QR 코드 스캔
5. 인증 코드 입력

### API 토큰
나중에 고급 기능을 사용하려면 API 토큰이 필요할 수 있습니다.
- My Profile > API Tokens
- 필요할 때 만들면 됩니다
- 지금은 필요 없어요

## 용어 설명

### CDN (Content Delivery Network)
- 전 세계 서버에 콘텐츠를 분산 저장
- 사용자와 가까운 서버에서 콘텐츠 제공
- 속도가 빨라집니다

### Build (빌드)
- 코드를 웹사이트로 변환하는 과정
- GitHub에 푸시하면 자동으로 실행

### Deploy (배포)
- 웹사이트를 인터넷에 올리는 것
- 빌드가 완료되면 자동으로 배포됩니다

### Domain (도메인)
- 웹사이트 주소 (예: www.example.com)
- Cloudflare에서 무료로 *.pages.dev 도메인 제공

## 다음 단계

이제 필요한 계정이 모두 준비되었습니다:
- Cursor (코딩 도구)
- GitHub (코드 저장소)
- Cloudflare (웹사이트 배포)

다음 장에서는 Cursor를 본격적으로 사용하는 방법을 배워봅시다!
