"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, BarChart3, BookOpen, Briefcase, TrendingUp, MessageSquare, Github, Settings } from "lucide-react";

// Import existing components
import ChatAssistant from "@/components/chat/chat-assistant";
import { AutomaticGapAnalysis } from "./automatic-gap-analysis";

export default function SkillBridgeDashboard() {
  const [activeTab, setActiveTab] = useState("chat");

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
        <section className="space-y-6 py-8 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            The Unknown Unknowns of Your Career
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            SkillBridge analyzes your work to surface hidden skill gaps, curated learning paths, and actionable guidance so you can focus on the next best step in your career.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Secure, privacy-aware workflows</span>
            </span>
            <span className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Automatic skill gap analysis</span>
            </span>
            <span className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Knowledge-backed recommendations</span>
            </span>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Assistant</span>
            </TabsTrigger>
          </TabsList>

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

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>💬 Multi-Agent Chat</CardTitle>
                <CardDescription>
                  Chat with the SkillBridge AI assistant backed by multi-agent routing and knowledge base retrieval
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
