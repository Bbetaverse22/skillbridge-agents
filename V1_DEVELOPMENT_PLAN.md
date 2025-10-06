# SkillBridge V1 - Development Plan & GitHub Issues

## 📋 Overview

This document outlines the complete development plan for SkillBridge V1, broken down into GitHub issues that can be tracked and implemented one by one.

**Timeline:** 3 Weeks  
**Branch:** `v1-capstone-development`  
**Milestone:** V1 Launch

---

## 🎯 Sprint Structure

### Week 1: LangGraph Research Agent (Core)
**Goal:** Build autonomous research agent with retry loops

### Week 2: Portfolio Builder Integration
**Goal:** Connect research to GitHub issue generation

### Week 3: Polish & Launch
**Goal:** UI, testing, documentation, demo

---

## 📦 GitHub Issues Breakdown

### 🏷️ Labels to Create First

```
Priority:
- priority-critical (red)
- priority-high (orange)
- priority-medium (yellow)
- priority-low (blue)

Type:
- type-feature (green)
- type-bug (red)
- type-docs (blue)
- type-refactor (purple)

Component:
- component-langgraph (pink)
- component-mcp (cyan)
- component-ui (yellow)
- component-portfolio-builder (green)

Status:
- status-blocked (red)
- status-in-progress (yellow)
- status-review (purple)
```

---

## 📋 Issues to Create

### **WEEK 1: LangGraph Research Agent**

---

#### Issue #1: Setup LangGraph Dependencies
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`, `component-langgraph`  
**Estimate:** 2 hours

**Description:**
Install and configure LangGraph for autonomous agent development.

**Tasks:**
- [ ] Install `@langchain/langgraph` package
- [ ] Install `@langchain/core` package  
- [ ] Install `@langchain/openai` package
- [ ] Configure OpenAI API key
- [ ] Create basic test to verify LangGraph works
- [ ] Update package.json with new dependencies
- [ ] Update README with LangGraph setup instructions

**Acceptance Criteria:**
- LangGraph imports work without errors
- Can create basic StateGraph
- Test passes confirming setup

**Files to Create/Modify:**
- `package.json`
- `lib/agents/langgraph/test-setup.ts`
- `README.md`

---

#### Issue #2: Design Research Agent State Schema
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`, `component-langgraph`  
**Estimate:** 3 hours

**Description:**
Define the state structure for the research agent that will be maintained across all nodes.

**Tasks:**
- [ ] Create `ResearchState` TypeScript interface
- [ ] Define input schema (skill gap, user context)
- [ ] Define output schema (recommendations, confidence)
- [ ] Create state transformation types
- [ ] Add validation logic for state
- [ ] Document state flow in comments

**Acceptance Criteria:**
- Complete TypeScript interface for ResearchState
- All fields properly typed
- Validation functions work
- Documentation clear

**Files to Create:**
- `lib/agents/langgraph/types.ts`
- `lib/agents/langgraph/state.ts`

**Example State:**
```typescript
interface ResearchState {
  // Input
  skillGap: string;
  detectedLanguage: string;
  userContext: string;
  
  // Search phase
  searchQuery: string;
  searchResults: Resource[];
  
  // Evaluation phase
  evaluatedResults: ScoredResource[];
  examples: GitHubProject[];
  
  // Decision phase
  confidence: number;
  iterationCount: number;
  
  // Output
  recommendations: Recommendation[];
}
```

---

