# STATUS — vibecoding (바이브 코딩 가이드북)
_최종 갱신: 2026-07-06 (auto-pulse)_
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
- 작업 트리 클린, 커밋 `cc07c8f` 푸시 완료
- Google Search Console 소유권 확인은 **메타 태그 방식**(astro.config.mjs `head`)으로 전환 완료, 사이트맵 2개(`sitemap-0.xml`, `sitemap-index.xml`) 제출함 — "가져올 수 없음" 표시돼 재확인 필요(사이트맵 자체는 curl로 정상 200 확인됨, 제출 시점 일시적 실패로 추정)
- **`pnpm deploy` 추가 완료**: `wrangler` devDependency로 추가, `astro build && wrangler pages deploy dist --project-name=malgn-vibecoding` 스크립트로 로컬 빌드 후 Cloudflare에 직접 업로드 가능(GitHub 연동 배포보다 훨씬 빠름, 테스트 완료 — 약 3초)

## ✅ 최근 완료
- docsify → Astro Starlight 전환 (SEO/SSG) — 커밋 `8f6cedd`
- Workers 환경 변수·로깅 모니터링 문서 추가 — 커밋 `b683f74`
- 가이드북 대폭 개선 및 Workers 섹션 재구성 — 커밋 `dfde749`
- Cloudflare Pages 재배포 트리거 — 커밋 `bd78001`
- 프로젝트 운영 표준 스캐폴드 보완: `STATUS.md`·`CLAUDE.md`·`docs/README.md`·`.claude/doc-drift.json` 생성 (2026-07-03)
- favicon 정사각형 아이콘 교체, 홈 히어로 중복 로고 제거·타이틀 2줄 처리, `javascript-events.md`/`project-calculator.md` 프롬프트 중심 재작성 — 커밋 `2d81be7` (2026-07-06)
- Google Search Console 사이트 소유권 확인 HTML 추가 — 커밋 `1d0f455` (2026-07-06)
- Search Console 확인 방식을 메타 태그로 전환(HTML 파일 방식은 Cloudflare Pages 404 이슈로 폐기) — 커밋 `b87d3be` (2026-07-06)
- `pnpm deploy` 스크립트 추가(wrangler direct upload) — 커밋 `cc07c8f` (2026-07-06)

## 🚧 진행 중 / 다음
- 기존 문서 중 소스 코드 위주로 서술된 부분을 프롬프트 중심 설명으로 재작성 (진행 중)
  - ✅ `project-calculator.md`, `javascript-events.md` 완료
  - 🔜 `javascript-intro.md`, `json-file-read.md` 등 추가 후보
- Search Console 사이트맵 "가져올 수 없음" 상태 재확인 필요 (삭제 후 재제출 권장했음)
- `public/robots.txt`에 Sitemap 지시자 추가 여부 (사용자 확인 대기 중, 현재 robots.txt 자체가 404)

## ⛔ 막힌 것 / 열린 이슈
- 없음 (Cloudflare Pages 배포 지연 건은 결국 정상 반영되어 해소됨)
