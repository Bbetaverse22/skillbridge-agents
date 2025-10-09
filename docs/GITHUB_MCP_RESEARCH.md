# GitHub MCP Server - Research Summary

**Date:** October 7, 2025
**Research Phase:** Issue #0 - Setup Official GitHub MCP Server

---

## 📦 Official Package

**Package:** GitHub MCP Server (Official from GitHub)
**Repository:** https://github.com/github/github-mcp-server
**Status:** Active development by GitHub team

**Note:** The old `@modelcontextprotocol/server-github` package has been archived and moved to the official GitHub repository.

---

## 🎯 What is GitHub MCP Server?

GitHub MCP Server connects AI tools directly to GitHub's platform, enabling:
- AI agents to interact with repositories, issues, PRs, and workflows
- Direct code reading and file access
- Issue and PR management
- CI/CD workflow monitoring
- Code security analysis

---

## 🔧 Available Toolsets

The GitHub MCP Server provides **16 default toolsets**:

### 1. **context**
- User and team information
- `get_me` - Get current authenticated user
- `get_team_members` - List team members

### 2. **repos**
- Repository management and browsing
- `search_repositories` - Search GitHub repositories
- `get_file_contents` - Read file contents from repositories
- Repository metadata access

### 3. **issues**
- Issue management
- `create_issue` - Create new issues
- `list_issues` - List repository issues
- `update_issue` - Update existing issues

### 4. **pull_requests**
- Pull request operations
- Create, list, update PRs
- PR review management

### 5. **users**
- User profile information
- User search and lookup

### 6. **actions**
- GitHub Actions workflows
- `list_workflow_runs` - List workflow executions
- `cancel_workflow_run` - Cancel running workflows
- CI/CD monitoring

### 7. **code_security**
- Security scanning
- `list_code_scanning_alerts` - View security alerts
- Vulnerability detection

### 8. **dependabot**
- Dependency management
- Dependabot alerts
- Automated dependency updates

### 9. **discussions**
- GitHub Discussions management

### 10. **gists**
- Gist creation and management

### 11. **notifications**
- Notification management

### 12. **orgs**
- Organization management

### 13. **projects**
- GitHub Projects management

### 14. **secret_protection**
- Secret scanning and protection

### 15. **security_advisories**
- Security advisory management

### 16. **stargazers**
- Star management and tracking

---

## 🔐 Authentication Requirements

### GitHub Personal Access Token (PAT)

**Required Token Scopes:**
- `repo` - Full control of private repositories
- `read:packages` - Read packages
- `read:org` - Read organization data

**For Public Repos Only:**
- `public_repo` - Access public repositories (subset of `repo`)

**Token Creation:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select required scopes: `repo`, `read:packages`, `read:org`
4. Generate and save token securely

**Security Best Practices:**
- ✅ Use minimal token scopes required
- ✅ Rotate tokens periodically (every 90 days)
- ✅ Store tokens in environment variables
- ❌ Never commit tokens to version control
- ✅ Use separate tokens for development and production

---

## 📥 Installation Methods

### Option 1: Remote Server (Recommended)

**Supported Clients:**
- VS Code
- JetBrains IDEs
- Visual Studio
- Claude Desktop
- Cursor

**Configuration:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Option 2: Local Server (Docker)

**Docker Setup:**
```bash
docker run -e GITHUB_TOKEN=your_token \
  -e GITHUB_TOOLSETS=repos,issues,pull_requests \
  ghcr.io/github/github-mcp-server:latest
```

### Option 3: Local Server (Go Build)

**Build from Source:**
```bash
git clone https://github.com/github/github-mcp-server
cd github-mcp-server
go build -o github-mcp-server
./github-mcp-server
```

---

## 🎛️ Toolset Configuration

### Enable Specific Toolsets

**Via Environment Variable:**
```bash
GITHUB_TOOLSETS=repos,issues,pull_requests,actions
```

**Via Command Line Flag:**
```bash
github-mcp-server --toolsets=repos,issues,pull_requests
```

### Enable All Tools

```bash
GITHUB_TOOLSETS=all
```

**Default Toolsets (if not specified):**
All 16 toolsets are enabled by default.

---

## 🔍 Key Tools for SkillBridge.ai

### 1. search_repositories

**Purpose:** Search GitHub repositories based on query criteria

**Parameters:**
```typescript
{
  query: string;              // Search query (e.g., "react authentication stars:>100")
  per_page?: number;          // Results per page (default: 30, max: 100)
  page?: number;              // Page number (default: 1)
  sort?: 'stars' | 'forks' | 'updated' | 'created';
  order?: 'asc' | 'desc';
  minimal_output?: boolean;   // Return minimal info (default: true)
}
```

**Response (minimal_output: true):**
```json
{
  "total_count": 150,
  "items": [
    {
      "name": "next-auth",
      "full_name": "nextauthjs/next-auth",
      "description": "Authentication for Next.js",
      "stars": 15000,
      "language": "TypeScript",
      "url": "https://github.com/nextauthjs/next-auth",
      "topics": ["authentication", "nextjs", "oauth"]
    }
  ]
}
```

**Example Query:**
```
"react hooks language:typescript stars:>1000"
```

---

### 2. get_file_contents

**Purpose:** Retrieve file contents from a repository

**Parameters:**
```typescript
{
  owner: string;     // Repository owner (e.g., "facebook")
  repo: string;      // Repository name (e.g., "react")
  path: string;      // File path (e.g., "package.json")
  ref?: string;      // Branch/tag/commit (default: default branch)
}
```

