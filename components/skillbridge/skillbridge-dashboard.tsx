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
  Settings
} from "lucide-react";

// Import existing components
import ChatAssistant from "@/components/chat/chat-assistant";
import { SanitizerDemo } from "@/components/sanitizer/sanitizer-demo";

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
                  <h1 className="text-2xl font-bold">SkillBridge Agents</h1>
                  <p className="text-sm text-muted-foreground">
                    Multi-Agent Framework for Career Development
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="gaps" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Skill Gaps</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Learning</span>
            </TabsTrigger>
            <TabsTrigger value="career" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Career</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">
                    Sanitizer, Coordinator, Gap, Learning, Career, Progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Secrets Sanitized</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    All user input is automatically sanitized
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Modules</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Personalized learning paths available
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Career Resources</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Resume, badges, and OSS opportunities
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🛡️ Security Sanitizer Agent</CardTitle>
                  <CardDescription>
                    Automatically detects and sanitizes secrets before processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Keys Detection</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Encryption Support</span>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audit Logging</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🤖 Multi-Agent System</CardTitle>
                  <CardDescription>
                    Specialized agents for different aspects of career development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Coordinator Agent</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Gap Analysis Agent</span>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Learning Agent</span>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Career Agent</span>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Progress Agent</span>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Skill Gaps Tab */}
          <TabsContent value="gaps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Skill Gap Analysis</CardTitle>
                <CardDescription>
                  Analyze your current skills vs target role requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Skill Gap Analysis Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature will provide detailed skill gap analysis with radar charts and recommendations.
                  </p>
                  <Button disabled>Analyze Skills</Button>
                </div>
              </CardContent>
            </Card>
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