#### Issue #3: Implement Web Search Node
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`, `component-langgraph`, `component-mcp`  
**Estimate:** 4 hours

**Description:**
Create the first LangGraph node that searches for learning resources using web search.

**Tasks:**
- [ ] Create `searchResourcesNode` function
- [ ] Integrate web search MCP tool
- [ ] Build search query from skill gap
- [ ] Parse search results
- [ ] Extract metadata (title, URL, description)
- [ ] Handle search errors gracefully
- [ ] Add logging for debugging
- [ ] Write unit tests

**Acceptance Criteria:**
- Node executes successfully
- Returns 20+ search results
- Handles errors without crashing
- Tests pass

**Files to Create:**
- `lib/agents/langgraph/nodes/search-resources.ts`
- `lib/agents/langgraph/nodes/search-resources.test.ts`

---

#### Issue #4: Implement Quality Evaluation Node
**Priority:** High  
**Labels:** `priority-high`, `type-feature`, `component-langgraph`  
**Estimate:** 5 hours

**Description:**
Create node that scores and ranks learning resources by quality.

**Tasks:**
- [ ] Create `evaluateQualityNode` function
- [ ] Implement scoring algorithm:
  - Rating score (30%)
  - Recency score (30%)
  - Completeness score (20%)
  - Author credibility (10%)
  - Community validation (10%)
- [ ] Extract ratings from results
- [ ] Check publication dates
- [ ] Detect if has code examples
- [ ] Sort by total score
- [ ] Return top 10 results
- [ ] Add tests for scoring logic

**Acceptance Criteria:**
- Scoring algorithm works correctly
- Resources ranked by quality
- Returns top 10 results
- Tests cover edge cases

**Files to Create:**
- `lib/agents/langgraph/nodes/evaluate-quality.ts`
- `lib/agents/langgraph/utils/scoring.ts`
- `lib/agents/langgraph/nodes/evaluate-quality.test.ts`

---

#### Issue #5: Implement GitHub Examples Search Node
**Priority:** High  
**Labels:** `priority-high`, `type-feature`, `component-langgraph`, `component-mcp`  
**Estimate:** 4 hours

**Description:**
Create node that finds example GitHub projects using GitHub MCP.

**Tasks:**
- [ ] Create `searchExamplesNode` function
- [ ] Use existing GitHub MCP integration
- [ ] Build search query from skill gap
- [ ] Filter by language (match user's stack)
- [ ] Sort by stars
- [ ] Extract: name, stars, description, URL
- [ ] Limit to top 10 results
- [ ] Handle rate limits
- [ ] Write tests

**Acceptance Criteria:**
- Finds relevant GitHub examples
- Returns 5-10 high-quality projects
- Properly sorted by stars
- Tests pass

**Files to Create:**
- `lib/agents/langgraph/nodes/search-examples.ts`
- `lib/agents/langgraph/nodes/search-examples.test.ts`

---

#### Issue #6: Implement Confidence Calculation Node
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`, `component-langgraph`  
**Estimate:** 3 hours

**Description:**
Create node that calculates research quality confidence score.

**Tasks:**
- [ ] Create `calculateConfidenceNode` function
- [ ] Implement confidence algorithm:
  - Resource quality: 40%
  - Resource quantity: 20%
  - Example quality: 30%
  - Relevance: 10%
- [ ] Calculate final confidence score (0-1)
- [ ] Add confidence thresholds
- [ ] Log confidence breakdown
- [ ] Write tests

**Acceptance Criteria:**
- Confidence score calculated correctly
- Returns value between 0 and 1
- Breakdown is logged
- Tests validate algorithm

**Files to Create:**
- `lib/agents/langgraph/nodes/calculate-confidence.ts`
- `lib/agents/langgraph/nodes/calculate-confidence.test.ts`

---

#### Issue #7: Implement Synthesis Node
**Priority:** High  
**Labels:** `priority-high`, `type-feature`, `component-langgraph`  
**Estimate:** 4 hours

**Description:**
Create final node that synthesizes all research into recommendations.

**Tasks:**
- [ ] Create `synthesizeNode` function
- [ ] Combine top resources + examples
- [ ] Generate learning path
- [ ] Create actionable recommendations
- [ ] Format output for Portfolio Builder
- [ ] Add metadata (confidence, sources)
- [ ] Write tests

**Acceptance Criteria:**
- Produces complete recommendations
- Includes top 3 resources
- Includes top 3 examples
- Learning path is coherent
- Tests pass

**Files to Create:**
- `lib/agents/langgraph/nodes/synthesize.ts`
- `lib/agents/langgraph/utils/learning-path.ts`
- `lib/agents/langgraph/nodes/synthesize.test.ts`

---

