# Skill Gap Analysis Memory Integration

## Overview
The chat assistant now has access to previously completed skill gap analyses through a new `get_skill_gap_analysis` tool. This allows the AI to provide personalized recommendations based on actual skill assessments.

## How It Works

### 1. **Skill Assessment Storage**
When you complete a skill gap analysis in the "Skill Analysis" tab:
- The results are automatically stored in memory (via `skillGapStorage`)
- Includes: repository info, skill levels, identified gaps, and recommendations
- Stored with user ID `user_123` by default

### 2. **Chat Assistant Access**
The Gap Analysis Agent can now retrieve this data using the `get_skill_gap_analysis` tool:

```typescript
get_skill_gap_analysis({ userId: "user_123" })
```

Returns:
```
SKILL GAP ANALYSIS SUMMARY
Repository: owner/repo-name
Overall Score: 75%
Skill Level: intermediate

Technologies Found:
- Languages: JavaScript, TypeScript
- Frameworks: React, Next.js
- Tools: Git, npm

Top Skill Gaps:
1. Advanced TypeScript: 3/5 → 5/5 (Gap: 2)
2. Testing: 2/5 → 4/5 (Gap: 2)
3. System Design: 2/5 → 5/5 (Gap: 3)

Key Recommendations:
1. Focus on advanced TypeScript features
2. Learn testing frameworks (Jest, React Testing Library)
3. Study system design patterns
```

### 3. **Agent Instructions**
The Gap Agent is instructed to:
1. **ALWAYS** call `get_skill_gap_analysis` first when users ask about skills/recommendations
2. Use the returned data to provide specific, personalized advice
3. Guide users to run an analysis first if no data is available

## Usage Example

### Workflow:
```
1. User: Go to "Skill Analysis" tab
2. User: Enter GitHub URL and analyze
3. ✅ Analysis stored automatically
4. User: Switch to "Assistant" tab
5. User: "What should I learn?"
6. 🤖 Agent: Calls get_skill_gap_analysis tool
7. 🤖 Agent: Provides personalized recommendations based on YOUR analysis
```

### Before This Feature:
```
User: "What should I learn?"
Agent: "Could you provide your GitHub username or details?"
❌ Agent doesn't know about the analysis you just ran
```

### After This Feature:
```
User: "What should I learn?"
Agent: *calls get_skill_gap_analysis*
Agent: "Based on your recent GitHub analysis of owner/repo, you should focus on:
       1. Advanced TypeScript (current: 3/5, target: 5/5)
       2. Testing frameworks (current: 2/5, target: 4/5)
       3. System Design patterns (current: 2/5, target: 5/5)"
✅ Agent references YOUR specific analysis
```

## Technical Implementation

### Files Modified:
1. **`lib/agents/coordinator.ts`**
   - Added import: `import { skillGapStorage } from "@/lib/storage/skill-gap-storage"`
   - Added `get_skill_gap_analysis` tool to `getTools()` method
   - Updated Gap Agent system prompt to use the tool

### Tool Definition:
```typescript
get_skill_gap_analysis: tool({
  description: 'Get the user\'s latest skill gap analysis results...',
  inputSchema: jsonSchema({
    type: 'object',
    properties: {
      userId: { 
        type: 'string', 
        description: 'User ID (defaults to "user_123")',
        default: 'user_123'
      },
    },
    additionalProperties: false,
  }) as any,
  execute: async ({ userId = 'user_123' }) => {
    const summary = skillGapStorage.getSkillGapSummary(userId);
    if (!summary) {
      return { success: false, message: 'No analysis found...' };
    }
    return { success: true, data: summary, message: 'Retrieved...' };
  },
})
```

## Benefits

1. **Context Continuity**: AI remembers your skill assessments across tabs
2. **Personalized Advice**: Recommendations based on YOUR actual skills, not generic suggestions
3. **Seamless UX**: No need to re-enter information or re-run analyses
4. **Tab Integration**: Analysis in "Skill Analysis" tab → Discussion in "Assistant" tab

## Storage Details

- **Storage Type**: In-memory Map (resets on server restart)
- **User ID**: `user_123` (hardcoded, can be made dynamic later)
- **Data Retention**: 30 days (automatic cleanup)
- **Scope**: Latest analysis per user (automatically updates)

## Future Enhancements

1. **Persistent Storage**: Save to database for long-term retention
2. **Multiple Analyses**: Compare analyses over time
3. **User Authentication**: Real user IDs instead of `user_123`
4. **Cross-Tab Updates**: Live updates when analysis completes
5. **Skill Detail Tool**: Get specific info about individual skills

## Testing

Try this flow:
1. Go to "Skill Analysis" tab
2. Enter: `https://github.com/vercel/next.js`
3. Wait for analysis to complete
4. Switch to "Assistant" tab
5. Ask: "What should I learn next?"
6. ✅ Agent should reference your Next.js analysis

## Notes

- The Gap Agent is configured to ALWAYS check for existing analysis data first
- If no data exists, the agent will guide users to run an analysis
- The tool works for all agents, but Gap Agent is the primary consumer
- Data is stored when analysis completes in the "Skill Analysis" tab (line 103 in `automatic-gap-analysis.tsx`)

