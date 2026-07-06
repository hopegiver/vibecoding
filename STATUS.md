# STATUS — vibecoding (바이브 코딩 가이드북)
_최종 갱신: 2026-07-03 (auto-pulse)_
<!-- malgnai-mcp project_id: c79ec4b6-59d4-40e6-b8f2-b72121776937 -->

> **vibecoding** = 맑은소프트 직원/비개발자를 위한 바이브 코딩 가이드북 웹사이트(Astro Starlight, Cloudflare Pages 배포)
> **새 세션은 이 파일(라이브 상태) + `CLAUDE.md`(구조·규칙)면 오리엔테이션 충분.** 구조 상세는 malgnai-mcp `get_current_context`, 깊은 문서는 `docs/README.md`. 상황 파악하려고 코드/docs 통독 금지.
> 이 파일이 진행 상태의 **단일 소스**다. 착수 전 읽고, 상태가 바뀌면 끝내기 전 갱신.

## 🎯 목표 (malgnai-mcp goal)
- docsify → Astro Starlight 전환 완료 → 구글 검색 노출 + 맑은소프트 홍보
- 비개발자도 따라할 수 있도록 **소스 코드보다 프롬프트 중심**으로 문서 작성
- 작업 후에는 반드시 커밋 → 푸시 → 배포까지 완료할 것

## 🟢 현재 상태
- Astro Starlight 기반 사이트로 전환 완료, Cloudflare Pages에 배포 중 (main 브랜치 = 배포 소스)
- `src/content/docs/*.md` 61개 문서 페이지 ↔ `astro.config.mjs` 사이드바 slug 61개 — 일치
- 작업 트리에 미커밋 변경 있음: `public/favicon.png`, `src/content/docs/index.mdx` 수정 + `assets/`, `docs/` 신규(미추적)

## ✅ 최근 완료
- docsify → Astro Starlight 전환 (SEO/SSG) — 커밋 `8f6cedd`
- Workers 환경 변수·로깅 모니터링 문서 추가 — 커밋 `b683f74`
- 가이드북 대폭 개선 및 Workers 섹션 재구성 — 커밋 `dfde749`
- Cloudflare Pages 재배포 트리거 — 커밋 `bd78001`
- 프로젝트 운영 표준 스캐폴드 보완: `STATUS.md`·`CLAUDE.md`·`docs/README.md`·`.claude/doc-drift.json` 생성 (2026-07-03)

## 🚧 진행 중 / 다음
- favicon.png, index.mdx 변경사항 확인 후 커밋 → 푸시 → Cloudflare Pages 배포 확인 (Bash 환경 복구 후 진행)
- `assets/`, `docs/` 신규 디렉토리 내용 검토 후 필요 시 커밋(또는 .gitignore 처리)
- 기존 문서 중 소스 코드 위주로 서술된 부분을 프롬프트 중심 설명으로 재작성 (진행 중)
  - ✅ `project-calculator.md` — 500줄 코드 덤프 → 프롬프트 중심 가이드로 재작성 완료 (미커밋)
  - ✅ `javascript-events.md` — 코드 중심 → 프롬프트 중심으로 재작성 완료 (미커밋)
  - 🔜 `javascript-intro.md`, `json-file-read.md` 등 추가 후보

## ⚠️ 현재 환경 제약
- **Bash 도구 EPERM 오류**: `/private/tmp/claude-501/` 샌드박스 디렉토리 생성 불가 → git commit/push 불가
- 복구 방법: `sudo mkdir -p /private/tmp/claude-501 && sudo chmod 700 /private/tmp/claude-501` 실행 후 재시도

## ⛔ 막힌 것 / 열린 이슈
- **Bash EPERM 차단**: git commit/push 불가. `/private/tmp/claude-501/` 권한 복구 필요.
