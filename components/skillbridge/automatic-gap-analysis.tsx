"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { GitHubAnalysisComponent } from './github-analysis';
import { AIChatAnalysis } from './ai-chat-analysis';
import { SkillRadarChart } from './skill-radar-chart';
import { GitHubAnalysis, GapAnalysisResult, GapAnalyzerAgent } from '@/lib/agents/gap-analyzer';
import { skillGapStorage } from '@/lib/storage/skill-gap-storage';
import { 
  Github, 
  BarChart3, 
  Target, 
  CheckCircle,
  AlertCircle,
  Brain,
  TrendingUp,
  BookOpen
} from 'lucide-react';

export function AutomaticGapAnalysis() {
  const [githubAnalysis, setGitHubAnalysis] = useState<GitHubAnalysis | null>(null);
  const [aiChatAnalysis, setAIChatAnalysis] = useState<any>(null);
  const [skillAssessment, setSkillAssessment] = useState<GapAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<'github' | 'ai-chat'>('github');

  const handleGitHubAnalysisComplete = (analysis: GitHubAnalysis) => {
    setGitHubAnalysis(analysis);
    setAnalysisType('github');
  };

  const handleAIChatAnalysisComplete = (analysis: any) => {
    setAIChatAnalysis(analysis);
    setAnalysisType('ai-chat');
  };


  const handleSkillAssessmentComplete = (assessment: GapAnalysisResult) => {
    setSkillAssessment(assessment);
    setIsProcessing(false);
    
    // Store the skill gap analysis for chat access
    const analysisToStore = githubAnalysis || assessment.githubAnalysis;
    if (analysisToStore) {
      const userId = 'user_123'; // In a real app, this would come from auth
      try {
        const storageId = skillGapStorage.storeSkillGap(userId, analysisToStore, assessment);
        console.log('✅ Skill gap analysis stored for chat access:', {
          storageId,
          userId,
          repository: analysisToStore.repository,
          skillCount: assessment.skillGaps.length,
          overallScore: assessment.overallScore
        });
      } catch (error) {
        console.error('❌ Failed to store skill gap analysis:', error);
      }
    } else {
      console.warn('⚠️ No analysis available to store with skill assessment');
    }
  };

  const handleAnalysisStart = () => {
    setIsProcessing(true);
    setError(null);
  };

  const resetAnalysis = () => {
    setGitHubAnalysis(null);
    setAIChatAnalysis(null);
    setSkillAssessment(null);
    setIsProcessing(false);
    setError(null);
    setAnalysisType('github');
  };

  const getProgress = () => {
    const hasAnalysis = githubAnalysis || aiChatAnalysis;
    if (!hasAnalysis && !skillAssessment) return 0;
    if (hasAnalysis && !skillAssessment) return 50;
    if (hasAnalysis && skillAssessment) return 100;
    return 0;
  };

  const getProgressText = () => {
    const hasAnalysis = githubAnalysis || aiChatAnalysis;
    if (!hasAnalysis && !skillAssessment) return 'Ready to analyze';
    if (hasAnalysis && !skillAssessment) return 'Analyzing skills...';
    if (hasAnalysis && skillAssessment) return 'Analysis complete!';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Automatic Skill Gap Analysis</span>
          </CardTitle>
          <CardDescription>
            Enter a GitHub repository URL to automatically analyze your skills and identify gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>{getProgressText()}</span>
              <span>{getProgress()}% Complete</span>
            </div>
            <Progress value={getProgress()} />
            
            {/* Step Indicators */}
            <div className="flex justify-between">
              <div className={`flex items-center space-x-2 ${analysisType === 'github' && githubAnalysis ? 'text-green-600' : analysisType === 'ai-chat' && aiChatAnalysis ? 'text-green-600' : 'text-gray-400'}`}>
                {analysisType === 'github' ? (
                  <>
                    <Github className="h-4 w-4" />
                    <span className="text-sm">GitHub Analysis</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    <span className="text-sm">Chat Analysis</span>
                  </>
                )}
              </div>
              <div className={`flex items-center space-x-2 ${skillAssessment ? 'text-green-600' : isProcessing ? 'text-blue-600' : 'text-gray-400'}`}>
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Skill Assessment</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Analysis Options */}
      {!skillAssessment && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Choose Your Analysis Method</h3>
            <p className="text-muted-foreground">
              Select either GitHub repository analysis or AI chat session analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={`cursor-pointer transition-all ${analysisType === 'github' ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}>
              <CardHeader onClick={() => setAnalysisType('github')}>
                <CardTitle className="flex items-center space-x-2">
                  <Github className="h-5 w-5" />
                  <span>GitHub Repository</span>
                </CardTitle>
                <CardDescription>
                  Analyze your code repositories to discover skills and technologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GitHubAnalysisComponent
                  onAnalysisComplete={handleGitHubAnalysisComplete}
                  onSkillAssessmentComplete={handleSkillAssessmentComplete}
                />
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-all ${analysisType === 'ai-chat' ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}>
              <CardHeader onClick={() => setAnalysisType('ai-chat')}>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Chat Session</span>
                </CardTitle>
                <CardDescription>
                  Analyze your AI coding conversations to identify learning patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIChatAnalysis
                  onAnalysisComplete={handleAIChatAnalysisComplete}
                  onAnalysisStart={handleAnalysisStart}
                  isAnalyzing={isProcessing}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && !skillAssessment && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Analyzing Your Skills</h3>
              <p className="text-muted-foreground">
                {analysisType === 'github' 
                  ? "We're automatically assessing your skills based on the repository analysis..."
                  : "We're analyzing your AI chat session to identify skills and learning patterns..."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {skillAssessment && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Skill Gap Analysis Complete!</span>
              </CardTitle>
              <CardDescription>
                {analysisType === 'github' 
                  ? 'Based on your GitHub repository analysis'
                  : 'Based on your AI chat session analysis'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {skillAssessment.overallScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Skill Score</div>
                  <Progress value={skillAssessment.overallScore} className="mt-2" />
                </div>

                {/* Radar Chart */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">Skill Visualization</h3>
                  <SkillRadarChart
                    categories={skillAssessment.categories}
                    currentSkills={skillAssessment.skillGaps.map(gap => gap.skill)}
                    targetSkills={skillAssessment.skillGaps.map(gap => ({
                      ...gap.skill,
                      currentLevel: gap.skill.targetLevel
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Chat Analysis Insights */}
          {analysisType === 'ai-chat' && aiChatAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Chat Analysis Insights</span>
                </CardTitle>
                <CardDescription>
                  Key findings from your AI coding session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Questions Analyzed</h4>
                      <div className="text-2xl font-bold text-primary">{aiChatAnalysis.questionCount || 0}</div>
                      <p className="text-sm text-muted-foreground">User questions</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">AI Responses</h4>
                      <div className="text-2xl font-bold text-primary">{aiChatAnalysis.responseCount || 0}</div>
                      <p className="text-sm text-muted-foreground">Assistant responses</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Technologies Discussed</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiChatAnalysis.technologies.map((tech: string, index: number) => (
                          <Badge key={index} variant="outline">{tech}</Badge>
                        ))}
                        {aiChatAnalysis.technologies.length === 0 && (
                          <span className="text-sm text-muted-foreground">No specific technologies mentioned in questions</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Concepts Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiChatAnalysis.concepts.map((concept: string, index: number) => (
                          <Badge key={index} variant="secondary">{concept}</Badge>
                        ))}
                        {aiChatAnalysis.concepts.length === 0 && (
                          <span className="text-sm text-muted-foreground">No specific concepts mentioned in questions</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {aiChatAnalysis.learningPatterns && (
                    <div>
                      <h4 className="font-semibold mb-2">Learning Patterns</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Beginner Questions:</span>
                          <span className="font-medium">{aiChatAnalysis.learningPatterns.beginnerQuestions || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Intermediate Questions:</span>
                          <span className="font-medium">{aiChatAnalysis.learningPatterns.intermediateQuestions || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Advanced Questions:</span>
                          <span className="font-medium">{aiChatAnalysis.learningPatterns.advancedQuestions || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Debugging Questions:</span>
                          <span className="font-medium">{aiChatAnalysis.learningPatterns.debuggingQuestions || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold mb-2">Skill Level</h4>
                    <div className="flex items-center space-x-4">
                      <Badge className={`${aiChatAnalysis.skillLevel === 'advanced' ? 'bg-green-100 text-green-800' : aiChatAnalysis.skillLevel === 'intermediate' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {aiChatAnalysis.skillLevel}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {aiChatAnalysis.confidence}%
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Key Insights</h4>
                    <ul className="text-sm space-y-1">
                      {aiChatAnalysis.insights.map((insight: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Skill Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Top Skill Gaps</span>
              </CardTitle>
              <CardDescription>
                Areas where you can improve your skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skillAssessment.skillGaps.slice(0, 5).map((gap, index) => (
                  <div key={gap.skill.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{gap.skill.name}</span>
                      <Badge variant={gap.gap > 2 ? "destructive" : gap.gap > 1 ? "default" : "secondary"}>
                        Gap: {gap.gap}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Current: {gap.skill.currentLevel}/5 → Target: {gap.skill.targetLevel}/5
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(gap.skill.currentLevel / 5) * 100}%` }}
                      />
                    </div>
                    {gap.recommendations.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Recommendation:</div>
                        <div className="text-xs">{gap.recommendations[0]}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Path */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Recommended Learning Path</span>
              </CardTitle>
              <CardDescription>
                Personalized steps to improve your skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {skillAssessment.learningPath.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* General Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>General Recommendations</span>
              </CardTitle>
              <CardDescription>
                Additional insights for your skill development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skillAssessment.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 border rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button onClick={resetAnalysis} variant="outline">
              Analyze Another Repository
            </Button>
            <Button onClick={() => window.print()}>
              Export Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
