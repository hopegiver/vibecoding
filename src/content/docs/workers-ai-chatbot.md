---
title: "AI 챗봇 만들기"
description: "Cloudflare AI Gateway를 사용해서 OpenAI와 연결하고, Vectorize로 데이터를 학습시켜 스마트한 챗봇 API를 만들어봅시다!"
---

Cloudflare AI Gateway를 사용해서 OpenAI와 연결하고, Vectorize로 데이터를 학습시켜 스마트한 챗봇 API를 만들어봅시다!

## AI Gateway란?

AI Gateway는 Cloudflare가 제공하는 AI 모델 연결 서비스입니다.

### 장점

- **비용 절감**: 요청을 캐싱해서 중복 호출 방지
- **속도 향상**: 전 세계 엣지에서 빠른 응답
- **모니터링**: 모든 AI 요청을 대시보드에서 확인
- **유연성**: OpenAI, Anthropic 등 다양한 AI 제공자 지원
- **스트리밍**: 실시간 응답 스트리밍 지원

## 기본 챗봇 만들기

### 1단계: AI Gateway 설정

**AI에게 요청:**
```
Cloudflare AI Gateway를 설정하고 싶어.
OpenAI를 연결할 거야.

다음 순서로 알려줘:
1. Cloudflare 대시보드에서 AI Gateway 생성 방법
2. wrangler.toml에 설정 추가
3. OpenAI API 키를 Secret으로 저장하는 방법
```

**Run 버튼 클릭!**

#### Cloudflare 대시보드에서 설정