**Response:**
```json
{
  "name": "package.json",
  "path": "package.json",
  "sha": "abc123...",
  "size": 1024,
  "content": "base64_encoded_content",
  "encoding": "base64",
  "download_url": "https://raw.githubusercontent.com/..."
}
```

**Usage:**
- Extract template files from example repositories
- Analyze project structure
- Read configuration files

---

### 3. create_issue

**Purpose:** Create a new issue in a repository

**Parameters:**
```typescript
{
  owner: string;          // Repository owner
  repo: string;           // Repository name
  title: string;          // Issue title
  body: string;           // Issue body (Markdown)
  labels?: string[];      // Issue labels
  assignees?: string[];   // Assignee usernames
  milestone?: number;     // Milestone number
}
```

**Response:**
```json
{
  "number": 42,
  "title": "Add authentication support",
  "state": "open",
  "url": "https://github.com/user/repo/issues/42",
  "html_url": "https://github.com/user/repo/issues/42",
  "user": { "login": "username" },
  "labels": [{ "name": "enhancement" }],
  "created_at": "2025-10-07T10:00:00Z"
}
```

**Usage:**
- Create skill improvement tasks
- Generate portfolio enhancement issues
- Track learning progress

---

## 🚀 Integration Strategy for SkillBridge.ai

### Phase 1: Core Tools (Issue #0)
1. ✅ **search_repositories** - Find GitHub example projects
2. ✅ **get_file_contents** - Read template files
3. ✅ **create_issue** - Generate improvement tasks

### Phase 2: Extended Tools (Future)
4. **list_workflow_runs** - CI/CD analysis
5. **list_code_scanning_alerts** - Security review
6. **list_issues** - Track progress

### Phase 3: Advanced Tools (Optional)
7. Pull request management
8. Dependabot integration
9. Project board automation

---

## 📊 Tool Usage Limits

### GitHub API Rate Limits

**Authenticated Requests:**
- 5,000 requests per hour per token
- Rate limit status in response headers

**Unauthenticated Requests:**
- 60 requests per hour per IP

**Best Practices:**
- ✅ Always use authenticated requests
- ✅ Cache responses when possible
- ✅ Implement retry logic with exponential backoff
- ✅ Monitor rate limit headers

**Rate Limit Headers:**
```
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4999
X-RateLimit-Reset: 1696680000
```

---

## 🔄 MCP Communication Flow

```
Client (TypeScript)
     │
     ↓ stdio transport
GitHub MCP Server
     │
     ↓ HTTPS
GitHub REST API
```

**Transport:** stdio (Standard Input/Output)
**Protocol:** JSON-RPC 2.0
**Server Runtime:** Go (official implementation)

---

## 💡 Implementation Approach for SkillBridge.ai

### Client Wrapper Pattern

```typescript
// Similar to Template Creator MCP
class GitHubMCPClient {
  private client: Client;
  private transport: StdioClientTransport;

  async connect(githubToken?: string) {
    // Connect to GitHub MCP server via stdio
  }

  async searchRepositories(query, options) {
    // Call search_repositories tool
  }

  async getFileContents(owner, repo, path) {
    // Call get_file_contents tool
  }

  async createIssue(owner, repo, title, body) {
    // Call create_issue tool
  }
}
```

### LangGraph Integration

```typescript
// Issue #5b: GitHub Examples Search Node
export async function searchExamplesNode(state: ResearchState) {
  const client = new GitHubMCPClient();
  await client.connect();

  const query = `${state.skillGap} language:${state.detectedLanguage} stars:>100`;
  const repos = await client.searchRepositories(query, {
    per_page: 10,
    sort: 'stars',
    order: 'desc'
  });

  return { ...state, examples: repos };
}
```

---

## ⚠️ Known Limitations

1. **Server Installation:**
   - Requires npx or Docker
   - Not a pure npm package
   - Runtime dependency on GitHub

2. **Tool Permissions:**
   - Requires GitHub PAT with appropriate scopes
   - Token must have access to target repositories
   - Private repos require explicit token access

3. **Rate Limits:**
   - 5,000 requests/hour (authenticated)
   - Shared across all MCP operations
   - Need to implement caching strategy

4. **Response Format:**
   - MCP returns text (JSON string)
   - Requires parsing on client side
   - Type safety must be implemented in wrapper

---

## 🎯 Next Steps (Phase 2: Installation)

1. ✅ Research complete
2. ⏭️ Install GitHub MCP server package
3. ⏭️ Create client wrapper with 3 core tools
4. ⏭️ Configure authentication
5. ⏭️ Test tool functionality
6. ⏭️ Integrate with LangGraph

---

## 📚 Resources

**Official Documentation:**
- GitHub MCP Server: https://github.com/github/github-mcp-server
- MCP Protocol Spec: https://modelcontextprotocol.io
- GitHub API Docs: https://docs.github.com/en/rest

**Blog Posts:**
- A practical guide on how to use the GitHub MCP server
- Meet the GitHub MCP Registry

**Community:**
- MCP Registry: https://github.com/modelcontextprotocol/registry
- Awesome MCP Servers: https://github.com/wong2/awesome-mcp-servers

---

## ✅ Research Phase Complete

**Status:** ✅ Phase 1 Complete
**Duration:** 15 minutes
**Next Phase:** Installation (Phase 2)

**Key Findings:**
1. Official GitHub MCP server available from GitHub
2. 16 toolsets with comprehensive GitHub API coverage
3. 3 core tools identified for SkillBridge.ai
4. Authentication via GitHub PAT
5. stdio transport for communication
6. Clear integration path for LangGraph

**Ready for Implementation:** ✅

---

*Research completed for Issue #0 - Setup Official GitHub MCP Server*
*Generated by Claude Code for SkillBridge.ai Development*
