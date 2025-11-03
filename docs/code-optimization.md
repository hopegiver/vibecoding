# 코드 최적화와 리팩토링

코드가 작동하더라도 더 빠르고, 읽기 쉽고, 유지보수하기 좋게 만들 수 있습니다. 최적화는 성능 개선, 리팩토링은 코드 구조 개선에 초점을 맞춥니다.

## 최적화 vs 리팩토링

### 최적화 (Optimization)
**목표:** 성능 향상 - 더 빠르게, 더 적은 리소스 사용

**언제:**
- 페이지 로딩이 느림
- 파일 크기가 너무 큼
- 많은 데이터를 처리해야 함
- 메모리 사용량이 높음

### 리팩토링 (Refactoring)
**목표:** 코드 품질 향상 - 읽기 쉽고, 수정하기 쉽게

**언제:**
- 같은 코드가 여러 곳에 반복됨
- 코드를 이해하기 어려움
- 새 기능 추가가 어려움
- 버그가 자주 발생함

## 왜 필요한가?

### 최적화/리팩토링이 필요한 신호

- 페이지 로딩이 3초 이상 걸림
- 같은 코드를 복사-붙여넣기 하고 있음
- 작성한 코드를 며칠 후 이해하기 어려움
- 한 파일이 500줄을 넘어감
- 브라우저 콘솔에 경고가 나타남
- 버그 수정 시 다른 곳도 같이 수정해야 함

### 개선의 이점

- 웹사이트 속도 향상 → 사용자 만족도 ↑
- 유지보수 시간 단축 → 생산성 ↑
- 버그 발생 감소 → 안정성 ↑
- 협업이 쉬워짐 → 팀워크 ↑
- SEO 점수 향상 → 검색 노출 ↑

## 기본 요청 방법

### 전체 코드 최적화

```
Cursor에게 요청:

이 코드를 최적화해줘:
[코드 붙여넣기]

다음 관점에서 개선해줘:
1. 성능 - 더 빠르게
2. 가독성 - 읽기 쉽게
3. 유지보수 - 수정하기 쉽게
4. 베스트 프랙티스 적용

변경 사항을 주석으로 설명해줘.
```

### 성능 최적화

```
Cursor에게 요청:

이 JavaScript 코드의 성능을 개선해줘:
[코드 붙여넣기]

특히 다음을 확인해줘:
- 불필요한 반복문이 있는지
- DOM 조작을 최소화할 수 있는지
- 메모리 누수 가능성이 있는지
- 비동기 처리를 개선할 수 있는지

Before/After 코드를 보여주고,
성능이 얼마나 개선되는지 설명해줘.
```

## 구체적인 최적화 유형

### 1. 코드 중복 제거 (DRY - Don't Repeat Yourself)

**AI에게 요청:**

```
다음 코드에서 중복되는 부분을 찾아서
함수나 변수로 추출해줘:

[코드 붙여넣기]

재사용 가능한 함수를 만들고,
각 함수의 역할을 주석으로 설명해줘.
```

**예시:**

Before:
```javascript
// 중복 코드
document.getElementById('btn1').addEventListener('click', function() {
    document.getElementById('modal1').style.display = 'block';
    document.body.style.overflow = 'hidden';
});

document.getElementById('btn2').addEventListener('click', function() {
    document.getElementById('modal2').style.display = 'block';
    document.body.style.overflow = 'hidden';
});

document.getElementById('btn3').addEventListener('click', function() {
    document.getElementById('modal3').style.display = 'block';
    document.body.style.overflow = 'hidden';
});
```

AI에게 요청 후:
```javascript
// 재사용 가능한 함수
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 간결한 이벤트 리스너
document.getElementById('btn1').addEventListener('click', () => openModal('modal1'));
document.getElementById('btn2').addEventListener('click', () => openModal('modal2'));
document.getElementById('btn3').addEventListener('click', () => openModal('modal3'));
```

### 2. CSS 최적화

**AI에게 요청:**

```
이 CSS 코드를 최적화해줘:
[CSS 코드]

다음을 확인해줘:
- 중복되는 스타일 속성을 통합
- 사용하지 않는 CSS 제거
- 선택자를 더 효율적으로
- CSS 변수로 반복되는 값 추출
- 미디어 쿼리를 더 깔끔하게

최적화 전/후 파일 크기도 비교해줘.
```

**예시:**

Before:
```css
.button-primary {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
}

.button-secondary {
    background-color: #6c757d;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
}

.button-success {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
}
```