1. **Cloudflare 대시보드** 접속 ([dash.cloudflare.com](https://dash.cloudflare.com))
2. 왼쪽 메뉴에서 **"AI"** 클릭
3. **"AI Gateway"** 탭 선택
4. **"Create Gateway"** 버튼 클릭
5. Gateway 이름 입력 (예: `my-chatbot-gateway`)
6. **"Create"** 클릭
7. Gateway URL 복사 (예: `https://gateway.ai.cloudflare.com/v1/{account_id}/my-chatbot-gateway`)

#### OpenAI API 키 저장

**AI에게 요청:**
```
OpenAI API 키를 Cloudflare Secret으로 저장하고 싶어.
wrangler secret put 명령어를 실행해줘.
```

**AI가 제안하는 명령어:**
```bash
wrangler secret put OPENAI_API_KEY
```

**Run 버튼 클릭!**

터미널에 API 키를 입력하면 암호화되어 저장됩니다.

### 2단계: 간단한 챗봇 API 만들기

**AI에게 요청:**
```
Cloudflare Workers로 OpenAI 챗봇 API를 만들어줘.

프로젝트 구성:
1. Hono Workers 프로젝트 생성 (chatbot-api)
2. AI Gateway를 통해 OpenAI 연결
3. POST /api/chat - 메시지 전송하고 응답 받기

TypeScript로 작성하고, 에러 처리도 포함해줘.
```

**Run 버튼 클릭!**

**AI가 생성한 코드 (src/index.ts):**
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Env = {
  OPENAI_API_KEY: string;
  AI_GATEWAY_URL: string; // 예: https://gateway.ai.cloudflare.com/v1/{account_id}/my-chatbot-gateway
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// 간단한 챗봇 API
app.post('/api/chat', async (c) => {
  try {
    const { message } = await c.req.json();

    if (!message) {
      return c.json({ error: '메시지를 입력해주세요.' }, 400);
    }

    // AI Gateway를 통해 OpenAI 호출
    const response = await fetch(`${c.env.AI_GATEWAY_URL}/openai/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 친절한 AI 어시스턴트입니다. 한국어로 답변해주세요.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API 호출 실패');
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return c.json({
      success: true,
      reply,
      usage: data.usage
    });

  } catch (error) {
    console.error('챗봇 에러:', error);
    return c.json({
      error: '챗봇 응답 중 오류가 발생했습니다.'
    }, 500);
  }
});

export default app;
```

**wrangler.toml:**
```toml
name = "chatbot-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
AI_GATEWAY_URL = "https://gateway.ai.cloudflare.com/v1/{account_id}/my-chatbot-gateway"
```

### 3단계: 테스트

**AI에게 요청:**
```
로컬 서버를 실행하고 챗봇을 테스트해줘.
```

**AI가 제안하는 명령어:**
```bash
# 개발 서버 실행
npm run dev

# 다른 터미널에서 테스트
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"안녕하세요! 오늘 날씨가 좋네요."}'
```

**Run 버튼 클릭!**

**응답 예시:**
```json
{
  "success": true,
  "reply": "안녕하세요! 네, 날씨가 정말 좋다니 다행이네요. 이런 날엔 산책이나 야외 활동을 즐기시면 좋을 것 같아요. 오늘 하루 즐겁게 보내세요! 😊",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 38,
    "total_tokens": 83
  }
}
```

## 스트리밍 챗봇 만들기

실시간으로 응답이 생성되는 스트리밍 챗봇을 만들어봅시다.

**AI에게 요청:**
```
스트리밍 방식으로 응답하는 챗봇 API를 추가해줘.
POST /api/chat/stream - 실시간 스트리밍 응답

Server-Sent Events(SSE)를 사용해서 구현해줘.
```

**Run 버튼 클릭!**

**AI가 추가한 코드 (src/index.ts):**
```typescript
// 스트리밍 챗봇 API
app.post('/api/chat/stream', async (c) => {
  try {
    const { message } = await c.req.json();

    if (!message) {
      return c.json({ error: '메시지를 입력해주세요.' }, 400);
    }

    // AI Gateway를 통해 OpenAI 스트리밍 호출
    const response = await fetch(`${c.env.AI_GATEWAY_URL}/openai/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 친절한 AI 어시스턴트입니다. 한국어로 답변해주세요.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: true  // 스트리밍 활성화
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API 호출 실패');
    }

    // Server-Sent Events로 스트리밍
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });

  } catch (error) {
    console.error('스트리밍 에러:', error);
    return c.json({
      error: '스트리밍 중 오류가 발생했습니다.'
    }, 500);
  }
});
```

### 프론트엔드 예제 (스트리밍)

**AI에게 요청:**
```
스트리밍 챗봇을 사용하는 HTML 페이지를 만들어줘.
채팅 UI와 실시간으로 응답이 타이핑되는 효과를 넣어줘.
```

**AI가 생성한 코드 (chat.html):**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 챗봇</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .chat-container {
      width: 90%;
      max-width: 600px;
      height: 80vh;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px 20px 0 0;
      font-size: 20px;
      font-weight: bold;
    }

    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .message {
      padding: 12px 16px;
      border-radius: 18px;
      max-width: 80%;
      line-height: 1.5;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message.user {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      align-self: flex-end;
    }

    .message.bot {
      background: #f0f0f0;
      color: #333;
      align-self: flex-start;
    }

    .chat-input {
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 10px;
    }

    input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 25px;
      font-size: 14px;
      outline: none;
      transition: border 0.3s;
    }

    input:focus {
      border-color: #667eea;
    }

    button {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }

    button:hover {
      transform: scale(1.05);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: #999;
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <div class="chat-header">
      AI 어시스턴트 💬
    </div>
    <div class="chat-messages" id="messages">
      <div class="message bot">
        안녕하세요! 무엇을 도와드릴까요?
      </div>
    </div>
    <div class="chat-input">
      <input
        type="text"
        id="userInput"
        placeholder="메시지를 입력하세요..."
        onkeypress="if(event.key==='Enter') sendMessage()"
      >
      <button onclick="sendMessage()" id="sendBtn">전송</button>
    </div>
  </div>

  <script>
    const messagesDiv = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;

      // 사용자 메시지 표시
      addMessage(message, 'user');
      userInput.value = '';
      sendBtn.disabled = true;

      // 타이핑 인디케이터 표시
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message bot typing-indicator';
      typingDiv.innerHTML = '<span></span><span></span><span></span>';
      messagesDiv.appendChild(typingDiv);
      scrollToBottom();

      try {
        // 스트리밍 요청
        const response = await fetch('http://localhost:8787/api/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message })
        });

        // 타이핑 인디케이터 제거
        messagesDiv.removeChild(typingDiv);

        // 봇 메시지 div 생성
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot';
        messagesDiv.appendChild(botMessageDiv);

        // 스트리밍 응답 처리
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  fullText += content;
                  botMessageDiv.textContent = fullText;
                  scrollToBottom();
                }
              } catch (e) {
                // JSON 파싱 에러 무시
              }
            }
          }
        }

      } catch (error) {
        messagesDiv.removeChild(typingDiv);
        addMessage('죄송합니다. 오류가 발생했습니다.', 'bot');
      }

      sendBtn.disabled = false;
      userInput.focus();
    }

    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${sender}`;
      messageDiv.textContent = text;
      messagesDiv.appendChild(messageDiv);
      scrollToBottom();
    }

    function scrollToBottom() {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  </script>
</body>
</html>
```

## 대화 기록 관리

대화 컨텍스트를 유지하는 챗봇을 만들어봅시다.

**AI에게 요청:**
```
대화 기록을 저장하고 컨텍스트를 유지하는 챗봇을 만들어줘.

기능:
1. KV 스토리지에 대화 기록 저장
2. 세션 ID로 대화 구분
3. 최근 10개 메시지만 유지
4. POST /api/chat/session - 세션 기반 대화
```

**Run 버튼 클릭!**

**AI가 생성한 코드:**
```typescript
type Env = {
  OPENAI_API_KEY: string;
  AI_GATEWAY_URL: string;
  CHAT_HISTORY: KVNamespace;  // KV 바인딩 추가
};

// 세션 기반 챗봇 API
app.post('/api/chat/session', async (c) => {
  try {
    const { message, sessionId } = await c.req.json();

    if (!message || !sessionId) {
      return c.json({ error: '메시지와 세션 ID를 입력해주세요.' }, 400);
    }

    // 세션 기록 불러오기
    const historyJson = await c.env.CHAT_HISTORY.get(`session:${sessionId}`);
    let history = historyJson ? JSON.parse(historyJson) : [];

    // 사용자 메시지 추가
    history.push({
      role: 'user',
      content: message
    });

    // 최근 10개 메시지만 유지 (시스템 메시지 제외)
    if (history.length > 10) {
      history = history.slice(-10);
    }

    // 시스템 메시지 + 대화 기록
    const messages = [
      {
        role: 'system',
        content: '당신은 친절한 AI 어시스턴트입니다. 이전 대화 내용을 기억하고 일관성 있게 답변해주세요.'
      },
      ...history
    ];

    // OpenAI 호출
    const response = await fetch(`${c.env.AI_GATEWAY_URL}/openai/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API 호출 실패');
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // 봇 응답 추가
    history.push({
      role: 'assistant',
      content: reply
    });

    // KV에 저장 (24시간 유지)
    await c.env.CHAT_HISTORY.put(
      `session:${sessionId}`,
      JSON.stringify(history),
      { expirationTtl: 86400 }
    );

    return c.json({
      success: true,
      reply,
      sessionId,
      messageCount: history.length
    });

  } catch (error) {
    console.error('세션 챗봇 에러:', error);
    return c.json({
      error: '챗봇 응답 중 오류가 발생했습니다.'
    }, 500);
  }
});

// 세션 초기화 API
app.delete('/api/chat/session/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');
  await c.env.CHAT_HISTORY.delete(`session:${sessionId}`);
  return c.json({ success: true, message: '세션이 초기화되었습니다.' });
});
```

## 고급: Vectorize로 데이터 학습하기

이제 Vectorize를 사용해서 커스텀 데이터를 학습시키고 챗봇에 연결해봅시다.

### Vectorize란?

Vectorize는 Cloudflare의 벡터 데이터베이스입니다. 텍스트를 벡터로 변환해서 저장하고, 유사도 검색을 할 수 있습니다.

**사용 사례:**
- 회사 문서 기반 챗봇
- FAQ 자동 응답
- 제품 정보 검색
- 고객 지원 자동화

### 1단계: Vectorize 인덱스 생성

**AI에게 요청:**
```
Vectorize 인덱스를 생성하고 싶어.
wrangler vectorize create 명령어를 실행해줘.
인덱스 이름은 chatbot-knowledge로 해줘.
OpenAI의 text-embedding-3-small 모델을 사용할 거야. (1536 차원)
```

**AI가 제안하는 명령어:**
```bash
wrangler vectorize create chatbot-knowledge \
  --dimensions=1536 \
  --metric=cosine
```

**Run 버튼 클릭!**

**wrangler.toml 업데이트:**
```toml
[[vectorize]]
binding = "VECTORIZE"
index_name = "chatbot-knowledge"
```

### 2단계: 데이터 임베딩 및 저장 API

**AI에게 요청:**
```
Vectorize에 지식 데이터를 저장하는 API를 만들어줘.

기능:
1. POST /api/knowledge - 텍스트를 임베딩해서 Vectorize에 저장
2. 텍스트를 OpenAI embedding API로 벡터화
3. 메타데이터도 함께 저장 (제목, 카테고리 등)

TypeScript 타입도 정의해줘.
```

**Run 버튼 클릭!**

**AI가 생성한 코드:**
```typescript
type Env = {
  OPENAI_API_KEY: string;
  AI_GATEWAY_URL: string;
  CHAT_HISTORY: KVNamespace;
  VECTORIZE: VectorizeIndex;  // Vectorize 바인딩
};

// 지식 데이터 저장 API
app.post('/api/knowledge', async (c) => {
  try {
    const { text, title, category } = await c.req.json();

    if (!text || !title) {
      return c.json({ error: '텍스트와 제목을 입력해주세요.' }, 400);
    }

    // OpenAI Embedding API로 벡터화
    const embeddingResponse = await fetch(
      `${c.env.AI_GATEWAY_URL}/openai/embeddings`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
        })
      }
    );

    if (!embeddingResponse.ok) {
      throw new Error('임베딩 생성 실패');
    }

    const embeddingData = await embeddingResponse.json();
    const vector = embeddingData.data[0].embedding;

    // Vectorize에 저장
    const id = crypto.randomUUID();
    await c.env.VECTORIZE.insert([
      {
        id,
        values: vector,
        metadata: {
          title,
          text,
          category: category || 'general',
          createdAt: new Date().toISOString()
        }
      }
    ]);

    return c.json({
      success: true,
      id,
      message: '지식 데이터가 저장되었습니다.'
    });

  } catch (error) {
    console.error('지식 저장 에러:', error);
    return c.json({
      error: '지식 데이터 저장 중 오류가 발생했습니다.'
    }, 500);
  }
});

// 여러 개의 지식 데이터 한 번에 저장
app.post('/api/knowledge/bulk', async (c) => {
  try {
    const { items } = await c.req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return c.json({ error: '지식 데이터 배열을 입력해주세요.' }, 400);
    }

    const vectors = [];

    // 모든 텍스트를 임베딩
    for (const item of items) {
      const embeddingResponse = await fetch(
        `${c.env.AI_GATEWAY_URL}/openai/embeddings`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: item.text,
          })
        }
      );

      const embeddingData = await embeddingResponse.json();
      const vector = embeddingData.data[0].embedding;

      vectors.push({
        id: crypto.randomUUID(),
        values: vector,
        metadata: {
          title: item.title,
          text: item.text,
          category: item.category || 'general',
          createdAt: new Date().toISOString()
        }
      });
    }

    // Vectorize에 일괄 저장
    await c.env.VECTORIZE.insert(vectors);

    return c.json({
      success: true,
      count: vectors.length,
      message: `${vectors.length}개의 지식 데이터가 저장되었습니다.`
    });

  } catch (error) {
    console.error('일괄 저장 에러:', error);
    return c.json({
      error: '지식 데이터 저장 중 오류가 발생했습니다.'
    }, 500);
  }
});
```

### 3단계: RAG 챗봇 만들기

Retrieval-Augmented Generation (RAG) 방식으로 학습된 데이터를 활용하는 챗봇을 만듭니다.

**AI에게 요청:**
```
Vectorize에 저장된 지식을 활용하는 RAG 챗봇을 만들어줘.

동작 방식:
1. 사용자 질문을 임베딩으로 변환
2. Vectorize에서 유사한 지식 검색 (top 3)
3. 검색된 지식을 컨텍스트로 OpenAI에 전달
4. 컨텍스트 기반으로 답변 생성

POST /api/chat/rag 엔드포인트로 만들어줘.
```

**Run 버튼 클릭!**

**AI가 생성한 코드:**
```typescript
// RAG 챗봇 API
app.post('/api/chat/rag', async (c) => {
  try {
    const { message } = await c.req.json();

    if (!message) {
      return c.json({ error: '메시지를 입력해주세요.' }, 400);
    }

    // 1. 사용자 질문을 임베딩으로 변환
    const embeddingResponse = await fetch(
      `${c.env.AI_GATEWAY_URL}/openai/embeddings`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: message,
        })
      }
    );

    const embeddingData = await embeddingResponse.json();
    const queryVector = embeddingData.data[0].embedding;

    // 2. Vectorize에서 유사한 지식 검색
    const searchResults = await c.env.VECTORIZE.query(queryVector, {
      topK: 3,  // 상위 3개 결과
      returnMetadata: true
    });

    // 3. 검색된 지식을 컨텍스트로 구성
    let context = '';
    const sources = [];

    if (searchResults.matches.length > 0) {
      context = '다음은 관련된 지식입니다:\n\n';

      searchResults.matches.forEach((match, index) => {
        context += `[참고 ${index + 1}] ${match.metadata.title}\n`;
        context += `${match.metadata.text}\n\n`;

        sources.push({
          title: match.metadata.title,
          category: match.metadata.category,
          score: match.score
        });
      });
    }

    // 4. 컨텍스트 기반으로 답변 생성
    const messages = [
      {
        role: 'system',
        content: `당신은 제공된 지식 기반으로 정확하게 답변하는 AI 어시스턴트입니다.

지침:
- 제공된 지식 내에서만 답변하세요.
- 확실하지 않으면 "제공된 정보에서는 해당 내용을 찾을 수 없습니다"라고 답변하세요.
- 친절하고 명확하게 답변하세요.
- 한국어로 답변하세요.`
      },
      {
        role: 'user',
        content: context ? `${context}\n질문: ${message}` : message
      }
    ];

    const response = await fetch(
      `${c.env.AI_GATEWAY_URL}/openai/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.3,  // 더 정확한 답변을 위해 낮은 temperature
          max_tokens: 500
        })
      }
    );

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return c.json({
      success: true,
      reply,
      sources,  // 참고한 지식 출처
      hasContext: searchResults.matches.length > 0
    });

  } catch (error) {
    console.error('RAG 챗봇 에러:', error);
    return c.json({
      error: '챗봇 응답 중 오류가 발생했습니다.'
    }, 500);
  }
});

