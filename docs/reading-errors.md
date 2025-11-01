# 에러 메시지 읽는 법

에러를 이해하고 해결하는 방법을 배워봅시다.

## 흔한 JavaScript 에러

### 1. Cannot read property 'x' of null
```
Uncaught TypeError: Cannot read property 'name' of null
```

**의미:** null 객체의 속성에 접근하려고 함

**원인:**
```javascript
const element = document.getElementById('notexist');
console.log(element.innerHTML); // 에러!
```

**해결:**
```javascript
const element = document.getElementById('notexist');
if (element) {
    console.log(element.innerHTML);
}
```

### 2. is not defined
```
Uncaught ReferenceError: myVariable is not defined
```

**의미:** 변수가 선언되지 않음

**원인:**
```javascript
console.log(name); // 선언 안 함!
```

**해결:**
```javascript
const name = "김철수";
console.log(name);
```

### 3. Unexpected token
```
Uncaught SyntaxError: Unexpected token '}'
```

**의미:** 문법 오류

**원인:**
```javascript
function test() {
    console.log("hello");
}} // 중괄호 하나 더!
```

**해결:**
```javascript
function test() {
    console.log("hello");
}
```

## JSON 에러

### Unexpected token in JSON
```
SyntaxError: Unexpected token } in JSON at position 45
```

**원인:**
- 마지막 쉼표
- 작은따옴표 사용
- 주석

**해결:**
```json
{
    "name": "Kim",
    "age": 20
}
```

## Fetch 에러

### Failed to fetch
```
TypeError: Failed to fetch
```

**원인:**
- 파일 경로 잘못됨
- CORS 문제
- 네트워크 오류

**해결:**
```javascript
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
    })
    .catch(error => console.error('Error:', error));
```

## 에러 읽기 팁

### 에러 메시지 구조
```
Uncaught TypeError: Cannot read property 'name' of null
  at script.js:15
```

1. **Uncaught** - 처리되지 않은 에러
2. **TypeError** - 에러 유형
3. **설명** - 무엇이 잘못되었는지
4. **파일:줄번호** - 어디서 발생했는지

### 대처 방법

1. **에러 위치 확인**
   - 파일명과 줄번호 확인

2. **에러 유형 파악**
   - TypeError, ReferenceError, SyntaxError

3. **구글 검색**
   - 에러 메시지 복사해서 검색

4. **Cursor에게 물어보기**
   ```
   이런 에러가 나는데:
   [에러 메시지]

   [관련 코드]

   뭐가 문제인지 설명하고 수정해줘.
   ```

## 다음 단계

에러는 두렵지 않습니다.
차근차근 읽고 해결하세요!
