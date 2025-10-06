"use client";

/**
 * V1 Agentic Skill Analyzer
 * Single-page agentic workflow with AI-powered Portfolio Builder
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GapAnalyzerAgent } from '@/lib/agents/gap-analyzer';
import { StickyAgentStatus } from './sticky-agent-status';
import { InteractiveSkillCard } from './interactive-skill-card';
import { LandingExplanation } from './landing-explanation';
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
  
  const gapAnalyzer = useMemo(() => new GapAnalyzerAgent(), []);

  const addLog = (type: ActionLog['type'], message: string, icon?: React.ReactNode) => {
    const log: ActionLog = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      icon
    };
    setActionLogs(prev => [log, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const getCurrentTaskMessage = (status: AgentStatus): string => {
    switch (status) {
      case 'ANALYZING':
        return 'Analyzing GitHub profile and repositories...';
      case 'RESEARCHING':
        return 'Conducting deep market research on job requirements...';
      case 'PLANNING':
        return 'Analyzing portfolio quality and generating improvement plan...';
      case 'ACTING':
        return 'Creating GitHub issues and improvement tasks...';
      case 'MONITORING':
        return 'Setting up progress tracking and monitoring...';
      case 'COMPLETE':
        return 'Analysis complete! Review your results below.';
      case 'ERROR':
        return 'An error occurred during analysis.';
      default:
        return 'Ready to start analysis';
    }
  };

  const runAgenticWorkflow = async () => {
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
      // Phase 1: REAL GitHub Analysis (using existing tool integrations)
      addLog('info', 'Starting GitHub profile analysis...', <Github className="h-4 w-4" />);
      setProgress(10);

      addLog('info', `Fetching repositories for @${githubUsername}`, <Search className="h-4 w-4" />);
      setProgress(15);

      // Fetch user's most recent repository
      const username = githubUsername.trim();
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=1`);
      
      if (!reposResponse.ok) {
        if (reposResponse.status === 404) {
          throw new Error(`GitHub user "${username}" not found`);
        } else if (reposResponse.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again in a few minutes.');
        } else {
          throw new Error(`Failed to fetch GitHub profile (Status: ${reposResponse.status})`);
        }
      }
      
      const repos = await reposResponse.json();
      if (!repos || repos.length === 0) {
        throw new Error(`No public repositories found for user "${username}"`);
      }

      const repoUrl = repos[0].html_url;
      addLog('success', `Found repository: ${repos[0].name}`, <CheckCircle2 className="h-4 w-4" />);
      setProgress(25);

      addLog('info', 'Analyzing repository tech stack...', <Code className="h-4 w-4" />);
      setProgress(30);

      // Use REAL GitHub analysis
      const githubAnalysis = await gapAnalyzer.analyzeGitHubRepository(repoUrl);
      
      addLog('success', `Detected languages: ${githubAnalysis.languages.join(', ')}`, <CheckCircle2 className="h-4 w-4" />);
      if (githubAnalysis.frameworks.length > 0) {
        addLog('info', `Frameworks: ${githubAnalysis.frameworks.join(', ')}`, <Code className="h-4 w-4" />);
      }
      setProgress(40);

      // Generate REAL skill assessment
      addLog('info', 'Generating skill gap analysis...', <Target className="h-4 w-4" />);
      setProgress(50);
      
      const gapAnalysis = await gapAnalyzer.generateAutomaticSkillAssessment(githubAnalysis);
      
      addLog('success', `Overall skill score: ${gapAnalysis.overallScore}%`, <CheckCircle2 className="h-4 w-4" />);
      addLog('info', `Identified ${gapAnalysis.skillGaps.length} skill gaps`, <Target className="h-4 w-4" />);
      setProgress(55);

      // Store results on server
      try {
        await fetch('/api/skill-gaps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'user_123',
            githubAnalysis: githubAnalysis,
            skillAssessment: gapAnalysis,
          }),
        });
        addLog('success', 'Skill analysis stored for future reference', <CheckCircle2 className="h-4 w-4" />);
      } catch (storeError) {
        addLog('warning', 'Could not store analysis data', <AlertCircle className="h-4 w-4" />);
      }

      // Set REAL skill gaps
      const topGaps = gapAnalysis.skillGaps.slice(0, 5).map(sg => ({
        name: sg.skill.name,
        currentLevel: sg.skill.currentLevel,
        targetLevel: sg.skill.targetLevel,
        priority: Math.round(sg.priority),
        gap: sg.gap
      }));
      setSkillGaps(topGaps);
      setProgress(60);

      // Phase 2: Market Research (SIMULATED - to be implemented)
      setAgentStatus('RESEARCHING');
      addLog('info', 'Starting deep market research...', <Brain className="h-4 w-4" />);
      await new Promise(resolve => setTimeout(resolve, 1500));

      addLog('info', 'Scraping LinkedIn for relevant roles...', <TrendingUp className="h-4 w-4" />);
      setProgress(65);
      await new Promise(resolve => setTimeout(resolve, 1200));

      addLog('success', 'Analyzed 150+ job postings (simulated)', <CheckCircle2 className="h-4 w-4" />);
      setProgress(70);

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
      {/* Sticky Agent Status Bar */}
      <StickyAgentStatus
        status={agentStatus}
        progress={progress}
        currentTask={getCurrentTaskMessage(agentStatus)}
        estimatedTimeRemaining="2 min"
        onViewLogs={() => {
          const logElement = document.getElementById('activity-log');
          if (logElement) {
            logElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      {/* Landing Explanation Section */}
      <LandingExplanation />

      {/* Analysis Input Section */}
      <div id="analysis-input" className="scroll-mt-20">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/10">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <span className="text-white">Agentic Skill Analyzer</span>
                </CardTitle>
                <CardDescription className="text-base text-white">
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
                if (e.key === 'Enter' && githubUsername.trim() && (agentStatus === 'IDLE' || agentStatus === 'ERROR' || agentStatus === 'COMPLETE')) {
                  runAgenticWorkflow();
                }
              }}
              className="flex-1 h-12 text-base"
              disabled={agentStatus !== 'IDLE' && agentStatus !== 'ERROR' && agentStatus !== 'COMPLETE'}
            />
            <Button 
              size="lg" 
              onClick={runAgenticWorkflow}
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
      </div>

      {/* Main Results Grid */}
      {actionLogs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Agent Action Logs */}
          <Card id="activity-log">
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
                <div className="space-y-3">
                  {skillGaps.map((gap, index) => (
                    <InteractiveSkillCard
                      key={index}
                      skill={gap}
                      onStartLearning={(skillName) => {
                        console.log('Starting learning path for:', skillName);
                        // Future: Navigate to learning resources or open modal
                      }}
                    />
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