// 지식 검색 API (챗봇 없이 검색만)
app.post('/api/knowledge/search', async (c) => {
  try {
    const { query } = await c.req.json();

    if (!query) {
      return c.json({ error: '검색어를 입력해주세요.' }, 400);
    }

    // 검색어를 임베딩으로 변환
    const embeddingResponse = await fetch(
      `${c.env.AI_GATEWAY_URL}/openai/embeddings`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: query,
        })
      }
    );

    const embeddingData = await embeddingResponse.json();
    const queryVector = embeddingData.data[0].embedding;

    // Vectorize에서 검색
    const results = await c.env.VECTORIZE.query(queryVector, {
      topK: 5,
      returnMetadata: true
    });

    return c.json({
      success: true,
      results: results.matches.map(match => ({
        id: match.id,
        title: match.metadata.title,
        text: match.metadata.text,
        category: match.metadata.category,
        score: match.score
      }))
    });

  } catch (error) {
    console.error('검색 에러:', error);
    return c.json({
      error: '검색 중 오류가 발생했습니다.'
    }, 500);
  }
});
```

### 4단계: 지식 데이터 업로드 예제

**AI에게 요청:**
```
회사 FAQ 데이터를 Vectorize에 업로드하는 스크립트를 만들어줘.
JSON 파일을 읽어서 일괄 업로드하는 방식으로.
```

**AI가 생성한 코드 (scripts/upload-knowledge.ts):**
```typescript
// FAQ 데이터 예시
const faqData = [
  {
    title: "회사 영업시간",
    text: "저희 회사의 영업시간은 평일 오전 9시부터 오후 6시까지입니다. 주말과 공휴일은 휴무입니다.",
    category: "영업정보"
  },
  {
    title: "제품 배송 기간",
    text: "제품 배송은 주문 후 2-3 영업일 소요됩니다. 도서산간 지역은 추가로 1-2일이 더 걸릴 수 있습니다.",
    category: "배송"
  },
  {
    title: "반품 정책",
    text: "제품 수령 후 7일 이내에 반품이 가능합니다. 단, 제품이 미개봉 상태여야 하며, 고객 변심에 의한 반품 시 배송비는 고객 부담입니다.",
    category: "반품/교환"
  },
  {
    title: "회원 가입 혜택",
    text: "회원 가입 시 첫 구매 10% 할인 쿠폰을 드립니다. 또한 구매 금액의 5%가 적립금으로 적립됩니다.",
    category: "회원혜택"
  },
  {
    title: "결제 방법",
    text: "신용카드, 체크카드, 계좌이체, 무통장입금, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다.",
    category: "결제"
  }
];

