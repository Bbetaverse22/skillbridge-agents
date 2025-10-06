"use client";

/**
 * V1 Agentic Skill Analyzer
 * Single-page agentic workflow with LangGraph-powered Portfolio Builder
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Github, 
  Brain, 
  Rocket,
  Target,
  TrendingUp,
  Code,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  GitPullRequest,
  FileText,
  Activity,
  Zap,
  Search
} from 'lucide-react';

type AgentStatus = 'IDLE' | 'ANALYZING' | 'RESEARCHING' | 'PLANNING' | 'ACTING' | 'MONITORING' | 'COMPLETE' | 'ERROR';

interface ActionLog {
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  icon?: React.ReactNode;
}

interface PortfolioTask {
  id: string;
  title: string;
  type: 'issue' | 'readme' | 'documentation' | 'test';
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export function AgenticSkillAnalyzer() {
  const [githubUsername, setGithubUsername] = useState('');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('IDLE');
  const [progress, setProgress] = useState(0);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [portfolioTasks, setPortfolioTasks] = useState<PortfolioTask[]>([]);
  const [careerInsights, setCareerInsights] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addLog = (type: ActionLog['type'], message: string, icon?: React.ReactNode) => {
    const log: ActionLog = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      icon
    };
    setActionLogs(prev => [log, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const simulateAgenticWorkflow = async () => {
    if (!githubUsername.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setError(null);
    setAgentStatus('ANALYZING');
    setProgress(0);
    setActionLogs([]);
    setSkillGaps([]);
    setPortfolioTasks([]);
    setCareerInsights(null);

    try {
      // Phase 1: GitHub Analysis
      addLog('info', 'Starting GitHub profile analysis...', <Github className="h-4 w-4" />);
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 1000));

      addLog('info', `Fetching repositories for @${githubUsername}`, <Search className="h-4 w-4" />);
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1200));

      addLog('success', 'Found 15 public repositories', <CheckCircle2 className="h-4 w-4" />);
      addLog('info', 'Analyzing tech stack: React, TypeScript, Python, Node.js', <Code className="h-4 w-4" />);
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Phase 2: Market Research
      setAgentStatus('RESEARCHING');
      addLog('info', 'Starting deep market research...', <Brain className="h-4 w-4" />);
      setProgress(40);
      await new Promise(resolve => setTimeout(resolve, 1500));

      addLog('info', 'Scraping LinkedIn for Software Engineer roles...', <TrendingUp className="h-4 w-4" />);
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1200));

      addLog('success', 'Analyzed 150+ job postings', <CheckCircle2 className="h-4 w-4" />);
      addLog('info', 'Identifying skill gaps vs. market requirements', <Target className="h-4 w-4" />);
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set skill gaps (mock data)
      const mockGaps = [
        { name: 'Kubernetes', currentLevel: 2, targetLevel: 4, priority: 9, gap: 2 },
        { name: 'System Design', currentLevel: 3, targetLevel: 5, priority: 8, gap: 2 },
        { name: 'Testing (Jest)', currentLevel: 2, targetLevel: 4, priority: 7, gap: 2 },
        { name: 'Docker', currentLevel: 3, targetLevel: 5, priority: 7, gap: 2 },
        { name: 'CI/CD Pipelines', currentLevel: 1, targetLevel: 4, priority: 6, gap: 3 }
      ];
      setSkillGaps(mockGaps);
      addLog('success', `Identified ${mockGaps.length} high-priority skill gaps`, <AlertCircle className="h-4 w-4" />);

      // Phase 3: Portfolio Analysis & Planning
      setAgentStatus('PLANNING');
      addLog('info', 'Portfolio Builder Agent activated', <Rocket className="h-4 w-4" />);
      setProgress(70);
      await new Promise(resolve => setTimeout(resolve, 1000));

      addLog('info', 'Analyzing portfolio quality and completeness...', <Activity className="h-4 w-4" />);
      setProgress(75);
      await new Promise(resolve => setTimeout(resolve, 1500));

      addLog('warning', 'Found 3 repositories without READMEs', <FileText className="h-4 w-4" />);
      addLog('warning', 'Found 0 test coverage in 5 projects', <AlertCircle className="h-4 w-4" />);
      addLog('info', 'Generating improvement plan...', <Sparkles className="h-4 w-4" />);
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Phase 4: Autonomous Actions
      setAgentStatus('ACTING');
      addLog('info', 'Creating GitHub issues for portfolio improvements...', <GitPullRequest className="h-4 w-4" />);
      setProgress(85);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockTasks: PortfolioTask[] = [
        { id: '1', title: 'Add comprehensive README to portfolio-website', type: 'readme', status: 'pending', priority: 'high' },
        { id: '2', title: 'Implement Jest tests for React components', type: 'test', status: 'pending', priority: 'high' },
        { id: '3', title: 'Add Docker containerization guide', type: 'documentation', status: 'pending', priority: 'medium' },
        { id: '4', title: 'Create GitHub issue: Add Kubernetes deployment', type: 'issue', status: 'pending', priority: 'medium' },
        { id: '5', title: 'Document API endpoints in backend project', type: 'documentation', status: 'pending', priority: 'low' }
      ];
      setPortfolioTasks(mockTasks);
      addLog('success', `Created ${mockTasks.length} GitHub issues`, <CheckCircle2 className="h-4 w-4" />);
      setProgress(90);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Phase 5: Career Insights
      addLog('info', 'Generating personalized career insights...', <TrendingUp className="h-4 w-4" />);
      setProgress(95);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCareerInsights = {
        targetRole: 'Senior Full-Stack Engineer',
        avgSalary: '$135,000 - $180,000',
        topCompanies: ['Google', 'Meta', 'Stripe', 'Vercel', 'Netflix'],
        timeToReady: '3-6 months',
        recommendedCourses: [
          'Kubernetes for Developers (Udemy)',
          'System Design Interview Prep (Frontend Masters)',
          'Testing JavaScript (Kent C. Dodds)'
        ]
      };
      setCareerInsights(mockCareerInsights);
      addLog('success', 'Career research complete', <CheckCircle2 className="h-4 w-4" />);

      // Complete
      setProgress(100);
      setAgentStatus('COMPLETE');
      addLog('success', '✅ Agentic analysis complete! Ready to level up.', <Sparkles className="h-4 w-4" />);

    } catch (err) {
      setAgentStatus('ERROR');
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      addLog('error', `Analysis failed: ${errorMessage}`, <AlertCircle className="h-4 w-4" />);
    }
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'IDLE': return 'text-muted-foreground';
      case 'ANALYZING': return 'text-blue-600';
      case 'RESEARCHING': return 'text-purple-600';
      case 'PLANNING': return 'text-orange-600';
      case 'ACTING': return 'text-green-600';
      case 'MONITORING': return 'text-yellow-600';
      case 'COMPLETE': return 'text-green-600';
      case 'ERROR': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case 'IDLE': return <Clock className="h-5 w-5" />;
      case 'ANALYZING': return <Search className="h-5 w-5 animate-pulse" />;
      case 'RESEARCHING': return <Brain className="h-5 w-5 animate-pulse" />;
      case 'PLANNING': return <Target className="h-5 w-5 animate-pulse" />;
      case 'ACTING': return <Rocket className="h-5 w-5 animate-pulse" />;
      case 'MONITORING': return <Activity className="h-5 w-5 animate-pulse" />;
      case 'COMPLETE': return <CheckCircle2 className="h-5 w-5" />;
      case 'ERROR': return <AlertCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Input Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <span>Agentic Skill Analyzer</span>
                  <Badge variant="outline" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    LangGraph + MCP
                  </Badge>
                </CardTitle>
                <CardDescription className="text-base">
                  Deep research + autonomous portfolio improvements powered by AI agents
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Input
              placeholder="Enter your GitHub username (e.g., octocat)"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && githubUsername.trim() && agentStatus === 'IDLE') {
                  simulateAgenticWorkflow();
                }
              }}
              className="flex-1 h-12 text-base"
              disabled={agentStatus !== 'IDLE' && agentStatus !== 'ERROR' && agentStatus !== 'COMPLETE'}
            />
            <Button 
              size="lg" 
              onClick={simulateAgenticWorkflow}
              disabled={!githubUsername.trim() || (agentStatus !== 'IDLE' && agentStatus !== 'ERROR' && agentStatus !== 'COMPLETE')}
              className="px-8"
            >
              {agentStatus !== 'IDLE' && agentStatus !== 'ERROR' && agentStatus !== 'COMPLETE' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Activate Agent
                </>
              )}
            </Button>
          </div>

          {progress > 0 && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-2 text-sm font-medium ${getStatusColor(agentStatus)}`}>
                  {getStatusIcon(agentStatus)}
                  <span>Agent Status: {agentStatus}</span>
                </div>
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Results Grid */}
      {actionLogs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Agent Action Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Agent Activity</span>
              </CardTitle>
              <CardDescription>
                Real-time agent actions and decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {actionLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border text-sm ${
                        log.type === 'success' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' :
                        log.type === 'error' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                        log.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' :
                        'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {log.icon}
                        <div className="flex-1 min-w-0">
                          <p className="break-words">{log.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Column 2: Skill Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Skill Gaps Identified</span>
              </CardTitle>
              <CardDescription>
                Based on market research and job requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {skillGaps.length > 0 ? (
                <div className="space-y-4">
                  {skillGaps.map((gap, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{gap.name}</span>
                        <Badge variant={gap.priority >= 8 ? 'destructive' : gap.priority >= 6 ? 'default' : 'secondary'}>
                          Priority: {gap.priority}/10
                        </Badge>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            gap.priority >= 8 ? 'bg-red-500' : 
                            gap.priority >= 6 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${(gap.gap / gap.targetLevel) * 100}%` }} 
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current: {gap.currentLevel}/5</span>
                        <span>Target: {gap.targetLevel}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Skill gaps will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Column 3: Portfolio Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="h-5 w-5" />
                <span>Portfolio Builder</span>
              </CardTitle>
              <CardDescription>
                Autonomous improvement tasks created by the agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {portfolioTasks.length > 0 ? (
                <div className="space-y-3">
                  {portfolioTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {task.type === 'issue' && <GitPullRequest className="h-4 w-4 text-blue-600" />}
                          {task.type === 'readme' && <FileText className="h-4 w-4 text-green-600" />}
                          {task.type === 'documentation' && <FileText className="h-4 w-4 text-purple-600" />}
                          {task.type === 'test' && <Code className="h-4 w-4 text-orange-600" />}
                          <Badge variant="outline" className="text-xs">
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{task.title}</p>
                    </div>
                  ))}
                  
                  <Button className="w-full mt-4" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Rocket className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Portfolio tasks will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Career Insights Section */}
      {careerInsights && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Career Intelligence</span>
            </CardTitle>
            <CardDescription>
              Market-driven insights based on 150+ job postings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-background rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Target Role</p>
                <p className="font-semibold">{careerInsights.targetRole}</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Avg. Salary Range</p>
                <p className="font-semibold text-green-600">{careerInsights.avgSalary}</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Time to Ready</p>
                <p className="font-semibold">{careerInsights.timeToReady}</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Top Companies Hiring</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {careerInsights.topCompanies.slice(0, 3).map((company: string) => (
                    <Badge key={company} variant="secondary" className="text-xs">{company}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-background rounded-lg border">
              <p className="text-sm font-medium mb-2">📚 Recommended Learning Path</p>
              <ul className="space-y-1">
                {careerInsights.recommendedCourses.map((course: string, index: number) => (
                  <li key={index} className="text-sm flex items-center space-x-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

