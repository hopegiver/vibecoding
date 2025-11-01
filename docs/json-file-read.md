# JSON 파일 만들고 읽기

JavaScript로 JSON 파일을 읽어서 웹페이지에 표시하는 방법을 배워봅시다.

## 프로젝트 구조

```
my-project/
├── index.html
├── script.js
└── data.json
```

## 1단계: JSON 파일 만들기

### data.json
```json
[
  {
    "id": 1,
    "이름": "김철수",
    "부서": "개발팀",
    "직책": "대리",
    "이메일": "kim@company.com"
  },
  {
    "id": 2,
    "이름": "이영희",
    "부서": "디자인팀",
    "직책": "주임",
    "이메일": "lee@company.com"
  },
  {
    "id": 3,
    "이름": "박민수",
    "부서": "마케팅팀",
    "직책": "사원",
    "이메일": "park@company.com"
  }
]
```

## 2단계: HTML 파일 만들기

### index.html
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>JSON 데이터 읽기</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        #dataContainer {
            margin-top: 20px;
        }
        .item {
            background-color: #f5f5f5;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>직원 목록</h1>
    <button id="loadBtn">데이터 불러오기</button>
    <div id="dataContainer"></div>

    <script src="script.js"></script>
</body>
</html>
```

## 3단계: JavaScript로 JSON 읽기

### script.js
```javascript
const loadBtn = document.getElementById('loadBtn');
const container = document.getElementById('dataContainer');

loadBtn.addEventListener('click', loadData);

function loadData() {
    // fetch로 JSON 파일 읽기
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            displayData(data);
        })
        .catch(error => {
            console.error('에러:', error);
            container.innerHTML = '<p>데이터를 불러올 수 없습니다.</p>';
        });
}

