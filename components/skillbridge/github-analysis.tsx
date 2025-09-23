"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GitHubAnalysis, GapAnalyzerAgent } from '@/lib/agents/gap-analyzer';
import { Github, ExternalLink, Code, Database, Cloud, Wrench, AlertCircle } from 'lucide-react';

interface GitHubAnalysisProps {
  onAnalysisComplete?: (analysis: GitHubAnalysis) => void;
  onSkillAssessmentComplete?: (skillAssessment: any) => void;
}

export function GitHubAnalysisComponent({ onAnalysisComplete, onSkillAssessmentComplete }: GitHubAnalysisProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gapAnalyzer = new GapAnalyzerAgent();

  const isValidGitHubUrl = (url: string): boolean => {
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/;
    return githubRegex.test(url);
  };

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!isValidGitHubUrl(repoUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null); // Clear previous analysis

    try {
      const result = await gapAnalyzer.analyzeGitHubRepository(repoUrl);
      setAnalysis(result);
      onAnalysisComplete?.(result);
      
      // Automatically generate skill assessment from GitHub analysis
      const skillAssessment = await gapAnalyzer.generateAutomaticSkillAssessment(result);
      onSkillAssessmentComplete?.(skillAssessment);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze repository. Please try again.';
      setError(errorMessage);
      console.error('GitHub analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return '🌱';
      case 'intermediate':
        return '🚀';
      case 'advanced':
        return '🏆';
      default:
        return '📊';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Github className="h-5 w-5" />
            <span>GitHub Repository Analysis</span>
          </CardTitle>
          <CardDescription>
            Analyze a GitHub repository to identify technologies, frameworks, and learning opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !repoUrl.trim()}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isAnalyzing && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Analyzing repository...</p>
              </div>
            )}

            {analysis && !isAnalyzing && (
              <div className="space-y-6">
                {/* Repository Info */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Github className="h-5 w-5" />
                    <span className="font-medium">{analysis.repository}</span>
                  </div>
                  <Badge className={getSkillLevelColor(analysis.skillLevel)}>
                    {getSkillLevelIcon(analysis.skillLevel)} {analysis.skillLevel}
                  </Badge>
                </div>

                {/* Technologies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">Frameworks</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.frameworks.map((framework, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-sm">Technologies</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-sm">Tools</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.tools.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Learning Recommendations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Learning Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={analysis.repository} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Repository
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const text = `GitHub Analysis for ${analysis.repository}\n\n` +
                        `Technologies: ${analysis.technologies.join(', ')}\n` +
                        `Frameworks: ${analysis.frameworks.join(', ')}\n` +
                        `Languages: ${analysis.languages.join(', ')}\n` +
                        `Tools: ${analysis.tools.join(', ')}\n\n` +
                        `Recommendations:\n${analysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
                      
                      navigator.clipboard.writeText(text);
                    }}
                  >
                    Copy Analysis
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
