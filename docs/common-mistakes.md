# 자주 하는 실수들

초보자가 자주 하는 실수와 해결 방법을 알아봅시다.

## HTML/CSS 실수

### 1. 닫는 태그 빠뜨리기
❌ **잘못된 예:**
```html
<div>
    <p>안녕하세요
</div>
```

✅ **올바른 예:**
```html
<div>
    <p>안녕하세요</p>
</div>
```

### 2. CSS 선택자 오타
❌ **잘못된 예:**
```css
.buton { /* 오타! */
    color: blue;
}
```

✅ **올바른 예:**
```css
.button {
    color: blue;
}
```

### 3. 파일 경로 실수
❌ **잘못된 예:**
```html
<img src="/image.jpg">  <!-- 절대 경로 -->
```

✅ **올바른 예:**
```html
<img src="./images/image.jpg">  <!-- 상대 경로 -->
```

## JavaScript 실수

### 1. 세미콜론 빠뜨리기
```javascript
// 작동하지만 권장하지 않음
let name = "김철수"
console.log(name)

// 권장
let name = "김철수";
console.log(name);
```

### 2. const vs let 혼동
❌ **잘못된 예:**
```javascript
const age = 20;
age = 21; // 에러!
```

✅ **올바른 예:**
```javascript
let age = 20;
age = 21; // OK
```

### 3. 비동기 처리 실수
❌ **잘못된 예:**
```javascript
fetch('data.json');
console.log(data); // undefined!
```

✅ **올바른 예:**
```javascript
fetch('data.json')
    .then(response => response.json())
    .then(data => console.log(data));
```

## JSON 실수

### 1. 마지막 쉼표
❌ **잘못된 예:**
```json
{
    "name": "김철수",
    "age": 20,  // 마지막 쉼표 제거!
}
```

✅ **올바른 예:**
```json
{
    "name": "김철수",
    "age": 20
}
```

### 2. 작은따옴표 사용
❌ **잘못된 예:**
```json
{
    'name': 'Kim'  // 작은따옴표 안 됨!
}
```

✅ **올바른 예:**
```json
{
    "name": "Kim"
}
```

## Git 실수

### 1. 큰 파일 커밋
❌ **잘못된 예:**
```bash
git add node_modules/  # 수천 개 파일!
git add *.zip          # 큰 파일!
```

✅ **올바른 예:**
.gitignore에 추가:
```
node_modules/
*.zip
*.env
```

### 2. 커밋 메시지 불명확
❌ **잘못된 예:**
```bash
git commit -m "수정"
git commit -m "aaa"
```

✅ **올바른 예:**
```bash
git commit -m "로그인 버그 수정"
git commit -m "제품 목록 페이지 추가"
```

## Cloudflare Pages 실수

### 1. functions 폴더 위치
❌ **잘못된 예:**
```
project/
└── src/
    └── functions/  # 잘못된 위치!
```

✅ **올바른 예:**
```
project/
└── functions/      # 루트에 위치!
```

### 2. 환경 변수 노출
❌ **잘못된 예:**
```javascript
const API_KEY = "abc123";  // 코드에 직접!
```

✅ **올바른 예:**
```javascript
const API_KEY = context.env.API_KEY;  // 환경 변수
```

## Cursor AI 실수

### 1. 너무 모호한 요청
❌ **잘못된 예:**
```
웹사이트 만들어줘
```

✅ **올바른 예:**
```
간단한 블로그 웹사이트 만들어줘.
- 제목, 날짜, 내용 표시
- posts.json에서 데이터 읽기
- 깔끔한 카드 디자인
```

### 2. 한 번에 너무 많이 요청
❌ **잘못된 예:**
```
쇼핑몰 전체를 한 번에 만들어줘.
장바구니, 결제, 회원가입, 관리자 페이지 모두 포함해서.
```

✅ **올바른 예:**
```
먼저 제품 목록 페이지만 만들어줘.
products.json에서 데이터 읽어서 카드로 표시.
```

### 3. 에러 메시지 안 알려주기
❌ **잘못된 예:**
```
작동 안 해. 고쳐줘.
```

✅ **올바른 예:**
```
콘솔에 이런 에러가 나와:
"Uncaught TypeError: Cannot read property 'name' of undefined"

data.json 파일을 읽는 부분에서 문제인 것 같아.
확인하고 수정해줘.
```

## 디버깅 팁

### 문제 발생 시 체크리스트:

1. **콘솔 확인**
   - F12 → Console 탭
   - 빨간 에러 메시지 확인

2. **파일 경로 확인**
   - 대소문자 정확히
   - 슬래시 방향 (/, \)

3. **문법 검사**
   - 괄호, 중괄호 짝 맞는지
   - 따옴표 닫혔는지

4. **단계별 테스트**
   - console.log() 추가
   - 한 줄씩 확인

5. **캐시 삭제**
   - Ctrl + Shift + R (강력 새로고침)
   - 브라우저 캐시 지우기

## Cursor에게 도움 요청하기

```
이런 에러가 나와:
[에러 메시지 복사]

관련 코드:
[문제 있는 코드 블록]

뭐가 문제인지 설명하고 수정해줘.
```

## 다음 단계

실수는 배움의 기회입니다!
에러를 두려워하지 말고, 하나씩 해결해나가세요.