function displayData(employees) {
    container.innerHTML = '';

    employees.forEach(employee => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <strong>${employee.이름}</strong> (${employee.직책})<br>
            부서: ${employee.부서}<br>
            이메일: ${employee.이메일}
        `;
        container.appendChild(div);
    });
}
```

## fetch API 이해하기

### 기본 문법
```javascript
fetch('파일경로')
    .then(response => response.json())  // JSON 파싱
    .then(data => {
        // 데이터 사용
        console.log(data);
    })
    .catch(error => {
        // 에러 처리
        console.error(error);
    });
```

### 단계별 설명
```javascript
// 1. 파일 요청
fetch('data.json')

// 2. 응답을 JSON으로 변환
.then(response => response.json())

// 3. 변환된 데이터 사용
.then(data => {
    console.log(data);  // 배열 또는 객체
})

// 4. 에러 처리
.catch(error => {
    console.error('에러 발생:', error);
});
```

## 페이지 로드 시 자동 실행

버튼 없이 페이지가 열리면 자동으로 데이터 로드:

```javascript
// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', () => {
    loadData();
});

function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            displayData(data);
        })
        .catch(error => {
            console.error('에러:', error);
        });
}
```

## 로딩 상태 표시

```javascript
function loadData() {
    // 로딩 표시
    container.innerHTML = '<p>데이터를 불러오는 중...</p>';

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            displayData(data);
        })
        .catch(error => {
            container.innerHTML = '<p>데이터를 불러올 수 없습니다.</p>';
        });
}
```

## 여러 JSON 파일 읽기

### 파일 구조
```
project/
├── index.html
├── employees.json
├── products.json
└── script.js
```

### 여러 파일 읽기
```javascript
// 방법 1: 순차적으로
fetch('employees.json')
    .then(response => response.json())
    .then(employees => {
        displayEmployees(employees);

        return fetch('products.json');
    })
    .then(response => response.json())
    .then(products => {
        displayProducts(products);
    });

// 방법 2: 동시에
Promise.all([
    fetch('employees.json').then(r => r.json()),
    fetch('products.json').then(r => r.json())
])
.then(([employees, products]) => {
    displayEmployees(employees);
    displayProducts(products);
});
```

## 실전 예제: 제품 목록

### products.json
```json
[
  {
    "id": 1,
    "제품명": "무선 마우스",
    "가격": 35000,
    "이미지": "mouse.jpg",
    "설명": "편안한 그립감의 무선 마우스"
  },
  {
    "id": 2,
    "제품명": "기계식 키보드",
    "가격": 89000,
    "이미지": "keyboard.jpg",
    "설명": "청축 스위치 기계식 키보드"
  },
  {
    "id": 3,
    "제품명": "모니터",
    "가격": 250000,
    "이미지": "monitor.jpg",
    "설명": "27인치 4K 모니터"
  }
]
```

### 전체 코드
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>제품 목록</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        .product-card {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }

        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }

        .product-image {
            width: 100%;
            height: 200px;
            background-color: #eee;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
            color: #999;
        }

        .product-name {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }

        .product-price {
            font-size: 24px;
            color: #4CAF50;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .product-description {
            color: #666;
            line-height: 1.5;
            margin-bottom: 15px;
        }

        .buy-button {
            width: 100%;
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        .buy-button:hover {
            background-color: #45a049;
        }

        .loading {
            text-align: center;
            padding: 50px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>제품 목록</h1>
        <div id="productsContainer" class="products-grid"></div>
    </div>

    <script>
        const container = document.getElementById('productsContainer');

        // 페이지 로드 시 실행
        window.addEventListener('DOMContentLoaded', loadProducts);

        function loadProducts() {
            container.innerHTML = '<div class="loading">제품을 불러오는 중...</div>';

            fetch('products.json')
                .then(response => response.json())
                .then(products => {
                    displayProducts(products);
                })
                .catch(error => {
                    console.error('에러:', error);
                    container.innerHTML = '<div class="loading">제품을 불러올 수 없습니다.</div>';
                });
        }

        function displayProducts(products) {
            container.innerHTML = '';

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';

                card.innerHTML = `
                    <div class="product-image">${product.이미지}</div>
                    <div class="product-name">${product.제품명}</div>
                    <div class="product-price">${product.가격.toLocaleString()}원</div>
                    <div class="product-description">${product.설명}</div>
                    <button class="buy-button" onclick="buyProduct(${product.id})">
                        구매하기
                    </button>
                `;

                container.appendChild(card);
            });
        }

        function buyProduct(id) {
            alert(`제품 ID ${id}를 장바구니에 담았습니다!`);
        }
    </script>
</body>
</html>
```

## 로컬 서버에서 테스트

### 문제
브라우저에서 직접 HTML 파일을 열면 CORS 에러 발생:
```
Access to fetch at 'file:///...' has been blocked by CORS policy
```

### 해결 방법 1: Live Server 사용 (권장)

#### VSCode/Cursor에서:
1. 확장 프로그램 검색: "Live Server"
2. 설치
3. HTML 파일 우클릭 → "Open with Live Server"

### 해결 방법 2: Python 서버
```bash
# Python 3가 설치되어 있다면
python -m http.server 8000

# 브라우저에서 접속
http://localhost:8000
```

### 해결 방법 3: Node.js 서버
```bash
# npx 사용 (Node.js 설치 필요)
npx http-server

# 또는
npx serve
```

## 에러 처리

### 파일이 없을 때
```javascript
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('파일을 찾을 수 없습니다');
        }
        return response.json();
    })
    .then(data => {
        displayData(data);
    })
    .catch(error => {
        console.error('에러:', error);
        container.innerHTML = `<p>에러: ${error.message}</p>`;
    });
```

### JSON 형식이 잘못되었을 때
```javascript
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data)) {
            throw new Error('데이터 형식이 올바르지 않습니다');
        }
        displayData(data);
    })
    .catch(error => {
        console.error('에러:', error);
    });
```

## async/await 방식

더 읽기 쉬운 코드:

```javascript
async function loadData() {
    try {
        container.innerHTML = '<p>로딩 중...</p>';

        const response = await fetch('data.json');
        const data = await response.json();

        displayData(data);
    } catch (error) {
        console.error('에러:', error);
        container.innerHTML = '<p>데이터를 불러올 수 없습니다.</p>';
    }
}

// 사용
loadData();
```

## 데이터 필터링

```javascript
function displayData(employees) {
    // 개발팀만 필터링
    const devTeam = employees.filter(emp => emp.부서 === '개발팀');

    devTeam.forEach(employee => {
        // 표시
    });
}
```

## 데이터 정렬

```javascript
function displayData(employees) {
    // 이름순 정렬
    const sorted = employees.sort((a, b) =>
        a.이름.localeCompare(b.이름)
    );

    sorted.forEach(employee => {
        // 표시
    });
}
```

## AI로 JSON 읽기 코드 생성

Cursor AI에게 요청:
```
products.json 파일을 읽어서 카드 형태로 표시하는 코드 만들어줘.
각 카드에는:
- 제품 이미지
- 제품명
- 가격
- 설명
- 구매 버튼
포함해줘.
```

## 다음 단계

JSON 파일을 읽는 방법을 배웠습니다. 이제 데이터를 예쁘게 표시하는 방법을 배워봅시다!
