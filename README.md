# 🤖 RAG Customer Support AI

A full-stack AI-powered customer support chatbot that answers questions based on your own documents using Retrieval-Augmented Generation (RAG).

## 🌐 Live Demo
- **Frontend:** https://rag-customer-support-app.vercel.app
- **Backend:** https://rag-backend-3bwl.onrender.com



## 🧠 What It Does

Upload your company documents (PDFs, CSVs) and customers can ask questions in natural language. The AI finds the most relevant sections from your documents and generates accurate answers — only from your content, never hallucinated.
```
Upload PDF → Chunks stored in ChromaDB
Ask question → Semantic search → LLM answers from chunks → Streams back
```

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Zustand |
| **Backend** | Node.js, Express 4, TypeScript |
| **LLM** | Groq (Llama 3.3 70B) |
| **Embeddings** | Nomic Embed Text v1.5 |
| **Vector DB** | ChromaDB |
| **Database** | PostgreSQL + Prisma ORM |
| **Cache** | Redis |
| **Auth** | JWT + bcrypt |
| **Streaming** | Server-Sent Events (SSE) |
| **Deployment** | Railway + Render + Vercel |

## 🏗️ Architecture
```
User
 │
 ▼
React Frontend (Vercel)
 │ SSE Stream
 ▼
Node.js Backend (Render)
 │
 ├── JWT Auth
 ├── Rate Limiting
 │
 ▼
RAG Pipeline
 │
 ├── Nomic Embeddings → ChromaDB Search → Top 4 Chunks
 │
 ├── Groq LLM (Llama 3.3 70B) → Streamed Response
 │
 └── Redis Cache → Skip LLM for repeated questions
 │
 ▼
PostgreSQL (conversations, messages, feedback)
```

## 🚀 Features

- 💬 **Real-time streaming** — responses stream token by token like ChatGPT
- 📄 **Document ingestion** — upload PDF and CSV files
- 🔍 **Semantic search** — finds relevant content by meaning not keywords
- 📚 **Source citations** — shows which document chunk answered the question
- 👍 **Feedback system** — thumbs up/down on every response
- 💾 **Conversation history** — all chats saved and restored
- 🔐 **Auth + Roles** — JWT login, USER and ADMIN roles
- ⚡ **Redis caching** — repeated questions served instantly
- 🛡️ **Rate limiting** — 20 requests per minute per user

## 🗂️ Project Structure
```
rag-customer-support/
├── frontend/          # React + TypeScript
│   └── src/
│       ├── pages/     # Login, Register, Chat, Admin
│       ├── components/# Chat UI, Auth forms, Admin panel
│       ├── hooks/     # useChat, useAuth, useConversations
│       ├── store/     # Zustand state management
│       └── services/  # Axios API client
│
└── backend/           # Node.js + Express
    └── src/
        ├── api/       # Routes, controllers, middlewares
        ├── core/      # RAG pipeline, LLM, embeddings
        ├── ingestion/ # PDF/CSV loaders, chunker
        ├── vectorStore/ # ChromaDB integration
        ├── db/        # Prisma schema, repositories
        └── cache/     # Redis cache
```

## 🔄 RAG Pipeline Flow
```
1. User uploads PDF
        ↓
2. Text extracted → cleaned → chunked (512 chars)
        ↓
3. Each chunk embedded via Nomic API (768 dimensions)
        ↓
4. Embeddings stored in ChromaDB
        ↓
5. User asks question
        ↓
6. Question embedded → ChromaDB similarity search
        ↓
7. Top 4 chunks retrieved
        ↓
8. Chunks + question sent to Groq (Llama 3.3 70B)
        ↓
9. Answer streamed back via SSE
        ↓
10. Sources shown below answer
```

## 🏃 Run Locally

### Prerequisites
- Node.js v20
- Docker Desktop
- Ollama (for local LLM)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/rag-customer-support.git
cd rag-customer-support
```

### 2. Start infrastructure
```bash
docker-compose up -d
```

### 3. Setup backend
```bash
cd backend
cp .env.example .env
# Fill in your API keys in .env
npm install
npx prisma migrate dev
npm run dev
```

### 4. Setup frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Open browser
```
http://localhost:5173
```

## 🔑 Environment Variables

### Backend
```
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://raguser:ragpass@localhost:5432/ragdb
REDIS_URL=redis://localhost:6379
CHROMA_URL=http://localhost:8000
GROQ_API_KEY=gsk_...
NOMIC_API_KEY=...
```

### Frontend
```
VITE_API_URL=http://localhost:3000
```

## 📡 API Endpoints
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me

POST   /api/v1/chat                    # SSE streaming
GET    /api/v1/conversations
GET    /api/v1/conversations/:id
DELETE /api/v1/conversations/:id

POST   /api/v1/documents/upload        # Admin only
GET    /api/v1/documents               # Admin only
DELETE /api/v1/documents/:id           # Admin only

POST   /api/v1/feedback
GET    /api/v1/admin/stats             # Admin only
GET    /api/v1/admin/conversations     # Admin only
GET    /api/v1/health
```

## 🎯 Key Engineering Decisions

**Why SSE over WebSockets?**
SSE is simpler, unidirectional, and perfect for streaming AI responses. No need for bidirectional communication.

**Why RAG over fine-tuning?**
RAG is cheaper, faster to update, and more transparent — you can see exactly which document chunk was used to answer.

**Why abstract interfaces for LLM and VectorStore?**
Swapping Ollama → Groq and ChromaDB → Pinecone required changing one line each. The strategy pattern makes components replaceable without touching business logic.

**Why Redis cache?**
Repeated questions (very common in support scenarios) skip the LLM entirely. Reduces cost and latency dramatically.

## 🔮 Upgrade Path
```
Current (Free)          Production (Paid)
──────────────────────────────────────────
Groq free tier    →     OpenAI GPT-4o
Nomic free tier   →     OpenAI Embeddings
ChromaDB local    →     Pinecone managed
No reranker       →     Cohere Rerank API
```

## 📊 Database Schema
```
User          → email, password, role (USER/ADMIN)
Conversation  → userId, title
Message       → conversationId, role, content, sources
Document      → name, fileType, status, chunkCount
Feedback      → messageId, userId, rating, comment
```

## 👨‍💻 Author

Built by Shikhar Shukla
- GitHub: github.com/shuklashikhar
