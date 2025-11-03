# 프로젝트 폴더 구조

웹사이트 규모가 커질수록 파일을 체계적으로 관리하는 것이 중요합니다. 좋은 폴더 구조는 AI가 코드를 더 쉽게 이해하고 유지보수할 수 있게 해줍니다.

## 왜 구조화가 중요한가?

작은 프로젝트는 파일 몇 개로 충분하지만, 프로젝트가 성장하면 다음과 같은 문제가 발생합니다:

- 파일을 찾기 어려워짐
- 코드 수정 시 어디를 고쳐야 할지 헷갈림
- AI가 맥락을 파악하기 어려워져 잘못된 제안을 함
- 여러 사람이 협업할 때 충돌이 자주 발생

## 기본 폴더 구조

가장 기본적인 구조는 다음과 같습니다:

```
my-website/
├── index.html          # 메인 페이지
├── about.html          # 회사 소개 페이지
├── contact.html        # 연락처 페이지
├── css/
│   └── style.css       # 모든 스타일 (500라인 이하면 하나로)
├── js/
│   ├── main.js         # 메인 JavaScript
│   ├── utils.js        # 유틸리티 함수
│   └── api.js          # API 호출 함수
├── data/
│   ├── products.json   # 제품 데이터
│   └── employees.json  # 직원 데이터
├── images/
│   ├── logo.png
│   ├── hero/           # Hero 섹션 이미지
│   └── products/       # 제품 이미지
└── assets/
    ├── fonts/          # 폰트 파일
    └── icons/          # 아이콘 파일
```

## 중급 구조 (SPA - 노빌드)

한 페이지에서 모든 것을 처리하는 방식 (Single Page Application):

```
my-spa/
├── index.html           # 단 하나의 HTML 파일
├── css/
│   └── style.css        # 모든 스타일 (600라인 넘으면 분리 고려)
├── js/
│   ├── components/      # UI 컴포넌트 (HTML 생성)
│   │   ├── navbar.js
│   │   ├── hero.js
│   │   ├── productCard.js
│   │   └── footer.js
│   ├── pages/           # 페이지별 콘텐츠
│   │   ├── home.js
│   │   ├── about.js
│   │   ├── products.js
│   │   └── contact.js
│   ├── services/        # API, 데이터 처리
│   │   ├── api.js
│   │   └── router.js    # 페이지 전환 관리
│   ├── utils/           # 공통 함수
│   │   └── helpers.js
│   └── main.js          # 앱 시작점
├── data/
│   ├── products.json
│   └── team.json
├── images/
│   └── products/
└── functions/           # Cloudflare Pages Functions
    └── api/
        └── contact.js
```

### SPA의 장점

- 페이지 전환이 빠름 (새로고침 없음)
- 하나의 HTML 파일만 관리
- 앱처럼 부드러운 사용자 경험
- AI가 전체 구조를 한눈에 파악하기 쉬움

### AI에게 SPA 만들어달라고 하기

```
Cursor에게 요청:

노빌드 바닐라 JavaScript로 SPA 만들어줘.

페이지:
- 홈
- 회사소개
- 제품목록
- 연락처

요구사항:
- index.html 하나만 사용
- 페이지 전환 시 새로고침 없음
- URL 해시 라우팅 (#home, #about)
- 각 페이지는 별도 JS 파일로 관리
- ES6 모듈 사용

폴더 구조와 모든 파일 코드를 만들어줘.
```

## AI에게 폴더 구조 요청하는 방법

### 새 프로젝트 시작 시

Cursor에게 다음과 같이 요청하세요:

```
회사 소개 웹사이트를 만들려고 해.
다음 페이지들이 필요해:
- 홈페이지
- 회사 소개
- 제품 목록
- 고객 후기
- 문의 양식

프로젝트 폴더 구조를 만들어줘.
- HTML, CSS, JavaScript 파일을 각각 분리
- 이미지와 데이터는 별도 폴더에 보관
- 유지보수하기 쉬운 구조로
- 각 폴더와 파일의 역할을 주석으로 설명해줘
```

### 기존 프로젝트 리팩토링

