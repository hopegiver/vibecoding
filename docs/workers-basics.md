# Workers로 백엔드 만들기

Cloudflare Workers로 더 강력한 백엔드 기능을 만들어봅시다.

## Pages Functions vs Workers

### Pages Functions
- 정적 사이트에 기능 추가
- `functions/` 폴더에 파일
- GitHub 연동 자동 배포

### Workers
- 순수 백엔드 서비스
- 더 많은 기능과 유연성
- 별도 프로젝트

## 비개발자를 위한 팁

**대부분의 경우 Pages Functions로 충분합니다!**

Workers는 이런 경우에만 필요:
- 복잡한 백엔드 로직
- 여러 프로젝트에서 공유하는 API
- 고급 라우팅 필요

**초보자는 Pages Functions 사용을 권장합니다.**

## Workers 기본 예제

### 간단한 Worker

Cursor에게 요청:
```
Cloudflare Worker 예제 만들어줘.

간단한 Hello World:
- GET 요청에 JSON 응답
- 시간 정보 포함
- CORS 헤더 추가

worker.js 파일로 작성해줘.
```

### KV 스토리지 사용

Cursor에게 요청:
```
Worker에서 KV 스토리지 사용하는 예제 만들어줘.

기능:
- GET: 저장된 값 조회
- POST: 새 값 저장

KV 네임스페이스: MY_KV

간단한 키-값 저장소로.
```

## 배포 방법

### 1. Wrangler로 배포
```bash
wrangler deploy
```

### 2. 대시보드에서 배포
1. Cloudflare 대시보드
2. Workers & Pages
3. Create Worker
4. 코드 붙여넣기
5. Deploy

## 다음 단계

Workers는 고급 주제입니다.
먼저 Pages Functions를 마스터하세요!

더 배우고 싶다면:
- Cloudflare Workers 공식 문서
- Workers Examples
- D1 데이터베이스 (SQL)
- R2 스토리지 (파일)
