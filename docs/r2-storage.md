# R2 파일 스토리지 사용하기

Cloudflare R2는 S3 호환 오브젝트 스토리지입니다. AI와 함께라면 파일 업로드 시스템을 쉽게 만들 수 있습니다!

## AI로 R2 파일 스토리지 시작하기

복잡한 파일 처리 로직은 AI에게 맡기세요!

### 1. R2 버킷 생성

**AI에게 요청:**
```
Cloudflare R2 버킷을 만들고 싶어.
wrangler r2 bucket create 명령어를 실행해줘.
버킷 이름은 my-files로 해줘.
```

**AI가 제안하는 명령어:**
```bash
wrangler r2 bucket create my-files
```

**Run 버튼 클릭!**

### 2. Workers에 R2 바인딩

**AI에게 요청:**
```
방금 만든 R2 버킷을 Workers에 연결해줘.
wrangler.toml에 바인딩을 추가하고,
TypeScript 타입도 정의해줘.
바인딩 이름은 MY_BUCKET으로 해줘.
```

**Run 버튼 클릭!**

AI가 자동으로 설정을 완료합니다.

### 3. 파일 업로드 API 만들기

**AI에게 요청:**
```
R2 스토리지를 사용하는 파일 업로드 API를 만들어줘.

기능:
- POST /api/files/upload : 파일 업로드
- GET /api/files/:filename : 파일 다운로드
- DELETE /api/files/:filename : 파일 삭제
- GET /api/files/list : 파일 목록 조회

이미지 파일은 Content-Type을 자동으로 설정해줘.
에러 처리도 추가해줘.
```

**Run 버튼 클릭!**

AI가 완전한 파일 업로드 시스템을 생성합니다!

### 4. 프론트엔드 업로드 폼 만들기

**AI에게 요청:**
```
파일 업로드할 수 있는 HTML 폼을 만들어줘.
index.html 파일에:
- 파일 선택 input
- 업로드 버튼
- 업로드된 파일 목록 표시
- 각 파일 다운로드/삭제 버튼

예쁘게 스타일링도 해줘.
```

**Run 버튼 클릭!**

완성! 파일 업로드 시스템이 동작합니다.

## R2란?

### 기본 개념

R2는 대용량 파일을 저장하고 제공하는 오브젝트 스토리지입니다.

**특징:**
- 이미지, 비디오, 문서 등 모든 파일 저장
- S3 API 호환
- 무료 송출 (egress)
- 글로벌 CDN 제공

### KV vs R2

| 특징 | KV | R2 |
|------|----|----|
| 용도 | 작은 데이터 (최대 25MB) | 대용량 파일 |
| 주요 사용 | 설정, 캐시, JSON | 이미지, 비디오, 파일 |
| 가격 | 읽기/쓰기 횟수 | 저장 용량 |

## 무료 플랜 한도

```
무료로 제공:
- 10GB 저장 공간
- 하루 100만 Class A 작업 (업로드 등)
- 하루 1000만 Class B 작업 (다운로드 등)
- 무제한 송출 (egress) 🎉

대부분의 프로젝트에 충분!
```

## R2 버킷 만들기

### 1. Cloudflare 대시보드에서 생성

```
1. https://dash.cloudflare.com 로그인
2. R2 메뉴 선택
3. "Create bucket" 클릭
4. 버킷 이름 입력 (예: my-files)
5. "Create bucket" 클릭
```

### 2. wrangler.toml에 바인딩 추가

```toml
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-files"
```

### 3. TypeScript 타입 설정

**src/types/env.ts**
```typescript
export type Env = {
  MY_BUCKET: R2Bucket;
};
```

## Hono로 파일 업로드/다운로드 구현

### 기본 구조

**src/index.ts**
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import files from './routes/files';
import type { Env } from './types/env';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.get('/', (c) => {
  return c.json({ message: 'File Upload API' });
});

app.route('/api/files', files);

export default app;
```

### 파일 업로드/다운로드

**src/routes/files.ts**
```typescript
import { Hono } from 'hono';
import type { Env } from '../types/env';

const files = new Hono<{ Bindings: Env }>();