```
현재 프로젝트의 파일들이 너무 많아서 관리가 어려워.
다음 파일들을 체계적으로 정리하고 싶어:
[파일 목록을 붙여넣기]

다음 기준으로 폴더 구조를 재구성해줘:
1. 관련된 파일들을 같은 폴더에 모아줘
2. CSS는 기능별로 분리해줘
3. JavaScript는 컴포넌트, 서비스, 유틸리티로 나눠줘
4. 이미지는 용도별로 하위 폴더를 만들어줘

각 파일을 어디로 옮겨야 하는지 목록으로 알려주고,
import 경로도 자동으로 수정해줘.
```

### 특정 기능 추가 시

```
기존 프로젝트에 쇼핑카트 기능을 추가하려고 해.

현재 구조:
[현재 폴더 구조]

쇼핑카트에 필요한 파일들을 어디에 어떻게 추가하면 좋을까?
- 기존 구조와 일관성 유지
- cart.js, cart.css 등 필요한 파일
- 카트 데이터는 어디에 저장할지
- 관련 이미지와 아이콘은 어디에 둘지

파일 경로와 함께 전체 코드를 만들어줘.
```

## 파일 크기 관리 (500라인 기준)

한 파일이 너무 커지면 AI도 이해하기 어렵고 수정할 때 실수가 발생할 수 있습니다.

### 파일이 500라인을 넘어갈 때

#### CSS 파일 분리

**Before (style.css - 900라인):**
```css
/* 모든 스타일이 한 파일에 */
```

**After (2개로 분리):**
```
css/
├── base.css            # 400라인 (reset, variables, 기본 스타일)
└── components.css      # 500라인 (모든 컴포넌트와 페이지 스타일)
```

**AI에게 요청:**
```
style.css 파일이 900라인이 넘어서 너무 커.

2개 파일로 나눠줘:
1. base.css
   - CSS 리셋
   - CSS 변수 (색상, 폰트 등)
   - 기본 타이포그래피

2. components.css
   - 모든 컴포넌트 스타일
   - 페이지별 스타일

각 파일로 코드를 나눠주고,
index.html에서 base.css → components.css 순서로 로드하게 해줘.
```

#### JavaScript 파일 분리

**Before (main.js - 1200라인):**
```javascript
// API 호출, DOM 조작, 이벤트 핸들러, 유틸리티 함수 모두 포함
```

**After:**
```
js/
├── services/
│   └── api.js          # 300라인 - API 호출
├── components/
│   ├── navbar.js       # 150라인
│   ├── product.js      # 200라인
│   └── modal.js        # 150라인
├── utils/
│   └── helpers.js      # 200라인
└── main.js             # 200라인 - 초기화 및 조합
```

**AI에게 요청:**
```
main.js가 1200라인이 넘어서 관리하기 어려워.
다음 기준으로 분리해줘:

1. API 호출 함수들 → services/api.js
2. 네비게이션 관련 → components/navbar.js
3. 제품 관련 기능 → components/product.js
4. 모달 관련 → components/modal.js
5. 유틸리티 함수 → utils/helpers.js
6. main.js는 초기화 코드만 남겨줘

ES6 모듈로 export/import하도록 만들어줘.
index.html의 script 태그도 수정해줘.
```

### 분리 시 주의사항

1. **의존성 관리**
```
각 파일을 분리할 때:
- 어떤 파일이 어떤 파일에 의존하는지 명확하게
- import 순서가 중요함
- 순환 참조가 없도록 확인
```

2. **명명 규칙 일관성**
```
파일명 규칙:
- 컴포넌트: PascalCase (ProductCard.js)
- 유틸리티: camelCase (helpers.js)
- 페이지: kebab-case (product-list.js)
- 서비스: camelCase (api.js)
```

## 파일 분리 요청 예시

### 예시 1: CSS 파일 분리

