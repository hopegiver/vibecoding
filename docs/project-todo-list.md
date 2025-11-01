# 할일 목록(To-Do List) 만들기

JavaScript를 이용해 할일을 추가하고 완료 표시할 수 있는 To-Do List를 만들어봅시다.

## 완성 모습

```
내 할일 목록
┌──────────────────────────────┐
│  [입력창] 할일 입력... [추가] │
└──────────────────────────────┘

☐ 프로젝트 보고서 작성      [삭제]
☑ 이메일 답장 보내기       [삭제]
☐ 회의 준비하기            [삭제]
```

## 전체 코드

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>할일 목록</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 10px 50px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 500px;
            padding: 30px;
        }

        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }

        .input-section {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        #todoInput {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        #todoInput:focus {
            outline: none;
            border-color: #667eea;
        }

        #addBtn {
            padding: 12px 25px;
            background-color: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #addBtn:hover {
            background-color: #5568d3;
        }

        #todoList {
            list-style: none;
        }

        .todo-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 10px;
            transition: all 0.3s;
        }

        .todo-item:hover {
            background-color: #e9ecef;
            transform: translateX(5px);
        }

        .todo-item.completed {
            opacity: 0.6;
        }

        .todo-item.completed .todo-text {
            text-decoration: line-through;
            color: #999;
        }

        .todo-checkbox {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .todo-text {
            flex: 1;
            font-size: 16px;
            color: #333;
        }

        .delete-btn {
            padding: 8px 15px;
            background-color: #ff7675;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .delete-btn:hover {
            background-color: #ff5252;
        }

        .empty-message {
            text-align: center;
            color: #999;
            padding: 40px 20px;
            font-size: 18px;
        }

        .stats {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            display: flex;
            justify-content: space-around;
            color: #666;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }

        .stat-label {
            font-size: 12px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>내 할일 목록</h1>

        <div class="input-section">
            <input type="text" id="todoInput" placeholder="할일을 입력하세요...">
            <button id="addBtn">추가</button>
        </div>

        <ul id="todoList"></ul>

        <div class="stats">
            <div class="stat-item">
                <div class="stat-number" id="totalCount">0</div>
                <div class="stat-label">전체</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="activeCount">0</div>
                <div class="stat-label">남은 할일</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="completedCount">0</div>
                <div class="stat-label">완료</div>
            </div>
        </div>
    </div>

    <script>
        const todoInput = document.getElementById('todoInput');
        const addBtn = document.getElementById('addBtn');
        const todoList = document.getElementById('todoList');
        const totalCount = document.getElementById('totalCount');
        const activeCount = document.getElementById('activeCount');
        const completedCount = document.getElementById('completedCount');

        let todos = [];

        // 할일 추가
        function addTodo() {
            const text = todoInput.value.trim();

            if (text === '') {
                alert('할일을 입력하세요!');
                return;
            }

            const todo = {
                id: Date.now(),
                text: text,
                completed: false
            };

            todos.push(todo);
            todoInput.value = '';
            render();
        }

        // 할일 삭제
        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            render();
        }

        // 완료 상태 토글
        function toggleTodo(id) {
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                render();
            }
        }

        // 화면 렌더링
        function render() {
            // 목록 비우기
            todoList.innerHTML = '';

            // 할일이 없을 때
            if (todos.length === 0) {
                todoList.innerHTML = '<div class="empty-message">할일이 없습니다. 새로운 할일을 추가해보세요!</div>';
                updateStats();
                return;
            }

            // 할일 목록 생성
            todos.forEach(todo => {
                const li = document.createElement('li');
                li.className = 'todo-item';
                if (todo.completed) {
                    li.classList.add('completed');
                }

                li.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                    <button class="delete-btn">삭제</button>
                `;

                // 체크박스 이벤트
                const checkbox = li.querySelector('.todo-checkbox');
                checkbox.addEventListener('change', () => toggleTodo(todo.id));

                // 삭제 버튼 이벤트
                const deleteBtn = li.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

                todoList.appendChild(li);
            });

            updateStats();
        }

        // 통계 업데이트
        function updateStats() {
            const total = todos.length;
            const completed = todos.filter(todo => todo.completed).length;
            const active = total - completed;

            totalCount.textContent = total;
            activeCount.textContent = active;
            completedCount.textContent = completed;
        }

        // 이벤트 리스너
        addBtn.addEventListener('click', addTodo);

        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        // 초기 렌더링
        render();
    </script>
</body>
</html>
```

## 코드 설명

### 데이터 구조
```javascript
const todo = {
    id: Date.now(),        // 고유 ID (타임스탬프)
    text: "할일 내용",      // 할일 텍스트
    completed: false       // 완료 여부
};

let todos = [];  // 할일 배열
```

### 추가 기능
```javascript
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('할일을 입력하세요!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    todoInput.value = '';  // 입력창 비우기
    render();             // 화면 갱신
}
```

### 삭제 기능
```javascript
function deleteTodo(id) {
    // id가 일치하지 않는 항목만 남김
    todos = todos.filter(todo => todo.id !== id);
    render();
}
```

### 완료 토글
```javascript
function toggleTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;  // 반전
        render();
    }
}
```

## 로컬 스토리지에 저장하기

브라우저를 닫아도 데이터가 유지되도록:

```javascript
// 저장
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 불러오기
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
        render();
    }
}

// 함수 수정
function addTodo() {
    // ... 기존 코드 ...
    saveTodos();  // 추가
}

function deleteTodo(id) {
    // ... 기존 코드 ...
    saveTodos();  // 추가
}

function toggleTodo(id) {
    // ... 기존 코드 ...
    saveTodos();  // 추가
}

// 페이지 로드 시 실행
loadTodos();
```

## 필터 기능 추가

전체/진행중/완료 필터:

```html
<div class="filter-buttons">
    <button class="filter-btn active" data-filter="all">전체</button>
    <button class="filter-btn" data-filter="active">진행중</button>
    <button class="filter-btn" data-filter="completed">완료</button>
</div>
```

```javascript
let currentFilter = 'all';

function setFilter(filter) {
    currentFilter = filter;

    // 버튼 활성화 상태 변경
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    render();
}

function render() {
    todoList.innerHTML = '';

    // 필터링
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    // 렌더링
    filteredTodos.forEach(todo => {
        // ... 기존 코드 ...
    });
}

// 이벤트 리스너
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});
```

## 모두 삭제 기능

```html
<button id="clearAll">모두 삭제</button>
<button id="clearCompleted">완료된 항목 삭제</button>
```

```javascript
// 모두 삭제
document.getElementById('clearAll').addEventListener('click', () => {
    if (confirm('정말 모두 삭제하시겠습니까?')) {
        todos = [];
        saveTodos();
        render();
    }
});

// 완료된 항목만 삭제
document.getElementById('clearCompleted').addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    render();
});
```

## 수정 기능 추가

```javascript
function editTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return;

    const newText = prompt('할일 수정:', todo.text);
    if (newText && newText.trim() !== '') {
        todo.text = newText.trim();
        saveTodos();
        render();
    }
}

// 렌더링에서 수정 버튼 추가
li.innerHTML = `
    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
    <span class="todo-text">${todo.text}</span>
    <button class="edit-btn">수정</button>
    <button class="delete-btn">삭제</button>
`;

const editBtn = li.querySelector('.edit-btn');
editBtn.addEventListener('click', () => editTodo(todo.id));
```

## 우선순위 기능

```javascript
const todo = {
    id: Date.now(),
    text: "할일 내용",
    completed: false,
    priority: 'normal'  // 'low', 'normal', 'high'
};

// 우선순위별 색상
function getPriorityColor(priority) {
    switch(priority) {
        case 'high': return '#ff7675';
        case 'low': return '#74b9ff';
        default: return '#dfe6e9';
    }
}

// 렌더링에서 적용
li.style.borderLeft = `5px solid ${getPriorityColor(todo.priority)}`;
```

## AI로 To-Do List 만들기

Cursor AI에게 요청:
```
할일 목록 앱 만들어줘.
기능:
- 할일 추가
- 체크박스로 완료 표시
- 삭제 버튼
- 로컬 스토리지에 저장
- 통계 (전체/남은 할일/완료)
- 필터 (전체/진행중/완료)

디자인:
- 현대적이고 깔끔한 느낌
- 그라데이션 배경
- 카드 형태 레이아웃
- 호버 효과
```

## 다음 단계

JavaScript 기본 프로젝트를 완성했습니다. 이제 JSON 파일로 데이터를 관리하는 방법을 배워봅시다!
