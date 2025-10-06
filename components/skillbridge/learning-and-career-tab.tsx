import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Briefcase, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  BookOpen,
  Target,
  Zap,
  Award,
  ExternalLink,
  Play
} from 'lucide-react';

// Types
interface CareerPath {
  id: string;
  title: string;
  emoji: string;
  matchScore: number;
  salaryRange: string;
  timeline: string;
  skillsYouHave: string[];
  skillsYouNeed: string[];
  demandLevel: 'high' | 'medium' | 'low';
  description: string;
}

interface LearningPhase {
  month: string;
  title: string;
  skills: string[];
  resources: { name: string; url: string; type: string }[];
  milestone: string;
  completed?: boolean;
}

interface LearningAndCareerTabProps {
  currentSkills?: string[];
  targetRole?: string;
}

export function LearningAndCareerTab({ currentSkills = [], targetRole }: LearningAndCareerTabProps) {
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [learningRoadmap, setLearningRoadmap] = useState<LearningPhase[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Generate career paths based on current skills
  useEffect(() => {
    generateCareerPaths();
  }, [currentSkills]);

  const generateCareerPaths = () => {
    // Mock career path generation (will be replaced with LangGraph agent)
    const paths: CareerPath[] = [
      {
        id: 'frontend',
        title: 'Senior Frontend Developer',
        emoji: '📱',
        matchScore: 82,
        salaryRange: '$85K - $110K',
        timeline: '5 months',
        skillsYouHave: currentSkills.filter(s => 
          ['React', 'JavaScript', 'CSS', 'HTML', 'Git'].includes(s)
        ),
        skillsYouNeed: ['TypeScript', 'Testing', 'Performance Optimization'],
        demandLevel: 'high',
        description: 'Build interactive user interfaces with modern frameworks'
      },
      {
        id: 'fullstack',
        title: 'Full-Stack Developer',
        emoji: '💻',
        matchScore: 68,
        salaryRange: '$95K - $135K',
        timeline: '9 months',
        skillsYouHave: currentSkills.filter(s => 
          ['React', 'JavaScript', 'Git'].includes(s)
        ),
        skillsYouNeed: ['Node.js', 'SQL', 'APIs', 'Docker', 'TypeScript'],
        demandLevel: 'high',
        description: 'Master both frontend and backend development'
      },
      {
        id: 'uiux',
        title: 'UI/UX Engineer',
        emoji: '🎨',
        matchScore: 55,
        salaryRange: '$80K - $105K',
        timeline: '7 months',
        skillsYouHave: currentSkills.filter(s => 
          ['React', 'CSS', 'HTML'].includes(s)
        ),
        skillsYouNeed: ['Figma', 'Design Systems', 'Accessibility', 'Animation'],
        demandLevel: 'medium',
        description: 'Bridge design and development with technical expertise'
      },
      {
        id: 'cloud',
        title: 'Cloud Frontend Developer',
        emoji: '☁️',
        matchScore: 60,
        salaryRange: '$90K - $120K',
        timeline: '8 months',
        skillsYouHave: currentSkills.filter(s => 
          ['React', 'JavaScript', 'Git'].includes(s)
        ),
        skillsYouNeed: ['AWS', 'CI/CD', 'Serverless', 'TypeScript'],
        demandLevel: 'high',
        description: 'Build scalable cloud-native applications'
      }
    ];

    // Sort by match score
    paths.sort((a, b) => b.matchScore - a.matchScore);
    setCareerPaths(paths.slice(0, 3)); // Show top 3
  };

  const generateLearningRoadmap = (path: CareerPath) => {
    setIsSimulating(true);

    // Mock roadmap generation (will be replaced with LangGraph agent)
    setTimeout(() => {
      const roadmaps: Record<string, LearningPhase[]> = {
        frontend: [
          {
            month: 'Month 1-2',
            title: 'TypeScript Mastery',
            skills: ['TypeScript Fundamentals', 'Generics & Advanced Types', 'React + TypeScript'],
            resources: [
              { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', type: 'Official Docs' },
              { name: 'Execute Program: TypeScript', url: 'https://executeprogram.com', type: 'Interactive Course' },
            ],
            milestone: 'Build a typed React application',
          },
          {
            month: 'Month 3-4',
            title: 'Advanced React Patterns',
            skills: ['Custom Hooks', 'Context & State Management', 'Performance Optimization'],
            resources: [
              { name: 'React Patterns', url: 'https://patterns.dev', type: 'Guide' },
              { name: 'Epic React', url: 'https://epicreact.dev', type: 'Course' },
            ],
            milestone: 'Optimize a complex React app',
          },
          {
            month: 'Month 5',
            title: 'Testing & Portfolio',
            skills: ['Jest', 'React Testing Library', 'E2E Testing'],
            resources: [
              { name: 'Testing Library Docs', url: 'https://testing-library.com', type: 'Official Docs' },
              { name: 'Build a Portfolio', url: '#', type: 'Project' },
            ],
            milestone: 'Complete portfolio with tests',
          }
        ],
        fullstack: [
          {
            month: 'Month 1-3',
            title: 'Backend Fundamentals',
            skills: ['Node.js & Express', 'REST APIs', 'Authentication'],
            resources: [
              { name: 'The Odin Project: Node.js', url: 'https://theodinproject.com', type: 'Course' },
              { name: 'Node.js Best Practices', url: 'https://github.com/goldbergyoni/nodebestpractices', type: 'Guide' },
            ],
            milestone: 'Build a CRUD API with auth',
          },
          {
            month: 'Month 4-6',
            title: 'Database & TypeScript',
            skills: ['SQL', 'PostgreSQL', 'TypeScript', 'ORMs'],
            resources: [
              { name: 'SQL for Developers', url: 'https://sqlfordevs.com', type: 'Tutorial' },
              { name: 'Prisma Docs', url: 'https://prisma.io', type: 'Official Docs' },
            ],
            milestone: 'Full-stack app with database',
          },
          {
            month: 'Month 7-9',
            title: 'Deployment & DevOps',
            skills: ['Docker', 'CI/CD', 'AWS/Vercel', 'Monitoring'],
            resources: [
              { name: 'Docker for Beginners', url: 'https://docker-curriculum.com', type: 'Tutorial' },
              { name: 'Deploy to AWS', url: 'https://aws.amazon.com/getting-started/', type: 'Guide' },
            ],
            milestone: 'Deploy full-stack app to production',
          }
        ],
        uiux: [
          {
            month: 'Month 1-3',
            title: 'Design Tools & Systems',
            skills: ['Figma', 'Design Systems', 'Component Libraries'],
            resources: [
              { name: 'Figma for Developers', url: 'https://figma.com/resources', type: 'Course' },
              { name: 'Design Systems Handbook', url: 'https://designsystemsrepo.com', type: 'Guide' },
            ],
            milestone: 'Build a component library',
          },
          {
            month: 'Month 4-5',
            title: 'Accessibility & Animation',
            skills: ['WCAG', 'ARIA', 'Framer Motion', 'CSS Animations'],
            resources: [
              { name: 'Web Accessibility', url: 'https://web.dev/accessibility', type: 'Guide' },
              { name: 'Framer Motion Docs', url: 'https://framer.com/motion', type: 'Official Docs' },
            ],
            milestone: 'Accessible animated UI',
          },
          {
            month: 'Month 6-7',
            title: 'Portfolio & Case Studies',
            skills: ['UX Writing', 'Case Studies', 'Portfolio Design'],
            resources: [
              { name: 'Portfolio Tips', url: '#', type: 'Article' },
              { name: 'UX Writing Guide', url: '#', type: 'Guide' },
            ],
            milestone: 'Complete UX portfolio',
          }
        ],
        cloud: [
          {
            month: 'Month 1-3',
            title: 'TypeScript & APIs',
            skills: ['TypeScript', 'REST APIs', 'GraphQL'],
            resources: [
              { name: 'TypeScript Deep Dive', url: 'https://basarat.gitbook.io/typescript', type: 'Book' },
              { name: 'GraphQL Tutorial', url: 'https://howtographql.com', type: 'Tutorial' },
            ],
            milestone: 'Build a GraphQL API',
          },
          {
            month: 'Month 4-6',
            title: 'AWS & Serverless',
            skills: ['AWS Lambda', 'S3', 'CloudFront', 'DynamoDB'],
            resources: [
              { name: 'AWS for Frontend', url: 'https://aws.amazon.com/amplify/', type: 'Guide' },
              { name: 'Serverless Framework', url: 'https://serverless.com', type: 'Official Docs' },
            ],
            milestone: 'Deploy serverless app',
          },
          {
            month: 'Month 7-8',
            title: 'CI/CD & Monitoring',
            skills: ['GitHub Actions', 'CloudWatch', 'Monitoring'],
            resources: [
              { name: 'GitHub Actions', url: 'https://docs.github.com/actions', type: 'Official Docs' },
              { name: 'AWS Monitoring', url: '#', type: 'Guide' },
            ],
            milestone: 'Automated deployment pipeline',
          }
        ]
      };

      setLearningRoadmap(roadmaps[path.id] || []);
      setIsSimulating(false);
    }, 800);
  };

  const handleSelectPath = (path: CareerPath) => {
    setSelectedPath(path);
    generateLearningRoadmap(path);
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Career Path Simulator */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">🦋 Career Path Simulator</CardTitle>
                <CardDescription className="text-base">
                  Small skills → Big outcomes. See where you can go based on your current skills.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Profile */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Your Current Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {currentSkills.length > 0 ? (
                    currentSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Complete a skill analysis to see personalized paths
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Career Path Cards */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Your Simulated Career Paths
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {careerPaths.map((path) => (
                <Card 
                  key={path.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    selectedPath?.id === path.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectPath(path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{path.emoji}</span>
                      <Badge className={getDemandColor(path.demandLevel)}>
                        {path.demandLevel === 'high' ? 'High Demand' : 
                         path.demandLevel === 'medium' ? 'Good Demand' : 'Low Demand'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Match Score */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Match Score</span>
                        <span className={`font-bold ${getMatchColor(path.matchScore)}`}>
                          {path.matchScore}%
                        </span>
                      </div>
                      <Progress value={path.matchScore} className="h-2" />
                    </div>

                    {/* Salary & Timeline */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        <span>{path.salaryRange}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{path.timeline}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <div className="text-xs">
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {path.skillsYouHave.length} skills you have
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-yellow-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {path.skillsYouNeed.length} skills to learn
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button 
                      size="sm" 
                      className="w-full"
                      variant={selectedPath?.id === path.id ? 'default' : 'outline'}
                    >
                      {selectedPath?.id === path.id ? 'Selected' : 'Explore Path'} →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          {careerPaths.length > 0 && (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                <strong>💡 AI Insight:</strong> Based on your skills, the{' '}
                <strong>{careerPaths[0].title}</strong> path has the highest match score ({careerPaths[0].matchScore}%) 
                and can be achieved in just {careerPaths[0].timeline}. 
                {careerPaths.length > 1 && ` The ${careerPaths[1].title} path offers higher salary but takes longer.`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Learning Roadmap - Only shows when a path is selected */}
      {selectedPath && (
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    📚 Your Learning Roadmap: {selectedPath.emoji} {selectedPath.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    Timeline: <strong>{selectedPath.timeline}</strong> | 
                    Skills to Learn: <strong>{selectedPath.skillsYouNeed.length}</strong> | 
                    Success Rate: <strong className={getMatchColor(selectedPath.matchScore)}>
                      {selectedPath.matchScore}%
                    </strong>
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSimulating ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Generating personalized roadmap...</p>
              </div>
            ) : (
              <>
                {/* Learning Phases */}
                <div className="space-y-6">
                  {learningRoadmap.map((phase, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <span className="text-2xl">{index + 1}</span>
                              {phase.month}: {phase.title}
                            </CardTitle>
                          </div>
                          <Badge variant={phase.completed ? 'default' : 'outline'}>
                            {phase.completed ? 'Completed' : 'Upcoming'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Skills to Learn */}
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                            <Zap className="h-4 w-4 text-yellow-600" />
                            Skills to Learn
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            Recommended Resources
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {phase.resources.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 rounded-md bg-background hover:bg-accent transition-colors text-sm"
                              >
                                <div className="flex items-center gap-2">
                                  <Play className="h-3 w-3 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium">{resource.name}</div>
                                    <div className="text-xs text-muted-foreground">{resource.type}</div>
                                  </div>
                                </div>
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Milestone */}
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 text-green-900 dark:text-green-100">
                            <Award className="h-4 w-4" />
                            <span className="text-sm font-semibold">Milestone:</span>
                            <span className="text-sm">{phase.milestone}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Start Learning Path
                  </Button>
                  <Button size="lg" variant="outline">
                    Adjust Timeline
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedPath && careerPaths.length > 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Career Path</h3>
            <p className="text-muted-foreground">
              Click on any career path above to see your personalized learning roadmap.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

