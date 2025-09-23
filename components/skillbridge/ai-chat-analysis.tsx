"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Code,
  Lightbulb,
  FileText,
  X
} from 'lucide-react';

interface AIChatAnalysisProps {
  onAnalysisComplete: (analysis: any) => void;
  onAnalysisStart: () => void;
  isAnalyzing?: boolean;
}

export function AIChatAnalysis({ 
  onAnalysisComplete, 
  onAnalysisStart, 
  isAnalyzing = false 
}: AIChatAnalysisProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/plain' && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
        setError('Please select a text file (.txt or .md)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileContent('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!fileContent.trim()) {
      setError('Please select a file to analyze');
      return;
    }

    setError(null);
    setIsProcessing(true);
    onAnalysisStart();

    try {
      // Simulate AI chat analysis
      const analysis = await analyzeAIChatText(fileContent);
      onAnalysisComplete(analysis);
    } catch (err) {
      setError('Failed to analyze AI chat file. Please try again.');
      console.error('AI chat analysis error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeAIChatText = async (text: string): Promise<any> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Extract AI assistant responses and user questions
    const { aiResponses, userQuestions } = extractChatParts(text);
    
    // Analyze questions to understand learning patterns
    const learningPatterns = analyzeLearningPatterns(userQuestions);
    const technologies = extractTechnologiesFromQuestions(userQuestions);
    const concepts = extractConceptsFromQuestions(userQuestions);
    const skillLevel = inferSkillLevelFromQuestions(userQuestions);
    const recommendations = generateQuestionBasedRecommendations(learningPatterns, technologies, concepts);

    return {
      source: 'ai_chat',
      technologies,
      concepts,
      skillLevel,
      recommendations,
      confidence: calculateConfidence(text),
      insights: generateQuestionBasedInsights(learningPatterns, userQuestions),
      learningPatterns,
      questionCount: userQuestions.length,
      responseCount: aiResponses.length
    };
  };

  const extractChatParts = (text: string): { aiResponses: string[], userQuestions: string[] } => {
    const lines = text.split('\n');
    const aiResponses: string[] = [];
    const userQuestions: string[] = [];
    
    let currentUserQuestion = '';
    let currentAIResponse = '';
    let isUserMessage = false;
    let isAIMessage = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Detect user messages (common patterns)
      if (trimmedLine.match(/^(User|You|Human|Me):/i) || 
          trimmedLine.match(/^Q\d*[:\-\.]/i) ||
          trimmedLine.match(/^Question/i) ||
          (trimmedLine.length > 0 && !trimmedLine.match(/^(Assistant|AI|Claude|ChatGPT|Bot|System):/i) && 
           !trimmedLine.match(/^A\d*[:\-\.]/i) && 
           !trimmedLine.match(/^Answer/i) &&
           !trimmedLine.match(/^```/) &&
           !trimmedLine.match(/^#/) &&
           !trimmedLine.match(/^##/))) {
        
        if (isAIMessage && currentAIResponse.trim()) {
          aiResponses.push(currentAIResponse.trim());
          currentAIResponse = '';
        }
        
        isUserMessage = true;
        isAIMessage = false;
        
        if (trimmedLine.match(/^(User|You|Human|Me):/i)) {
          currentUserQuestion += trimmedLine.replace(/^(User|You|Human|Me):\s*/i, '') + ' ';
        } else if (trimmedLine.match(/^Q\d*[:\-\.]/i)) {
          currentUserQuestion += trimmedLine.replace(/^Q\d*[:\-\.]\s*/i, '') + ' ';
        } else {
          currentUserQuestion += trimmedLine + ' ';
        }
      }
      // Detect AI messages
      else if (trimmedLine.match(/^(Assistant|AI|Claude|ChatGPT|Bot|System):/i) ||
               trimmedLine.match(/^A\d*[:\-\.]/i) ||
               trimmedLine.match(/^Answer/i)) {
        
        if (isUserMessage && currentUserQuestion.trim()) {
          userQuestions.push(currentUserQuestion.trim());
          currentUserQuestion = '';
        }
        
        isUserMessage = false;
        isAIMessage = true;
        
        if (trimmedLine.match(/^(Assistant|AI|Claude|ChatGPT|Bot|System):/i)) {
          currentAIResponse += trimmedLine.replace(/^(Assistant|AI|Claude|ChatGPT|Bot|System):\s*/i, '') + ' ';
        } else if (trimmedLine.match(/^A\d*[:\-\.]/i)) {
          currentAIResponse += trimmedLine.replace(/^A\d*[:\-\.]\s*/i, '') + ' ';
        } else {
          currentAIResponse += trimmedLine + ' ';
        }
      }
      // Continue current message
      else if (trimmedLine.length > 0) {
        if (isUserMessage) {
          currentUserQuestion += trimmedLine + ' ';
        } else if (isAIMessage) {
          currentAIResponse += trimmedLine + ' ';
        }
      }
    }
    
    // Add final messages
    if (currentUserQuestion.trim()) {
      userQuestions.push(currentUserQuestion.trim());
    }
    if (currentAIResponse.trim()) {
      aiResponses.push(currentAIResponse.trim());
    }
    
    return { aiResponses, userQuestions };
  };

  const analyzeLearningPatterns = (questions: string[]): any => {
    const patterns = {
      beginnerQuestions: 0,
      intermediateQuestions: 0,
      advancedQuestions: 0,
      debuggingQuestions: 0,
      architectureQuestions: 0,
      optimizationQuestions: 0,
      learningQuestions: 0,
      implementationQuestions: 0
    };
    
    questions.forEach(question => {
      const q = question.toLowerCase();
      
      // Beginner patterns
      if (q.includes('how to') || q.includes('what is') || q.includes('explain') || 
          q.includes('tutorial') || q.includes('beginner') || q.includes('basic')) {
        patterns.beginnerQuestions++;
      }
      
      // Intermediate patterns
      if (q.includes('how do i') || q.includes('can you help') || q.includes('example') ||
          q.includes('best practice') || q.includes('recommend')) {
        patterns.intermediateQuestions++;
      }
      
      // Advanced patterns
      if (q.includes('architecture') || q.includes('scalability') || q.includes('performance') ||
          q.includes('design pattern') || q.includes('enterprise') || q.includes('optimization')) {
        patterns.advancedQuestions++;
      }
      
      // Specific question types
      if (q.includes('error') || q.includes('bug') || q.includes('debug') || q.includes('fix')) {
        patterns.debuggingQuestions++;
      }
      if (q.includes('architecture') || q.includes('structure') || q.includes('design')) {
        patterns.architectureQuestions++;
      }
      if (q.includes('optimize') || q.includes('performance') || q.includes('faster')) {
        patterns.optimizationQuestions++;
      }
      if (q.includes('learn') || q.includes('study') || q.includes('understand')) {
        patterns.learningQuestions++;
      }
      if (q.includes('implement') || q.includes('build') || q.includes('create')) {
        patterns.implementationQuestions++;
      }
    });
    
    return patterns;
  };

  const extractTechnologiesFromQuestions = (questions: string[]): string[] => {
    const techPatterns = [
      /\b(React|Vue|Angular|Svelte)\b/gi,
      /\b(JavaScript|TypeScript|Python|Java|C#|Go|Rust|Swift|Kotlin)\b/gi,
      /\b(Node\.?js|Express|Django|Flask|Spring|Laravel|Rails)\b/gi,
      /\b(MySQL|PostgreSQL|MongoDB|Redis|Elasticsearch)\b/gi,
      /\b(AWS|Azure|GCP|Docker|Kubernetes|Terraform)\b/gi,
      /\b(Git|GitHub|GitLab|Bitbucket|Jenkins|CI\/CD)\b/gi,
      /\b(HTML|CSS|SASS|SCSS|Tailwind|Bootstrap)\b/gi,
      /\b(Webpack|Vite|Parcel|Rollup|Babel)\b/gi
    ];

    const technologies = new Set<string>();
    
    questions.forEach(question => {
      techPatterns.forEach(pattern => {
        const matches = question.match(pattern);
        if (matches) {
          matches.forEach(match => technologies.add(match.toLowerCase()));
        }
      });
    });

    return Array.from(technologies);
  };

  const extractConceptsFromQuestions = (questions: string[]): string[] => {
    const conceptPatterns = [
      /\b(API|REST|GraphQL|Microservices|MVC|MVP|MVVM)\b/gi,
      /\b(Testing|TDD|BDD|Unit Testing|Integration Testing)\b/gi,
      /\b(Design Patterns|SOLID|DRY|KISS|YAGNI)\b/gi,
      /\b(Agile|Scrum|Kanban|DevOps|CI\/CD)\b/gi,
      /\b(Performance|Optimization|Caching|Load Balancing)\b/gi,
      /\b(Security|Authentication|Authorization|OAuth|JWT)\b/gi,
      /\b(Data Structures|Algorithms|Big O|Complexity)\b/gi,
      /\b(Architecture|Scalability|Maintainability|Code Quality)\b/gi
    ];

    const concepts = new Set<string>();
    
    questions.forEach(question => {
      conceptPatterns.forEach(pattern => {
        const matches = question.match(pattern);
        if (matches) {
          matches.forEach(match => concepts.add(match.toLowerCase()));
        }
      });
    });

    return Array.from(concepts);
  };

  const inferSkillLevelFromQuestions = (questions: string[]): 'beginner' | 'intermediate' | 'advanced' => {
    const patterns = analyzeLearningPatterns(questions);
    
    const totalQuestions = questions.length;
    const beginnerRatio = patterns.beginnerQuestions / totalQuestions;
    const intermediateRatio = patterns.intermediateQuestions / totalQuestions;
    const advancedRatio = patterns.advancedQuestions / totalQuestions;
    
    if (advancedRatio > 0.3 || patterns.architectureQuestions > 2 || patterns.optimizationQuestions > 2) {
      return 'advanced';
    } else if (intermediateRatio > 0.4 || patterns.implementationQuestions > 3) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  };

  const generateQuestionBasedRecommendations = (patterns: any, technologies: string[], concepts: string[]): string[] => {
    const recommendations: string[] = [];
    
    if (patterns.beginnerQuestions > patterns.intermediateQuestions) {
      recommendations.push('Focus on building foundational knowledge and practical examples');
    }
    
    if (patterns.debuggingQuestions > 3) {
      recommendations.push('Improve debugging skills and error handling practices');
    }
    
    if (patterns.architectureQuestions === 0) {
      recommendations.push('Learn about software architecture and design patterns');
    }
    
    if (patterns.optimizationQuestions === 0) {
      recommendations.push('Explore performance optimization and scalability topics');
    }
    
    if (technologies.length === 0) {
      recommendations.push('Ask more specific questions about technologies and frameworks');
    }
    
    if (concepts.length === 0) {
      recommendations.push('Focus on software engineering concepts and best practices');
    }

    return recommendations;
  };

  const generateQuestionBasedInsights = (patterns: any, questions: string[]): string[] => {
    const insights: string[] = [];
    
    if (patterns.learningQuestions > patterns.implementationQuestions) {
      insights.push('You focus more on understanding concepts than implementation');
    }
    
    if (patterns.debuggingQuestions > 2) {
      insights.push('You actively work on debugging and problem-solving');
    }
    
    if (patterns.architectureQuestions > 0) {
      insights.push('You show interest in system design and architecture');
    }
    
    if (patterns.optimizationQuestions > 0) {
      insights.push('You care about performance and optimization');
    }
    
    if (questions.length > 10) {
      insights.push('You engage in extensive learning conversations');
    }

    return insights;
  };

  const extractTechnologies = (text: string): string[] => {
    const techPatterns = [
      /\b(React|Vue|Angular|Svelte)\b/gi,
      /\b(JavaScript|TypeScript|Python|Java|C#|Go|Rust|Swift|Kotlin)\b/gi,
      /\b(Node\.?js|Express|Django|Flask|Spring|Laravel|Rails)\b/gi,
      /\b(MySQL|PostgreSQL|MongoDB|Redis|Elasticsearch)\b/gi,
      /\b(AWS|Azure|GCP|Docker|Kubernetes|Terraform)\b/gi,
      /\b(Git|GitHub|GitLab|Bitbucket|Jenkins|CI\/CD)\b/gi,
      /\b(HTML|CSS|SASS|SCSS|Tailwind|Bootstrap)\b/gi,
      /\b(Webpack|Vite|Parcel|Rollup|Babel)\b/gi
    ];

    const technologies = new Set<string>();
    
    techPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => technologies.add(match.toLowerCase()));
      }
    });

    return Array.from(technologies);
  };

  const extractConcepts = (text: string): string[] => {
    const conceptPatterns = [
      /\b(API|REST|GraphQL|Microservices|MVC|MVP|MVVM)\b/gi,
      /\b(Testing|TDD|BDD|Unit Testing|Integration Testing)\b/gi,
      /\b(Design Patterns|SOLID|DRY|KISS|YAGNI)\b/gi,
      /\b(Agile|Scrum|Kanban|DevOps|CI\/CD)\b/gi,
      /\b(Performance|Optimization|Caching|Load Balancing)\b/gi,
      /\b(Security|Authentication|Authorization|OAuth|JWT)\b/gi,
      /\b(Data Structures|Algorithms|Big O|Complexity)\b/gi,
      /\b(Architecture|Scalability|Maintainability|Code Quality)\b/gi
    ];

    const concepts = new Set<string>();
    
    conceptPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => concepts.add(match.toLowerCase()));
      }
    });

    return Array.from(concepts);
  };

  const inferSkillLevelFromChat = (text: string): 'beginner' | 'intermediate' | 'advanced' => {
    const advancedKeywords = [
      'architecture', 'scalability', 'performance', 'optimization', 'microservices',
      'design patterns', 'algorithms', 'complexity', 'enterprise', 'production'
    ];
    
    const intermediateKeywords = [
      'framework', 'library', 'api', 'database', 'testing', 'deployment',
      'git', 'version control', 'collaboration', 'code review'
    ];

    const beginnerKeywords = [
      'tutorial', 'learn', 'beginner', 'basic', 'simple', 'example',
      'how to', 'getting started', 'introduction'
    ];

    const textLower = text.toLowerCase();
    
    const advancedCount = advancedKeywords.filter(keyword => textLower.includes(keyword)).length;
    const intermediateCount = intermediateKeywords.filter(keyword => textLower.includes(keyword)).length;
    const beginnerCount = beginnerKeywords.filter(keyword => textLower.includes(keyword)).length;

    if (advancedCount > intermediateCount && advancedCount > beginnerCount) {
      return 'advanced';
    } else if (intermediateCount > beginnerCount) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  };

  const generateRecommendations = (text: string, technologies: string[], concepts: string[]): string[] => {
    const recommendations: string[] = [];
    
    if (technologies.length === 0) {
      recommendations.push('Consider discussing specific technologies and frameworks in your coding sessions');
    }
    
    if (!concepts.includes('testing')) {
      recommendations.push('Focus on testing strategies and best practices');
    }
    
    if (!concepts.includes('design patterns')) {
      recommendations.push('Learn about design patterns and architectural principles');
    }
    
    if (!concepts.includes('performance')) {
      recommendations.push('Explore performance optimization and scalability topics');
    }
    
    if (technologies.length > 0 && !concepts.includes('api')) {
      recommendations.push('Learn about API design and integration patterns');
    }

    return recommendations;
  };

  const calculateConfidence = (text: string): number => {
    // Simple confidence calculation based on text length and technical content
    const technicalWords = text.match(/\b(api|function|class|method|variable|algorithm|database|framework|library)\b/gi)?.length || 0;
    const confidence = Math.min(0.9, 0.3 + (technicalWords / text.split(' ').length) * 2);
    return Math.round(confidence * 100);
  };

  const generateInsights = (text: string, technologies: string[], concepts: string[]): string[] => {
    const insights: string[] = [];
    
    if (technologies.length > 5) {
      insights.push('You work with a diverse range of technologies');
    }
    
    if (concepts.includes('testing') && concepts.includes('design patterns')) {
      insights.push('You demonstrate strong software engineering practices');
    }
    
    if (text.toLowerCase().includes('problem') || text.toLowerCase().includes('issue')) {
      insights.push('You actively engage in problem-solving discussions');
    }
    
    if (text.toLowerCase().includes('optimize') || text.toLowerCase().includes('improve')) {
      insights.push('You focus on code quality and optimization');
    }

    return insights;
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'advanced': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'beginner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI Chat Analysis</span>
        </CardTitle>
        <CardDescription>
          Paste your AI coding session text to discover hidden skills and learning opportunities
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isProcessing || isAnalyzing}
            />
            
            {!selectedFile ? (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upload AI Chat File</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your AI coding session export (.txt or .md file)
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing || isAnalyzing}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: .txt, .md • Max size: 5MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold text-green-600">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={isProcessing || isAnalyzing}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>File ready for analysis</p>
                  <p className="text-xs">
                    {fileContent.length} characters • {fileContent.split('\n').length} lines
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>
              {selectedFile 
                ? `${fileContent.length} characters • ${fileContent.split('\n').length} lines`
                : 'No file selected'
              }
            </span>
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={!fileContent.trim() || isProcessing || isAnalyzing}
            className="flex items-center space-x-2"
          >
            {isProcessing || isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                <span>Analyze File</span>
              </>
            )}
          </Button>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>What we'll analyze from your file:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-3 w-3" />
                <span>Question analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-3 w-3" />
                <span>Learning patterns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code className="h-3 w-3" />
                <span>Technologies mentioned</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3" />
                <span>Skill level inference</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
