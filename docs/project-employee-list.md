# 프로젝트: 직원 명부 만들기

회사 직원 명부 웹사이트를 만들어봅시다. JSON 파일로 직원 정보를 관리하고 검색/필터 기능을 추가합니다.

## 완성 모습

```
맑은소프트 직원 명부
┌──────────────────────────────────┐
│ [검색창] [부서▼] [정렬▼]         │
└──────────────────────────────────┘

통계: 전체 20명 | 개발팀 8명 | 디자인팀 6명

┌────────────┐ ┌────────────┐ ┌────────────┐
│ 김철수      │ │ 이영희      │ │ 박민수      │
│ 개발팀 팀장 │ │ 디자인 대리 │ │ 마케팅 사원 │
│ 📧 이메일   │ │ 📧 이메일   │ │ 📧 이메일   │
│ 📞 전화     │ │ 📞 전화     │ │ 📞 전화     │
└────────────┘ └────────────┘ └────────────┘
```

## 1단계: JSON 데이터 준비

### employees.json
```json
[
  {
    "id": 1,
    "이름": "김철수",
    "영문명": "Kim Chulsoo",
    "부서": "개발팀",
    "팀": "백엔드팀",
    "직책": "팀장",
    "이메일": "chulsoo.kim@company.com",
    "전화": "010-1234-5678",
    "내선번호": "201",
    "입사일": "2018-03-15",
    "생일": "1985-05-20",
    "기술스택": ["Java", "Spring", "AWS"],
    "사진": "kim.jpg"
  },
  {
    "id": 2,
    "이름": "이영희",
    "영문명": "Lee Younghee",
    "부서": "디자인팀",
    "팀": "UI/UX팀",
    "직책": "대리",
    "이메일": "younghee.lee@company.com",
    "전화": "010-2345-6789",
    "내선번호": "301",
    "입사일": "2019-06-20",
    "생일": "1990-08-15",
    "기술스택": ["Figma", "Sketch", "Photoshop"],
    "사진": "lee.jpg"
  },
  {
    "id": 3,
    "이름": "박민수",
    "영문명": "Park Minsu",
    "부서": "마케팅팀",
    "팀": "디지털마케팅팀",
    "직책": "사원",
    "이메일": "minsu.park@company.com",
    "전화": "010-3456-7890",
    "내선번호": "401",
    "입사일": "2021-01-10",
    "생일": "1993-12-03",
    "기술스택": ["Google Analytics", "Facebook Ads", "SEO"],
    "사진": "park.jpg"
  },
  {
    "id": 4,
    "이름": "정수진",
    "영문명": "Jung Sujin",
    "부서": "개발팀",
    "팀": "프론트엔드팀",
    "직책": "대리",
    "이메일": "sujin.jung@company.com",
    "전화": "010-4567-8901",
    "내선번호": "202",
    "입사일": "2019-09-01",
    "생일": "1988-03-25",
    "기술스택": ["React", "TypeScript", "Next.js"],
    "사진": "jung.jpg"
  },
  {
    "id": 5,
    "이름": "최동욱",
    "영문명": "Choi Dongwook",
    "부서": "개발팀",
    "팀": "데브옵스팀",
    "직책": "주임",
    "이메일": "dongwook.choi@company.com",
    "전화": "010-5678-9012",
    "내선번호": "203",
    "입사일": "2020-04-15",
    "생일": "1991-07-10",
    "기술스택": ["Docker", "Kubernetes", "Jenkins"],
    "사진": "choi.jpg"
  }
]
```

## 2단계: HTML 구조

### index.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>맑은소프트 직원 명부</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- 헤더 -->
        <header>
            <h1>맑은소프트 직원 명부</h1>
            <p class="subtitle">우리 팀을 소개합니다</p>
        </header>

        <!-- 통계 -->
        <div class="stats-section">
            <div class="stat-card">
                <div class="stat-number" id="totalCount">0</div>
                <div class="stat-label">전체 직원</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="devCount">0</div>
                <div class="stat-label">개발팀</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="designCount">0</div>
                <div class="stat-label">디자인팀</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="marketingCount">0</div>
                <div class="stat-label">마케팅팀</div>
            </div>
        </div>

        <!-- 검색 및 필터 -->
        <div class="controls">
            <input
                type="text"
                id="searchInput"
                class="search-input"
                placeholder="🔍 이름, 부서, 팀 검색..."
            >
            <select id="deptFilter" class="filter-select">
                <option value="all">전체 부서</option>
                <option value="개발팀">개발팀</option>
                <option value="디자인팀">디자인팀</option>
                <option value="마케팅팀">마케팅팀</option>
            </select>
            <select id="sortSelect" class="filter-select">
                <option value="name-asc">이름순 ↑</option>
                <option value="name-desc">이름역순 ↓</option>
                <option value="dept-asc">부서순</option>
                <option value="date-new">최근 입사순</option>
                <option value="date-old">오래된 입사순</option>
            </select>
        </div>

        <!-- 직원 카드 그리드 -->
        <div id="employeeGrid" class="employee-grid"></div>

        <!-- 상세 모달 -->
        <div id="detailModal" class="modal">
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <div id="modalBody"></div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