#### Issue #8: Build LangGraph Workflow
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`, `component-langgraph`  
**Estimate:** 4 hours

**Description:**
Connect all nodes into a complete LangGraph workflow with conditional edges.

**Tasks:**
- [ ] Create `ResearchAgent` class
- [ ] Initialize StateGraph
- [ ] Add all nodes to graph
- [ ] Connect nodes with edges
- [ ] Add conditional edge for retry logic
- [ ] Set entry point
- [ ] Compile graph
- [ ] Add error handling
- [ ] Write integration tests

**Acceptance Criteria:**
- All nodes connected correctly
- Conditional retry works
- Agent executes end-to-end
- Integration tests pass

**Files to Create:**
- `lib/agents/langgraph/research-agent.ts`
- `lib/agents/langgraph/research-agent.test.ts`

**Graph Structure:**
```
search → evaluate → examples → confidence
                                    ↓
                         (if < 0.7) ↓ (if >= 0.7)
                                    ↓
                          retry ←  decision → synthesize
```

---

#### Issue #9: Add Conditional Retry Logic
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`, `component-langgraph`  
**Estimate:** 3 hours

**Description:**
Implement the key agentic feature: autonomous decision to retry or proceed.

**Tasks:**
- [ ] Create retry decision function
- [ ] Check confidence threshold (0.7)
- [ ] Check iteration count (max 3)
- [ ] Refine search query on retry
- [ ] Add different search strategies
- [ ] Log retry decisions
- [ ] Test retry scenarios

**Acceptance Criteria:**
- Retries when confidence < 70%
- Stops after 3 iterations
- Query refinement improves results
- Tests cover all paths

**Files to Modify:**
- `lib/agents/langgraph/research-agent.ts`
- Add tests in `research-agent.test.ts`

---

#### Issue #10: Test LangGraph Agent End-to-End
**Priority:** High  
**Labels:** `priority-high`, `type-feature`, `component-langgraph`  
**Estimate:** 3 hours

**Description:**
Comprehensive testing of the complete research agent.

**Tasks:**
- [ ] Test with "pytest testing" skill gap
- [ ] Test with "Docker containers" skill gap
- [ ] Test with "GraphQL APIs" skill gap
- [ ] Verify confidence scores are reasonable
- [ ] Verify retry logic triggers correctly
- [ ] Verify final recommendations are useful
- [ ] Test error handling
- [ ] Document test results

**Acceptance Criteria:**
- 3+ different skill gaps tested
- All tests pass
- Confidence scores > 70% for most
- Retry works when needed
- Results are actionable

**Files to Create:**
- `lib/agents/langgraph/__tests__/integration.test.ts`
- `docs/research-agent-testing.md`

---

### **WEEK 2: Portfolio Builder Integration**

---

#### Issue #11: Enhance Portfolio Builder Agent
**Priority:** High  
**Labels:** `priority-high`, `type-feature`, `component-portfolio-builder`  
**Estimate:** 4 hours

**Description:**
Update Portfolio Builder to consume research results from LangGraph agent.

**Tasks:**
- [ ] Modify Portfolio Builder to accept research results
- [ ] Update issue template to include research
- [ ] Add resource links section
- [ ] Add example projects section
- [ ] Add confidence score display
- [ ] Update tests

**Acceptance Criteria:**
- Portfolio Builder accepts research input
- Issue templates include research
- Tests pass

**Files to Modify:**
- `lib/agents/portfolio-builder-agent.ts`

---

#### Issue #12: Generate Research-Backed Issue Body
**Priority:** High  
**Labels:** `priority-high`, `type-feature`, `component-portfolio-builder`  
**Estimate:** 3 hours

**Description:**
Create issue body template that includes all research findings.

**Tasks:**
- [ ] Create issue template function
- [ ] Add research findings section
- [ ] Add top resources with ratings
- [ ] Add example projects with links
- [ ] Add action checklist
- [ ] Add code template placeholder
- [ ] Add confidence score
- [ ] Format markdown properly

**Acceptance Criteria:**
- Issue body is well-formatted
- All research included
- Markdown renders correctly
- Looks professional

