"use client";

/**
 * Portfolio Builder Tab - AGENTIC UI
 * 
 * This component shows AGENTIC behavior in action:
 * - Agent autonomously creates tasks and GitHub issues
 * - Real-time progress monitoring
 * - Agent adapts based on user progress
 * - Shows what the agent is DOING, not just recommending
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  ExternalLink,
  GitPullRequest,
  GitBranch,
  FileText,
  AlertCircle,
  TrendingUp,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface AgentTask {
  id: string;
  repoName: string;
  description: string;
  status: 'planned' | 'agent_working' | 'waiting_user' | 'completed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: string;
  impact: string;
  agentActions: AgentAction[];
  githubIssueUrl?: string;
  githubPrUrl?: string;
}

interface AgentAction {
  id: string;
  type: 'analyzing' | 'creating_issue' | 'generating_draft' | 'monitoring' | 'completed';
  description: string;
  timestamp: Date;
  artifactUrl?: string;
}

export function PortfolioBuilderTab({ githubUsername }: { githubUsername?: string }) {
  const [agentActive, setAgentActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'planning' | 'executing' | 'monitoring'>('idle');
  const [currentAction, setCurrentAction] = useState<string>('');
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [overallScore, setOverallScore] = useState(65);
  const [targetScore] = useState(85);
  const [weeklyGoal, setWeeklyGoal] = useState<AgentTask | null>(null);

  // Simulate agentic behavior for demo
  const startAgentLoop = async () => {
    setAgentActive(true);
    setAgentStatus('planning');
    setCurrentAction('🤖 Agent analyzing your GitHub repositories...');

    // Simulate agent planning phase
    await simulateDelay(2000);
    setCurrentAction('🤖 Agent creating improvement plan...');
    
    await simulateDelay(1500);
    setCurrentAction('🤖 Agent generating prioritized tasks...');
    
    // Generate tasks
    const generatedTasks: AgentTask[] = [
      {
        id: '1',
        repoName: 'portfolio-website',
        description: 'Add comprehensive README',
        status: 'agent_working',
        priority: 'critical',
        estimatedTime: '2 hours',
        impact: '90% of recruiters check README first. This will make you stand out.',
        agentActions: [
          {
            id: '1-1',
            type: 'analyzing',
            description: 'Agent analyzing repository structure',
            timestamp: new Date(),
          },
          {
            id: '1-2',
            type: 'creating_issue',
            description: 'Agent creating GitHub issue with action items',
            timestamp: new Date(),
          },
          {
            id: '1-3',
            type: 'generating_draft',
            description: 'Agent generating README draft',
            timestamp: new Date(),
          }
        ],
        githubIssueUrl: '#',
        githubPrUrl: '#',
      },
      {
        id: '2',
        repoName: 'todo-app',
        description: 'Add Jest tests',
        status: 'planned',
        priority: 'high',
        estimatedTime: '3 hours',
        impact: 'Tests show production-ready code. Mentioned in 100% of senior dev interviews.',
        agentActions: [],
      },
      {
        id: '3',
        repoName: 'portfolio-website',
        description: 'Add GitHub Actions CI/CD',
        status: 'planned',
        priority: 'high',
        estimatedTime: '2 hours',
        impact: 'CI/CD shows professional development practices.',
        agentActions: [],
      },
      {
        id: '4',
        repoName: 'blog-api',
        description: 'Add API documentation',
        status: 'planned',
        priority: 'medium',
        estimatedTime: '1.5 hours',
        impact: 'Documentation is key for backend roles.',
        agentActions: [],
      },
      {
        id: '5',
        repoName: 'all repositories',
        description: 'Add LICENSE files',
        status: 'planned',
        priority: 'low',
        estimatedTime: '30 minutes',
        impact: 'Shows you understand open source best practices.',
        agentActions: [],
      }
    ];

    setTasks(generatedTasks);
    setWeeklyGoal(generatedTasks[0]);
    
    await simulateDelay(1000);
    setAgentStatus('executing');
    setCurrentAction('🤖 Agent creating GitHub issues in your repositories...');
    
    // Simulate agent creating issues
    await simulateDelay(2000);
    setCurrentAction('🤖 Agent generating README draft and opening PR...');
    
    await simulateDelay(2000);
    setAgentStatus('monitoring');
    setCurrentAction('✅ Agent setup complete. Now monitoring your progress...');
    
    // Update first task status
    setTasks(prev => prev.map(t => 
      t.id === '1' ? { ...t, status: 'waiting_user' as const } : t
    ));
  };

  const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getStatusIcon = (status: AgentTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'agent_working':
        return <Bot className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'waiting_user':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: AgentTask['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero - Agent Control Center */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-background to-purple-50 dark:to-purple-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${agentActive ? 'bg-purple-500 animate-pulse' : 'bg-purple-100 dark:bg-purple-900'}`}>
                <Bot className={`h-6 w-6 ${agentActive ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  🤖 Portfolio Builder Agent
                  {agentActive && <Badge variant="default" className="animate-pulse">ACTIVE</Badge>}
                </CardTitle>
                <CardDescription className="text-base">
                  An autonomous agent that improves your GitHub portfolio while you focus on coding
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Portfolio Score</div>
              <div className="text-3xl font-bold text-purple-600">{overallScore}%</div>
              <div className="text-xs text-muted-foreground">Target: {targetScore}%</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Hireable Portfolio</span>
              <span className="font-medium">{overallScore}% / {targetScore}%</span>
            </div>
            <Progress value={(overallScore / targetScore) * 100} className="h-3" />
          </div>

          {/* Agent Status */}
          {agentActive && (
            <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
              <Bot className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-900 dark:text-purple-100">
                <span className="font-semibold">Agent Status:</span> {currentAction}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          {!agentActive ? (
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={startAgentLoop}
              >
                <Play className="h-5 w-5 mr-2" />
                Activate Portfolio Builder Agent
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                The agent will analyze your GitHub, create improvement tasks, generate drafts, and monitor your progress
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setAgentActive(false)}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause Agent
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-analyze
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* This Week's Goal - What Agent Created */}
      {weeklyGoal && agentActive && (
        <Card className="border-2 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                This Week's Goal (Agent Selected)
              </CardTitle>
              <Badge className={getPriorityColor(weeklyGoal.priority)}>
                {weeklyGoal.priority} priority
              </Badge>
            </div>
            <CardDescription>
              The agent chose this as your highest-impact task
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {weeklyGoal.repoName}: {weeklyGoal.description}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {weeklyGoal.impact}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {weeklyGoal.estimatedTime}
                </span>
                {getStatusIcon(weeklyGoal.status)}
                <span className="capitalize">{weeklyGoal.status.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Agent Actions Taken */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Bot className="h-4 w-4" />
                What the Agent Did:
              </h4>
              <div className="space-y-2 pl-6">
                {weeklyGoal.agentActions.map((action) => (
                  <div key={action.id} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>{action.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links to Agent-Created Artifacts */}
            {weeklyGoal.status === 'waiting_user' && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="text-sm font-semibold">Ready for You:</h4>
                <div className="flex gap-2">
                  {weeklyGoal.githubIssueUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={weeklyGoal.githubIssueUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Issue
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {weeklyGoal.githubPrUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={weeklyGoal.githubPrUrl} target="_blank" rel="noopener noreferrer">
                        <GitPullRequest className="h-4 w-4 mr-2" />
                        Review Draft PR
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
                <Button className="w-full mt-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Tasks - Agent's Full Plan */}
      {agentActive && tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Agent's Improvement Plan ({tasks.length} tasks)</CardTitle>
            <CardDescription>
              Prioritized by impact on your portfolio score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task, index) => (
              <div 
                key={task.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  task.status === 'completed' ? 'bg-green-50 dark:bg-green-950/20 border-green-200' :
                  task.status === 'agent_working' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 animate-pulse' :
                  task.status === 'waiting_user' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200' :
                  'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {index + 1}. {task.description}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {task.repoName}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {task.impact}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.estimatedTime}
                        </span>
                        <Badge variant="secondary" className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                          {task.priority}
                        </Badge>
                      </div>

                      {/* Show agent actions for this task */}
                      {task.agentActions.length > 0 && (
                        <div className="mt-3 pt-3 border-t space-y-1">
                          {task.agentActions.map(action => (
                            <div key={action.id} className="flex items-center gap-2 text-xs">
                              <Bot className="h-3 w-3 text-purple-600" />
                              <span className="text-muted-foreground">{action.description}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {task.status === 'waiting_user' && (
                    <div className="flex flex-col gap-1">
                      {task.githubIssueUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={task.githubIssueUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Agent Monitoring Status */}
      {agentActive && agentStatus === 'monitoring' && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
              Agent Monitoring Your Progress
            </CardTitle>
            <CardDescription>
              The agent checks your GitHub daily and adapts the plan based on your progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Next Check-in:</strong> Tomorrow at 9:00 AM
                <br />
                <span className="text-sm text-muted-foreground">
                  If you complete this week's goal, the agent will automatically generate your next task.
                  If no progress is made in 7 days, the agent will simplify the goal.
                </span>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-muted text-center">
                <div className="text-2xl font-bold">0/5</div>
                <div className="text-xs text-muted-foreground">Tasks Completed</div>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-muted-foreground">Days Active</div>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <div className="text-2xl font-bold">+5%</div>
                <div className="text-xs text-muted-foreground">Score Potential</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State - Before Agent Activated */}
      {!agentActive && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Activate Your Personal Portfolio Builder
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Unlike generic advice, this agent <strong>takes action</strong>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left mb-6">
              <div className="p-4 rounded-lg bg-muted">
                <GitBranch className="h-6 w-6 mb-2 text-blue-600" />
                <h4 className="font-semibold text-sm mb-1">Creates GitHub Issues</h4>
                <p className="text-xs text-muted-foreground">
                  Agent opens issues in your repos with specific action items
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <GitPullRequest className="h-6 w-6 mb-2 text-purple-600" />
                <h4 className="font-semibold text-sm mb-1">Generates Drafts</h4>
                <p className="text-xs text-muted-foreground">
                  Agent writes READMEs, tests, and opens PRs for you to review
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <RefreshCw className="h-6 w-6 mb-2 text-green-600" />
                <h4 className="font-semibold text-sm mb-1">Monitors & Adapts</h4>
                <p className="text-xs text-muted-foreground">
                  Agent checks your progress daily and adjusts the plan
                </p>
              </div>
            </div>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600"
              onClick={startAgentLoop}
            >
              <Play className="h-5 w-5 mr-2" />
              Start Agent
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

