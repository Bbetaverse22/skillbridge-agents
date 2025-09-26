import type { GitHubAnalysis, GapAnalysisResult } from './gap-analyzer';

export type SupervisorTaskType =
  | 'collect-preferences'
  | 'github-analysis'
  | 'ai-chat-analysis'
  | 'targeted-questionnaire';

export interface SupervisorTask {
  id: string;
  type: SupervisorTaskType;
  status: 'pending' | 'running' | 'complete' | 'error';
  context?: Record<string, unknown>;
}

export interface SupervisorPlan {
  tasks: SupervisorTask[];
  focusCategories: string[];
}

export interface SupervisorResult {
  plan: SupervisorPlan;
  github?: GitHubAnalysis;
  assessment?: GapAnalysisResult;
  errors?: Array<{ taskId: string; message: string }>;
}

/**
 * SkillSupervisorAgent coordinates the specialised analysis agents and stitches their
 * findings into a single skill-gap report. This initial scaffold focuses on planning
 * and orchestration metadata so downstream components can render progress while the
 * concrete integrations are developed.
 */
export class SkillSupervisorAgent {
  createPlan(options: {
    focusCategories: string[];
    hasGithubSource: boolean;
    hasChatSource: boolean;
  }): SupervisorPlan {
    const tasks: SupervisorTask[] = [];

    tasks.push({
      id: 'collect-preferences',
      type: 'collect-preferences',
      status: 'complete',
      context: { focusCategories: options.focusCategories },
    });

    if (options.hasGithubSource) {
      tasks.push({
        id: 'github-analysis',
        type: 'github-analysis',
        status: 'pending',
      });
    }

    if (options.hasChatSource) {
      tasks.push({
        id: 'ai-chat-analysis',
        type: 'ai-chat-analysis',
        status: 'pending',
      });
    }

    if (options.focusCategories.includes('soft')) {
      tasks.push({
        id: 'targeted-questionnaire',
        type: 'targeted-questionnaire',
        status: 'pending',
        context: {
          prompt: 'Gather a quick self-reflection on collaboration and communication.',
        },
      });
    }

    return {
      tasks,
      focusCategories: options.focusCategories,
    };
  }

  async executePlan(plan: SupervisorPlan): Promise<SupervisorResult> {
    // Placeholder implementation – specialised agents will be plugged in here.
    return {
      plan,
      errors: plan.tasks
        .filter((task) => task.type !== 'collect-preferences')
        .map((task) => ({
          taskId: task.id,
          message: 'Execution not yet implemented.',
        })),
    };
  }
}
