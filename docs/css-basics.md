# CSS로 예쁘게 꾸미기

CSS는 HTML을 예쁘게 꾸미는 언어입니다.

## CSS란?

Cascading Style Sheets의 약자. 색상, 크기, 배치 등 디자인을 담당합니다.

## CSS 추가하는 3가지 방법

### 1. 인라인 스타일
HTML 태그 안에 직접 작성:
```html
<h1 style="color: blue; font-size: 30px;">제목</h1>
```

### 2. 내부 스타일
HTML 파일 head 안에 작성:
```html
<head>
<style>
    h1 {
        color: blue;
        font-size: 30px;
    }
</style>
</head>
```

### 3. 외부 파일
별도의 CSS 파일로 분리:
```html
<link rel="stylesheet" href="style.css">
```

## 기본 문법

```css
선택자 {
    속성: 값;
    속성: 값;
}
```

## 자주 쓰는 속성들

### 색상
```css
h1 {
    color: blue;              /* 글자 색 */
    background-color: yellow; /* 배경 색 */
}
```

### 크기
```css
p {
    width: 300px;      /* 너비 */
    height: 200px;     /* 높이 */
    font-size: 18px;   /* 글자 크기 */
}
```

### 여백
```css
div {
    margin: 20px;   /* 바깥 여백 */
    padding: 10px;  /* 안쪽 여백 */
}
```

### 테두리
```css
button {
    border: 2px solid black;  /* 테두리 */
    border-radius: 10px;      /* 둥근 모서리 */
}
```

### 글꼴
```css
body {
    font-family: Arial, sans-serif;
    font-weight: bold;
    text-align: center;
}
```

## 선택자의 종류

### 태그 선택자
```css
h1 { color: red; }
```

### 클래스 선택자
```css
.title { color: blue; }
```
```html
<h1 class="title">제목</h1>
```

### ID 선택자
```css
#main { color: green; }
```
```html
<div id="main">내용</div>
```

## 실습 예제

완전한 스타일 적용 예제:

```html
<!DOCTYPE html>
<html>
<head>
<style>
    body {
        font-family: Arial;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
    }

    h1 {
        color: #333;
        text-align: center;
        font-size: 36px;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    button {
        background-color: #4CAF50;
        color: white;
        padding: 15px 32px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    button:hover {
        background-color: #45a049;
    }
</style>
</head>
<body>
    <div class="container">
        <h1>멋진 웹페이지</h1>
        <p>CSS로 꾸며진 페이지입니다!</p>
        <button>클릭하세요</button>
    </div>
</body>
</html>
```

이 코드를 실행하면 훨씬 예쁜 페이지가 만들어집니다!

## 다음 단계

CSS 기본을 배웠습니다. 이제 Cursor AI로 더 복잡한 디자인을 만들어봅시다!
