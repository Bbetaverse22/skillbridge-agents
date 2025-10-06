"use client";

import { Button } from "@/components/ui/button";
import { Brain, Github, Sparkles, TrendingUp } from "lucide-react";
import { AgenticSkillAnalyzer } from "./agentic-skill-analyzer";

export default function SkillBridgeDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold">SkillBridge</h1>
                  <p className="text-xs text-muted-foreground">
                    Research + Action with LangGraph & MCP
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/Bbetaverse22/skillbridge-agents" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <Github className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="space-y-6 py-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">V1 Capstone Project</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Agentic Career Development
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Unlike traditional AI that just generates reports, SkillBridge <span className="font-semibold text-foreground">takes action</span>.
            Deep market research + autonomous portfolio improvements powered by LangGraph agents.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span>LangGraph Workflows</span>
            </span>
            <span className="flex items-center space-x-2">
              <Github className="h-4 w-4 text-blue-600" />
              <span>GitHub MCP Integration</span>
            </span>
            <span className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Real-time Market Research</span>
            </span>
          </div>
        </section>

        {/* V1 Main Component */}
        <AgenticSkillAnalyzer />
      </main>
    </div>
  );
}