## 3단계: CSS 스타일

### style.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
}

/* 헤더 */
header {
    text-align: center;
    color: white;
    margin-bottom: 40px;
}

header h1 {
    font-size: 42px;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.subtitle {
    font-size: 18px;
    opacity: 0.9;
}

/* 통계 섹션 */
.stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background-color: white;
    padding: 25px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-number {
    font-size: 36px;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 8px;
}

.stat-label {
    color: #666;
    font-size: 14px;
}

/* 검색 및 필터 */
.controls {
    background-color: white;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 30px;
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.search-input {
    flex: 1;
    min-width: 250px;
    padding: 12px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 16px;
    transition: all 0.3s;
}

.search-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
    padding: 12px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    background-color: white;
    transition: all 0.3s;
}

.filter-select:focus {
    outline: none;
    border-color: #667eea;
}

/* 직원 그리드 */
.employee-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 25px;
}

.employee-card {
    background-color: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: all 0.3s;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.employee-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.employee-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.employee-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.employee-photo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    font-weight: bold;
}

.employee-info {
    flex: 1;
}

.employee-name {
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
}

.employee-eng-name {
    font-size: 13px;
    color: #999;
    margin-bottom: 5px;
}

.employee-role {
    display: inline-block;
    background-color: #f0f4ff;
    color: #667eea;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: bold;
}

.employee-details {
    border-top: 1px solid #f0f0f0;
    padding-top: 15px;
}

.detail-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    color: #666;
    font-size: 14px;
}

.detail-row strong {
    min-width: 60px;
    color: #333;
}

.detail-row a {
    color: #667eea;
    text-decoration: none;
}

.detail-row a:hover {
    text-decoration: underline;
}

.tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 15px;
}

.tech-badge {
    background-color: #e8f5e9;
    color: #2e7d32;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
}

/* 모달 */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    backdrop-filter: blur(5px);
}

.modal-content {
    background-color: white;
    margin: 50px auto;
    padding: 40px;
    border-radius: 20px;
    max-width: 600px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    position: relative;
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 25px;
    font-size: 32px;
    font-weight: bold;
    color: #999;
    cursor: pointer;
    transition: color 0.3s;
}

.close-btn:hover {
    color: #333;
}

.empty-state {
    text-align: center;
    padding: 80px 20px;
    color: white;
    font-size: 18px;
}

.empty-state-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.5;
}

/* 반응형 */
@media (max-width: 768px) {
    header h1 {
        font-size: 32px;
    }

    .employee-grid {
        grid-template-columns: 1fr;
    }

    .controls {
        flex-direction: column;
    }

    .search-input,
    .filter-select {
        width: 100%;
    }
}
```

## 4단계: JavaScript 기능

### script.js
```javascript
let allEmployees = [];
let filteredEmployees = [];

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', init);

async function init() {
    await loadEmployees();
    setupEventListeners();
}

// 직원 데이터 로드
async function loadEmployees() {
    try {
        const response = await fetch('employees.json');
        allEmployees = await response.json();
        filteredEmployees = allEmployees;

        updateStats();
        displayEmployees(filteredEmployees);
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        showError('직원 데이터를 불러올 수 없습니다.');
    }
}

// 통계 업데이트
function updateStats() {
    document.getElementById('totalCount').textContent = allEmployees.length;

    const devCount = allEmployees.filter(emp => emp.부서 === '개발팀').length;
    const designCount = allEmployees.filter(emp => emp.부서 === '디자인팀').length;
    const marketingCount = allEmployees.filter(emp => emp.부서 === '마케팅팀').length;

    document.getElementById('devCount').textContent = devCount;
    document.getElementById('designCount').textContent = designCount;
    document.getElementById('marketingCount').textContent = marketingCount;
}

