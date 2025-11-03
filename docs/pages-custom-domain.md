# 내 도메인 연결하기

`프로젝트명.pages.dev` 대신 내가 가진 도메인을 연결해봅시다.

## 도메인이란?

웹사이트 주소:
```
https://프로젝트명.pages.dev  →  https://www.example.com
```

더 전문적이고 기억하기 쉬운 주소가 됩니다.

## 사전 준비

필요한 것:
- 도메인 (구매해야 함)
- Cloudflare 계정
- Pages에 배포된 프로젝트

## 도메인 구매하기

### 도메인 구매 사이트

한국:
- 가비아 (gabia.com)
- 후이즈 (whois.co.kr)
- 호스팅케이알 (hosting.kr)

해외:
- Namecheap
- GoDaddy
- Cloudflare Registrar (추천)

### 도메인 가격

일반적인 가격:
```
.com     →  연 10,000~15,000원
.net     →  연 12,000~18,000원
.kr      →  연 15,000~20,000원
.co.kr   →  연 20,000~25,000원
```

## 방법 1: Cloudflare에서 도메인 구매 (가장 쉬움)

### 장점
- DNS 설정 자동
- 추가 설정 불필요
- 도메인 비용만 지불 (수수료 없음)

### 구매 과정

1. Cloudflare 대시보드
2. 왼쪽 "Domain Registration" 클릭
3. "Register Domain" 클릭
4. 원하는 도메인 검색
5. 사용 가능하면 "Purchase" 클릭
6. 결제 정보 입력

## 방법 2: 다른 곳에서 구매한 도메인 연결

### 1단계: Cloudflare에 도메인 추가

1. Cloudflare 대시보드
2. "Add a Site" 클릭
3. 도메인 입력 (예: example.com)
4. 플랜 선택 (Free 선택)
5. "Continue" 클릭

### 2단계: DNS 레코드 스캔

Cloudflare가 자동으로 기존 DNS 레코드를 가져옵니다.
- "Continue" 클릭

### 3단계: 네임서버 변경

Cloudflare가 제공하는 네임서버 복사:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

도메인 구매한 곳에서 네임서버 변경:

#### 가비아
1. 로그인
2. "My 가비아" > "도메인 관리"
3. 도메인 클릭
4. "네임서버" 탭
5. "네임서버 변경" 클릭
6. Cloudflare 네임서버 입력

#### 후이즈
1. 로그인
2. "도메인 관리"
3. "네임서버 설정"
4. Cloudflare 네임서버 입력

변경 반영: 최대 24시간 (보통 1~2시간)

### 4단계: Cloudflare에서 확인 대기

Cloudflare 대시보드에서:
- "Recheck now" 클릭
- 네임서버 변경이 감지되면 활성화

## Pages에 도메인 연결

### 1단계: Custom Domain 추가

1. Cloudflare Pages 프로젝트 열기
2. "Custom domains" 탭 클릭
3. "Set up a custom domain" 클릭

### 2단계: 도메인 입력

도메인 입력:
```
www.example.com
```

또는
```
example.com
```

"Continue" 클릭

### 3단계: DNS 레코드 확인

Cloudflare가 자동으로 DNS 레코드를 추가:
```
CNAME   www   프로젝트명.pages.dev
```

"Activate domain" 클릭

### 4단계: 확인

몇 분 후:
- "Active" 상태로 변경
- SSL 인증서 자동 발급 (https://)

## 서브도메인 추가

### 예시
```
www.example.com       →  메인 사이트
blog.example.com      →  블로그
shop.example.com      →  쇼핑몰
```

### 추가 방법

1. "Set up a custom domain" 클릭
2. 서브도메인 입력:
   ```
   blog.example.com
   ```
3. "Continue" 클릭
4. 자동으로 DNS 레코드 생성

## www 리디렉션 설정

### www 있음 → 없음

`www.example.com` → `example.com`

1. Cloudflare 대시보드 (도메인)
2. "Rules" 탭
3. "Page Rules" 클릭
4. "Create Page Rule" 클릭

설정:
```
URL: www.example.com/*
Setting: Forwarding URL
Status Code: 301 (Permanent Redirect)
Destination: https://example.com/$1
```

### 없음 → www 있음

`example.com` → `www.example.com`

동일하게 설정하되 URL을 반대로:
```
URL: example.com/*
Destination: https://www.example.com/$1
```

## SSL/TLS 설정

### 자동 HTTPS

Cloudflare Pages는 자동으로 SSL 인증서 발급:
- Let's Encrypt 사용
- 무료
- 자동 갱신

### 설정 확인

1. Cloudflare 대시보드 (도메인)
2. "SSL/TLS" 탭
3. 암호화 모드:
   ```
   Full (strict) ← 이것 선택
   ```

### HTTPS 강제 적용

모든 HTTP 요청을 HTTPS로:

1. "SSL/TLS" 탭
2. "Edge Certificates"
3. "Always Use HTTPS" 활성화

## 실전 예제

### 시나리오: 회사 웹사이트 도메인 연결

#### 1. 도메인 구매
```
malgeunsoftware.com (가비아에서 구매)
```

#### 2. Cloudflare에 추가
1. "Add a Site" 클릭
2. `malgeunsoftware.com` 입력
3. Free 플랜 선택

#### 3. 네임서버 변경
가비아에서 네임서버를:
```
ns1.cloudflare.com
ns2.cloudflare.com
```
로 변경

#### 4. Pages에 연결
1. Pages 프로젝트 열기
2. "Custom domains" 탭
3. `www.malgeunsoftware.com` 추가

#### 5. 최종 결과
```
https://www.malgeunsoftware.com
```

## 도메인 확인

### DNS 전파 확인

온라인 도구 사용:
- whatsmydns.net
- dnschecker.org

여러 지역에서 도메인이 정상적으로 연결되는지 확인

### 브라우저 테스트

1. 도메인 접속
2. SSL 인증서 확인 (자물쇠 아이콘)
3. 모든 페이지 정상 작동 확인

## 흔한 문제 해결

### 도메인이 안 열려요

#### DNS 전파 대기
네임서버 변경 후 최대 24시간 대기

#### 캐시 삭제
```bash
# Windows
ipconfig /flushdns

# Mac
sudo dscacheutil -flushcache
```

### SSL 인증서 에러

"Your connection is not private" 에러:
1. 24시간 대기 (인증서 발급 중)
2. Cloudflare 대시보드에서 SSL 설정 확인
3. "Full (strict)" 모드 확인

### www 없는 주소가 안 열려요

Apex 도메인 (www 없음) 추가:
1. Pages에서 `example.com`도 추가
2. DNS 레코드 자동 생성 확인

### 이전 사이트가 계속 보여요

브라우저 캐시:
- `Ctrl + Shift + R` (강력 새로고침)
- 시크릿 모드로 확인

## 도메인 이메일 설정 (선택)

### Cloudflare Email Routing

무료로 도메인 이메일 사용:
```
contact@example.com  →  개인 이메일로 전달
```

설정:
1. Cloudflare 대시보드
2. "Email" 탭
3. "Email Routing" 클릭
4. 전달 주소 추가

## 비용 정리

### 필수 비용
```
도메인 등록: 연 10,000~20,000원
```

### 무료
```
Cloudflare Pages: 무료
SSL 인증서: 무료
CDN: 무료
Email Routing: 무료
```

## 다음 단계

도메인 연결을 완료했습니다. 이제 JavaScript로 인터랙티브한 기능을 추가해봅시다!
