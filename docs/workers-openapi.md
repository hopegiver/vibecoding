# Workers에서 OpenAPI 문서 만들기

API를 만들면 다른 개발자들(또는 미래의 나 자신)이 쉽게 사용할 수 있도록 문서가 필요합니다. OpenAPI는 API를 표준 형식으로 문서화하는 가장 인기있는 방법입니다!

## AI로 OpenAPI 시작하기

복잡한 스펙을 외울 필요 없습니다. AI가 자동으로 생성해줍니다!

### 1. OpenAPI 스펙 파일 만들기

**AI에게 요청:**
```
Hono Workers 프로젝트에 OpenAPI 스펙을 추가하고 싶어.

src/openapi.ts 파일을 만들어서:
1. OpenAPI 3.0 스펙으로 작성
2. 기본 정보 (제목, 설명, 버전) 포함
3. 사용자 관리 API 엔드포인트들 문서화:

각 엔드포인트의 요청/응답 스키마도 정의해줘.
```

**Run 버튼 클릭!**

AI가 `src/openapi.ts` 파일을 생성합니다.

**생성된 파일 예시 (src/openapi.ts):**
```typescript
export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: '사용자 관리 API',
    description: 'Cloudflare Workers로 만든 사용자 관리 REST API',
    version: '1.0.0',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    }
  },
  servers: [
    {
      url: 'https://my-api.workers.dev',
      description: 'Production server'
    },
    {
      url: 'http://localhost:8787',
      description: 'Development server'
    }
  ],
  paths: {
    '/api/users': {
      get: {
        summary: '사용자 목록 조회',
        description: '모든 사용자의 목록을 조회합니다',
        tags: ['Users'],
        responses: {
          '200': {
            description: '성공',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '새 사용자 생성',
        description: '새로운 사용자를 생성합니다',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateUserRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: '생성 성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    id: { type: 'number' }
                  }
                }
              }
            }
          },
          '400': {
            description: '잘못된 요청',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        summary: '특정 사용자 조회',
        description: 'ID로 특정 사용자를 조회합니다',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer'
            },
            description: '사용자 ID'
          }
        ],
        responses: {
          '200': {
            description: '성공',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          '404': {
            description: '사용자를 찾을 수 없음',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        summary: '사용자 정보 수정',
        description: '기존 사용자의 정보를 수정합니다',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer'
            },
            description: '사용자 ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateUserRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: '수정 성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' }
                  }
                }
              }
            }
          },
          '404': {
            description: '사용자를 찾을 수 없음'
          }
        }
      },
      delete: {
        summary: '사용자 삭제',
        description: '사용자를 삭제합니다',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer'
            },
            description: '사용자 ID'
          }
        ],
        responses: {
          '200': {
            description: '삭제 성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' }
                  }
                }
              }
            }
          },
          '404': {
            description: '사용자를 찾을 수 없음'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: '사용자 ID'
          },
          name: {
            type: 'string',
            description: '사용자 이름'
          },
          email: {
            type: 'string',
            format: 'email',
            description: '이메일 주소'
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: '생성 시각'
          }
        },
        required: ['id', 'name', 'email']
      },
      CreateUserRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: '사용자 이름'
          },
          email: {
            type: 'string',
            format: 'email',
            description: '이메일 주소'
          }
        },
        required: ['name', 'email']
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: '사용자 이름'
          },
          email: {
            type: 'string',
            format: 'email',
            description: '이메일 주소'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: '에러 메시지'
          }
        }
      }
    }
  }
};
```

### 2. OpenAPI JSON 엔드포인트 추가

이제 `/openapi.json` 엔드포인트를 만들어서 스펙을 제공합니다.

**AI에게 요청:**
```
src/index.ts에 OpenAPI JSON 엔드포인트를 추가해줘.
GET /openapi.json 요청이 오면 openapi.ts의 스펙을 JSON으로 반환하도록 해줘.
```

**Run 버튼 클릭!**

**AI가 수정한 코드 (src/index.ts):**
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { openApiSpec } from './openapi';
import users from './routes/users';

const app = new Hono();

app.use('*', cors());

// OpenAPI JSON 엔드포인트
app.get('/openapi.json', (c) => {
  return c.json(openApiSpec);
});

// 기타 라우트
app.route('/api/users', users);

export default app;
```

이제 `http://localhost:8787/openapi.json`에 접속하면 OpenAPI 스펙을 볼 수 있습니다!

### 3. Swagger UI 추가