// 파일 업로드
files.post('/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }

  // 파일명 생성 (타임스탬프 + 원본 파일명)
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.name}`;

  // R2에 업로드
  await c.env.MY_BUCKET.put(filename, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  return c.json({
    success: true,
    filename: filename,
    size: file.size,
    type: file.type,
    url: `/api/files/${filename}`,
  });
});

// 파일 다운로드
files.get('/:filename', async (c) => {
  const filename = c.req.param('filename');

  const object = await c.env.MY_BUCKET.get(filename);

  if (!object) {
    return c.json({ error: 'File not found' }, 404);
  }

  // 파일 반환
  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
      'Content-Length': object.size.toString(),
      'ETag': object.etag,
      'Cache-Control': 'public, max-age=31536000',
    },
  });
});

// 파일 목록
files.get('/', async (c) => {
  const list = await c.env.MY_BUCKET.list();

  const fileList = list.objects.map((obj) => ({
    name: obj.key,
    size: obj.size,
    uploaded: obj.uploaded,
  }));

  return c.json({
    files: fileList,
    truncated: list.truncated,
  });
});

// 파일 삭제
files.delete('/:filename', async (c) => {
  const filename = c.req.param('filename');

  await c.env.MY_BUCKET.delete(filename);

  return c.json({ success: true });
});

export default files;
```

## 고급 기능

### 이미지 업로드 (크기 제한)

**src/routes/images.ts**
```typescript
import { Hono } from 'hono';
import type { Env } from '../types/env';

const images = new Hono<{ Bindings: Env }>();

// 이미지 업로드 (5MB 제한)
images.post('/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }

  // MIME 타입 검증
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: 'Invalid file type. Only images allowed.' }, 400);
  }

  // 파일 크기 제한 (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return c.json({ error: 'File too large. Max 5MB.' }, 400);
  }

  // 파일명 생성 (UUID + 확장자)
  const ext = file.name.split('.').pop();
  const filename = `images/${crypto.randomUUID()}.${ext}`;

  await c.env.MY_BUCKET.put(filename, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  });

  return c.json({
    success: true,
    filename: filename,
    url: `/api/images/${filename}`,
  });
});

// 이미지 조회
images.get('/:path{.+}', async (c) => {
  const path = c.req.param('path');

  const object = await c.env.MY_BUCKET.get(path);

  if (!object) {
    return c.json({ error: 'Image not found' }, 404);
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000',
      'ETag': object.etag,
    },
  });
});

export default images;
```

### 파일 메타데이터

```typescript
// 메타데이터와 함께 업로드
files.post('/upload-with-metadata', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  const description = formData.get('description') as string;

  const filename = `${Date.now()}-${file.name}`;

  await c.env.MY_BUCKET.put(filename, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
    customMetadata: {
      description: description || '',
      uploadedBy: 'user-123',
      uploadedAt: new Date().toISOString(),
    },
  });

  return c.json({ success: true, filename });
});

// 메타데이터 조회
files.get('/:filename/metadata', async (c) => {
  const filename = c.req.param('filename');

  const object = await c.env.MY_BUCKET.head(filename);

  if (!object) {
    return c.json({ error: 'File not found' }, 404);
  }

  return c.json({
    filename: filename,
    size: object.size,
    uploaded: object.uploaded,
    httpMetadata: object.httpMetadata,
    customMetadata: object.customMetadata,
  });
});
```

### 폴더 구조로 관리

```typescript
// 카테고리별 업로드
files.post('/upload/:category', async (c) => {
  const category = c.req.param('category'); // "documents", "images" 등
  const formData = await c.req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }

  // 카테고리/날짜/파일명 구조
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `${category}/${date}/${Date.now()}-${file.name}`;

  await c.env.MY_BUCKET.put(filename, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  return c.json({
    success: true,
    filename: filename,
    url: `/api/files/${filename}`,
  });
});

// 특정 카테고리 파일 목록
files.get('/list/:category', async (c) => {
  const category = c.req.param('category');

  const list = await c.env.MY_BUCKET.list({
    prefix: `${category}/`,
  });

  const fileList = list.objects.map((obj) => ({
    name: obj.key,
    size: obj.size,
    uploaded: obj.uploaded,
  }));

  return c.json({ files: fileList });
});
```