```
Cursor에게 요청:

현재 style.css가 900라인이야.
2개 파일로 분리해줘:

1. base.css (400라인 예상)
   - CSS reset
   - CSS 변수 (색상, 폰트, 간격)
   - 기본 타이포그래피
   - 레이아웃 시스템 (container, grid, flex)

2. components.css (500라인 예상)
   - 모든 컴포넌트 (버튼, 카드, 폼, 모달 등)
   - 페이지별 스타일
   - 반응형 미디어 쿼리

각 파일로 코드를 나눠서 만들어주고,
index.html에서 올바른 순서로 로드하는 코드도 보여줘.
```

### 예시 2: JavaScript 모듈화

```
Cursor에게 요청:

app.js가 너무 커져서 (900라인) 모듈로 나누고 싶어.

현재 구조:
- API 호출 함수들 (200라인)
- 제품 관련 함수들 (300라인)
- 카트 관련 함수들 (250라인)
- 유틸리티 함수들 (150라인)

다음과 같이 분리해줘:

js/
├── services/
│   └── api.js
├── modules/
│   ├── product.js
│   └── cart.js
├── utils/
│   └── helpers.js
└── app.js (main entry point)

ES6 모듈로 export/import 사용하고,
index.html에서는 app.js만 로드하도록 해줘.
각 파일의 역할도 주석으로 설명해줘.
```

### 예시 3: HTML 컴포넌트 분리

```
Cursor에게 요청:

index.html이 너무 길어져서 (600라인) 읽기 어려워.
JavaScript로 컴포넌트를 분리하고 싶어.

현재 HTML 구조:
- Header (네비게이션)
- Hero Section
- Products Section
- Testimonials Section
- Footer

다음과 같이 JavaScript로 변환해줘:

js/components/
├── Header.js
├── Hero.js
├── Products.js
├── Testimonials.js
└── Footer.js

각 컴포넌트는:
1. 함수로 HTML 문자열을 반환
2. export default로 내보내기
3. app.js에서 import해서 DOM에 추가

index.html은 기본 구조만 남기고 간결하게 만들어줘.
```

## AI가 관리하기 좋은 파일 크기

### 적정 크기

파일을 너무 잘게 쪼개면 오히려 관리가 어려워집니다. AI가 가장 잘 이해하고 유지보수하기 좋은 크기:

**권장 크기:**
- HTML: 300-500 라인
- CSS: 400-600 라인
- JavaScript: 300-500 라인

**이 크기가 좋은 이유:**
- AI가 전체 맥락을 한눈에 파악 가능
- 수정 시 관련 코드를 모두 볼 수 있음
- 파일 간 이동 최소화
- 불필요한 import/export 줄어듦

### 파일이 너무 커졌을 때 신호

다음 상황이면 파일을 나눠야 합니다:

**HTML (500라인 초과):**
- 스크롤이 너무 길어서 찾기 어려움
- 비슷한 구조가 반복됨

**CSS (600라인 초과):**
- 같은 스타일을 계속 찾아야 함
- 수정했는데 어디에 영향을 주는지 모름

**JavaScript (500라인 초과):**
- 함수가 너무 많음
- 관련 없는 기능들이 섞여 있음

### AI에게 최적화 요청하기

#### 1단계: 현재 파일 분석 요청

```
Cursor에게 요청:

이 파일이 [라인수]라인이야.
너무 커진 것 같은데 분석해줘.

[파일 내용 또는 파일명]

다음을 알려줘:
1. 어떤 부분들이 포함되어 있는지
2. 독립적으로 분리 가능한 부분
3. 권장하는 파일 분리 방법
```

#### 2단계: 분리 요청

```
Cursor에게 요청:

분석 결과를 바탕으로 파일을 분리해줘.

분리 기준:
- 각 파일은 300-500라인 정도
- 관련 있는 기능끼리 묶기
- 파일명은 역할을 명확히 표현

분리 후:
- import/export 자동 설정
- 기존 파일에서 사용하는 곳도 자동 수정
```

#### 3단계: 검증 요청

```
Cursor에게 요청:

파일을 분리한 후 제대로 작동하는지 확인해줘.

확인 사항:
- 모든 기능이 이전처럼 작동하는지
- 누락된 import가 없는지
- 파일 크기가 적절한지

문제가 있으면 수정해줘.
```