AI에게 요청 후:
```css
/* CSS 변수 정의 */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
}

/* 공통 스타일 */
.button {
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
}

/* 색상만 변경 */
.button-primary { background-color: var(--primary-color); }
.button-secondary { background-color: var(--secondary-color); }
.button-success { background-color: var(--success-color); }
```

### 3. JavaScript 성능 최적화

**AI에게 요청:**

```
이 코드가 느린 것 같아.
성능을 개선해줘:

[코드 붙여넣기]

특히:
- DOM 조작을 줄여줘
- 이벤트 리스너를 최적화해줘
- 반복문을 개선해줘
- 캐싱할 수 있는 부분을 찾아줘

각 최적화가 왜 더 빠른지 설명해줘.
```

**예시: DOM 조작 최적화**

Before (느림):
```javascript
// 매번 DOM에 접근하고 reflow 발생
for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    document.getElementById('container').appendChild(div);
}
```

AI에게 요청 후 (빠름):
```javascript
// DocumentFragment 사용으로 reflow 한 번만 발생
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);
}
document.getElementById('container').appendChild(fragment);
```

### 4. 비동기 처리 최적화

**AI에게 요청:**

```
여러 API를 호출하는 이 코드를 최적화해줘:
[코드 붙여넣기]

다음을 개선해줘:
- 병렬로 실행할 수 있는 것은 병렬로
- 에러 처리 추가
- 로딩 상태 관리
- 타임아웃 설정

async/await와 Promise.all을 적절히 사용해줘.
```

**예시:**

Before (느림 - 순차 실행):
```javascript
async function loadData() {
    const users = await fetch('/api/users').then(r => r.json());
    const products = await fetch('/api/products').then(r => r.json());
    const orders = await fetch('/api/orders').then(r => r.json());
    return { users, products, orders };
}
```

AI에게 요청 후 (빠름 - 병렬 실행):
```javascript
async function loadData() {
    try {
        const [users, products, orders] = await Promise.all([
            fetch('/api/users').then(r => r.json()),
            fetch('/api/products').then(r => r.json()),
            fetch('/api/orders').then(r => r.json())
        ]);
        return { users, products, orders };
    } catch (error) {
        console.error('데이터 로딩 실패:', error);
        throw error;
    }
}
```

## 고급 최적화 요청

### 메모리 누수 방지

```
Cursor에게 요청:

이 코드에서 메모리 누수 가능성을 찾아줘:
[코드 붙여넣기]

확인해줘:
- 이벤트 리스너를 제대로 제거하는지
- 타이머가 계속 실행되지 않는지
- 전역 변수를 과도하게 사용하지 않는지
- DOM 참조를 계속 유지하지 않는지

문제가 있는 부분을 수정하고 설명해줘.
```

### 번들 크기 최적화

```
Cursor에게 요청:

JavaScript 파일 크기를 줄이고 싶어.
다음을 해줘:

1. 사용하지 않는 함수 찾기
2. 라이브러리 대신 네이티브 API 사용 가능한지 확인
3. 코드 압축 (minification)
4. 동적 import로 필요할 때만 로드

Before/After 파일 크기를 비교해줘.
```

### 이미지 최적화

```
Cursor에게 요청:

이미지 로딩을 최적화하는 HTML 코드를 만들어줘.

필요한 기능:
1. Lazy loading (스크롤 시 로드)
2. Responsive images (화면 크기별 다른 이미지)
3. WebP 포맷 지원 (지원 안 되면 fallback)
4. Loading placeholder

예시 코드와 함께 설명해줘.
```

## 코드 리뷰 요청

### 전체적인 코드 리뷰

```
Cursor에게 요청:

이 프로젝트 코드를 전체적으로 리뷰해줘.

평가 기준:
1. 코드 품질 (가독성, 유지보수성)
2. 성능
3. 보안 (XSS, injection 등)
4. 접근성 (a11y)
5. SEO

각 항목별로:
- 점수 (1-10)
- 문제점
- 개선 방법
- 우선순위

구체적인 코드 수정 예시도 보여줘.
```

### 특정 부분 집중 리뷰

```
Cursor에게 요청:

이 함수의 코드 품질을 평가해줘:
[함수 코드]

다음 관점에서:
- 함수명이 역할을 잘 설명하는가?
- 매개변수가 적절한가?
- 에러 처리가 되어 있는가?
- 테스트하기 쉬운 구조인가?
- 사이드 이펙트가 있는가?

개선된 버전을 보여주고 이유를 설명해줘.
```