// 업로드 함수
async function uploadKnowledge() {
  const response = await fetch('http://localhost:8787/api/knowledge/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: faqData })
  });

  const result = await response.json();
  console.log(result);
}

uploadKnowledge();
```

### 5단계: RAG 챗봇 테스트

**테스트 예제:**
```bash
# 지식 데이터 업로드
curl -X POST http://localhost:8787/api/knowledge/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "회사 영업시간",
        "text": "저희 회사의 영업시간은 평일 오전 9시부터 오후 6시까지입니다.",
        "category": "영업정보"
      }
    ]
  }'

# RAG 챗봇으로 질문
curl -X POST http://localhost:8787/api/chat/rag \
  -H "Content-Type: application/json" \
  -d '{"message":"영업시간이 어떻게 되나요?"}'
```

**응답 예시:**
```json
{
  "success": true,
  "reply": "저희 회사의 영업시간은 평일 오전 9시부터 오후 6시까지입니다. 주말과 공휴일은 휴무입니다. 추가로 궁금하신 사항이 있으시면 말씀해 주세요!",
  "sources": [
    {
      "title": "회사 영업시간",
      "category": "영업정보",
      "score": 0.92
    }
  ],
  "hasContext": true
}
```

## 프론트엔드 통합 예제

**AI에게 요청:**
```
RAG 챗봇을 사용하는 완전한 프론트엔드를 만들어줘.
스트리밍 지원, 출처 표시, 채팅 기록 포함.
```

**AI가 생성한 코드 (rag-chat.html):**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 지식 챗봇</title>
  <style>
    /* 이전 chat.html의 스타일 + 추가 */

    .sources {
      margin-top: 10px;
      padding: 10px;
      background: #f8f9fa;
      border-left: 3px solid #667eea;
      font-size: 12px;
      color: #666;
    }

    .source-item {
      margin: 5px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .source-badge {
      background: #667eea;
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 10px;
    }

    .confidence {
      color: #999;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <!-- UI 구조는 이전과 동일 -->

  <script>
    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;

      addMessage(message, 'user');
      userInput.value = '';

      try {
        const response = await fetch('http://localhost:8787/api/chat/rag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });

        const data = await response.json();

        // 봇 응답 표시
        const messageDiv = addMessage(data.reply, 'bot');

        // 출처 표시
        if (data.sources && data.sources.length > 0) {
          const sourcesDiv = document.createElement('div');
          sourcesDiv.className = 'sources';
          sourcesDiv.innerHTML = '<strong>📚 참고 자료:</strong>';

          data.sources.forEach(source => {
            const sourceItem = document.createElement('div');
            sourceItem.className = 'source-item';
            sourceItem.innerHTML = `
              <span class="source-badge">${source.category}</span>
              <span>${source.title}</span>
              <span class="confidence">(${Math.round(source.score * 100)}%)</span>
            `;
            sourcesDiv.appendChild(sourceItem);
          });

          messageDiv.appendChild(sourcesDiv);
        }

      } catch (error) {
        addMessage('오류가 발생했습니다.', 'bot');
      }
    }
  </script>
</body>
</html>
```

## 성능 최적화 팁

### 1. 캐싱 활용

**AI에게 요청:**
```
자주 묻는 질문에 대한 응답을 KV에 캐싱해서 비용을 절감하고 싶어.
캐싱 로직을 추가해줘.
```

### 2. 임베딩 배치 처리

여러 텍스트를 한 번에 임베딩하면 API 호출 횟수를 줄일 수 있습니다.

### 3. 벡터 검색 최적화

`topK` 값을 적절히 조절해서 관련성 높은 결과만 가져옵니다.

## 다음 단계

AI 챗봇을 마스터했습니다! 이제 다른 고급 기능도 탐색해보세요:

- **[Workers 기초](/workers-basics/)** - Hono 기본 사용법
- **[D1 데이터베이스](/d1-database/)** - 대화 기록 저장
- **[테스트 작성하기](/workers-testing/)** - 챗봇 API 테스트

## 참고 자료

- [Cloudflare AI Gateway 문서](https://developers.cloudflare.com/ai-gateway/)
- [Vectorize 문서](https://developers.cloudflare.com/vectorize/)
- [OpenAI API 문서](https://platform.openai.com/docs/api-reference)
- [RAG 개념 설명](https://www.pinecone.io/learn/retrieval-augmented-generation/)
