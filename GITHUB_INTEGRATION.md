# GitHub Integration Guide

## Overview

This document describes the GitHub integration implemented for the SkillBridge Agents project, based on the [typescript-next-starter](https://github.com/AgentEngineer-ing/typescript-next-starter) repository patterns.

## Architecture

### Components

1. **GitHub Client** (`lib/github/github-client.ts`)
   - Native fetch-based API client
   - No external dependencies
   - Supports all major GitHub API endpoints

2. **GitHub Agent** (`lib/agents/github-agent.ts`)
   - 5 AI SDK tools for GitHub analysis
   - Integrates with the multi-agent coordinator
   - Provides skill assessment and analysis

3. **Coordinator Integration** (`lib/agents/coordinator.ts`)
   - Routes GitHub queries to the GitHub agent
   - Makes tools available to all agents

4. **Demo Interface** (`app/github-demo/page.tsx`)
   - Interactive demo of GitHub features
   - Profile and repository analysis
   - Skill assessment visualization

## Available Tools

### 1. github_user_profile
Get GitHub user profile information including repositories, followers, and activity.

**Parameters:**
- `username` (string): GitHub username to fetch profile for

**Example:**
```typescript
"Analyze GitHub user octocat"
```

### 2. github_user_repositories
Get repositories for a GitHub user with filtering and sorting options.

**Parameters:**
- `username` (string): GitHub username
- `type` (optional): 'all' | 'owner' | 'public' | 'private' | 'member'
- `sort` (optional): 'created' | 'updated' | 'pushed' | 'full_name'
- `direction` (optional): 'asc' | 'desc'
- `limit` (optional): Number of repositories (max 100)

**Example:**
```typescript
"Show me the top 10 repositories for torvalds"
```

### 3. github_repository_analysis
Analyze a specific GitHub repository for skill assessment.

**Parameters:**
- `owner` (string): Repository owner (username or organization)
- `repo` (string): Repository name

**Example:**
```typescript
"Analyze the repository facebook/react"
```

### 4. github_search_repositories
Search GitHub repositories by query with filtering options.

**Parameters:**
- `query` (string): Search query (e.g., "language:javascript react")
- `sort` (optional): 'stars' | 'forks' | 'help-wanted-issues' | 'updated'
- `order` (optional): 'asc' | 'desc'
- `limit` (optional): Number of results (max 100)

**Example:**
```typescript
"Search for TypeScript projects with React"
```

### 5. github_skill_assessment
Assess technical skills based on GitHub activity and repositories.

**Parameters:**
- `username` (string): GitHub username to assess
- `focus_areas` (optional): Array of skill areas to focus on

**Example:**
```typescript
"Assess my GitHub skills: myusername with focus on javascript, react, and typescript"
```

## Setup Instructions

### 1. Get a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token" (classic)
3. Select the following scopes:
   - `public_repo` (for public repository access)
   - `read:user` (for user profile access)
4. Generate and copy the token

### 2. Configure Environment Variables

Add to your `.env.local` file:

```env
# GitHub API Token (optional but recommended)
GITHUB_TOKEN=your_github_personal_access_token_here
```

**Note:** The GitHub token is optional. Without it, you'll be subject to GitHub's API rate limits (60 requests per hour). With a token, you get 5,000 requests per hour.

### 3. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. Visit the demo page:
   - Navigate to `http://localhost:3000/github-demo`

3. Try the chat interface:
   - Ask: "Analyze GitHub user octocat"
   - Ask: "What can I learn from facebook/react?"
   - Ask: "Search for popular TypeScript projects"

## Usage Examples

### In the Chat Interface

```
User: "Analyze my GitHub profile: myusername"
Agent: *Uses github_user_profile and github_user_repositories*
       "Based on your GitHub profile, you have 25 public repositories with 
       expertise in JavaScript, TypeScript, and Python. Your most starred 
       project is..."

User: "What skills can I learn from facebook/react?"
Agent: *Uses github_repository_analysis*
       "The React repository demonstrates advanced skills in:
       - Modern JavaScript/TypeScript
       - Build tooling and testing
       - Open source collaboration
       - Documentation practices..."

User: "Find popular React projects I can contribute to"
Agent: *Uses github_search_repositories*
       "Here are some popular React projects:
       1. facebook/react - 180k stars
       2. vercel/next.js - 100k stars
       ..."
```

## API Rate Limits

### Without Token
- 60 requests per hour
- Rate limit resets every hour

### With Token
- 5,000 requests per hour
- Sufficient for most use cases

## TypeScript Types

All GitHub API responses are fully typed. See `lib/github/github-client.ts` for type definitions:

- `GitHubUser`
- `GitHubRepository`
- `GitHubIssue`
- `GitHubPullRequest`

## Error Handling

All tools include comprehensive error handling:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

## Future Enhancements

Potential additions:
- GitHub Actions analysis
- Contribution graph analysis
- Code quality metrics
- Language proficiency scoring
- Collaboration patterns
- Issue/PR management insights

## Troubleshooting

### "Failed to fetch GitHub profile"
- Check if the username exists
- Verify your GitHub token is valid
- Check API rate limits

### Rate limit exceeded
- Add a `GITHUB_TOKEN` to your `.env.local`
- Wait for the rate limit to reset (shown in error message)

### Type errors in development
- The TypeScript errors related to `inputSchema` are type inference issues
- They do not affect runtime functionality
- They will be resolved in future AI SDK updates

## References

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [typescript-next-starter](https://github.com/AgentEngineer-ing/typescript-next-starter)