### 실전 예시

#### JavaScript 파일이 800라인일 때

```
Cursor에게 요청:

app.js가 800라인이 넘어서 관리하기 어려워.

현재 포함된 기능:
- 네비게이션 메뉴 (150라인)
- 제품 카드 생성 (200라인)
- 장바구니 기능 (250라인)
- 유틸리티 함수 (200라인)

다음처럼 분리해줘:
- navbar.js (네비게이션)
- products.js (제품 관련)
- cart.js (장바구니)
- utils.js (공통 함수)
- app.js (초기화만, 100라인 정도)

ES6 모듈로 만들고 app.js에서 import해서 사용하게 해줘.
```

#### CSS 파일이 900라인일 때

```
Cursor에게 요청:

style.css가 900라인이야.

포함된 내용:
- 리셋/변수 (100라인)
- 레이아웃 (200라인)
- 버튼/카드 같은 컴포넌트 (400라인)
- 페이지별 스타일 (200라인)

다음처럼 나눠줘:
- base.css (리셋, 변수)
- layout.css (레이아웃)
- components.css (재사용 컴포넌트)
- pages.css (페이지별)

index.html에서 올바른 순서로 로드하게 해줘.
```

### 분리하지 말아야 할 경우

다음 경우는 파일을 합치는 게 더 좋습니다:

**너무 작은 파일들:**
```
❌ 나쁜 예:
button.css (20라인)
input.css (25라인)
card.css (30라인)

✅ 좋은 예:
components.css (75라인, 위 3개 합침)
```

**강하게 연결된 코드:**
```
❌ 나쁜 예:
modal-open.js (30라인)
modal-close.js (25라인)
modal-content.js (40라인)

✅ 좋은 예:
modal.js (95라인, 모달 관련 모두 포함)
```

### AI에게 파일 합치기 요청

```
Cursor에게 요청:

파일들이 너무 잘게 쪼개져서 오히려 관리가 어려워.

현재:
- button.css (20라인)
- input.css (25라인)
- card.css (30라인)
- modal.css (35라인)

이 파일들을 components.css 하나로 합쳐줘.
각 컴포넌트는 주석으로 구분하고,
기존 HTML에서 import하던 부분도 수정해줘.
```

## 구조 변경 시 AI 활용 팁

### 1. 전체 구조 파악 먼저

```
현재 프로젝트의 모든 파일을 분석해서,
어떤 파일이 어떤 파일을 참조하는지
의존성 다이어그램을 만들어줘.

그 다음 더 나은 구조를 제안해줘.
```

### 2. 단계적 리팩토링

```
한 번에 모든 파일을 옮기지 말고,
다음 순서로 단계적으로 리팩토링해줘:

1단계: CSS 파일만 분리
2단계: JavaScript 파일 분리
3단계: 이미지 정리
4단계: HTML 최적화

각 단계마다 테스트할 수 있게 해줘.
```

### 3. 자동 경로 수정

```
파일 구조를 변경하면 import 경로도 바뀌어야 해.
모든 파일의 경로를 자동으로 찾아서 수정해줘.

예시:
Before: <link href="style.css">
After: <link href="css/layout.css">
```

## 폴더 구조 체크리스트

프로젝트 구조가 잘 되어 있는지 확인하세요:

- [ ] 관련 파일들이 같은 폴더에 있나요?
- [ ] 폴더명이 역할을 명확히 설명하나요?
- [ ] 각 파일이 500라인을 넘지 않나요?
- [ ] HTML/CSS/JavaScript가 분리되어 있나요?
- [ ] 데이터 파일이 코드와 분리되어 있나요?
- [ ] 이미지가 용도별로 정리되어 있나요?
- [ ] 중복된 코드가 없나요?
- [ ] import 경로가 깔끔하고 상대경로가 복잡하지 않나요?

## 다음 단계

구조화된 프로젝트는 유지보수가 쉽습니다. 다음 문서에서는 AI에게 코드 최적화를 요청하는 방법을 배워봅시다.

[코드 최적화 요청하기](docs/code-optimization.md)
