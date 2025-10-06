# GitHub Repository Skill Analysis Integration

## Overview

The SkillBridge system now integrates GitHub repository analysis directly into the gap analysis workflow. When users provide a GitHub repository URL, the system automatically analyzes the repository and generates a comprehensive skill gap assessment.

## How It Works

### 1. User Query Routing

When a user provides a GitHub repository URL, the coordinator automatically routes the query to the **gap_agent**:

```typescript
// Example user queries that trigger this flow:
"Analyze https://github.com/facebook/react"
"What skills can I learn from https://github.com/vercel/next.js?"
"Help me understand the tech stack in github.com/microsoft/vscode"
```

**Routing Logic:**
- Repository URLs (`github.com/owner/repo`) → `gap_agent`
- User profiles (`github user octocat`) → `github_agent`

### 2. Gap Agent Processing

The **gap_agent** has been enhanced with instructions to:

1. **Extract repository details** from the URL (owner and repo name)
2. **Call `github_repository_analysis` tool** with the extracted parameters
3. **Analyze the response** to identify:
   - Programming languages and their usage
   - Frameworks and libraries
   - Project maturity and complexity
   - Development practices (testing, CI/CD, documentation)
   - Community engagement metrics

4. **Generate skill assessment** including:
   - Current skill level indicators based on code complexity
   - Skill gaps compared to industry standards
   - Personalized learning recommendations
   - Related technologies to explore

5. **Create actionable learning path** with specific next steps

### 3. Available GitHub Tools

The gap_agent has access to these GitHub tools:

#### `github_repository_analysis`
Analyzes a specific repository for technical depth and skills.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name

**Returns:**
```typescript
{
  repository: {
    name, full_name, description, language, stars, forks, url
  },
  activity: {
    open_issues, open_pull_requests, recent_issues, recent_pull_requests
  },
  skill_indicators: {
    primary_language,
    project_maturity: 'early-stage' | 'growing' | 'established' | 'mature',
    community_engagement: 'minimal' | 'low' | 'medium' | 'high',
    code_quality_indicators: { has_readme, has_issues, has_pull_requests, recent_activity }
  }
}
```

#### Other Available Tools
- `github_user_profile` - Get user statistics
- `github_user_repositories` - List user's repositories
- `github_search_repositories` - Search for repositories
- `github_skill_assessment` - Comprehensive skill assessment based on GitHub activity

## Usage Examples

### Example 1: Analyze a Single Repository

**User Input:**
```
Analyze https://github.com/facebook/react and tell me what skills I need
```

**System Flow:**
1. Coordinator routes to `gap_agent`
2. Gap agent extracts: `owner="facebook"`, `repo="react"`
3. Calls `github_repository_analysis("facebook", "react")`
4. Receives repository data with languages, frameworks, complexity
5. Generates skill assessment report

**Expected Response:**
```
Repository Analysis: facebook/react

Technologies Detected:
- Primary Language: JavaScript (86%), TypeScript (12%)
- Project Maturity: Mature (high community engagement)
- Active Development: 150+ open issues, 45 open PRs

Skills You Can Develop:
1. Advanced JavaScript/TypeScript
   - Modern ES6+ features
   - Type systems and type safety
   - Async programming patterns
   
2. React Framework Expertise
   - Component architecture
   - Hooks and state management
   - Performance optimization
   - Testing strategies

3. Open Source Collaboration
   - Contributing to large projects
   - Code review practices
   - Documentation standards

Recommended Learning Path:
Phase 1: Master JavaScript fundamentals and TypeScript basics
Phase 2: Deep dive into React advanced patterns
Phase 3: Contribute to the React ecosystem
```

### Example 2: Compare Multiple Projects

**User Input:**
```
I want to learn backend development. Compare https://github.com/django/django and https://github.com/spring-projects/spring-boot
```

**System Flow:**
1. Gap agent analyzes both repositories sequentially
2. Compares technologies, complexity, and use cases
3. Provides comparative skill assessment

### Example 3: User Profile Analysis

**User Input:**
```
Assess my GitHub profile: octocat
```

**System Flow:**
1. Coordinator routes to `github_agent` (profile query)
2. GitHub agent calls `github_skill_assessment("octocat")`
3. Returns comprehensive skill analysis based on all repositories

## Integration with Existing Features

### Skill Gap Storage

The gap agent can store GitHub-based analyses using the existing skill gap storage system:

```typescript
// Analysis is automatically saved with:
analysisResult.githubAnalysis = {
  repository: 'https://github.com/owner/repo',
  technologies: [...],
  frameworks: [...],
  languages: [...],
  skillLevel: 'intermediate',
  recommendations: [...]
}
```

### Chat Interface

Users can interact naturally:
```
User: "What can I learn from https://github.com/openai/gpt-3?"
Agent: [Analyzes repository, provides skill assessment]

User: "How does this compare to my current skills?"
Agent: [References stored skill gap data, provides comparison]

User: "Create a learning plan for me"
Agent: [Generates personalized learning path based on gaps]
```

## Configuration

### Environment Variables

```bash
# Optional: GitHub Personal Access Token for higher rate limits
GITHUB_TOKEN=your_github_token_here
```

**Rate Limits:**
- Without token: 60 requests/hour
- With token: 5,000 requests/hour

### Customization

To customize the analysis logic, modify:
- `lib/agents/github-agent.ts` - Tool definitions and GitHub API calls
- `lib/agents/coordinator.ts` - Routing logic and system prompts
- `lib/github/github-client.ts` - GitHub API client methods

## Best Practices

### For Users

1. **Be Specific**: Provide full GitHub URLs for best results
   - ✅ `https://github.com/facebook/react`
   - ❌ `analyze react`

2. **Ask Follow-up Questions**: Build on the analysis
   - "What should I learn first?"
   - "How long will it take to learn these skills?"
   - "Find similar projects at my skill level"

3. **Compare Repositories**: Get multiple perspectives
   - "Compare https://github.com/X with https://github.com/Y"

### For Developers

1. **Extend Tool Capabilities**: Add more GitHub tools as needed
   ```typescript
   github_code_analysis: tool({
     // Analyze specific files or code patterns
   })
   ```

2. **Enhance Prompts**: Refine system prompts for better responses
3. **Add Caching**: Cache GitHub API responses to respect rate limits
4. **Implement Error Handling**: Handle private repos, 404s, rate limits gracefully

## Troubleshooting

### Common Issues

**Issue**: "Repository not found"
- **Solution**: Check if the repository is public or if you have access

**Issue**: "Rate limit exceeded"
- **Solution**: Add `GITHUB_TOKEN` to environment variables

**Issue**: "Invalid GitHub URL"
- **Solution**: Ensure URL format is `github.com/owner/repo`

### Debug Mode

Enable detailed logging by setting:
```bash
DEBUG=skillbridge:github
```

## Future Enhancements

Planned improvements:
- [ ] Multi-repository batch analysis
- [ ] Historical skill progression tracking
- [ ] Integration with job requirement matching
- [ ] Code quality metrics and suggestions
- [ ] Automated learning resource recommendations
- [ ] GitHub Actions workflow analysis
- [ ] Dependency vulnerability scanning
- [ ] Architecture pattern detection

## API Reference

See `GITHUB_INTEGRATION.md` for complete API documentation of all GitHub tools and their parameters.

