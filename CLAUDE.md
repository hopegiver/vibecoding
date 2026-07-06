# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

<!-- 구조 드리프트 대조: .claude/doc-drift.json + `pnpm run check-docs`. 전역 SessionStart 훅이 세션 시작 시 자동 경고. -->

## 새 세션 부트스트랩 (읽기 순서 = 토큰 예산)
새 세션은 **자동 주입되는 `STATUS.md` + 이 `CLAUDE.md` 두 개면 오리엔테이션이 끝난다.** 현 상황 파악하려고 코드/docs를 통독하지 말 것.
- **L0 (자동 주입):** `STATUS.md`(라이브 상태) + `CLAUDE.md`(안정 구조·규칙). → 시작에 충분.
- **L1 (필요 시 pull):** malgnai-mcp `get_current_context` / `decision_list` / `memory_search`.
- **L2 (깊은 작업만):** `docs/README.md` 지도 → 필요한 문서만.

**필수 규율:** ①진행 상태는 `STATUS.md` 단일 소스(끝내기 전 갱신). ②주요 결정/이슈/교훈은 malgnai-mcp에 기록. ③구조를 바꾸면 `.claude/doc-drift.json`과 아래 서술을 함께 갱신. ④작업 후에는 커밋 → 푸시 → Cloudflare Pages 배포까지 완료한다(프로젝트 목표에 명시됨).

## Project Overview
vibecoding — 맑은소프트 직원/비개발자를 위한 바이브 코딩 가이드북. Cursor + GitHub + Cloudflare Pages/Workers로 30분 만에 웹사이트를 만드는 법을 다루며, 소스 코드보다 **AI에게 어떻게 프롬프트를 줄지**를 중심으로 서술한다.

## Tech Stack
- Astro 7 + `@astrojs/starlight` (정적 사이트, SEO/SSG)
- 콘텐츠: Markdown/MDX (`src/content/docs/*.md`, `index.mdx`)
- 배포: Cloudflare Pages (main 브랜치 push → 자동 재배포)
- 패키지 매니저: pnpm

## Commands
```bash
pnpm install            # 의존성 설치
pnpm run dev            # 로컬 개발 서버 (astro dev)
pnpm run build          # 정적 빌드 → dist/
pnpm run preview        # 빌드 결과 미리보기
pnpm run check-docs     # 구조 서술 ↔ 코드 실측 드리프트 대조
```

## Architecture
- `src/content/docs/*.md` — 실제 가이드 문서 페이지 (현재 61개, `astro.config.mjs`의 `sidebar` slug와 1:1 대응)
- `astro.config.mjs` — Starlight 설정: 사이트 제목, 소셜 링크, 사이드바 목차(8개 섹션: 시작하기 → Cursor 사용법 → 첫 웹사이트 → Pages 배포 → 실전 프로젝트 → 프로젝트 관리/최적화 → Pages Functions → Workers)
- `public/` — 정적 자산(favicon 등)
- `docs/` — 코드 밖 부산물: `output/`(생성된 HTML/PDF), `reviewer/`(리뷰 페르소나), `screenshots/`(데스크톱/모바일 캡처). Astro 빌드 대상 아님.
- `dist/` — 빌드 산출물 (배포용, 커밋 대상 아님)

새 가이드 문서를 추가하면 ① `src/content/docs/`에 `.md` 생성 ② `astro.config.mjs` sidebar에 slug 등록 ③ `.claude/doc-drift.json`의 문서 페이지 수 `expected` 값을 갱신한다.
