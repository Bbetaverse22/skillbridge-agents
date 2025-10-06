"use client";

import { Button } from "@/components/ui/button";
import { Brain, Github, Sparkles, Menu, X } from "lucide-react";
import { AgenticSkillAnalyzer } from "./agentic-skill-analyzer";
import { useState } from "react";

export default function SkillBridgeDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header with Navigation */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SkillBridge</h1>
                <p className="text-xs text-blue-300">
                  Agentic Career Platform
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Demo
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <a 
                href="https://github.com/Bbetaverse22/skillbridge-agents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/10"
              >
                Log In
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Sign Up Free
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/10 pt-4">
              <button 
                onClick={() => scrollToSection('demo')}
                className="block w-full text-left text-sm text-gray-300 hover:text-white py-2"
              >
                Demo
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left text-sm text-gray-300 hover:text-white py-2"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-sm text-gray-300 hover:text-white py-2"
              >
                Features
              </button>
              <a 
                href="https://github.com/Bbetaverse22/skillbridge-agents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-left text-sm text-gray-300 hover:text-white py-2"
              >
                GitHub
              </a>
              <div className="pt-3 space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Log In
                </Button>
                <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  Sign Up Free
                </Button>
              </div>
            </div>
          )}
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