## 최적화 체크리스트

코드를 최적화할 때 확인하세요:

### HTML
- [ ] 시맨틱 태그 사용
- [ ] 불필요한 div 중첩 제거
- [ ] 이미지에 alt 속성 추가
- [ ] meta 태그 최적화

### CSS
- [ ] 중복 스타일 통합
- [ ] CSS 변수 활용
- [ ] 사용하지 않는 CSS 제거
- [ ] 선택자 단순화
- [ ] 미디어 쿼리 정리

### JavaScript
- [ ] 변수명이 의미있음
- [ ] 함수가 한 가지 역할만 수행
- [ ] 중복 코드 제거
- [ ] 에러 처리 추가
- [ ] 주석이 적절함
- [ ] console.log 제거
- [ ] 전역 변수 최소화

### 성능
- [ ] 이미지 lazy loading
- [ ] JavaScript 비동기 로드
- [ ] CSS 파일 통합
- [ ] 불필요한 라이브러리 제거
- [ ] API 호출 최소화

## 자주 사용하는 최적화 명령어

### 1. 간단한 리팩토링

```
이 코드를 더 읽기 쉽게 리팩토링해줘.
변수명, 함수명을 더 명확하게 바꾸고,
주석도 추가해줘.
```

### 2. 성능 개선

```
이 코드의 실행 속도를 개선해줘.
특히 반복문과 DOM 조작 부분을.
```

### 3. 에러 처리 추가

```
이 코드에 적절한 에러 처리를 추가해줘.
try-catch, validation, fallback 등을 포함해서.
```

### 4. 모던 JavaScript로 변환

```
이 코드를 최신 JavaScript (ES6+) 문법으로 바꿔줘.
const/let, 화살표 함수, 구조 분해, 템플릿 리터럴 등을 사용해서.
```

### 5. 타입 안정성 추가

```
이 JavaScript 코드에 JSDoc 주석을 추가해서
타입 정보를 명시해줘.

각 함수의:
- 매개변수 타입
- 반환 타입
- 설명

을 포함해줘.
```

## 최적화 시 주의사항

### 1. 과도한 최적화 주의

```
"조기 최적화는 만악의 근원"

- 먼저 작동하는 코드를 만들기
- 실제로 느린 부분만 최적화
- 측정 없이 추측하지 않기
```

### 2. 가독성 vs 성능

```
성능이 중요하지만 가독성도 중요해.
둘 사이의 균형을 잡아줘.

이 코드를 최적화하되,
다른 사람도 이해할 수 있게 해줘.
```

### 3. 브라우저 호환성

```
이 최적화된 코드가
구형 브라우저에서도 작동하는지 확인해줘.

필요하면 polyfill이나 fallback을 추가해줘.
```

## 최적화 측정하기

### 성능 측정 요청

```
Cursor에게 요청:

이 코드의 성능을 측정하는 방법을 알려줘.

1. console.time/timeEnd로 실행 시간 측정
2. Performance API 사용
3. Chrome DevTools에서 확인하는 방법
4. Lighthouse 점수 개선 방법

측정 코드 예시도 보여줘.
```

### Before/After 비교

```
Cursor에게 요청:

최적화 전/후를 비교할 수 있는
벤치마크 코드를 만들어줘.

다음을 측정:
- 실행 시간
- 메모리 사용량
- 파일 크기
- 네트워크 요청 수

결과를 표로 정리해줘.
```

## 실전 예시

### 제품 목록 성능 최적화

```
Cursor에게 요청:

1000개 제품을 표시하는 이 코드를 최적화해줘:

[현재 코드 붙여넣기]

개선 사항:
1. 가상 스크롤 구현 (화면에 보이는 것만 렌더링)
2. 검색 debouncing
3. 이미지 lazy loading
4. 메모이제이션 (같은 데이터 재사용)

단계별로 구현해줘.
```

### API 호출 최적화

```
Cursor에게 요청:

여러 페이지에서 같은 API를 반복 호출하고 있어.
다음을 구현해줘:

1. API 응답 캐싱 (5분간 유효)
2. 중복 요청 방지
3. 백그라운드 새로고침
4. 에러 시 캐시된 데이터 사용

cache.js 모듈을 만들어줘.
```

## 다음 단계

최적화된 코드는 더 빠르고 유지보수하기 쉽습니다. 이제 실전 프로젝트에서 배운 내용을 적용해봅시다.

[실전 프로젝트 보기](docs/project-company-intro.md)