// 직원 카드 표시
function displayEmployees(employees) {
    const grid = document.getElementById('employeeGrid');

    if (employees.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div>검색 결과가 없습니다.</div>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';

    employees.forEach(employee => {
        const card = createEmployeeCard(employee);
        grid.appendChild(card);
    });
}

// 직원 카드 생성
function createEmployeeCard(employee) {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.onclick = () => showEmployeeDetail(employee);

    const initial = employee.이름.charAt(0);

    card.innerHTML = `
        <div class="employee-header">
            <div class="employee-photo">${initial}</div>
            <div class="employee-info">
                <div class="employee-name">${employee.이름}</div>
                <div class="employee-eng-name">${employee.영문명}</div>
                <span class="employee-role">${employee.부서} ${employee.직책}</span>
            </div>
        </div>
        <div class="employee-details">
            <div class="detail-row">
                <strong>팀:</strong> ${employee.팀}
            </div>
            <div class="detail-row">
                <strong>이메일:</strong>
                <a href="mailto:${employee.이메일}" onclick="event.stopPropagation()">
                    ${employee.이메일}
                </a>
            </div>
            <div class="detail-row">
                <strong>전화:</strong>
                <a href="tel:${employee.전화}" onclick="event.stopPropagation()">
                    ${employee.전화}
                </a>
            </div>
            <div class="detail-row">
                <strong>내선:</strong> ${employee.내선번호}
            </div>
        </div>
        <div class="tech-stack">
            ${employee.기술스택.map(tech =>
                `<span class="tech-badge">${tech}</span>`
            ).join('')}
        </div>
    `;

    return card;
}

// 직원 상세 정보 모달
function showEmployeeDetail(employee) {
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    const initial = employee.이름.charAt(0);

    modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div class="employee-photo" style="width: 100px; height: 100px; margin: 0 auto 20px; font-size: 40px;">
                ${initial}
            </div>
            <h2 style="margin-bottom: 5px;">${employee.이름}</h2>
            <p style="color: #999; margin-bottom: 10px;">${employee.영문명}</p>
            <span class="employee-role">${employee.부서} ${employee.직책}</span>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div class="detail-row" style="margin-bottom: 15px;">
                <strong>소속팀:</strong> ${employee.팀}
            </div>
            <div class="detail-row" style="margin-bottom: 15px;">
                <strong>이메일:</strong>
                <a href="mailto:${employee.이메일}">${employee.이메일}</a>
            </div>
            <div class="detail-row" style="margin-bottom: 15px;">
                <strong>전화:</strong>
                <a href="tel:${employee.전화}">${employee.전화}</a>
            </div>
            <div class="detail-row" style="margin-bottom: 15px;">
                <strong>내선번호:</strong> ${employee.내선번호}
            </div>
            <div class="detail-row" style="margin-bottom: 15px;">
                <strong>입사일:</strong> ${employee.입사일}
            </div>
            <div class="detail-row">
                <strong>생일:</strong> ${employee.생일}
            </div>
        </div>

        <div>
            <h3 style="margin-bottom: 15px; color: #333;">기술 스택</h3>
            <div class="tech-stack">
                ${employee.기술스택.map(tech =>
                    `<span class="tech-badge">${tech}</span>`
                ).join('')}
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 검색
    document.getElementById('searchInput').addEventListener('input', applyFilters);

    // 부서 필터
    document.getElementById('deptFilter').addEventListener('change', applyFilters);

    // 정렬
    document.getElementById('sortSelect').addEventListener('change', applySort);

    // 모달 닫기
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    document.getElementById('detailModal').addEventListener('click', (e) => {
        if (e.target.id === 'detailModal') {
            closeModal();
        }
    });
}

// 필터 적용
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedDept = document.getElementById('deptFilter').value;

    filteredEmployees = allEmployees.filter(employee => {
        const matchesSearch =
            employee.이름.toLowerCase().includes(searchTerm) ||
            employee.부서.toLowerCase().includes(searchTerm) ||
            employee.팀.toLowerCase().includes(searchTerm) ||
            employee.직책.toLowerCase().includes(searchTerm);

        const matchesDept =
            selectedDept === 'all' || employee.부서 === selectedDept;

        return matchesSearch && matchesDept;
    });

    applySort();
}

// 정렬 적용
function applySort() {
    const sortType = document.getElementById('sortSelect').value;
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
        case 'date-new':
            sorted.sort((a, b) => new Date(b.입사일) - new Date(a.입사일));
            break;
        case 'date-old':
            sorted.sort((a, b) => new Date(a.입사일) - new Date(b.입사일));
            break;
    }

    displayEmployees(sorted);
}

// 모달 닫기
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// 에러 표시
function showError(message) {
    const grid = document.getElementById('employeeGrid');
    grid.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <div>${message}</div>
        </div>
    `;
}
```

## AI로 직원 명부 만들기

Cursor AI에게 요청:
```
회사 직원 명부 웹사이트 만들어줘.
employees.json 파일 사용.

기능:
- 직원 카드 형태로 표시
- 이름/부서 검색
- 부서별 필터
- 다양한 정렬 (이름, 입사일 등)
- 클릭하면 상세 정보 모달
- 부서별 통계

디자인:
- 그라데이션 배경
- 카드 레이아웃
- 모던하고 깔끔한 느낌
- 반응형
```

## 추가 기능 아이디어

### 1. 생일 표시
```javascript
function isBirthdayToday(birthday) {
    const today = new Date();
    const bday = new Date(birthday);
    return today.getMonth() === bday.getMonth() &&
           today.getDate() === bday.getDate();
}

// 카드에 생일 뱃지 추가
if (isBirthdayToday(employee.생일)) {
    // 생일 뱃지 표시
}
```

### 2. 엑셀 내보내기
```javascript
function exportToExcel() {
    let csv = '이름,부서,직책,이메일,전화\n';
    filteredEmployees.forEach(emp => {
        csv += `${emp.이름},${emp.부서},${emp.직책},${emp.이메일},${emp.전화}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
}
```

### 3. 인쇄 기능
```css
@media print {
    .controls,
    .stats-section {
        display: none;
    }

    .employee-card {
        break-inside: avoid;
    }
}
```

## 다음 단계

직원 명부 프로젝트를 완성했습니다. 이제 블로그 프로젝트를 만들어봅시다!