**Files to Create:**
- `lib/agents/portfolio-builder/templates/issue-template.ts`

---

#### Issue #13: Integrate GitHub Issue Creation
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`, `component-mcp`  
**Estimate:** 4 hours

**Description:**
Connect to GitHub MCP to actually create issues in user repositories.

**Tasks:**
- [ ] Use GitHub MCP `create_issue` tool
- [ ] Handle authentication (GitHub token)
- [ ] Add labels to issues
- [ ] Set assignee (user)
- [ ] Handle errors (permissions, rate limits)
- [ ] Return issue URL
- [ ] Add logging
- [ ] Write tests

**Acceptance Criteria:**
- Issues created successfully in test repo
- Labels applied correctly
- Error handling works
- Tests pass

**Files to Create:**
- `lib/agents/portfolio-builder/github-integration.ts`
- `lib/agents/portfolio-builder/github-integration.test.ts`

---

#### Issue #14: Connect Analysis → Research → Action
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`  
**Estimate:** 5 hours

**Description:**
Build complete pipeline from skill gap detection to issue creation.

**Tasks:**
- [ ] Create orchestration function
- [ ] Call Gap Analyzer (existing)
- [ ] For each gap, call Research Agent
- [ ] For each research result, call Portfolio Builder
- [ ] Store results in database
- [ ] Return complete results
- [ ] Add error handling for each step
- [ ] Write integration tests

**Acceptance Criteria:**
- Complete pipeline works end-to-end
- All three phases execute
- Results stored correctly
- Integration tests pass

**Files to Create:**
- `lib/agents/orchestrator.ts`
- `lib/agents/orchestrator.test.ts`

---

#### Issue #15: Add Code Template Generation
**Priority:** Medium  
**Labels:** `priority-medium`, `type-feature`, `component-portfolio-builder`  
**Estimate:** 4 hours

**Description:**
Generate starter code templates based on research findings.

**Tasks:**
- [ ] Create template generator function
- [ ] Add templates for common skills:
  - Testing (pytest, jest)
  - Documentation (README)
  - CI/CD (GitHub Actions)
- [ ] Fill templates with user context
- [ ] Add templates to GitHub issues
- [ ] Write tests

