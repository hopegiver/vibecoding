# 버튼 클릭 이벤트 만들기

버튼을 클릭했을 때 원하는 동작이 실행되도록 만들어봅시다.

## 이벤트란?

사용자가 웹페이지에서 하는 행동:
- 버튼 클릭
- 텍스트 입력
- 마우스 이동
- 키보드 입력
- 페이지 스크롤

## 기본 클릭 이벤트

### HTML
```html
<button id="myButton">클릭하세요</button>
<p id="result"></p>
```

### JavaScript
```javascript
const button = document.getElementById('myButton');
const result = document.getElementById('result');

button.addEventListener('click', function() {
    result.textContent = "버튼이 클릭되었습니다!";
});
```

## 이벤트 리스너 문법

### 기본 형식
```javascript
요소.addEventListener('이벤트타입', function() {
    // 실행할 코드
});
```

### 화살표 함수 (최신 문법)
```javascript
button.addEventListener('click', () => {
    result.textContent = "클릭!";
});
```

## 자주 쓰는 이벤트

### 클릭 이벤트
```javascript
button.addEventListener('click', () => {
    console.log("클릭됨");
});
```

### 더블클릭
```javascript
button.addEventListener('dblclick', () => {
    console.log("더블클릭됨");
});
```

### 마우스 오버
```javascript
button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = "blue";
});

button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = "gray";
});
```

### 입력 이벤트
```javascript
const input = document.getElementById('myInput');

input.addEventListener('input', () => {
    console.log("현재 값:", input.value);
});
```

### 폼 제출
```javascript
const form = document.getElementById('myForm');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    console.log("폼 제출됨");
});
```

### 키보드 이벤트
```javascript
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        console.log("엔터 키 눌림");
    }
});
```

## 실습 1: 좋아요 버튼

### HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>좋아요 버튼</title>
    <style>
        .like-btn {
            padding: 15px 30px;
            font-size: 18px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background-color: #ddd;
        }
        .like-btn.liked {
            background-color: #ff6b6b;
            color: white;
        }
    </style>
</head>
<body>
    <button class="like-btn" id="likeBtn">❤ 좋아요 0</button>

    <script>
        const likeBtn = document.getElementById('likeBtn');
        let likes = 0;
        let isLiked = false;

        likeBtn.addEventListener('click', () => {
            if (isLiked) {
                likes--;
                isLiked = false;
                likeBtn.classList.remove('liked');
            } else {
                likes++;
                isLiked = true;
                likeBtn.classList.add('liked');
            }
            likeBtn.textContent = `❤ 좋아요 ${likes}`;
        });
    </script>
</body>
</html>
```

## 실습 2: 색상 변경 버튼

```html
<!DOCTYPE html>
<html>
<head>
    <title>색상 변경</title>
</head>
<body>
    <button id="colorBtn">배경색 변경</button>

    <script>
        const button = document.getElementById('colorBtn');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
        let currentIndex = 0;

        button.addEventListener('click', () => {
            document.body.style.backgroundColor = colors[currentIndex];
            currentIndex = (currentIndex + 1) % colors.length;
        });
    </script>
</body>
</html>
```

## 실습 3: 이미지 토글

```html
<!DOCTYPE html>
<html>
<head>
    <title>이미지 토글</title>
    <style>
        img {
            width: 300px;
            display: block;
            margin: 20px auto;
        }
        button {
            display: block;
            margin: 0 auto;
            padding: 10px 20px;
        }
    </style>
</head>
<body>
    <img id="bulb" src="https://via.placeholder.com/300/808080/FFFFFF?text=OFF" alt="전구">
    <button id="toggleBtn">켜기/끄기</button>

    <script>
        const bulb = document.getElementById('bulb');
        const button = document.getElementById('toggleBtn');
        let isOn = false;

        button.addEventListener('click', () => {
            if (isOn) {
                bulb.src = "https://via.placeholder.com/300/808080/FFFFFF?text=OFF";
                isOn = false;
            } else {
                bulb.src = "https://via.placeholder.com/300/FFFF00/000000?text=ON";
                isOn = true;
            }
        });
    </script>
