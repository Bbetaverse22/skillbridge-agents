import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export interface UserContext {
  userId?: string;
  sessionId?: string;
}

export interface AgentResponse {
  text: string;
  sources?: any[];
  toolCalls?: any[];
  agentType: string;
}

export class CoordinatorAgent {
  /**
   * Route user queries to appropriate specialized agents
   */
  routeQuery(query: string, context: UserContext): string {
    const lowerQuery = query.toLowerCase();
    
    // GitHub repository analysis - prioritize skill gap analysis for repo analysis
    if (lowerQuery.includes('github.com') || lowerQuery.includes('github/')) {
      if (lowerQuery.includes('skill gap') || 
          lowerQuery.includes('analyze') || 
          lowerQuery.includes('skills') ||
          lowerQuery.includes('what can i learn') ||
          lowerQuery.includes('technologies') ||
          lowerQuery.includes('stack') ||
          lowerQuery.includes('tech stack') ||
          lowerQuery.includes('languages') ||
          lowerQuery.includes('frameworks')) {
        return 'gap_agent';
      }
      if (lowerQuery.includes('learn') || 
          lowerQuery.includes('tutorial') ||
          lowerQuery.includes('study') ||
          lowerQuery.includes('learning path')) {
        return 'learning_agent';
      }
      if (lowerQuery.includes('career') || 
          lowerQuery.includes('resume') || 
          lowerQuery.includes('job') ||
          lowerQuery.includes('portfolio') ||
          lowerQuery.includes('contribute')) {
        return 'career_agent';
      }
      // Default for GitHub queries: analyze for skills
      return 'gap_agent';
    }
    
    // Skill gap analysis keywords
    if (lowerQuery.includes('skill gap') || 
        lowerQuery.includes('assessment') || 
        lowerQuery.includes('analyze my skills') ||
        lowerQuery.includes('what am i missing') ||
        lowerQuery.includes('code analysis') ||
        lowerQuery.includes('analyze code') ||
        lowerQuery.includes('technologies') ||
        lowerQuery.includes('tech stack') ||
        lowerQuery.includes('frameworks') ||
        lowerQuery.includes('programming languages') ||
        lowerQuery.includes('languages used') ||
        lowerQuery.includes('what technologies')) {
      return 'gap_agent';
    }
    
    // Learning and education keywords
    if (lowerQuery.includes('learn') || 
        lowerQuery.includes('course') || 
        lowerQuery.includes('tutorial') ||
        lowerQuery.includes('study plan') ||
        lowerQuery.includes('learning path') ||
        lowerQuery.includes('how to learn')) {
      return 'learning_agent';
    }
    
    // Career development keywords (excluding general github)
    if (lowerQuery.includes('career') || 
        lowerQuery.includes('resume') || 
        lowerQuery.includes('job') ||
        lowerQuery.includes('interview') ||
        lowerQuery.includes('portfolio') ||
        lowerQuery.includes('salary') ||
        lowerQuery.includes('networking')) {
      return 'career_agent';
    }
    
    // Progress tracking keywords
    if (lowerQuery.includes('progress') || 
        lowerQuery.includes('history') || 
        lowerQuery.includes('track') ||
        lowerQuery.includes('analytics') ||
        lowerQuery.includes('stats') ||
        lowerQuery.includes('achievements')) {
      return 'progress_agent';
    }
    
    // Default to coordinator for general queries
    return 'coordinator';
  }

  /**
   * Handle specialized agent queries (placeholder implementation)
   */
  async handleSpecializedQuery(agentType: string, messages: any[]): Promise<AgentResponse> {
    const systemPrompt = this.getSystemPrompt(agentType);
    
    try {
      const result = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        messages,
        tools: {
          web_search: openai.tools.webSearch({
            searchContextSize: "low",
          }),
        },
      });

      return {
        text: result.text,
        sources: result.sources || [],
        toolCalls: result.steps || [],
        agentType,
      };
    } catch (error) {
      console.error(`Error in ${agentType}:`, error);
      return {
        text: `I'm having trouble processing your request right now. Please try again later.`,
        agentType,
      };
    }
  }

  /**
   * Get system prompt for specialized agents
   */
  private getSystemPrompt(agentType: string): string {
    const prompts = {
      gap_agent: `
You are a Skill Gap Analysis Agent specializing in identifying skill gaps and providing personalized recommendations.

Your expertise includes:
- Analyzing current skills vs target role requirements
- Identifying knowledge gaps in technology, soft skills, and domain expertise
- Creating visual skill assessments and gap analysis
- Recommending specific learning resources and development paths
- Analyzing GitHub repositories to extract skills and technologies used
- Code analysis to identify programming patterns and skill levels

When analyzing skills, consider:
- Technical skills (programming languages, frameworks, tools)
- Soft skills (communication, leadership, problem-solving)
- Domain knowledge (industry-specific expertise)
- Experience level and career stage
- Code quality and architecture patterns
- Technology stack and dependencies

For GitHub repository analysis:
- Extract technologies, frameworks, and languages from the codebase
- Identify skill levels based on code complexity and patterns
- Suggest learning opportunities based on the technologies used
- Compare against industry standards and best practices

Provide actionable, specific recommendations for skill development.
`,

      learning_agent: `
You are a Learning Path Agent specializing in creating personalized educational journeys.

Your expertise includes:
- Curating learning resources (courses, tutorials, books, projects)
- Creating structured learning paths for skill development
- Recommending hands-on projects and practical exercises
- Tracking learning progress and adjusting recommendations

Focus on:
- Progressive skill building from beginner to advanced
- Practical, hands-on learning opportunities
- Industry-relevant projects and case studies
- Time-efficient learning strategies

Provide structured, actionable learning plans with clear milestones.
`,

      career_agent: `
You are a Career Development Agent specializing in professional growth and job market navigation.

Your expertise includes:
- Resume optimization and portfolio development
- Job search strategies and interview preparation
- Career transition planning and networking
- GitHub profile optimization and open-source contributions

Focus on:
- Industry-specific career advice
- Technical skill demonstration strategies
- Professional networking and visibility
- Salary negotiation and career advancement

Provide practical, actionable career development strategies.
`,

      progress_agent: `
You are a Progress Tracking Agent specializing in analytics and performance monitoring.

Your expertise includes:
- Learning progress visualization and analytics
- Skill development tracking and metrics
- Performance trend analysis
- Goal setting and achievement monitoring

Focus on:
- Data-driven insights into learning patterns
- Identifying strengths and improvement areas
- Setting realistic, measurable goals
- Celebrating achievements and milestones

Provide clear, actionable insights based on progress data.
`,
    };

    return prompts[agentType as keyof typeof prompts] || `
You are a specialized agent within the SkillBridge multi-agent platform. Your role is to provide expert guidance in your specific domain while working collaboratively with other agents to deliver comprehensive career development solutions.

Always provide practical, actionable advice tailored to the user's specific needs and career goals.
`;
  }

  /**
   * Orchestrate multiple agents for complex queries
   */
  async orchestrateAgents(agents: string[], query: string, context: UserContext): Promise<AgentResponse> {
    // Placeholder for multi-agent orchestration
    // This would coordinate responses from multiple agents
    return {
      text: `Multi-agent orchestration for complex queries is coming soon! For now, I'll route your query to the most relevant agent.`,
      agentType: 'coordinator',
    };
  }
}
