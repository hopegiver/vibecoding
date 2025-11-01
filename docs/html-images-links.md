# 이미지와 링크 추가하기

웹페이지에 이미지와 링크를 추가하는 방법을 배워봅시다.

## 이미지 추가하기

### 기본 문법
```html
<img src="이미지경로" alt="설명">
```

### 로컬 이미지
프로젝트 폴더에 이미지 파일이 있을 때:
```html
<img src="photo.jpg" alt="내 사진">
```

폴더 구조:
```
my-website/
  ├── index.html
  └── photo.jpg
```

### 하위 폴더의 이미지
```html
<img src="images/photo.jpg" alt="내 사진">
```

폴더 구조:
```
my-website/
  ├── index.html
  └── images/
      └── photo.jpg
```

### 온라인 이미지
인터넷 URL 사용:
```html
<img src="https://example.com/photo.jpg" alt="사진">
```

### 플레이스홀더 이미지
테스트용 임시 이미지:
```html
<img src="https://via.placeholder.com/300" alt="임시 이미지">
```

## 이미지 크기 조절

### HTML에서 조절
```html
<img src="photo.jpg" alt="사진" width="300">
```

### CSS로 조절 (권장)
```css
img {
    width: 300px;
    height: auto;  /* 비율 유지 */
}
```

### 반응형 이미지
```css
img {
    max-width: 100%;
    height: auto;
}
```

## 링크 추가하기

### 기본 문법
```html
<a href="주소">클릭할 텍스트</a>
```

### 외부 링크
```html
<a href="https://www.google.com">구글로 이동</a>
```

### 새 탭에서 열기
```html
<a href="https://www.google.com" target="_blank">새 탭에서 열기</a>
```

### 같은 페이지 내 이동
```html
<a href="#section1">섹션 1로 이동</a>

<div id="section1">
    <h2>섹션 1</h2>
</div>
```

### 이메일 링크
```html
<a href="mailto:contact@example.com">이메일 보내기</a>
```

### 전화번호 링크
```html
<a href="tel:+82-10-1234-5678">전화 걸기</a>
```

## 이미지를 링크로 만들기

```html
<a href="https://example.com">
    <img src="logo.png" alt="로고">
</a>
```

## 실습: 프로필 페이지 만들기

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>내 프로필</title>
    <style>
        body {
            font-family: Arial;
            max-width: 600px;
            margin: 50px auto;
            text-align: center;
        }
        .profile-img {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            object-fit: cover;
        }
        .social-links a {
            margin: 0 10px;
            text-decoration: none;
            color: #0077b5;
        }
    </style>
</head>
<body>
    <h1>김철수</h1>
    <img src="https://via.placeholder.com/200"
         alt="프로필 사진"
         class="profile-img">

    <p>웹 개발자입니다.</p>

    <div class="social-links">
        <a href="https://github.com/username" target="_blank">GitHub</a>
        <a href="https://linkedin.com/in/username" target="_blank">LinkedIn</a>
        <a href="mailto:email@example.com">Email</a>
    </div>
</body>
</html>
```

## AI로 이미지 갤러리 만들기

Cursor AI에게 요청:
```
이미지 갤러리 만들어줘.
- 2x2 그리드 배치
- 플레이스홀더 이미지 4개 사용
- 이미지 호버 시 확대 효과
- 반응형 (모바일에서는 1열로)
```

## 무료 이미지 사이트

실제 이미지가 필요하면 이 사이트들을 이용하세요:
- Unsplash (unsplash.com)
- Pexels (pexels.com)
- Pixabay (pixabay.com)

## 아이콘 추가하기

### Font Awesome (무료 아이콘)
```html
<head>
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <i class="fab fa-github"></i> GitHub
    <i class="fab fa-linkedin"></i> LinkedIn
    <i class="fas fa-envelope"></i> Email
</body>
```

## 다음 단계

이미지와 링크 사용법을 배웠습니다. 이제 Cloudflare Pages로 배포해봅시다!
