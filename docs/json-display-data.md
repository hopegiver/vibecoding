# 데이터 목록 표시하기

JSON 데이터를 다양한 형태로 표시하는 방법을 배워봅시다.

## 기본 리스트 형태

### HTML 구조
```html
<div id="listContainer"></div>
```

### JavaScript
```javascript
async function loadData() {
    const response = await fetch('employees.json');
    const employees = await response.json();

    const container = document.getElementById('listContainer');

    employees.forEach(employee => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <h3>${employee.이름}</h3>
            <p>${employee.부서} - ${employee.직책}</p>
        `;
        container.appendChild(item);
    });
}
```

## 테이블 형태

### HTML
```html
<table id="employeeTable">
    <thead>
        <tr>
            <th>이름</th>
            <th>부서</th>
            <th>직책</th>
            <th>이메일</th>
        </tr>
    </thead>
    <tbody id="tableBody"></tbody>
</table>
```

### JavaScript
```javascript
async function loadTable() {
    const response = await fetch('employees.json');
    const employees = await response.json();

    const tbody = document.getElementById('tableBody');

    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.이름}</td>
            <td>${employee.부서}</td>
            <td>${employee.직책}</td>
            <td>${employee.이메일}</td>
        `;
        tbody.appendChild(row);
    });
}
```

### CSS 스타일
```css
table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #4CAF50;
    color: white;
}

tr:hover {
    background-color: #f5f5f5;
}
```

## 카드 그리드 형태

### HTML
```html
<div class="cards-grid" id="cardsContainer"></div>
```

### CSS
```css
.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
}

.card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.card-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
}

.card-info {
    color: #666;
    margin: 5px 0;
}
```

### JavaScript
```javascript
async function loadCards() {
    const response = await fetch('employees.json');
    const employees = await response.json();

    const container = document.getElementById('cardsContainer');

    employees.forEach(employee => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-title">${employee.이름}</div>
            <div class="card-info">부서: ${employee.부서}</div>
            <div class="card-info">직책: ${employee.직책}</div>
            <div class="card-info">
                <a href="mailto:${employee.이메일}">${employee.이메일}</a>
            </div>
        `;
        container.appendChild(card);
    });
}
```

## 필터링 기능

### HTML
```html
<select id="departmentFilter">
    <option value="all">전체 부서</option>
    <option value="개발팀">개발팀</option>
    <option value="디자인팀">디자인팀</option>
    <option value="마케팅팀">마케팅팀</option>
</select>

<div id="employeeList"></div>
```

### JavaScript
```javascript
let allEmployees = [];

async function loadEmployees() {
    const response = await fetch('employees.json');
    allEmployees = await response.json();
    displayEmployees(allEmployees);
}

function displayEmployees(employees) {
    const container = document.getElementById('employeeList');
    container.innerHTML = '';

    employees.forEach(employee => {
        const item = document.createElement('div');
        item.className = 'employee-item';
        item.innerHTML = `
            <h3>${employee.이름}</h3>
            <p>${employee.부서} - ${employee.직책}</p>
        `;
        container.appendChild(item);
    });
}

// 필터 이벤트
document.getElementById('departmentFilter').addEventListener('change', (e) => {
    const selectedDept = e.target.value;

    if (selectedDept === 'all') {
        displayEmployees(allEmployees);
    } else {
        const filtered = allEmployees.filter(emp => emp.부서 === selectedDept);
        displayEmployees(filtered);
    }
});

// 페이지 로드 시 실행
loadEmployees();
```

## 검색 기능

### HTML
```html
<input type="text" id="searchInput" placeholder="이름 검색...">
<div id="searchResults"></div>
```

### JavaScript
```javascript
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = allEmployees.filter(employee =>
        employee.이름.toLowerCase().includes(searchTerm)
    );

    displayEmployees(filtered);
});
```

## 정렬 기능

### HTML
```html
<select id="sortSelect">
    <option value="name-asc">이름 (가나다순)</option>
    <option value="name-desc">이름 (역순)</option>
    <option value="dept-asc">부서 (가나다순)</option>
