# Coordinator and Tab Routing Architecture

## Overview

Your SkillBridge dashboard has 5 tabs, but **routing is currently done at the agent level, not the UI tab level**. The coordinator routes queries to specialized **agents** behind the scenes, while users interact through a unified chat interface.

## Current Architecture

### UI Tabs (Frontend)
```typescript
1. "gaps"     → Skill Analysis (AutomaticGapAnalysis component)
2. "learning" → Learning Paths (Coming Soon)
3. "career"   → Career Development (Coming Soon)
4. "progress" → Progress Tracking (Coming Soon)
5. "chat"     → Multi-Agent Chat (Active - ChatAssistant component)
```

### Backend Agents (Coordinator Routes To)
```typescript
1. gap_agent       → Skill gap analysis, GitHub repository analysis
2. github_agent    → GitHub user profiles, repository search
3. learning_agent  → Learning path generation
4. career_agent    → Career development, resumes, OSS opportunities
5. progress_agent  → Progress tracking and analytics
6. coordinator     → General queries, orchestration
```

## How It Works Now

### Current Flow

```
┌─────────────┐
│   User UI   │
│  (5 tabs)   │
└──────┬──────┘
       │
       │ All chat happens in "chat" tab
       │
       ▼
┌──────────────────┐
│  ChatAssistant   │
│  Component       │
└──────┬───────────┘
       │
       │ POST /api/chat
       │
       ▼
┌──────────────────┐
│  Coordinator     │
│  .routeQuery()   │
└──────┬───────────┘
       │
       │ Routes based on query content
       │
       ▼
┌──────────────────────────────────────┐
│  Specialized Agent                   │
│  - gap_agent                         │
│  - github_agent                      │
│  - learning_agent                    │
│  - career_agent                      │
│  - progress_agent                    │
└──────────────────────────────────────┘
```

### Example Routing

```javascript
// User query: "Analyze https://github.com/facebook/react"
coordinator.routeQuery(query) → "gap_agent"

// User query: "Show my GitHub profile octocat"  
coordinator.routeQuery(query) → "github_agent"

// User query: "Create a learning path for React"
coordinator.routeQuery(query) → "learning_agent"

// User query: "How can I improve my resume?"
coordinator.routeQuery(query) → "career_agent"

// User query: "Show my learning progress"
coordinator.routeQuery(query) → "progress_agent"
```

## The Disconnect

**Currently:**
- UI has 5 tabs, but most functionality is in the "chat" tab
- Other tabs show "Coming Soon" placeholders
- All interactions happen through chat, regardless of tab
- Coordinator routes to agents **based on query content**, not tab selection

**The coordinator doesn't know which tab the user is on!**

## How to Connect Tabs to Agents

Here are three approaches to connect your UI tabs with the coordinator routing:

### Option 1: Pass Tab Context to API (Recommended)

Modify the chat to include current tab as context:

```typescript
// components/skillbridge/skillbridge-dashboard.tsx
<ChatAssistant currentTab={activeTab} />

// components/chat/chat-assistant.tsx
export default function ChatAssistant({ currentTab }: { currentTab?: string }) {
  const { messages, sendMessage } = useChat({
    body: {
      tabContext: currentTab, // Pass tab to API
    }
  });
}

// app/api/chat/route.ts
export async function POST(request: NextRequest) {
  const { messages, tabContext } = await request.json();
  
  // Use tab context to influence routing
  const routedAgent = coordinatorAgent.routeQuery(
    lastUserText, 
    { tabContext } // Pass to coordinator
  );
}

// lib/agents/coordinator.ts
routeQuery(query: string, context: { tabContext?: string }) {
  // Prioritize routing based on active tab
  if (context.tabContext === 'gaps') {
    // Bias towards gap_agent
    if (query.includes('analyze') || query.includes('github.com')) {
      return 'gap_agent';
    }
  }
  
  if (context.tabContext === 'learning') {
    // Bias towards learning_agent
    return 'learning_agent';
  }
  
  // ... normal routing logic
}
```

### Option 2: Tab-Specific Chat Instances

Each tab has its own chat instance with pre-configured agent:

```typescript
// components/skillbridge/skillbridge-dashboard.tsx
<TabsContent value="gaps">
  <ChatAssistant forcedAgent="gap_agent" />
</TabsContent>

<TabsContent value="learning">
  <ChatAssistant forcedAgent="learning_agent" />
</TabsContent>

<TabsContent value="career">
  <ChatAssistant forcedAgent="career_agent" />
</TabsContent>

<TabsContent value="progress">
  <ChatAssistant forcedAgent="progress_agent" />
</TabsContent>

<TabsContent value="chat">
  <ChatAssistant /> {/* No forced agent, uses coordinator */}
</TabsContent>
```

### Option 3: Auto-Navigate Based on Response