**Acceptance Criteria:**
- Templates generated correctly
- Context-aware (user's stack)
- Included in issues
- Tests pass

**Files to Create:**
- `lib/agents/portfolio-builder/templates/code-templates.ts`
- `lib/agents/portfolio-builder/templates/code-templates.test.ts`

---

#### Issue #16: Test Portfolio Builder with Real GitHub
**Priority:** High  
**Labels:** `priority-high`, `type-feature`, `component-portfolio-builder`  
**Estimate:** 3 hours

**Description:**
Test issue creation with real GitHub repositories.

**Tasks:**
- [ ] Create test repository
- [ ] Generate token with issue permissions
- [ ] Run full pipeline on test repo
- [ ] Verify issues created correctly
- [ ] Verify issue content is complete
- [ ] Verify labels applied
- [ ] Clean up test issues
- [ ] Document testing process

**Acceptance Criteria:**
- Issues created in real GitHub repo
- Content matches expectations
- All sections present
- Professional formatting

**Files to Create:**
- `docs/portfolio-builder-testing.md`

---

### **WEEK 3: UI, Polish & Launch**

---

#### Issue #17: Create Results Display UI
**Priority:** High  
**Labels:** `priority-high`, `type-feature`, `component-ui`  
**Estimate:** 6 hours

**Description:**
Build UI to display analysis, research, and generated issues.

**Tasks:**
- [ ] Create results page component
- [ ] Section 1: Skill gaps detected
- [ ] Section 2: Research transparency (confidence, sources)
- [ ] Section 3: Generated GitHub issues
- [ ] Show research process (steps taken)
- [ ] Show confidence scores
- [ ] Link to GitHub issues
- [ ] Mobile responsive
- [ ] Add loading states

**Acceptance Criteria:**
- UI displays all results
- Professional design
- Mobile responsive
- Loading states work

**Files to Create:**
- `components/results/results-display.tsx`
- `components/results/research-card.tsx`
- `components/results/issue-card.tsx`

---

#### Issue #18: Add Real-Time Progress Indicators
**Priority:** Medium  
**Labels:** `priority-medium`, `type-feature`, `component-ui`  
**Estimate:** 4 hours

**Description:**
Show user what the agent is doing in real-time.

**Tasks:**
- [ ] Create progress component
- [ ] Show current phase (analysis/research/action)
- [ ] Show agent status messages
- [ ] Show progress percentage
- [ ] Animate transitions
- [ ] Add completion checkmarks
- [ ] Test with real workflow

**Acceptance Criteria:**
- Progress updates in real-time
- User knows what's happening
- Animations smooth
- Completion clear

**Files to Create:**
- `components/progress/agent-progress.tsx`
- `components/progress/phase-indicator.tsx`

---

#### Issue #19: Simplify Input Form
**Priority:** High  
**Labels:** `priority-high`, `type-feature`, `component-ui`  
**Estimate:** 3 hours

**Description:**
Create simple, focused input for GitHub URL.

**Tasks:**
- [ ] Single-page layout
- [ ] Large GitHub URL input
- [ ] "Analyze & Improve" button
- [ ] Validation for GitHub URLs
- [ ] Example links
- [ ] Error messages
- [ ] Loading state

**Acceptance Criteria:**
- Clean, simple design
- URL validation works
- User-friendly
- Examples helpful

**Files to Create:**
- `app/v1/page.tsx`
- `components/input/github-url-input.tsx`

---

#### Issue #20: Add Error Handling & User Feedback
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`  
**Estimate:** 4 hours

**Description:**
Comprehensive error handling and user messaging.

**Tasks:**
- [ ] Handle GitHub API errors
- [ ] Handle research failures
- [ ] Handle issue creation failures
- [ ] Show user-friendly error messages
- [ ] Add retry buttons
- [ ] Log errors for debugging
- [ ] Add error boundary components

**Acceptance Criteria:**
- All errors caught gracefully
- User never sees crashes
- Error messages are helpful
- Retry works

**Files to Create:**
- `lib/utils/error-handling.ts`
- `components/error/error-boundary.tsx`

---

#### Issue #21: Write Comprehensive Documentation
**Priority:** High  
**Labels:** `priority-high`, `type-docs`  
**Estimate:** 5 hours

**Description:**
Document entire V1 system for submission and future development.

**Tasks:**
- [ ] Update main README
- [ ] Document LangGraph agent architecture
- [ ] Document MCP integrations
- [ ] Add setup instructions
- [ ] Add usage guide
- [ ] Add troubleshooting section
- [ ] Add API documentation
- [ ] Add code comments

**Acceptance Criteria:**
- Documentation complete
- Setup instructions work
- Examples included
- Professional quality

**Files to Create/Modify:**
- `README.md`
- `docs/langgraph-architecture.md`
- `docs/mcp-integration.md`
- `docs/setup-guide.md`

---

#### Issue #22: Create Demo Video
**Priority:** High  
**Labels:** `priority-high`, `type-docs`  
**Estimate:** 4 hours

**Description:**
Record 5-minute demo video for capstone submission.

**Tasks:**
- [ ] Write video script
- [ ] Prepare demo repository
- [ ] Record screen capture
- [ ] Add voiceover narration
- [ ] Show complete workflow:
  - Input GitHub URL
  - Watch agent research
  - See GitHub issues created
- [ ] Edit video
- [ ] Upload to YouTube
- [ ] Add to README

**Acceptance Criteria:**
- Video < 5 minutes
- Shows complete workflow
- Professional quality
- Narration clear

**Deliverables:**
- Video script document
- Uploaded video (YouTube/Vimeo)
- Video link in README

---

#### Issue #23: Performance Testing
**Priority:** Medium  
**Labels:** `priority-medium`, `type-feature`  
**Estimate:** 3 hours

**Description:**
Ensure system performs within acceptable limits.

**Tasks:**
- [ ] Test end-to-end latency
- [ ] Measure research time per skill gap
- [ ] Measure issue creation time
- [ ] Test with 5+ different repositories
- [ ] Identify bottlenecks
- [ ] Optimize slow parts
- [ ] Document performance metrics

**Acceptance Criteria:**
- End-to-end < 60 seconds
- Research < 30 seconds per gap
- All requests succeed
- Performance documented

**Files to Create:**
- `docs/performance-testing.md`

---

#### Issue #24: Final Integration Testing
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`  
**Estimate:** 4 hours

**Description:**
Complete end-to-end testing with multiple repositories.

**Tasks:**
- [ ] Test with Python/Flask repo
- [ ] Test with JavaScript/React repo
- [ ] Test with mixed-language repo
- [ ] Test with empty repo (edge case)
- [ ] Test with private repo
- [ ] Verify all issues created
- [ ] Verify research quality
- [ ] Document test results

**Acceptance Criteria:**
- 5+ repos tested successfully
- All issues created correctly
- Research quality high
- Test results documented

**Files to Create:**
- `docs/integration-testing.md`
- `docs/test-results.md`

---

#### Issue #25: Deploy to Production
**Priority:** Critical  
**Labels:** `priority-critical`, `type-feature`  
**Estimate:** 3 hours

**Description:**
Deploy V1 to production (Vercel).

**Tasks:**
- [ ] Configure production environment variables
- [ ] Test build locally
- [ ] Deploy to Vercel
- [ ] Configure custom domain (if available)
- [ ] Test production deployment
- [ ] Monitor for errors
- [ ] Update README with live URL

**Acceptance Criteria:**
- Deployed successfully
- Live URL works
- No production errors
- README updated

**Deployment Checklist:**
- [ ] OPENAI_API_KEY set
- [ ] GITHUB_TOKEN set
- [ ] WEB_SEARCH_MCP_URL set
- [ ] Build succeeds
- [ ] All routes work

---

## 📊 Issue Summary

**Total Issues:** 25

**By Priority:**
- Critical: 10
- High: 10
- Medium: 5

**By Week:**
- Week 1: 10 issues (LangGraph)
- Week 2: 6 issues (Portfolio Builder)
- Week 3: 9 issues (UI & Launch)

**By Component:**
- LangGraph: 10 issues
- Portfolio Builder: 6 issues
- UI: 4 issues
- MCP: 3 issues
- Documentation: 2 issues

**Total Estimated Time:** 95 hours (~3 weeks @ 30 hrs/week)

---

## 🎯 Milestones

### Milestone 1: Research Agent Complete (End of Week 1)
**Issues:** #1-#10  
**Deliverable:** Working LangGraph agent that researches skill gaps

### Milestone 2: Portfolio Builder Integrated (End of Week 2)
**Issues:** #11-#16  
**Deliverable:** Agent creates GitHub issues with research

### Milestone 3: V1 Launch (End of Week 3)
**Issues:** #17-#25  
**Deliverable:** Complete working application with documentation

---

## 🚀 Getting Started

### Step 1: Create GitHub Issues
Copy each issue above into GitHub Issues with:
- Proper title
- Full description
- Labels
- Milestone assignment
- Time estimate

### Step 2: Set Up Project Board
Create columns:
- 📋 Backlog
- 🏃 In Progress
- 👀 Review
- ✅ Done

### Step 3: Start with Issue #1
Begin with LangGraph setup and work through issues sequentially.

---

## 📝 Notes

- **Issue Dependencies:** Some issues depend on others (e.g., #8 needs #3-#7)
- **Flexibility:** Adjust estimates based on your actual progress
- **Blockers:** If blocked, move to next independent issue
- **Testing:** Don't skip tests - they catch issues early
- **Documentation:** Document as you go, not at the end

---

## ✅ Success Criteria

V1 is complete when:
- [ ] All 25 issues closed
- [ ] Integration tests pass
- [ ] Demo video recorded
- [ ] Documentation complete
- [ ] Deployed to production
- [ ] Capstone proposal updated with results

---

**Created:** January 2025  
**Author:** Betul  
**Branch:** `v1-capstone-development`  
**Status:** Ready to begin implementation

