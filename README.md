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

## 🔧 Configuration

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