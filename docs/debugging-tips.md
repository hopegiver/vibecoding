# 디버깅하는 법

문제를 찾고 해결하는 실전 팁을 알아봅시다.

## 브라우저 개발자 도구

### 콘솔 사용하기
**F12** 또는 **Ctrl + Shift + I**로 열기

#### console.log 활용
```javascript
// 변수 확인
const name = "김철수";
console.log("이름:", name);

// 객체 확인
const user = { name: "김철수", age: 20 };
console.log("사용자:", user);

// 배열 확인
const items = [1, 2, 3];
console.log("아이템:", items);
```

#### 네트워크 탭
- Elements → 구조 확인
- Console → 에러 메시지
- Network → 파일 로딩 확인
- Sources → 코드 중단점

## 일반적인 문제 해결

### 페이지가 안 보여요
1. F12 → Console 확인
2. 빨간 에러 있는지 확인
3. 파일 경로 확인

### JSON이 안 읽혀요
```javascript
fetch('data.json')
    .then(response => {
        console.log('응답:', response);  // 상태 확인
        return response.json();
    })
    .then(data => {
        console.log('데이터:', data);   // 데이터 확인
    })
    .catch(error => {
        console.error('에러:', error);  // 에러 확인
    });
```

### 클릭이 안 돼요
```javascript
// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('myButton');
    console.log('버튼:', button);  // null이면 ID 확인!

    button.addEventListener('click', () => {
        console.log('클릭됨!');
    });
});
```

## Cursor AI 활용

### 에러 메시지 복사해서 물어보기
```
Cursor에게:

이런 에러가 나와:
Uncaught TypeError: Cannot read property 'name' of null

코드:
const user = document.getElementById('user');
console.log(user.name);

뭐가 문제인지 설명하고 수정해줘.
```

### 단계별 디버깅 요청
```
Cursor에게:

fetch로 데이터를 가져오는데 안 보여.
단계별로 console.log 추가해서
어디서 문제인지 찾아줘.
```

## 체계적 접근법

1. **문제 재현**
   - 어떤 상황에서 발생하는지

2. **에러 메시지 확인**
   - Console 탭 체크

3. **최근 변경사항 확인**
   - 뭘 고쳤는지 돌아보기

4. **한 번에 하나씩**
   - 여러 개 동시 수정 금지

5. **검색하기**
   - 에러 메시지 구글링

## 다음 단계

디버깅은 연습입니다.
에러를 두려워하지 마세요!
