# docs/ 문서 지도 (에이전트 진입점)

> 무엇을 어디서 읽을지 여기서 먼저 확인. 현 상태의 정답은 항상 코드 + `/STATUS.md`.
> 이 `docs/`는 사이트 콘텐츠가 아니라 코드 밖 부산물 모음이다. 실제 가이드 페이지는 `/src/content/docs/*.md`에 있다.

## 🧭 먼저 읽을 것
1. `/STATUS.md` — 현재 진행 상태(단일 소스)
2. `/CLAUDE.md` — 개요·구조·규칙
3. malgnai-mcp `get_current_context` — 검색 가능한 결정/이슈/메모리

## 📂 폴더
- `output/` — 가이드북 전체를 단일 문서로 뽑아낸 산출물(`바이브코딩-시작하기.html`, `.pdf`)
- `reviewer/personas/` — 콘텐츠 리뷰용 페르소나 정의
- `screenshots/` — 사이트 데스크톱/모바일 캡처(회고·리뷰용)

## 🌐 실제 가이드 콘텐츠는 여기
- `/src/content/docs/*.md` — Starlight가 렌더링하는 61개 가이드 페이지
- `/astro.config.mjs` — 사이드바 목차 구성

> **정확성 보증:** 새 세션 시작 시 드리프트 가드가 `.claude/doc-drift.json`으로 문서↔코드를 대조. 수동 `pnpm run check-docs`.
