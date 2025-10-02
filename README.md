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
- **Coordinator Agent**: Intelligent routing to specialized agents based on query context and active tab
- **GitHub Analysis Agent**: Analyzes GitHub profiles, repositories, and code for skill assessment
- **Gap Analysis Agent**: Performs automatic skill gap analysis with visual radar charts and personalized recommendations
- **Learning Path Agent**: Creates personalized learning modules with real GitHub practice issues for hands-on learning
- **Career Development Agent**: Generates resumes, badges, and finds OSS opportunities
- **Progress Tracking Agent**: Tracks learning progress and provides analytics
- **Persistent Storage**: File-based skill gap storage that persists across server restarts

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
   # Required
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional - for RAG features
   VECTORIZE_ORG_ID=your_vectorize_org_id
   VECTORIZE_PIPELINE_ID=your_vectorize_pipeline_id
   VECTORIZE_ACCESS_TOKEN=your_vectorize_access_token
   
   # Optional - increases GitHub API rate limits
   GITHUB_TOKEN=your_github_personal_access_token_here
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
- App: http://localhost:3000 (Next.js will pick a free port if needed)

## 💡 How It Works

### Complete Skill Development Workflow

1. **Skill Assessment Tab** 
   - Paste a GitHub repository URL or username
   - AI automatically analyzes the code, technologies, and skill level
   - Generates comprehensive skill gap report with current vs. target skills
   - Results stored persistently for future reference

2. **Learning Paths Tab**
   - View personalized learning recommendations based on your skill gaps
   - Automatically discover beginner-friendly GitHub issues to practice your skills
   - Get hands-on learning opportunities from real open-source projects
   - Direct links to contribute and build your portfolio

3. **Assistant Chat**
   - Ask questions about your skill gaps anytime
   - Get personalized advice based on your actual skill assessment
   - Access React, TypeScript, and programming documentation via RAG
   - Context-aware responses that understand which tab you're in

4. **Multi-Tab Experience**
   - Seamless navigation between Skill Assessment, Learning Paths, and Chat
   - Agent automatically routes queries to the right specialist
   - Persistent skill gap data accessible from any tab

## 🔧 Configuration

### Environment Variables

**Minimum Required (to get started):**
```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Optional Enhancements:**
```env
# RAG Knowledge Base (adds documentation search)
VECTORIZE_ORG_ID=your_vectorize_org_id
VECTORIZE_PIPELINE_ID=your_vectorize_pipeline_id
VECTORIZE_ACCESS_TOKEN=your_vectorize_access_token

# GitHub Token (increases API rate limits from 60/hr to 5000/hr)
GITHUB_TOKEN=your_github_personal_access_token_here

# Client-side configuration
# NEXT_PUBLIC_* vars for browser-side features
```

### GitHub Integration

The GitHub Analysis Agent provides powerful capabilities for skill assessment and practice:

- **Profile Analysis**: Get user statistics, repositories, and activity patterns
- **Repository Analysis**: Analyze specific repositories for technical depth and skills
- **Automatic Skill Assessment**: Two-step analysis that generates comprehensive skill gap reports
- **Repository Search**: Search repositories by technology or topic
- **Practice Issue Discovery**: Find beginner-friendly open-source issues based on your skill gaps
- **Code Quality Analysis**: Evaluate project maturity and community engagement
- **Learning Paths Integration**: Automatically suggest real GitHub issues for hands-on practice

**GitHub Token is Optional!** All GitHub features work without authentication, but with lower rate limits:
- **Without token**: 60 requests per hour (sufficient for testing and light usage)
- **With token**: 5,000 requests per hour (recommended for heavy usage)

To add a token for higher limits:
1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate a new token with `public_repo` scope (for public repositories only)
3. Add it to your `.env.local` file as `GITHUB_TOKEN`