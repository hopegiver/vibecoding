# JavaScript가 뭔가요?

JavaScript는 웹페이지에 동작과 인터랙션을 추가하는 프로그래밍 언어입니다.

## HTML, CSS, JavaScript의 관계

```
HTML       →  뼈대 (구조)
CSS        →  옷 (디자인)
JavaScript →  근육 (동작)
```

### 예시
```
버튼을 클릭하면 숫자가 증가하는 카운터
→ HTML: 버튼과 숫자 표시
→ CSS: 버튼 색상, 크기
→ JavaScript: 클릭 시 숫자 증가 로직
```

## JavaScript로 뭘 할 수 있나요?

### 사용자 인터랙션
- 버튼 클릭 반응
- 폼 입력 검증
- 메뉴 토글
- 이미지 슬라이더

### 데이터 처리
- 계산기
- 할일 목록
- 검색 기능
- 데이터 필터링

### 동적 콘텐츠
- 현재 시간 표시
- 날씨 정보 가져오기
- JSON 파일 읽기
- 페이지 내용 동적 업데이트

## JavaScript 기본 문법

### 변수 선언
```javascript
// 변하는 값
let count = 0;

// 변하지 않는 값
const name = "김철수";
```

### 함수
```javascript
function sayHello() {
    console.log("안녕하세요!");
}

// 호출
sayHello();
```

### 이벤트 리스너
```javascript
button.addEventListener('click', function() {
    alert("버튼 클릭!");
});
```

## JavaScript 추가하는 방법

### 1. 인라인 (권장 안 함)
```html
<button onclick="alert('클릭!')">버튼</button>
```

### 2. 내부 스크립트
```html
<script>
    console.log("Hello");
</script>
```

### 3. 외부 파일 (권장)
```html
<script src="script.js"></script>
```

## 첫 JavaScript 코드

### HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>첫 JavaScript</title>
</head>
<body>
    <h1>카운터</h1>
    <p id="count">0</p>
    <button id="btn">클릭</button>

    <script src="script.js"></script>
</body>
</html>
```

### JavaScript (script.js)
```javascript
// 요소 가져오기
const countElement = document.getElementById('count');
const button = document.getElementById('btn');

// 초기값
let count = 0;

// 버튼 클릭 이벤트
button.addEventListener('click', function() {
    count++;
    countElement.textContent = count;
});
```

브라우저에서 열고 버튼을 클릭하면 숫자가 증가합니다!

## 자주 쓰는 JavaScript 기능

### 1. 요소 선택
```javascript
// ID로 선택
const element = document.getElementById('myId');

// 클래스로 선택
const elements = document.querySelectorAll('.myClass');

// 태그로 선택
const buttons = document.querySelectorAll('button');
```

### 2. 내용 변경
```javascript
// 텍스트 변경
element.textContent = "새 텍스트";

// HTML 변경
element.innerHTML = "<strong>강조</strong>";
```

### 3. 스타일 변경
```javascript
// 색상 변경
element.style.color = "red";

// 여러 스타일
element.style.backgroundColor = "blue";
element.style.fontSize = "20px";
```

### 4. 클래스 조작
```javascript
// 클래스 추가
element.classList.add('active');

// 클래스 제거
element.classList.remove('active');

// 클래스 토글
element.classList.toggle('active');
```

### 5. 이벤트 리스너
```javascript
// 클릭 이벤트
button.addEventListener('click', function() {
    console.log("클릭됨");
});

// 입력 이벤트
input.addEventListener('input', function() {
    console.log(input.value);
});
```

## 콘솔 사용하기

### 콘솔 열기
- Windows: `F12` 또는 `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

### 콘솔에 출력
```javascript
console.log("디버깅 메시지");
console.log(변수);
```

### 실습
브라우저 콘솔에서 직접 실행:
```javascript
alert("안녕하세요!");
console.log(2 + 3);
document.body.style.backgroundColor = "lightblue";
```

## 조건문

### if 문
```javascript
let age = 20;

if (age >= 18) {
    console.log("성인입니다");
} else {
    console.log("미성년자입니다");
}
```

### 비교 연산자
```javascript
===  // 같음
!==  // 다름
>    // 크다
<    // 작다
>=   // 크거나 같다
<=   // 작거나 같다
```

## 반복문

### for 문
```javascript
for (let i = 0; i < 5; i++) {
    console.log(i);
}
// 출력: 0, 1, 2, 3, 4
```

### 배열 순회
```javascript
const fruits = ["사과", "바나나", "오렌지"];

for (let fruit of fruits) {
    console.log(fruit);
}
```

## 배열

### 배열 생성
```javascript
const numbers = [1, 2, 3, 4, 5];
const names = ["김철수", "이영희", "박민수"];
```

### 배열 조작
```javascript
// 추가
numbers.push(6);

// 제거
numbers.pop();

// 길이
console.log(numbers.length);

// 접근
console.log(numbers[0]); // 첫 번째 요소
```

## 객체

### 객체 생성
```javascript
const person = {
    name: "김철수",
    age: 30,
    job: "개발자"
};
```

### 객체 접근
```javascript
console.log(person.name);  // 김철수
console.log(person.age);   // 30
```

### 객체 수정
```javascript
person.age = 31;
person.city = "서울";
```

## 실전 예제: 인사 메시지

### HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>인사 메시지</title>
</head>
<body>
    <input type="text" id="nameInput" placeholder="이름 입력">
    <button id="greetBtn">인사하기</button>
    <p id="message"></p>

    <script>
        const input = document.getElementById('nameInput');
        const button = document.getElementById('greetBtn');
        const message = document.getElementById('message');

        button.addEventListener('click', function() {
            const name = input.value;
            if (name) {
                message.textContent = `안녕하세요, ${name}님!`;
            } else {
                message.textContent = "이름을 입력하세요.";
            }
        });
    </script>
</body>
</html>
```

## AI로 JavaScript 코드 생성

Cursor AI에게 요청:
```
버튼을 클릭하면 배경색이 랜덤으로 변하는 코드 만들어줘
```

AI가 자동으로 HTML + JavaScript 코드를 생성합니다!

## 디버깅 팁

### 자주 하는 실수
```javascript
// 나쁜 예: 대소문자 틀림
const button = document.getElementByid('btn'); // 'I'가 소문자

// 좋은 예
const button = document.getElementById('btn');
```

### 콘솔에서 확인
```javascript
console.log(button); // 요소가 제대로 선택됐는지 확인
```

## 다음 단계

JavaScript 기본을 배웠습니다. 이제 버튼 클릭 이벤트로 실제 기능을 만들어봅시다!
