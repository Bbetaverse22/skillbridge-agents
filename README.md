# 🚀 SkillBridge.ai: Agentic Career Development Platform

An **agentic AI platform** that helps developers identify skill gaps and improve their portfolios through deep research and autonomous actions. Unlike traditional generative AI that just produces reports, SkillBridge.ai **takes action**: analyzing GitHub profiles, creating improvement tasks, and continuously monitoring progress.

## 🎯 V1 Vision: Research + Action

SkillBridge.ai V1 focuses on two core innovations:
1. **Deep Research**: Real-time web scraping for job requirements, salary trends, and learning resources
2. **Autonomous Actions**: GitHub integration that creates issues, drafts improvements, and tracks progress

Built with advanced AI agents for intelligent career development and portfolio improvement.

## ✨ V1 Features

### 🧠 Agentic Skill Analyzer
- **Multi-Stage Analysis**: Automatically profiles GitHub repos, detects tech stack, and generates skill gaps
- **Deep Career Research**: Real-time scraping of job boards (LinkedIn, Indeed) for role requirements
- **Learning Intelligence**: Finds relevant courses, documentation, and tutorials based on gaps
- **Persistent Memory**: Stores skill profiles for continuous tracking and improvement

### 🤖 Portfolio Builder Agent
- **Autonomous Improvement Loop**: Analyzes portfolio weaknesses and creates actionable tasks
- **GitHub Integration**: Creates issues and PRs directly in your repositories
- **README Generation**: Drafts professional documentation for your projects
- **Progress Monitoring**: Tracks completion and adapts recommendations

### 🔗 Tool Integrations
- **GitHub API**: Repository analysis, issue creation, profile enhancement
- **Web Research**: Real-time job market and learning resource discovery
- **Extensible Architecture**: Easy to add custom tools and integrations

### 🎨 Modern UI
- **Single Tab Focus**: Clean, action-oriented interface for skill analysis
- **Real-Time Updates**: Live agent status and action logs
- **Visual Progress**: Skill radar charts and improvement tracking
- **TypeScript + Next.js**: Full-stack type safety with shadcn/ui components

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

## 💡 How It Works: The Agentic Loop

### Phase 1: Deep Analysis
1. **GitHub Profiling**: Analyzes your repositories, tech stack, and coding patterns
2. **Role Detection**: Automatically determines if you're a backend dev, data engineer, DevOps, etc.
3. **Skill Gap Identification**: Compares your current skills vs. market demands
4. **Market Intelligence**: Scrapes real job postings for required skills

### Phase 2: Research & Planning
1. **Job Market Research**: Real-time web scraping of LinkedIn, Indeed, AngelList
2. **Salary Analysis**: Pulls compensation data for roles matching your profile
3. **Learning Resource Discovery**: Finds tutorials, courses, and documentation
4. **Priority Ranking**: Determines which skills have highest ROI

### Phase 3: Autonomous Action (Portfolio Builder)
1. **Weakness Detection**: Identifies repos needing improvement (missing READMEs, tests, docs)
2. **Task Generation**: Creates GitHub issues with specific improvement steps
3. **README Drafting**: Generates professional documentation for your projects
4. **Progress Monitoring**: Tracks issue completion and portfolio quality

### Phase 4: Continuous Loop
- **Weekly Check-ins**: Re-analyzes portfolio to measure progress
- **Adaptive Planning**: Adjusts recommendations based on completed tasks
- **New Opportunities**: Surfaces trending technologies and emerging skill demands

## 🔧 Configuration

### Environment Variables

**Required for V1:**
```env
# AI Model Access
OPENAI_API_KEY=your_openai_api_key_here

# GitHub Integration (Required for Portfolio Builder)
GITHUB_TOKEN=your_github_personal_access_token_here
```

**How to get a GitHub Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with these scopes:
   - `repo` (full control for creating issues/PRs)
   - `read:user` (for profile analysis)
3. Add to `.env.local` as `GITHUB_TOKEN`

### Tool Integration Architecture

SkillBridge.ai V1 uses standardized tool integrations for external services:

**GitHub API Integration** (Built-in):
- Repository analysis and profiling
- Issue creation for portfolio improvements
- README generation and documentation
- Progress tracking via GitHub API

**Web Research Integration** (Planned):
- Job board scraping (LinkedIn, Indeed, AngelList)
- Salary data aggregation
- Learning resource discovery
- Market trend analysis

**Extensible Design**:
- Add custom tools and integrations
- Standardized interface for easy integration
- See `lib/agents/coordinator.ts` for tool definitions

### Agent Workflow Architecture

The Portfolio Builder Agent uses advanced workflow management:
- **State Management**: Tracks analysis progress, goals, and actions
- **Conditional Routing**: Decides next steps based on current state
- **Human-in-the-Loop**: Optional approval gates for GitHub actions
- **Retry Logic**: Handles API failures and rate limits gracefully

See `V1_DEVELOPMENT_PLAN.md` for implementation roadmap.

## 🏗️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Full type safety
- **Tailwind CSS + shadcn/ui**: Beautiful, accessible components
- **React**: UI library

### Backend & AI
- **AI SDK 5 (Vercel)**: Streamable AI responses and tool calling
- **Advanced Workflow Management**: Stateful agentic workflows and decision loops
- **OpenAI GPT-4**: Language model for analysis and generation
- **Standardized Tool Protocol**: Flexible tool integrations

### Integrations
- **GitHub API**: Repository analysis, issue creation, profile enhancement
- **Web Scraping**: Job boards, salary data, learning resources
- **File-based Storage**: Simple persistence for skill profiles

## 🗺️ Roadmap

### ✅ V1 (Capstone - 3 Weeks)
**Focus**: Research + Action fundamentals
- ✅ GitHub analysis and skill gap detection
- 🚧 Portfolio Builder Agent
- 🚧 Deep career research with web scraping
- 🚧 Autonomous GitHub issue creation
- 🚧 Progress tracking and weekly check-ins

**Deliverables**: Working demo with real GitHub integration, research capabilities, and autonomous actions

### 🔮 V2 (Future Enhancements)
**Focus**: Scale and intelligence
- Multi-user support with authentication
- Database-backed persistence (PostgreSQL)
- Advanced tool integrations (LinkedIn, code quality tools)
- ML-powered skill matching
- Community features (share learning paths)
- Mobile app

## 📚 Key Documentation

- **`CAPSTONE_PROPOSAL.md`**: Complete project vision and academic context
- **`V1_DEVELOPMENT_PLAN.md`**: 25-issue breakdown for V1 implementation
- **`CLAUDE.md`**: Session context and development history

## 🤝 Contributing

This is a capstone project, but feedback and suggestions are welcome! For V2 and beyond, contributions will be encouraged.
----

**Built with ❤️ for developers who want to level up their careers through AI-powered insights and autonomous portfolio improvement.**