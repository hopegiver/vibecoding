# 색상/폰트 조합 추천

비개발자를 위한 웹 디자인 기본 원칙입니다.

## 색상 선택

### 기본 팔레트
```
메인 색상 1개
보조 색상 1-2개
배경색 (밝은/어두운)
텍스트 색상 (회색 계열)
```

### 추천 조합
**파란색 계열:**
```css
--primary: #3498db;
--secondary: #2c3e50;
--bg: #ecf0f1;
--text: #2c3e50;
```

**녹색 계열:**
```css
--primary: #27ae60;
--secondary: #16a085;
--bg: #f8f9fa;
--text: #333333;
```

### 도구
- Coolors.co - 자동 팔레트
- Adobe Color - 색상 조합

## 폰트 조합

### 한글
```css
/* 본문 */
font-family: 'Noto Sans KR', sans-serif;

/* 제목 */
font-family: 'Noto Serif KR', serif;
```

### 규칙
- 폰트 2개 이하
- 제목과 본문 구분
- 줄간격 1.5-1.8
- 모바일 14px 이상

## 레이아웃 팁

### 여백
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}
```

### 버튼
```css
.button {
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 16px;
}

.button:hover {
    transform: translateY(-2px);
}
```

## Cursor에게 요청하기

```
현대적이고 깔끔한 디자인으로 만들어줘.
- 파란색 계열
- 카드 레이아웃
- 둥근 모서리
- 호버 효과
- 반응형
```

## 참고 사이트

- Dribbble - 디자인 영감
- Awwwards - 우수 웹사이트
- Coolors.co - 색상 팔레트
- Google Fonts - 무료 폰트
