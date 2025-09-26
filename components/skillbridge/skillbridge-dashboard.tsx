"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  BarChart3, 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  MessageSquare,
  Github,
  Settings,
  FileText
} from "lucide-react";

// Import existing components
import ChatAssistant from "@/components/chat/chat-assistant";
import { SanitizerDemo } from "@/components/sanitizer/sanitizer-demo";
import { SkillAssessmentForm } from "./skill-assessment-form";
import { GitHubAnalysisComponent } from "./github-analysis";
import { AutomaticGapAnalysis } from "./automatic-gap-analysis";

// Import new showcase components
import { AgentShowcase } from "./agent-showcase";
import { MultiAgentWorkflow, WORKFLOW_EXAMPLES } from "./multi-agent-workflow";
import { AgentComparison, AGENT_COMPARISON_DATA } from "./agent-comparison";
import { PDFResources } from "./pdf-resources";

export default function SkillBridgeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold">SkillBridge</h1>
                  <p className="text-sm text-muted-foreground">
                    Discover what you don't know
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Sanitized</span>
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href="/demo">
                  <Shield className="h-4 w-4 mr-2" />
                  Demo
                </a>
              </Button>
              <Button variant="outline" size="sm">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="gaps" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Skill Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Learning Paths</span>
            </TabsTrigger>
            <TabsTrigger value="career" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Career</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Resources</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Assistant</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                The Unknown Unknowns of Your Career
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We all have blind spots in our skills. What if you could discover the gaps you never knew existed? 
                SkillBridge analyzes your work to reveal hidden opportunities for growth.
              </p>
              <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Secure Analysis</span>
                </span>
                <span className="flex items-center space-x-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>GitHub Integration</span>
                </span>
                <span className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Personalized Learning</span>
                </span>
              </div>
            </div>

            {/* System Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Features</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">
                    Core capabilities for career development
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Analysis Tools</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">
                    Automated skill and career analysis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Capabilities</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">25+</div>
                  <p className="text-xs text-muted-foreground">
                    Skills and technologies analyzed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">100%</div>
                  <p className="text-xs text-muted-foreground">
                    All data automatically protected
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Feature Showcases */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Core Features</h2>
                <p className="text-muted-foreground">
                  Powerful tools to accelerate your career development
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AgentShowcase
                  agentType="sanitizer"
                  title="Data Protection"
                  description="Keeps your sensitive information safe and secure"
                  icon={<Shield className="h-5 w-5" />}
                  status="active"
                  capabilities={[
                    "API Key Detection",
                    "Password Sanitization", 
                    "JWT Token Masking",
                    "Credit Card Protection",
                    "Email Address Masking",
                    "GitHub URL Preservation"
                  ]}
                  useCases={[
                    "Input validation before processing",
                    "Protecting user privacy",
                    "Compliance with data regulations",
                    "Safe data sharing and storage"
                  ]}
                  demoComponent={<SanitizerDemo />}
                />

                <AgentShowcase
                  agentType="gap_analyzer"
                  title="Skill Analysis"
                  description="Automatically analyze your skills and identify growth opportunities"
                  icon={<BarChart3 className="h-5 w-5" />}
                  status="active"
                  capabilities={[
                    "GitHub Repository Analysis",
                    "Automatic Skill Inference",
                    "Technology Detection",
                    "Gap Identification",
                    "Visual Skill Charts",
                    "Personalized Recommendations"
                  ]}
                  useCases={[
                    "Analyze your GitHub repositories",
                    "Identify skill gaps automatically",
                    "Get personalized learning recommendations",
                    "Track skill development progress"
                  ]}
                  demoComponent={<AutomaticGapAnalysis />}
                />

                <AgentShowcase
                  agentType="learning"
                  title="Learning Paths"
                  description="Personalized learning recommendations tailored to your goals"
                  icon={<BookOpen className="h-5 w-5" />}
                  status="ready"
                  capabilities={[
                    "Learning Path Generation",
                    "Resource Recommendations",
                    "Progress Tracking",
                    "Skill-based Modules",
                    "Adaptive Learning",
                    "Milestone Setting"
                  ]}
                  useCases={[
                    "Generate personalized learning plans",
                    "Recommend relevant resources",
                    "Track learning progress",
                    "Adapt to your learning style"
                  ]}
                />

                <AgentShowcase
                  agentType="career"
                  title="Career Guidance"
                  description="Expert advice for advancing your professional journey"
                  icon={<Briefcase className="h-5 w-5" />}
                  status="ready"
                  capabilities={[
                    "Resume Analysis",
                    "Job Matching",
                    "Career Path Planning",
                    "Skill Requirements",
                    "Market Analysis",
                    "Interview Preparation"
                  ]}
                  useCases={[
                    "Analyze your resume and skills",
                    "Find matching job opportunities",
                    "Plan your career progression",
                    "Prepare for interviews"
                  ]}
                />
              </div>
            </div>

            {/* Workflow Demonstrations */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">How It Works</h2>
                <p className="text-muted-foreground">
                  Watch the magic happen as our system analyzes your work and reveals hidden opportunities
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MultiAgentWorkflow
                  title={WORKFLOW_EXAMPLES.skillAnalysis.title}
                  description={WORKFLOW_EXAMPLES.skillAnalysis.description}
                  steps={WORKFLOW_EXAMPLES.skillAnalysis.steps}
                />

                <MultiAgentWorkflow
                  title={WORKFLOW_EXAMPLES.careerDevelopment.title}
                  description={WORKFLOW_EXAMPLES.careerDevelopment.description}
                  steps={WORKFLOW_EXAMPLES.careerDevelopment.steps}
                />
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-4 py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="text-2xl font-bold">Ready to Discover What You Don't Know?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stop guessing about your skills. Let SkillBridge analyze your work and reveal the hidden opportunities 
                that could accelerate your career.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  size="lg" 
                  onClick={() => setActiveTab('gaps')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analyze My Skills
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Ask Questions
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Skill Analysis Tab */}
          <TabsContent value="gaps" className="space-y-6">
            <AutomaticGapAnalysis />
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📚 Learning Paths</CardTitle>
                <CardDescription>
                  Personalized learning modules and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Learning Paths Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature will provide personalized learning paths based on your skill gaps.
                  </p>
                  <Button disabled>Generate Learning Path</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>💼 Career Development</CardTitle>
                <CardDescription>
                  Resume generation, skill badges, and OSS opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Career Tools Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature will help you build your professional profile and find opportunities.
                  </p>
                  <Button disabled>Generate Resume</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📈 Progress Tracking</CardTitle>
                <CardDescription>
                  Track your learning progress and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Progress Analytics Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature will provide detailed progress tracking and analytics.
                  </p>
                  <Button disabled>View Progress</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <PDFResources />
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>💬 Multi-Agent Chat</CardTitle>
                <CardDescription>
                  Chat with our AI agents - all input is automatically sanitized for security
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <div className="h-full">
                  <ChatAssistant />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