OpenAPI JSON만으로는 읽기 어렵습니다. Swagger UI를 추가해서 예쁜 문서 페이지를 만들어봅시다.

**AI에게 요청:**
```
/docs 엔드포인트를 추가해서 Swagger UI를 보여주고 싶어.
src/routes/docs.ts 파일을 만들어서:
1. Swagger UI HTML 페이지 생성
2. /openapi.json을 자동으로 로드하도록 설정
3. 다크 모드 지원

그리고 index.ts에 라우트를 연결해줘.
```

**Run 버튼 클릭!**

**AI가 생성한 파일 (src/routes/docs.ts):**
```typescript
import { Hono } from 'hono';

const docs = new Hono();

docs.get('/', (c) => {
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API 문서</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui.css">
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
  `;

  return c.html(html);
});

export default docs;
```

**AI가 수정한 코드 (src/index.ts):**
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { openApiSpec } from './openapi';
import users from './routes/users';
import docs from './routes/docs';

const app = new Hono();

app.use('*', cors());

// OpenAPI 엔드포인트
app.get('/openapi.json', (c) => {
  return c.json(openApiSpec);
});

// Swagger UI 문서
app.route('/docs', docs);

// API 라우트
app.route('/api/users', users);

export default app;
```

### 4. 로컬에서 확인

**AI에게 요청:**
```
개발 서버를 실행해줘.
```

**AI가 제안하는 명령어:**
```bash
npm run dev
```

**Run 버튼 클릭!**

이제 브라우저에서 다음 주소들을 확인하세요:
- `http://localhost:8787/openapi.json` - OpenAPI JSON 스펙
- `http://localhost:8787/docs` - Swagger UI 문서 페이지

Swagger UI에서는:
- 모든 API 엔드포인트 확인
- 요청/응답 스키마 확인
- **"Try it out"** 버튼으로 실제 API 테스트 가능! 🎉

## API 추가/수정 시 OpenAPI 업데이트

새로운 API를 만들거나 기존 API를 수정할 때마다 OpenAPI 스펙도 함께 업데이트해야 합니다.

### 예제: 새 API 추가 시

**상황:** 게시물(Posts) API를 추가했습니다.

**AI에게 요청:**
```
src/routes/posts.ts에 게시물 API를 만들었어.
src/openapi.ts를 업데이트해서 이 엔드포인트들을 문서화해줘.
```

**Run 버튼 클릭!**

AI가 자동으로 `src/openapi.ts`에 다음을 추가합니다:
- `/api/posts` 경로 정의
- 요청/응답 스키마
- 에러 응답
- Tags에 'Posts' 추가

**업데이트된 openapi.ts 일부:**
```typescript
export const openApiSpec = {
  // ... 기존 설정 ...
  paths: {
    // ... 기존 경로 ...
    '/api/posts': {
      get: {
        summary: '게시물 목록 조회',
        description: '모든 게시물의 목록을 조회합니다',
        tags: ['Posts'],
        responses: {
          '200': {
            description: '성공',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Post'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '새 게시물 생성',
        description: '새로운 게시물을 생성합니다',
        tags: ['Posts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreatePostRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: '생성 성공'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      // ... 기존 스키마 ...
      Post: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          user_id: { type: 'integer' },
          title: { type: 'string' },
          content: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      CreatePostRequest: {
        type: 'object',
        properties: {
          user_id: { type: 'integer' },
          title: { type: 'string' },
          content: { type: 'string' }
        },
        required: ['user_id', 'title', 'content']
      }
    }
  }
};
```

### 예제: 기존 API 수정 시

**상황:** 사용자 API에 페이지네이션을 추가했습니다.

**AI에게 요청:**
```
GET /api/users API를 수정했어.
src/openapi.ts를 업데이트해줘.
```

**Run 버튼 클릭!**

AI가 해당 엔드포인트를 업데이트합니다:

```typescript
'/api/users': {
  get: {
    summary: '사용자 목록 조회',
    description: '모든 사용자의 목록을 페이지네이션과 함께 조회합니다',
    tags: ['Users'],
    parameters: [
      {
        name: 'page',
        in: 'query',
        schema: {
          type: 'integer',
          default: 1
        },
        description: '페이지 번호'
      },
      {
        name: 'limit',
        in: 'query',
        schema: {
          type: 'integer',
          default: 10
        },
        description: '페이지당 항목 수'
      }
    ],
    responses: {
      '200': {
        description: '성공',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User'
                  }
                },
                pagination: {
                  $ref: '#/components/schemas/Pagination'
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## OpenAPI 스펙 구조 이해하기

AI가 생성한 OpenAPI 파일의 주요 구조를 이해해봅시다.

### 1. 기본 정보 (info)

```typescript
info: {
  title: 'API 제목',
  description: 'API 설명',
  version: '1.0.0',
  contact: {
    name: '담당자 이름',
    email: 'support@example.com'
  }
}
```

API의 기본 정보를 담습니다.

### 2. 서버 정보 (servers)

```typescript
servers: [
  {
    url: 'https://my-api.workers.dev',
    description: 'Production'
  },
  {
    url: 'http://localhost:8787',
    description: 'Development'
  }
]
```

API가 실행되는 서버 주소를 정의합니다.

### 3. 경로 (paths)

```typescript
paths: {
  '/api/users': {
    get: { /* GET 메서드 정의 */ },
    post: { /* POST 메서드 정의 */ }
  }
}
```

각 엔드포인트와 HTTP 메서드를 정의합니다.

### 4. 스키마 (components.schemas)

```typescript
components: {
  schemas: {
    User: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' }
      }
    }
  }
}
```

재사용 가능한 데이터 구조를 정의합니다.

## 실전 팁

### 1. 스펙 검증하기

**AI에게 요청:**
```
OpenAPI 스펙을 검증해줘.
문법 오류나 누락된 필드가 있는지 확인해줘.
```

AI가 스펙을 분석하고 문제를 찾아줍니다.

### 2. 인증 추가하기

**AI에게 요청:**
```
API에 Bearer Token 인증을 추가했어.
openapi.ts에 Security Scheme를 추가해줘.
모든 엔드포인트에 인증이 필요하다고 표시해줘.
```

**AI가 추가한 코드:**
```typescript
components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  }
}

// 각 엔드포인트에 추가
paths: {
  '/api/users': {
    get: {
      security: [{ bearerAuth: [] }],
      // ... 나머지 설정
    }
  }
}
```

### 3. 예제 추가하기

**AI에게 요청:**
```
User 스키마에 예제 데이터를 추가해줘.
Swagger UI에서 예제가 보이도록 해줘.
```

**AI가 수정한 코드:**
```typescript
User: {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' }
  },
  example: {
    id: 1,
    name: '홍길동',
    email: 'hong@example.com'
  }
}
```

## 배포하기

### 1. 프로덕션 서버 URL 업데이트

배포 전에 `src/openapi.ts`의 서버 URL을 실제 주소로 변경하세요.

**AI에게 요청:**
```
openapi.ts의 프로덕션 서버 URL을
https://my-api.your-subdomain.workers.dev 로 변경해줘.
```

### 2. 배포

**AI에게 요청:**
```
Workers를 배포해줘.
```

**AI가 제안하는 명령어:**
```bash
npm run deploy
```

**Run 버튼 클릭!**

배포 완료 후 `https://my-api.your-subdomain.workers.dev/docs`에서 문서를 확인하세요!

## 자주 묻는 질문

### Q: OpenAPI 파일이 너무 커지면 어떻게 하나요?

**A:** 파일을 분리하세요.

**AI에게 요청:**
```
openapi.ts가 너무 커졌어.
users, posts 스키마를 별도 파일로 분리하고 싶어.
src/openapi/schemas/ 폴더를 만들어서 관리해줘.
```

### Q: 실시간으로 OpenAPI를 생성할 수 있나요?

**A:** Hono에는 `@hono/zod-openapi` 라이브러리가 있습니다.

**AI에게 요청:**
```
@hono/zod-openapi를 사용해서
코드에서 자동으로 OpenAPI 스펙을 생성하고 싶어.
```

### Q: 다크 모드를 기본으로 하고 싶어요.

**AI에게 요청:**
```
Swagger UI를 다크 모드로 기본 설정하고 싶어.
docs.ts를 수정해줘.
```

## 프론트엔드에서 OpenAPI 활용하기

OpenAPI 스펙을 프론트엔드에서 활용하면 AI가 자동으로 API 호출 코드를 만들어줍니다!

### AI에게 OpenAPI 스펙 제공하기

프론트엔드 개발 시 AI에게 OpenAPI URL만 알려주면 됩니다. AI가 알아서 필요한 모든 코드를 생성합니다.

