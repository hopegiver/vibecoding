# 폼 제출 처리하기

Pages Functions를 사용해 문의 폼, 가입 폼 등을 처리하는 방법을 배워봅시다.

## 기본 문의 폼

### 1단계: HTML 폼

Cursor에게 요청:
```
간단한 문의 폼 만들어줘.

contact.html:
- 이름 (필수)
- 이메일 (필수)
- 메시지 (필수, textarea)
- 제출 버튼

POST로 /api/contact에 전송
```

### 2단계: Function 만들기

Cursor에게 요청:
```
functions/api/contact.js 만들어줘.

기능:
- POST 요청 처리
- FormData 읽기
- 입력 검증 (이름, 이메일, 메시지)
- 콘솔에 로그 출력
- 성공 응답 JSON 반환

이메일 전송은 아직 구현 안 함.
검증만 하고 응답해줘.
```

### 3단계: 클라이언트 처리

Cursor에게 요청:
```
contact.html에 JavaScript 추가해줘.

폼 제출 시:
- 기본 동작 막기 (preventDefault)
- fetch로 POST 요청
- 로딩 상태 표시
- 성공 시 감사 메시지
- 실패 시 에러 메시지
- 폼 초기화
```

## 이메일 전송

### Resend 사용

Cursor에게 요청:
```
Resend API로 이메일 전송 기능 추가해줘.

functions/api/contact.js 수정:
1. Resend API 키 환경 변수로 받기
2. fetch로 Resend API 호출
3. 이메일 발송
4. 성공/실패 응답

이메일 내용:
- From: noreply@mydomain.com
- To: contact@mydomain.com
- Subject: "새 문의: [이름]"
- Body: 이름, 이메일, 메시지
```

### 환경 변수 설정

Cloudflare Pages 대시보드:
1. Settings → Environment variables
2. `RESEND_API_KEY` 추가
3. 재배포

## 스팸 방지

### 간단한 Honeypot

Cursor에게 요청:
```
Honeypot 필드로 스팸 방지 추가해줘.

HTML에:
- 숨겨진 필드 추가 (CSS로 display: none)
- 이름: "phone" (봇이 채우기 쉬운 이름)

Functions에:
- phone 필드에 값이 있으면 거부
- 400 응답 (스팸으로 간주)
```

### Rate Limiting

Cursor에게 요청:
```
간단한 rate limiting 추가해줘.

메모리 변수로:
- IP 주소별 요청 기록
- 1분에 3회 제한
- 초과 시 429 Too Many Requests
```

## 파일 업로드

### 이미지 업로드

Cursor에게 요청:
```
파일 업로드 폼 만들어줘.

upload.html:
- 파일 선택 (이미지만)
- 미리보기
- 업로드 버튼

functions/api/upload.js:
- multipart/form-data 처리
- 파일 타입 검증 (이미지만)
- 파일 크기 검증 (5MB 이하)
- Base64로 인코딩해서 응답 (실제 저장 X)

나중에 R2 스토리지 연결 가능하게
기본 구조만 만들어줘.
```

## 다단계 폼

### 여러 페이지 폼

Cursor에게 요청:
```
3단계 가입 폼 만들어줘.

1단계: 기본 정보 (이름, 이메일)
2단계: 추가 정보 (전화, 주소)
3단계: 확인 및 제출

진행 표시기 포함.
LocalStorage에 임시 저장.
마지막 단계에서 API 전송.
```

## 다음 단계

폼 처리의 기본을 배웠습니다!

더 고급 기능:
- KV로 제출 내역 저장
- D1 데이터베이스 연동
- Turnstile (Cloudflare Captcha)
- Webhook 연동
