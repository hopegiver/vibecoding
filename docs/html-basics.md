# HTML 기초 - 5분 만에 이해하기

HTML은 웹 페이지의 뼈대를 만드는 언어입니다.

## HTML이란?

HyperText Markup Language의 약자. 웹 페이지의 구조를 정의합니다.

## 기본 구조

```html
<!DOCTYPE html>
<html>
<head>
    <title>페이지 제목</title>
</head>
<body>
    여기에 내용이 들어갑니다
</body>
</html>
```

## 태그란?

HTML은 태그로 구성됩니다. 태그는 `<>` 안에 작성합니다.

```html
<태그이름>내용</태그이름>
```

## 자주 쓰는 태그들

### 제목 태그
```html
<h1>가장 큰 제목</h1>
<h2>두 번째 제목</h2>
<h3>세 번째 제목</h3>
<h4>네 번째 제목</h4>
```

### 문단 태그
```html
<p>이것은 문단입니다.</p>
```

### 링크 태그
```html
<a href="https://example.com">클릭하세요</a>
```

### 이미지 태그
```html
<img src="photo.jpg" alt="사진 설명">
```

### 버튼 태그
```html
<button>클릭</button>
```

### 입력 태그
```html
<input type="text" placeholder="텍스트 입력">
<input type="email" placeholder="이메일 입력">
<input type="password" placeholder="비밀번호 입력">
```

### 리스트 태그
```html
<ul>
    <li>항목 1</li>
    <li>항목 2</li>
    <li>항목 3</li>
</ul>
```

### 컨테이너 태그
```html
<div>블록 컨테이너</div>
<span>인라인 컨테이너</span>
```

## 실습 예제

완전한 HTML 페이지를 만들어봅시다:

```html
<!DOCTYPE html>
<html>
<head>
    <title>내 첫 페이지</title>
</head>
<body>
    <h1>환영합니다!</h1>
    <p>이것은 제 첫 HTML 페이지입니다.</p>

    <h2>좋아하는 것들</h2>
    <ul>
        <li>코딩</li>
        <li>음악</li>
        <li>여행</li>
    </ul>

    <button>클릭해보세요</button>
</body>
</html>
```

이 코드를 Cursor에 붙여넣고 `hello.html`로 저장한 후 브라우저에서 열어보세요!

## 다음 단계

HTML의 기본을 배웠습니다. 이제 CSS로 예쁘게 꾸며봅시다!