**AI에게 요청:**
```
내 백엔드 API의 OpenAPI 스펙이야:
https://my-api.workers.dev/openapi.json

이 API를 사용하는 프론트엔드를 만들어줘.
순수 HTML + JavaScript로 작성해줘.

만들어줄 것:
- index.html - 메인 페이지
- api.js - API 호출 함수들
- app.js - 메인 로직

기능:
- 사용자 목록 보기
- 사용자 추가하기
- 에러 처리
- 로딩 상태 표시
```

**Run 버튼 클릭!**

AI가 OpenAPI 스펙을 읽고 완전한 프론트엔드를 자동 생성합니다!

**AI가 생성한 코드 예시:**

**api.js**
```javascript
// AI가 OpenAPI 스펙을 보고 자동 생성
const API_BASE_URL = 'https://my-api.workers.dev';

// 사용자 목록 조회
async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/api/users`);
  if (!response.ok) {
    throw new Error('사용자 목록 조회 실패');
  }
  return response.json();
}

// 특정 사용자 조회
async function getUserById(id) {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
  if (!response.ok) {
    throw new Error('사용자 조회 실패');
  }
  return response.json();
}

// 사용자 생성
async function createUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('사용자 생성 실패');
  }
  return response.json();
}

// ... OpenAPI의 모든 엔드포인트를 위한 함수들
```

**app.js**
```javascript
// 사용자 목록 표시
async function displayUsers() {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '<p>로딩 중...</p>';

  try {
    const users = await getUsers();

    if (users.length === 0) {
      userList.innerHTML = '<p>사용자가 없습니다.</p>';
      return;
    }

    userList.innerHTML = users.map(user => `
      <div class="user-card">
        <h3>${user.name}</h3>
        <p>${user.email}</p>
      </div>
    `).join('');
  } catch (error) {
    userList.innerHTML = `<p class="error">에러: ${error.message}</p>`;
  }
}

// 사용자 추가
async function handleCreateUser(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userData = {
    name: formData.get('name'),
    email: formData.get('email')
  };

  try {
    await createUser(userData);
    alert('사용자가 추가되었습니다!');
    event.target.reset();
    displayUsers();
  } catch (error) {
    alert(`에러: ${error.message}`);
  }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  displayUsers();

  const form = document.getElementById('user-form');
  form.addEventListener('submit', handleCreateUser);
});
```

### 다양한 프레임워크로 요청 가능

AI는 어떤 프레임워크든 자동으로 생성할 수 있습니다:

**React 프론트엔드:**
```
내 API의 OpenAPI 스펙이야:
https://my-api.workers.dev/openapi.json

React로 프론트엔드 만들어줘.
```

**Vue 프론트엔드:**
```
내 API의 OpenAPI 스펙이야:
https://my-api.workers.dev/openapi.json

Vue로 프론트엔드 만들어줘.
```

**Next.js 프론트엔드:**
```
내 API의 OpenAPI 스펙이야:
https://my-api.workers.dev/openapi.json

Next.js로 SEO 최적화된 블로그를 만들어줘.
```

AI가 OpenAPI 스펙을 분석해서 프레임워크에 맞는 코드를 자동 생성합니다!

### 실전 예제

**블로그 프론트엔드 전체 생성:**

```
내 블로그 API의 OpenAPI 스펙이야:
https://blog-api.workers.dev/openapi.json

이 스펙을 보고 완전한 블로그 프론트엔드를 만들어줘.
HTML + JavaScript로 작성해줘.

페이지:
- 게시물 목록 (페이지네이션)
- 게시물 상세 보기 + 댓글
- 글쓰기 페이지 (로그인 필요)
- 로그인/회원가입 페이지

기능:
- 좋아요 버튼
- 댓글 작성/삭제
- 반응형 디자인
- 로딩 상태 표시
- 에러 처리
```

AI가 OpenAPI 스펙을 읽고 완전한 블로그를 자동으로 만들어줍니다!

## 다음 단계

OpenAPI 문서를 마스터했습니다! 이제 다른 Workers 기능도 탐색해보세요:

- **[Workers 기초](./workers-basics.md)** - Hono 기본 사용법
- **[KV 스토리지](./kv-storage.md)** - 간단한 데이터 저장
- **[D1 데이터베이스](./d1-database.md)** - SQL 데이터베이스
- **[실전: REST API 만들기](./workers-rest-api.md)** - 완전한 API 구축

## 참고 자료

- [OpenAPI 공식 문서](https://swagger.io/specification/)
- [Swagger UI 문서](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [React Query 문서](https://tanstack.com/query)
- [MSW 문서](https://mswjs.io/)
- [Hono 문서](https://hono.dev)