</body>
</html>
```

## 실습 4: 카운터

```html
<!DOCTYPE html>
<html>
<head>
    <title>카운터</title>
    <style>
        body {
            text-align: center;
            font-family: Arial;
            padding: 50px;
        }
        #count {
            font-size: 72px;
            margin: 30px;
        }
        button {
            font-size: 20px;
            padding: 15px 30px;
            margin: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #increase {
            background-color: #4CAF50;
            color: white;
        }
        #decrease {
            background-color: #f44336;
            color: white;
        }
        #reset {
            background-color: #2196F3;
            color: white;
        }
    </style>
</head>
<body>
    <h1>카운터</h1>
    <div id="count">0</div>
    <button id="increase">+1</button>
    <button id="decrease">-1</button>
    <button id="reset">리셋</button>

    <script>
        const countElement = document.getElementById('count');
        const increaseBtn = document.getElementById('increase');
        const decreaseBtn = document.getElementById('decrease');
        const resetBtn = document.getElementById('reset');

        let count = 0;

        increaseBtn.addEventListener('click', () => {
            count++;
            countElement.textContent = count;
        });

        decreaseBtn.addEventListener('click', () => {
            count--;
            countElement.textContent = count;
        });

        resetBtn.addEventListener('click', () => {
            count = 0;
            countElement.textContent = count;
        });
    </script>
</body>
</html>
```

## 실습 5: 메뉴 토글

```html
<!DOCTYPE html>
<html>
<head>
    <title>메뉴 토글</title>
    <style>
        body {
            font-family: Arial;
            margin: 0;
            padding: 20px;
        }
        #menuBtn {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }
        #menu {
            list-style: none;
            padding: 0;
            margin-top: 10px;
            display: none;
        }
        #menu.show {
            display: block;
        }
        #menu li {
            padding: 10px;
            background-color: #f0f0f0;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <button id="menuBtn">메뉴 열기/닫기</button>
    <ul id="menu">
        <li>홈</li>
        <li>소개</li>
        <li>서비스</li>
        <li>연락처</li>
    </ul>

    <script>
        const menuBtn = document.getElementById('menuBtn');
        const menu = document.getElementById('menu');

        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('show');
        });
    </script>
</body>
</html>
```

## 이벤트 객체

### 이벤트 정보 가져오기
```javascript
button.addEventListener('click', (event) => {
    console.log(event.target);     // 클릭된 요소
    console.log(event.type);       // 이벤트 타입 (click)
    console.log(event.clientX);    // 마우스 X 좌표
    console.log(event.clientY);    // 마우스 Y 좌표
});
```

### 기본 동작 막기
```javascript
link.addEventListener('click', (e) => {
    e.preventDefault(); // 링크 이동 방지
    console.log("링크 클릭됨 (이동 안 됨)");
});
```

## 여러 요소에 이벤트 추가

### 반복문 사용
```javascript
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        console.log(button.textContent + " 클릭됨");
    });
});
```

## AI로 이벤트 코드 생성

Cursor AI에게 요청:
```
다음 기능 만들어줘:
- 입력창에 이름 입력
- 버튼 클릭 시 "안녕하세요, [이름]님!" 표시
- 입력창이 비어있으면 "이름을 입력하세요" 경고
```

## 디버깅 팁

### 이벤트가 안 작동할 때
```javascript
// 1. 요소가 제대로 선택됐는지 확인
console.log(button);

// 2. 이벤트가 등록됐는지 확인
button.addEventListener('click', () => {
    console.log("이벤트 작동!");
});

// 3. 스크립트 위치 확인
// </body> 직전에 <script> 태그를 넣거나
// DOMContentLoaded 사용
document.addEventListener('DOMContentLoaded', () => {
    // 여기에 이벤트 리스너 코드
});
```

## 흔한 실수

### 1. 요소 선택 전 스크립트 실행
```javascript
// 나쁜 예: HTML보다 먼저 실행됨
const button = document.getElementById('btn'); // null

// 좋은 예: HTML 로드 후 실행
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('btn');
});
```

### 2. 이벤트 리스너를 함수 호출로 작성
```javascript
// 나쁜 예
button.addEventListener('click', myFunction()); // 즉시 실행됨

// 좋은 예
button.addEventListener('click', myFunction);
```

### 3. 같은 이벤트 중복 등록
```javascript
// 나쁜 예: 클릭할 때마다 카운트가 2씩 증가
button.addEventListener('click', increment);
button.addEventListener('click', increment);

// 좋은 예: 한 번만 등록
button.addEventListener('click', increment);
```

## 다음 단계

버튼 클릭 이벤트를 배웠습니다. 이제 간단한 계산기를 만들어봅시다!
