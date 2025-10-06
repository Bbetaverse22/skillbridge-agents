"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, BarChart3, TrendingUp, MessageSquare, Github, Settings, Bot } from "lucide-react";

// Import existing components
import ChatAssistant from "@/components/chat/chat-assistant";
import { RedesignedSkillAssessment } from "./redesigned-skill-assessment";
import { LearningAndCareerTab } from "./learning-and-career-tab";
import { PortfolioBuilderTab } from "./portfolio-builder-tab";

export default function SkillBridgeDashboard() {
  const [activeTab, setActiveTab] = useState("chat");
  const [assessedSkills, setAssessedSkills] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState<string>("Full-Stack Developer");

  // Callback to receive skills from assessment
  const handleSkillsAssessed = (skills: string[], role?: string) => {
    console.log('📊 Skills assessed:', skills);
    setAssessedSkills(skills);
    if (role) setTargetRole(role);
    // Don't auto-navigate - let user see results first!
  };

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
              <Button variant="outline" size="sm" asChild>
                <a href="/github-demo">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub Demo
                </a>
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
              <TrendingUp className="h-4 w-4" />
              <span>AI-powered career simulation</span>
            </span>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gaps" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Skill Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio-builder" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>Portfolio Builder 🤖</span>
            </TabsTrigger>
            <TabsTrigger value="learning-career" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Learning & Career</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Assistant</span>
            </TabsTrigger>
          </TabsList>

          {/* Skill Analysis Tab */}
          <TabsContent value="gaps" className="space-y-6">
            <RedesignedSkillAssessment 
              onNavigateToLearning={() => setActiveTab('learning-career')}
              onSkillsAssessed={handleSkillsAssessed}
            />
          </TabsContent>

          {/* Portfolio Builder Tab - AGENTIC */}
          <TabsContent value="portfolio-builder" className="space-y-6">
            <PortfolioBuilderTab githubUsername="your-username" />
          </TabsContent>

          {/* Learning & Career Tab */}
          <TabsContent value="learning-career" className="space-y-6">
            <LearningAndCareerTab 
              currentSkills={assessedSkills} 
              targetRole={targetRole}
            />
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
                  <ChatAssistant activeTab={activeTab} onSuggestTab={setActiveTab} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