Let the coordinator's routing response trigger tab navigation:

```typescript
// app/api/chat/route.ts
const streamOptions = {
  messageMetadata: () => ({ 
    routedAgent,
    suggestedTab: mapAgentToTab(routedAgent) // Map agent to tab
  }),
}

function mapAgentToTab(agent: string): string {
  const mapping = {
    'gap_agent': 'gaps',
    'github_agent': 'gaps',
    'learning_agent': 'learning',
    'career_agent': 'career',
    'progress_agent': 'progress',
  };
  return mapping[agent] || 'chat';
}

// components/chat/chat-assistant.tsx
// Listen for metadata and emit event
useEffect(() => {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.metadata?.suggestedTab) {
    window.dispatchEvent(
      new CustomEvent('navigate-tab', { 
        detail: { tab: lastMessage.metadata.suggestedTab }
      })
    );
  }
}, [messages]);

// components/skillbridge/skillbridge-dashboard.tsx
useEffect(() => {
  const handleTabNavigation = (event: CustomEvent) => {
    setActiveTab(event.detail.tab);
  };
  
  window.addEventListener('navigate-tab', handleTabNavigation);
  return () => window.removeEventListener('navigate-tab', handleTabNavigation);
}, []);
```

## Recommended Implementation

I recommend **Option 1** with enhancements:

### Step 1: Add Tab Context

```typescript
// Pass tab context through the entire flow
User types in tab "gaps" → 
  ChatAssistant knows activeTab="gaps" →
    API receives tabContext="gaps" →
      Coordinator uses context to influence routing
```

### Step 2: Add Visual Indicators

Show which agent is responding:

```typescript
// components/chat/chat-assistant.tsx
{message.metadata?.routedAgent && (
  <Badge variant="outline">
    {getAgentDisplayName(message.metadata.routedAgent)}
  </Badge>
)}

function getAgentDisplayName(agent: string): string {
  return {
    'gap_agent': '📊 Skill Analyzer',
    'github_agent': '🐙 GitHub Expert',
    'learning_agent': '📚 Learning Guide',
    'career_agent': '💼 Career Coach',
    'progress_agent': '📈 Progress Tracker',
  }[agent] || '🤖 Assistant';
}
```

### Step 3: Add Routing Hints

Add suggestions to navigate to relevant tabs:

```typescript
// In agent responses, suggest tab navigation
"I've analyzed your skills. View the full report in the Skill Analysis tab →"

// With clickable link
<Button onClick={() => setActiveTab('gaps')}>
  View in Skill Analysis
</Button>
```

## Example Enhanced Flow

```typescript
// User is on "gaps" tab
User: "Analyze https://github.com/facebook/react"

// System knows:
// - activeTab = "gaps"
// - query contains GitHub URL
// - gap_agent is most appropriate

Response:
┌─────────────────────────────────────┐
│ 📊 Skill Analyzer responding...     │
├─────────────────────────────────────┤
│ Analyzing facebook/react...         │
│                                      │
│ Technologies Found:                  │
│ - JavaScript, TypeScript, React     │
│                                      │
│ Skill Gaps Identified:              │
│ 1. Advanced React patterns (Gap: 3) │
│ 2. TypeScript expertise (Gap: 2)    │
│                                      │
│ [View Full Report in Skill Analysis]│
└─────────────────────────────────────┘
```

## Benefits of This Approach

1. **Context-Aware**: Coordinator knows which tab user is in
2. **Seamless UX**: Users stay in their current tab workflow
3. **Smart Routing**: Tab context helps disambiguate queries
4. **Progressive Enhancement**: Works with or without tab context
5. **Visual Feedback**: Users see which agent is responding

## Implementation Priority

1. ✅ **Basic routing** (Already done - coordinator routes by content)
2. 🔄 **Add tab context** (Pass activeTab to API)
3. 🔄 **Visual indicators** (Show which agent responds)
4. 🔄 **Tab navigation hints** (Suggest relevant tabs)
5. 🔄 **Auto-navigation** (Optional - navigate to relevant tab)

## Code Changes Needed

### 1. Update Dashboard Component

```typescript
// Pass tab state to chat
<ChatAssistant activeTab={activeTab} onSuggestTab={setActiveTab} />
```

### 2. Update Chat Assistant

```typescript
// Include tab in API request
const { messages, sendMessage } = useChat({
  body: { tabContext: activeTab }
});
```

### 3. Update API Route

```typescript
// Use tab context in routing
const { messages, tabContext } = await request.json();
const routedAgent = coordinatorAgent.routeQuery(lastUserText, { tabContext });
```

### 4. Update Coordinator

```typescript
// Consider tab context in routing decisions
routeQuery(query: string, context: { tabContext?: string }) {
  // Your enhanced routing logic
}
```

Would you like me to implement any of these options for you?