</select>
```

### JavaScript
```javascript
document.getElementById('sortSelect').addEventListener('change', (e) => {
    const sortType = e.target.value;
    let sorted = [...allEmployees];

    switch(sortType) {
        case 'name-asc':
            sorted.sort((a, b) => a.이름.localeCompare(b.이름));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.이름.localeCompare(a.이름));
            break;
        case 'dept-asc':
            sorted.sort((a, b) => a.부서.localeCompare(b.부서));
            break;
    }

    displayEmployees(sorted);
});
```

## 페이지네이션

### HTML
```html
<div id="employeeList"></div>
<div class="pagination">
    <button id="prevBtn">이전</button>
    <span id="pageInfo"></span>
    <button id="nextBtn">다음</button>
</div>
```

### JavaScript
```javascript
let currentPage = 1;
const itemsPerPage = 5;

function displayPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = allEmployees.slice(startIndex, endIndex);

    displayEmployees(pageItems);

    // 페이지 정보 업데이트
    const totalPages = Math.ceil(allEmployees.length / itemsPerPage);
    document.getElementById('pageInfo').textContent =
        `${page} / ${totalPages}`;

    // 버튼 활성화/비활성화
    document.getElementById('prevBtn').disabled = page === 1;
    document.getElementById('nextBtn').disabled = page === totalPages;
}

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    const totalPages = Math.ceil(allEmployees.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
    }
});
```

## 전체 예제: 직원 디렉토리

### employees.json
```json
[
  {
    "id": 1,
    "이름": "김철수",
    "부서": "개발팀",
    "직책": "팀장",
    "이메일": "kim@company.com",
    "전화": "010-1234-5678",
    "입사일": "2018-03-15"
  },
  {
    "id": 2,
    "이름": "이영희",
    "부서": "디자인팀",
    "직책": "대리",
    "이메일": "lee@company.com",
    "전화": "010-2345-6789",
    "입사일": "2019-06-20"
  },
  {
    "id": 3,
    "이름": "박민수",
    "부서": "마케팅팀",
    "직책": "사원",
    "이메일": "park@company.com",
    "전화": "010-3456-7890",
    "입사일": "2021-01-10"
  }
]
```

### 완성된 코드
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>직원 디렉토리</title>
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
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        h1 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
        }

        .controls {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .search-box {
            flex: 1;
            min-width: 250px;
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
        }

        .search-box:focus {
            outline: none;
            border-color: #4CAF50;
        }

        select {
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .employee-card {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 20px;
            border-left: 5px solid #4CAF50;
            transition: all 0.3s;
        }

        .employee-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .employee-name {
            font-size: 22px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }

        .employee-role {
            color: #4CAF50;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .employee-info {
            color: #666;
            margin: 5px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .employee-info strong {
            min-width: 50px;
        }

        .employee-info a {
            color: #4CAF50;
            text-decoration: none;
        }

        .employee-info a:hover {
            text-decoration: underline;
        }

        .stats {
            background-color: #f0f8f0;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-around;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #4CAF50;
        }

        .stat-label {
            color: #666;
            margin-top: 5px;
        }

        .empty-message {
            text-align: center;
            padding: 50px;
            color: #999;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>직원 디렉토리</h1>

        <div class="stats" id="stats">
            <div class="stat-item">
                <div class="stat-number" id="totalCount">0</div>
                <div class="stat-label">전체 직원</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="deptCount">0</div>
                <div class="stat-label">부서 수</div>
            </div>
        </div>

        <div class="controls">
            <input
                type="text"
                class="search-box"
                id="searchInput"
                placeholder="이름 검색..."
            >
            <select id="departmentFilter">
                <option value="all">전체 부서</option>
            </select>
            <select id="sortSelect">
                <option value="name-asc">이름 (가나다순)</option>
                <option value="name-desc">이름 (역순)</option>
                <option value="dept-asc">부서 (가나다순)</option>
            </select>
        </div>

        <div class="cards-grid" id="employeeList"></div>
    </div>

    <script>
        let allEmployees = [];
        let filteredEmployees = [];

        // 페이지 로드 시 실행
        window.addEventListener('DOMContentLoaded', loadEmployees);

        async function loadEmployees() {
            try {
                const response = await fetch('employees.json');
                allEmployees = await response.json();
                filteredEmployees = allEmployees;

                updateStats();
                populateDepartmentFilter();
                displayEmployees(filteredEmployees);
            } catch (error) {
                console.error('에러:', error);
                document.getElementById('employeeList').innerHTML =
                    '<div class="empty-message">직원 데이터를 불러올 수 없습니다.</div>';
            }
        }

        function displayEmployees(employees) {
            const container = document.getElementById('employeeList');

            if (employees.length === 0) {
                container.innerHTML =
                    '<div class="empty-message">검색 결과가 없습니다.</div>';
                return;
            }

            container.innerHTML = '';

            employees.forEach(employee => {
                const card = document.createElement('div');
                card.className = 'employee-card';
                card.innerHTML = `
                    <div class="employee-name">${employee.이름}</div>
                    <div class="employee-role">${employee.직책}</div>
                    <div class="employee-info">
                        <strong>부서:</strong> ${employee.부서}
                    </div>
                    <div class="employee-info">
                        <strong>이메일:</strong>
                        <a href="mailto:${employee.이메일}">${employee.이메일}</a>
                    </div>
                    <div class="employee-info">
                        <strong>전화:</strong>
                        <a href="tel:${employee.전화}">${employee.전화}</a>
                    </div>
                    <div class="employee-info">
                        <strong>입사:</strong> ${employee.입사일}
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function updateStats() {
            document.getElementById('totalCount').textContent = allEmployees.length;

            const departments = new Set(allEmployees.map(emp => emp.부서));
            document.getElementById('deptCount').textContent = departments.size;
        }

        function populateDepartmentFilter() {
            const departments = new Set(allEmployees.map(emp => emp.부서));
            const select = document.getElementById('departmentFilter');

            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                select.appendChild(option);
            });
        }

        // 검색 기능
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            applyFilters(searchTerm);
        });

        // 부서 필터
        document.getElementById('departmentFilter').addEventListener('change', (e) => {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            applyFilters(searchTerm);
        });

        function applyFilters(searchTerm) {
            const selectedDept = document.getElementById('departmentFilter').value;

            filteredEmployees = allEmployees.filter(employee => {
                const matchesSearch = employee.이름.toLowerCase().includes(searchTerm);
                const matchesDept = selectedDept === 'all' || employee.부서 === selectedDept;
                return matchesSearch && matchesDept;
            });

            displayEmployees(filteredEmployees);
        }

        // 정렬 기능
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            const sortType = e.target.value;
            let sorted = [...filteredEmployees];

            switch(sortType) {
                case 'name-asc':
                    sorted.sort((a, b) => a.이름.localeCompare(b.이름));
                    break;
                case 'name-desc':
                    sorted.sort((a, b) => b.이름.localeCompare(a.이름));
                    break;
                case 'dept-asc':
                    sorted.sort((a, b) => a.부서.localeCompare(b.부서));
                    break;
            }

            displayEmployees(sorted);
        });
    </script>
