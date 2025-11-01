# 간단한 계산기 만들기

JavaScript를 이용해 사칙연산이 가능한 계산기를 만들어봅시다.

## 완성 모습

```
┌─────────────────┐
│      0          │ ← 디스플레이
├─────────────────┤
│  7   8   9   ÷  │
│  4   5   6   ×  │
│  1   2   3   -  │
│  C   0   =   +  │
└─────────────────┘
```

## 전체 코드

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>계산기</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .calculator {
            background-color: #2d3436;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        #display {
            width: 100%;
            height: 60px;
            background-color: #000;
            color: #0f0;
            font-size: 32px;
            text-align: right;
            padding: 10px;
            margin-bottom: 15px;
            border: none;
            border-radius: 5px;
            box-sizing: border-box;
            font-family: 'Courier New', monospace;
        }

        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }

        button {
            padding: 20px;
            font-size: 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: bold;
        }

        button:hover {
            transform: scale(1.05);
        }

        button:active {
            transform: scale(0.95);
        }

        .number {
            background-color: #636e72;
            color: white;
        }

        .number:hover {
            background-color: #747d8c;
        }

        .operator {
            background-color: #ff7675;
            color: white;
        }

        .operator:hover {
            background-color: #ff8787;
        }

        .equals {
            background-color: #00b894;
            color: white;
        }

        .equals:hover {
            background-color: #00cec9;
        }

        .clear {
            background-color: #fdcb6e;
            color: #2d3436;
        }

        .clear:hover {
            background-color: #ffeaa7;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <input type="text" id="display" value="0" readonly>
        <div class="buttons">
            <button class="number" data-num="7">7</button>
            <button class="number" data-num="8">8</button>
            <button class="number" data-num="9">9</button>
            <button class="operator" data-op="/">÷</button>

            <button class="number" data-num="4">4</button>
            <button class="number" data-num="5">5</button>
            <button class="number" data-num="6">6</button>
            <button class="operator" data-op="*">×</button>

            <button class="number" data-num="1">1</button>
            <button class="number" data-num="2">2</button>
            <button class="number" data-num="3">3</button>
            <button class="operator" data-op="-">-</button>

            <button class="clear">C</button>
            <button class="number" data-num="0">0</button>
            <button class="equals">=</button>
            <button class="operator" data-op="+">+</button>
        </div>
    </div>

    <script>
        const display = document.getElementById('display');
        const numberButtons = document.querySelectorAll('.number');
        const operatorButtons = document.querySelectorAll('.operator');
        const equalsButton = document.querySelector('.equals');
        const clearButton = document.querySelector('.clear');

        let currentValue = '0';
        let previousValue = '';
        let operator = '';

        // 숫자 버튼 클릭
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                const num = button.getAttribute('data-num');
                if (currentValue === '0') {
                    currentValue = num;
                } else {
                    currentValue += num;
                }
                display.value = currentValue;
            });
        });

        // 연산자 버튼 클릭
        operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                operator = button.getAttribute('data-op');
                previousValue = currentValue;
                currentValue = '0';
            });
        });

        // = 버튼 클릭
        equalsButton.addEventListener('click', () => {
            if (operator && previousValue) {
                const prev = parseFloat(previousValue);
                const current = parseFloat(currentValue);
                let result = 0;

                switch(operator) {
                    case '+':
                        result = prev + current;
                        break;
                    case '-':
                        result = prev - current;
                        break;
                    case '*':
                        result = prev * current;
                        break;
                    case '/':
                        result = current !== 0 ? prev / current : 'Error';
                        break;
                }

                currentValue = result.toString();
                display.value = currentValue;
                operator = '';
                previousValue = '';
            }
        });

        // C(Clear) 버튼 클릭
        clearButton.addEventListener('click', () => {
            currentValue = '0';
            previousValue = '';
            operator = '';
            display.value = currentValue;
        });
    </script>
</body>
</html>
```

## 코드 설명

### 1. HTML 구조
```html
<div class="calculator">
    <input type="text" id="display" readonly>  <!-- 결과 화면 -->
    <div class="buttons">
        <!-- 버튼들 -->
    </div>
