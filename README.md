# 🚀 SkillBridge Agents

A RAG-enabled Next.js application that pairs a multi-agent assistant with Vectorize-backed retrieval to support career development and skill building. Built with TypeScript, AI SDK 5, and modern security practices.

## ✨ Features

### 🔍 Vectorized Knowledge Base
- **Vectorize RAG Pipeline**: Retrieve context-aware sources for assistant responses
- **Firecrawl-Friendly**: Ingest docs from the web for richer knowledge
- **Structured Sources**: Surface citations and snippets alongside answers
- **Server Abstraction**: Vectorize service wrapper and `/api/research` endpoint
- **Current Coverage**: Seeded with React “Thinking in React” and TypeScript handbook content

### 🤖 Multi-Agent Framework
- **Coordinator Agent**: Routes queries to appropriate specialized agents
- **Gap Analysis Agent**: Analyzes skill gaps with radar charts and recommendations
- **Learning Path Agent**: Creates personalized learning modules and resources
- **Career Development Agent**: Generates resumes, badges, and finds OSS opportunities
- **Progress Tracking Agent**: Tracks learning progress and provides analytics

### 🎨 Modern UI & Experience
- **Assistant-First Dashboard**: Chat always available with contextual tabs
- **Multi-Agent Chat**: Coordinated responses from specialized agents
- **Tailwind + shadcn/ui**: Consistent design system with flexible layout
- **TypeScript**: Full type safety and better developer experience

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: use nvm)
- pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bbetaverse22/skillbridge-agents.git
   cd skillbridge-agents
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   VECTORIZE_ORG_ID=your_vectorize_org_id
   VECTORIZE_PIPELINE_ID=your_vectorize_pipeline_id
   VECTORIZE_ACCESS_TOKEN=your_vectorize_access_token
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
- App: http://localhost:3000 (Next.js will pick a free port if needed)

## 🧪 Testing

### Multi-Agent Dashboard
Visit the main app to explore the assistant-centric dashboard with:
- **Skill Analysis Tab**: Automatic GitHub-based gap analysis
- **Learning Tab**: Planned personalized learning paths
- **Career Tab**: Upcoming resume and opportunity tools
- **Progress Tab**: Future progress tracking modules
- **Assistant Tab**: Multi-agent chat with knowledge base retrieval

### Knowledge Retrieval Demo
Seed your Vectorize pipeline (e.g. via Firecrawl) and ask the assistant targeted questions:
- “Show me the official React docs on hooks.”
- “Summarize the TypeScript handbook on generics.”
- “What does the Node.js fs module support?”

### Multi-Agent Testing
Try these examples in the chat to see different agents in action:

**GitHub Repository Analysis (Gap Agent):**
```
Analyze this GitHub repo for skills: https://github.com/user/repo
What technologies are used in this codebase?
```

**Learning Path Generation (Learning Agent):**
```
Create a learning path for becoming a React developer
What should I study to learn machine learning?
```

**Career Development (Career Agent):**
```
Help me optimize my resume for a frontend developer position
Find open source projects I can contribute to
```

**Progress Tracking (Progress Agent):**
```
Show me my learning progress
What skills have I improved this month?
```

### Retrieval Testing
Monitor `POST /api/chat` responses—tool calls include `knowledge_base` payloads with `sources`.
- Default knowledge base content focuses on React and TypeScript; ingest more sources via Firecrawl for broader coverage.

## 🔧 Configuration

### Multi-Agent System
```typescript
// Coordinator Agent routes queries to specialized agents
const coordinator = new CoordinatorAgent();
const routedAgent = coordinator.routeQuery(userQuery, context);

// Available agents:
// - coordinator: General queries and orchestration
// - gap_agent: Skill gap analysis and GitHub repo analysis
// - learning_agent: Personalized learning paths
// - career_agent: Resume optimization and job search
// - progress_agent: Learning analytics and tracking
```

### Environment Variables
```env
# Required
OPENAI_API_KEY=your_openai_api_key_here
VECTORIZE_ORG_ID=your_vectorize_org_id
VECTORIZE_PIPELINE_ID=your_vectorize_pipeline_id
VECTORIZE_ACCESS_TOKEN=your_vectorize_access_token

# Optional
# NEXT_PUBLIC_* vars for client-side configuration
```

### Agent Responsibilities
- **🤖 Coordinator Agent**: Intelligent query routing and orchestration
- **📊 Gap Analysis Agent**: Skill gap analysis, GitHub repo analysis, code review
- **📚 Learning Agent**: Personalized learning paths, course recommendations
- **💼 Career Agent**: Resume optimization, job search, portfolio building
- **📈 Progress Agent**: Learning analytics, progress tracking, achievements
- **🧠 Knowledge Base Tool**: Vectorize-backed retrieval for grounded answers

### Components
- **SkillBridgeDashboard**: Assistant-first interface with contextual tabs
- **ChatAssistant**: Multi-agent chat with tool streaming
- **VectorizeService**: Abstraction over Vectorize pipelines for retrieval
- **CoordinatorAgent**: Query routing and agent orchestration
- **SpecializedAgents**: Domain-specific AI agents for career development