</body>
</html>
```

## 데이터 개수 표시

```javascript
function displayEmployees(employees) {
    // ... 기존 코드 ...

    // 결과 개수 표시
    const count = document.getElementById('resultCount');
    count.textContent = `${employees.length}명의 직원`;
}
```

## 데이터 그룹화

부서별로 그룹화:

```javascript
function groupByDepartment(employees) {
    const grouped = {};

    employees.forEach(employee => {
        const dept = employee.부서;
        if (!grouped[dept]) {
            grouped[dept] = [];
        }
        grouped[dept].push(employee);
    });

    return grouped;
}

function displayGrouped() {
    const grouped = groupByDepartment(allEmployees);
    const container = document.getElementById('employeeList');
    container.innerHTML = '';

    Object.keys(grouped).forEach(dept => {
        const section = document.createElement('div');
        section.innerHTML = `<h2>${dept}</h2>`;

        grouped[dept].forEach(employee => {
            const item = document.createElement('div');
            item.className = 'employee-item';
            item.innerHTML = `${employee.이름} - ${employee.직책}`;
            section.appendChild(item);
        });

        container.appendChild(section);
    });
}
```

## AI로 데이터 표시 코드 생성

Cursor AI에게 요청:
```
employees.json 데이터를 카드 형태로 표시하는 웹페이지 만들어줘.
기능:
- 검색 (이름)
- 필터 (부서별)
- 정렬 (이름, 부서)
- 통계 (전체 직원 수, 부서 수)

디자인:
- 깔끔한 카드 레이아웃
- 호버 효과
- 반응형 그리드
```

## 다음 단계

데이터 표시 방법을 배웠습니다. 이제 실전 프로젝트로 직원 명부를 만들어봅시다!