</div>
```

### 2. CSS 스타일
```css
.calculator {
    background-color: #2d3436;
    padding: 20px;
    border-radius: 15px;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);  /* 4열 그리드 */
    gap: 10px;
}
```

### 3. JavaScript 변수
```javascript
let currentValue = '0';    // 현재 입력된 숫자
let previousValue = '';    // 이전 숫자
let operator = '';         // 선택된 연산자
```

### 4. 숫자 버튼 기능
```javascript
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const num = button.getAttribute('data-num');
        if (currentValue === '0') {
            currentValue = num;  // 0이면 교체
        } else {
            currentValue += num;  // 아니면 추가
        }
        display.value = currentValue;
    });
});
```

### 5. 연산자 버튼 기능
```javascript
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        operator = button.getAttribute('data-op');
        previousValue = currentValue;  // 현재 값 저장
        currentValue = '0';            // 다음 입력 준비
    });
});
```

### 6. = 버튼 기능
```javascript
equalsButton.addEventListener('click', () => {
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    switch(operator) {
        case '+':
            result = prev + current;
            break;
        // ... 다른 연산자들
    }

    currentValue = result.toString();
    display.value = currentValue;
});
```

## 단계별로 만들기

### 1단계: HTML 구조
먼저 계산기의 뼈대를 만듭니다.

### 2단계: CSS 스타일
디스플레이와 버튼을 예쁘게 꾸밉니다.

### 3단계: 숫자 입력 기능
숫자 버튼을 클릭하면 디스플레이에 표시되도록 합니다.

### 4단계: 연산자 기능
+, -, ×, ÷ 버튼이 작동하도록 합니다.

### 5단계: 계산 기능
= 버튼을 눌렀을 때 결과를 계산합니다.

### 6단계: Clear 기능
C 버튼으로 초기화합니다.

## AI로 계산기 만들기

Cursor AI에게 요청:
```
계산기 만들어줘.
기능:
- 숫자 버튼 0-9
- 사칙연산 (+, -, ×, ÷)
- 결과 표시 (=)
- 초기화 (C)
- 그리드 레이아웃 (4x4)
- 현대적인 디자인

스타일:
- 어두운 배경
- 네온 그린 디스플레이
- 호버 효과
- 그라데이션 배경
```

## 기능 추가하기

### 소수점 버튼
```html
<button class="decimal">.</button>
```

```javascript
const decimalButton = document.querySelector('.decimal');

decimalButton.addEventListener('click', () => {
    if (!currentValue.includes('.')) {
        currentValue += '.';
        display.value = currentValue;
    }
});
```

### 백스페이스 기능
```html
<button class="backspace">←</button>
```

```javascript
const backspaceButton = document.querySelector('.backspace');

backspaceButton.addEventListener('click', () => {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    display.value = currentValue;
});
```

### 키보드 입력 지원
```javascript
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        // 숫자 입력
        if (currentValue === '0') {
            currentValue = e.key;
        } else {
            currentValue += e.key;
        }
        display.value = currentValue;
    } else if (e.key === 'Enter') {
        // Enter = 계산
        equalsButton.click();
    } else if (e.key === 'Escape') {
        // ESC = 초기화
        clearButton.click();
    }
});
```

## 개선 아이디어

### 1. 연산 히스토리
```javascript
let history = [];

function addToHistory(calculation) {
    history.push(calculation);
    console.log(history);
}

// = 버튼에서
const calculation = `${previousValue} ${operator} ${currentValue} = ${result}`;
addToHistory(calculation);
```

### 2. 과학 계산기
```html
<button class="function" data-func="sqrt">√</button>
<button class="function" data-func="square">x²</button>
<button class="function" data-func="percent">%</button>
```

```javascript
functionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const func = button.getAttribute('data-func');
        const current = parseFloat(currentValue);

        switch(func) {
            case 'sqrt':
                currentValue = Math.sqrt(current).toString();
                break;
            case 'square':
                currentValue = (current * current).toString();
                break;
            case 'percent':
                currentValue = (current / 100).toString();
                break;
        }
        display.value = currentValue;
    });
});
```

### 3. 테마 변경
```javascript
const themes = {
    dark: {
        background: '#2d3436',
        display: '#000',
        displayColor: '#0f0'
    },
    light: {
        background: '#ecf0f1',
        display: '#fff',
        displayColor: '#000'
    }
};

function changeTheme(themeName) {
    const theme = themes[themeName];
    document.querySelector('.calculator').style.backgroundColor = theme.background;
    display.style.backgroundColor = theme.display;
    display.style.color = theme.displayColor;
}
```

## 흔한 버그 수정

### 1. 0으로 나누기
```javascript
case '/':
    result = current !== 0 ? prev / current : 'Error';
    break;
```

### 2. 연속 연산
```javascript
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 이전 연산이 있으면 먼저 계산
        if (operator && previousValue && currentValue !== '0') {
            equalsButton.click();
        }
        operator = button.getAttribute('data-op');
        previousValue = currentValue;
        currentValue = '0';
    });
});
```

### 3. 숫자 길이 제한
```javascript
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const num = button.getAttribute('data-num');
        if (currentValue.length < 10) {  // 최대 10자리
            if (currentValue === '0') {
                currentValue = num;
            } else {
                currentValue += num;
            }
            display.value = currentValue;
        }
    });
});
```

## 다음 단계

계산기를 만들었습니다. 이제 할일 목록(To-Do List)를 만들어봅시다!
