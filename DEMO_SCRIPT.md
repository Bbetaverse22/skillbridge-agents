# SkillBridge.ai - 1 Minute Demo Script

## 🎯 Setup Before Recording
1. Open Terminal 1 with `pnpm langgraph:dev` running
2. Open browser at http://localhost:2024 with LangGraph Platform
3. Have this script visible on second monitor

---

## 📝 Demo Script (60 seconds)

### Opening (5 seconds)
"Hi! I'm presenting SkillBridge.ai, an agentic AI platform that helps developers identify skill gaps and improve their portfolios through autonomous actions."

### Infrastructure Overview (15 seconds)
"Over the past week, I've completed the foundational infrastructure:
- **LangGraph** for autonomous agent workflows
- **Prisma Postgres** database with 11 data models
- **GitHub OAuth** integration configured
- All deployed with a production-ready tech stack"

### Live Demo: LangGraph Platform (25 seconds)
[**Show LangGraph Platform in browser**]

"Here's the LangGraph Platform - a visual development environment for AI agents.

[**Click on research_agent graph**]

This is the Research Agent that will autonomously find learning resources for skill gaps.

[**Show input panel and enter test data**]
```json
{
  "skillGap": "React Server Components",
  "detectedLanguage": "TypeScript",
  "userContext": "Backend developer learning modern React",
  "iterationCount": 0
}
```

[**Click Run and show execution**]

Watch it execute: Search → Evaluate → Synthesize. Right now it returns placeholder data, but the workflow infrastructure is ready for real implementation."

### Database Demo (10 seconds)
[**Open new terminal or show VS Code with db.ts file**]

"The database schema supports everything: users, skill gaps, technologies, recommendations, and GitHub issues - all persisted in Prisma Postgres."

### Closing (5 seconds)
"Next steps: implement the real research logic, add GitHub integration, and connect the UI. The foundation is solid and ready for rapid development. Thank you!"

---

## 🎬 Alternative Shorter Version (45 seconds)

If you need to cut time:

**Opening (5s):** "SkillBridge.ai - an AI agent that analyzes GitHub profiles, identifies skill gaps, and autonomously improves your portfolio."

**Infrastructure (10s):** "I've built the foundation: LangGraph for agent workflows, Prisma database with 11 models, and GitHub OAuth configured."

**Demo (25s):** [Show LangGraph Platform execution with test input as above]

**Closing (5s):** "Infrastructure complete. Next: real research logic and GitHub integration. Thanks!"

---

## 📊 What to Show on Screen

### Screenshot 1: LangGraph Platform
- Graph visualization showing nodes (search → evaluate → synthesize)
- Execution trace with green checkmarks
- Output panel with placeholder results

### Screenshot 2: Project Structure
```
skillbridge-agents/
├── lib/
│   ├── agents/langgraph/research-agent.ts  ← Agent implementation
│   └── db.ts                                ← Database client
├── prisma/
│   ├── schema.prisma                        ← 11 data models
│   └── migrations/                          ← Database migrations
├── .env.local                               ← All credentials configured
└── langgraph.json                           ← LangGraph config
```

### Screenshot 3: Database Schema (Optional)
- Show `prisma/schema.prisma` with User, SkillGap, Technology models

---

## 💡 Key Talking Points

### What's Working:
✅ LangGraph Platform running locally with visual debugging
✅ Research agent executes with placeholder logic
✅ Database schema created and migrated
✅ GitHub OAuth credentials configured
✅ Production-ready infrastructure (Next.js 15, TypeScript, Tailwind)

### What's Next:
🚧 Issue #3: Implement real web search
🚧 Issue #4: Add resource evaluation with AI
🚧 Issues #5-10: Complete research agent
🚧 Issues #11-25: Portfolio builder agent

### Technical Highlights:
- **Autonomous Agents**: LangGraph enables stateful, decision-making agents
- **Scalable Database**: Prisma Postgres free tier (5GB, 10k queries/day)
- **Visual Development**: LangGraph Platform for debugging agent workflows
- **Type Safety**: Full TypeScript from database to UI

---

## 🎥 Recording Tips

1. **Keep browser window clean** - close extra tabs
2. **Use 1080p screen recording** - Zoom, Loom, or OBS
3. **Speak clearly and confidently**
4. **Practice once before recording**
5. **Show smooth transitions** - no fumbling with windows
6. **End with energy** - confidence in next steps

---

## ⏱️ Timing Breakdown

| Section | Time | Purpose |
|---------|------|---------|
| Opening | 5s | Hook attention |
| Infrastructure | 15s | Show technical depth |
| LangGraph Demo | 25s | Visual proof it works |
| Database | 10s | Show data architecture |
| Closing | 5s | Next steps confidence |

**Total: 60 seconds**
