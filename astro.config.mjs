// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// 배포 도메인. sitemap.xml, canonical URL, SEO 메타태그가 이 값을 기준으로 생성됩니다.
// 커스텀 도메인 연결 시 이 값을 그 주소로 변경하세요.
const SITE = 'https://malgn-vibecoding.pages.dev';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: '바이브 코딩 가이드북',
      description: '맑은소프트 직원들을 위한 쉽고 빠른 웹 개발 가이드',
      favicon: '/favicon.png',
      defaultLocale: 'root',
      locales: {
        root: { label: '한국어', lang: 'ko' },
      },
      logo: {
        src: './src/assets/malgnsoft-logo.png',
        alt: '맑은소프트',
        replacesTitle: false,
      },
      social: [
        { icon: 'external', label: '맑은소프트', href: 'https://www.malgnsoft.com' },
      ],
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'google-site-verification',
            content: 'd5yC82g3M7a2_H7qoHI0YWmn8AckdW0ITsDrZFiAOso',
          },
        },
      ],
      lastUpdated: true,
      pagination: true,
      sidebar: [
        {
          label: '1. 시작하기',
          items: [
            { label: '바이브 코딩이란?', slug: 'what-is-vibe-coding' },
            { label: 'Git 설치하기', slug: 'git-setup' },
            { label: 'Cursor 설치하기', slug: 'cursor-setup' },
            { label: 'GitHub 계정 만들기', slug: 'github-account' },
            { label: 'Cloudflare 계정 만들기', slug: 'cloudflare-account' },
          ],
        },
        {
          label: '2. Cursor 사용법',
          items: [
            { label: '첫 화면 이해하기', slug: 'cursor-basics' },
            { label: 'AI와 대화하기', slug: 'cursor-chat' },
            { label: '좋은 질문 하는 법', slug: 'how-to-ask-ai' },
            { label: '자주 쓰는 단축키', slug: 'cursor-shortcuts' },
          ],
        },
        {
          label: '3. 첫 웹사이트 만들기',
          items: [
            { label: 'HTML 기초', slug: 'html-basics' },
            { label: 'CSS로 꾸미기', slug: 'css-basics' },
            { label: 'HTML 페이지 만들기', slug: 'first-html-page' },
            { label: '이미지와 링크 추가하기', slug: 'html-images-links' },
            { label: 'JavaScript 소개', slug: 'javascript-intro' },
            { label: '버튼 클릭 이벤트 만들기', slug: 'javascript-events' },
            { label: 'JavaScript vs TypeScript', slug: 'js-vs-ts' },
            { label: 'JSON 데이터 이해하기', slug: 'json-basics' },
            { label: 'JSON 파일 만들고 읽기', slug: 'json-file-read' },
            { label: '데이터 목록 표시하기', slug: 'json-display-data' },
          ],
        },
        {
          label: '4. Pages 배포하기',
          items: [
            { label: 'GitHub에 코드 올리기', slug: 'push-to-github' },
            { label: 'Pages 소개', slug: 'pages-introduction' },
            { label: '드래그 앤 드롭 배포', slug: 'pages-deploy-drag' },
            { label: 'GitHub 연결하기', slug: 'pages-deploy-git' },
            { label: '자동 배포 설정', slug: 'pages-auto-deploy' },
            { label: '도메인 연결하기', slug: 'pages-custom-domain' },
          ],
        },
        {
          label: '5. 실전 프로젝트',
          items: [
            { label: '회사 소개 페이지', slug: 'project-company-intro' },
            { label: '제품 카탈로그', slug: 'project-product-catalog' },
            { label: 'FAQ 페이지', slug: 'project-faq-page' },
            { label: '설문조사 페이지', slug: 'project-survey' },
            { label: '포트폴리오', slug: 'project-portfolio' },
            { label: '할일 목록 만들기', slug: 'project-todo-list' },
            { label: '간단한 계산기', slug: 'project-calculator' },
            { label: '간단한 블로그', slug: 'project-simple-blog' },
            { label: '직원 명부 만들기', slug: 'project-employee-list' },
            { label: '템플릿 활용하기', slug: 'quick-start-template' },
          ],
        },
        {
          label: '6. 프로젝트 관리와 최적화',
          items: [
            { label: '프로젝트 폴더 구조', slug: 'project-structure' },
            { label: '효율적인 개발 워크플로우', slug: 'dev-workflow' },
            { label: '코드 최적화와 리팩토링', slug: 'code-optimization' },
          ],
        },
        {
          label: '7. Pages Functions',
          items: [
            { label: 'Functions 소개', slug: 'pages-functions-intro' },
            { label: 'API 만들기', slug: 'simple-api' },
            { label: '폼 제출 처리', slug: 'form-handling' },
            { label: 'JSON 업데이트', slug: 'update-json-with-functions' },
          ],
        },
        {
          label: '8. Workers (개발자용)',
          items: [
            { label: 'Workers 기초', slug: 'workers-basics' },
            { label: 'Workers와 Functions 비교', slug: 'workers-vs-functions' },
            { label: '환경 변수와 Secrets', slug: 'workers-env-secrets' },
            { label: 'KV 스토리지', slug: 'kv-storage' },
            { label: 'D1 데이터베이스', slug: 'd1-database' },
            { label: 'R2 파일 스토리지', slug: 'r2-storage' },
            { label: '사용자 인증 (JWT)', slug: 'workers-auth' },
            { label: 'OpenAPI 문서 만들기', slug: 'workers-openapi' },
            { label: '실전: REST API 만들기', slug: 'workers-rest-api' },
            { label: '실전: AI 챗봇 만들기', slug: 'workers-ai-chatbot' },
            { label: '로깅과 모니터링', slug: 'workers-logging' },
            { label: '테스트 작성하기', slug: 'workers-testing' },
          ],
        },
        {
          label: '9. 팁과 트릭',
          items: [
            { label: '자주 하는 실수', slug: 'common-mistakes' },
            { label: '디버깅하는 법', slug: 'debugging-tips' },
            { label: '무료 리소스 모음', slug: 'free-resources' },
            { label: '디자인 팁', slug: 'design-tips' },
          ],
        },
        {
          label: '10. 문제 해결',
          items: [
            { label: '에러 메시지 읽기', slug: 'reading-errors' },
            { label: '자주 묻는 질문', slug: 'faq' },
            { label: '도움 받기', slug: 'getting-help' },
          ],
        },
      ],
    }),
  ],
});
