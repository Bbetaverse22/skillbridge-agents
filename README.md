# 🚀 SkillBridge Agents

A comprehensive Next.js application that combines advanced security sanitization with a multi-agent framework for career development and skill building. Built with TypeScript, AI SDK 5, and modern security practices.

## ✨ Features

### 🛡️ Security Sanitizer Agent
- **Real-time Secret Detection**: Automatically detects API keys, passwords, personal info, and more
- **Client-side Sanitization**: Strips/masks secrets before any network calls
- **Multi-layer Security**: Client-side + server-side validation
- **Visual Feedback**: Clear indicators and warnings for detected secrets

### 🤖 Multi-Agent Framework
- **Coordinator Agent**: Routes queries to appropriate specialized agents
- **Gap Analysis Agent**: Analyzes skill gaps with radar charts and recommendations
- **Learning Path Agent**: Creates personalized learning modules and resources
- **Career Development Agent**: Generates resumes, badges, and finds OSS opportunities
- **Progress Tracking Agent**: Tracks learning progress and provides analytics

### 🎨 Modern UI & Experience
- **Interactive Dashboard**: Comprehensive SkillBridge dashboard with multiple tabs
- **Multi-Agent Chat**: Chat interface that routes to specialized agents
- **Real-time Sanitization**: All user input automatically sanitized
- **TypeScript**: Full type safety and better developer experience
- **Modern UI**: Built with shadcn/ui and Tailwind CSS

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
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   - Main app: http://localhost:3000
   - Demo page: http://localhost:3000/demo

## 🧪 Testing

### Multi-Agent Dashboard
Visit the main app at `http://localhost:3000` to access the full SkillBridge Agents dashboard with:
- **Overview Tab**: System status and agent information
- **Skill Gaps Tab**: Analyze your skills and identify gaps
- **Learning Tab**: Get personalized learning paths
- **Career Tab**: Resume optimization and job search tools
- **Progress Tab**: Track your learning progress
- **Chat Tab**: Multi-agent chat with intelligent routing

### Interactive Demo
Visit `/demo` to test the sanitizer with pre-built examples:
- API Keys (OpenAI, AWS, GitHub)
- Database connection strings
- Personal information (SSN, email, phone)
- Credit card numbers
- JWT tokens

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

### Security Testing
Test the sanitizer with sensitive data:
```
My API key is sk-1234567890abcdef1234567890abcdef1234567890abcdef
Database: mongodb://user:password123@localhost:27017/mydb
Contact: john.doe@example.com, Phone: (555) 123-4567
```

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

# Optional
SANITIZER_STRICT_MODE=true
SANITIZER_ENABLE_MASKING=true
SANITIZER_ENABLE_STRIPPING=false
```

### Agent Responsibilities
- **🛡️ Sanitizer Agent**: Real-time secret detection and sanitization
- **🤖 Coordinator Agent**: Intelligent query routing and orchestration
- **📊 Gap Analysis Agent**: Skill gap analysis, GitHub repo analysis, code review
- **📚 Learning Agent**: Personalized learning paths, course recommendations
- **💼 Career Agent**: Resume optimization, job search, portfolio building
- **📈 Progress Agent**: Learning analytics, progress tracking, achievements

### Components
- **SkillBridgeDashboard**: Main multi-agent interface with 6 tabs
- **ChatAssistant**: Multi-agent chat interface with routing
- **SanitizerAgent**: Core detection and sanitization logic
- **CoordinatorAgent**: Query routing and agent orchestration
- **SpecializedAgents**: Domain-specific AI agents for career development