### 페이지네이션

```typescript
// 많은 파일 목록 (페이지네이션)
files.get('/list', async (c) => {
  const limit = parseInt(c.req.query('limit') || '100');
  const cursor = c.req.query('cursor');

  const options: R2ListOptions = {
    limit: limit,
  };

  if (cursor) {
    options.cursor = cursor;
  }

  const list = await c.env.MY_BUCKET.list(options);

  return c.json({
    files: list.objects.map((obj) => ({
      name: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
    })),
    truncated: list.truncated,
    cursor: list.truncated ? list.cursor : null,
  });
});
```

### 조건부 다운로드 (ETag)

```typescript
// ETag를 사용한 캐싱
files.get('/:filename', async (c) => {
  const filename = c.req.param('filename');
  const ifNoneMatch = c.req.header('If-None-Match');

  const object = await c.env.MY_BUCKET.get(filename);

  if (!object) {
    return c.json({ error: 'File not found' }, 404);
  }

  // ETag 일치 시 304 Not Modified
  if (ifNoneMatch && ifNoneMatch === object.etag) {
    return new Response(null, { status: 304 });
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
      'ETag': object.etag,
      'Cache-Control': 'public, max-age=31536000',
    },
  });
});
```

## 프론트엔드 연동

### HTML 업로드 폼

```html
<!DOCTYPE html>
<html>
<head>
  <title>파일 업로드</title>
  <style>
    .upload-area {
      border: 2px dashed #ccc;
      padding: 40px;
      text-align: center;
      cursor: pointer;
    }
    .upload-area.dragover {
      background: #f0f0f0;
      border-color: #666;
    }
    .file-list {
      margin-top: 20px;
    }
    .file-item {
      padding: 10px;
      margin: 5px 0;
      background: #f5f5f5;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>파일 업로드</h1>

  <div class="upload-area" id="uploadArea">
    <p>파일을 드래그하거나 클릭하여 선택하세요</p>
    <input type="file" id="fileInput" multiple hidden>
  </div>

  <div class="file-list" id="fileList"></div>

  <script>
    const API_URL = 'https://your-worker.workers.dev/api/files';
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');

    // 클릭으로 파일 선택
    uploadArea.addEventListener('click', () => fileInput.click());

    // 파일 선택 이벤트
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      for (const file of files) {
        uploadFile(file);
      }
    });

    // 드래그 앤 드롭
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');

      const files = e.dataTransfer.files;
      for (const file of files) {
        uploadFile(file);
      }
    });

    // 파일 업로드 함수
    async function uploadFile(file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          addFileToList(result);
        } else {
          alert('업로드 실패: ' + result.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('업로드 중 오류가 발생했습니다.');
      }
    }

    // 업로드된 파일 목록에 추가
    function addFileToList(fileInfo) {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `
        <strong>${fileInfo.filename}</strong>
        <br>
        크기: ${(fileInfo.size / 1024).toFixed(2)} KB
        <br>
        <a href="${API_URL}${fileInfo.url}" target="_blank">다운로드</a>
      `;
      fileList.prepend(item);
    }

    // 페이지 로드 시 파일 목록 불러오기
    async function loadFiles() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        data.files.forEach(file => {
          addFileToList({
            filename: file.name,
            size: file.size,
            url: `/${file.name}`,
          });
        });
      } catch (error) {
        console.error('Load files error:', error);
      }
    }

    loadFiles();
  </script>
</body>
</html>
```

### React/Vue에서 사용

```typescript
// React 예제
import { useState } from 'react';

function FileUpload() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://your-worker.workers.dev/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('업로드 성공:', result.url);
      }
    } catch (error) {
      console.error('업로드 실패:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>업로드 중...</p>}
    </div>
  );
}
```

## 실전 예제: 이미지 갤러리

전체 이미지 갤러리 시스템:

**src/routes/gallery.ts**
```typescript
import { Hono } from 'hono';
import type { Env } from '../types/env';

const gallery = new Hono<{ Bindings: Env }>();

// 이미지 업로드
gallery.post('/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('image') as File;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!file) {
    return c.json({ error: 'No image provided' }, 400);
  }

  // 이미지 타입 검증
  if (!file.type.startsWith('image/')) {
    return c.json({ error: 'Only images are allowed' }, 400);
  }

  // 파일명 생성
  const id = crypto.randomUUID();
  const ext = file.name.split('.').pop();
  const filename = `gallery/${id}.${ext}`;

  // R2에 업로드
  await c.env.MY_BUCKET.put(filename, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
    customMetadata: {
      id: id,
      title: title || file.name,
      description: description || '',
      uploadedAt: new Date().toISOString(),
    },
  });

  return c.json({
    success: true,
    id: id,
    filename: filename,
    url: `/api/gallery/${id}`,
  });
});

// 갤러리 목록
gallery.get('/list', async (c) => {
  const list = await c.env.MY_BUCKET.list({
    prefix: 'gallery/',
  });

  const images = await Promise.all(
    list.objects.map(async (obj) => {
      const metadata = await c.env.MY_BUCKET.head(obj.key);
      return {
        id: metadata?.customMetadata?.id || obj.key,
        filename: obj.key,
        title: metadata?.customMetadata?.title || 'Untitled',
        description: metadata?.customMetadata?.description || '',
        size: obj.size,
        uploaded: obj.uploaded,
        url: `/api/gallery/${metadata?.customMetadata?.id || obj.key}`,
      };
    })
  );

  return c.json({ images });
});

// 이미지 조회
gallery.get('/:id', async (c) => {
  const id = c.req.param('id');

  // ID로 파일 찾기
  const list = await c.env.MY_BUCKET.list({
    prefix: 'gallery/',
  });

  const obj = list.objects.find(async (o) => {
    const meta = await c.env.MY_BUCKET.head(o.key);
    return meta?.customMetadata?.id === id;
  });

  if (!obj) {
    return c.json({ error: 'Image not found' }, 404);
  }

  const object = await c.env.MY_BUCKET.get(obj.key);

  if (!object) {
    return c.json({ error: 'Image not found' }, 404);
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
});

// 이미지 삭제
gallery.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const list = await c.env.MY_BUCKET.list({
    prefix: 'gallery/',
  });

  for (const obj of list.objects) {
    const meta = await c.env.MY_BUCKET.head(obj.key);
    if (meta?.customMetadata?.id === id) {
      await c.env.MY_BUCKET.delete(obj.key);
      return c.json({ success: true });
    }
  }

  return c.json({ error: 'Image not found' }, 404);
});

export default gallery;
```

## 보안과 모범 사례

### 1. 파일 타입 검증

```typescript
const ALLOWED_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  documents: ['application/pdf', 'application/msword'],
  videos: ['video/mp4', 'video/webm'],
};

function validateFileType(file: File, category: string): boolean {
  const allowed = ALLOWED_TYPES[category] || [];
  return allowed.includes(file.type);
}
```

### 2. 파일 크기 제한

```typescript
const MAX_FILE_SIZE = {
  image: 5 * 1024 * 1024,      // 5MB
  video: 100 * 1024 * 1024,    // 100MB
  document: 10 * 1024 * 1024,  // 10MB
};
```

### 3. 안전한 파일명

```typescript
function sanitizeFilename(filename: string): string {
  // 위험한 문자 제거
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 255);
}
```

### 4. 인증/권한 체크

```typescript
import { authMiddleware } from '../middleware/auth';

// 업로드는 인증 필요
files.post('/upload', authMiddleware, async (c) => {
  // 업로드 로직
});

// 다운로드는 공개
files.get('/:filename', async (c) => {
  // 다운로드 로직
});
```

## 다음 단계

- [Workers 기초](./workers-basics.md) - Hono 기본 사용법
- [D1 데이터베이스](./d1-database.md) - 파일 메타데이터를 DB에 저장
- [KV 스토리지](./kv-storage.md) - 파일 접근 로그 저장

## 참고 자료

- [R2 공식 문서](https://developers.cloudflare.com/r2)
- [S3 API 호환성](https://developers.cloudflare.com/r2/api/s3/api/)
- [Hono 문서](https://hono.dev)
