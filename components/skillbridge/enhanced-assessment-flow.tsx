"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AssessmentQuestion, 
  AssessmentAnswer, 
  AssessmentSession, 
  CalibratedSkillLevel,
  EnhancedSkillAssessment 
} from '@/lib/agents/enhanced-skill-assessment';
import { 
  Brain, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface EnhancedAssessmentFlowProps {
  onComplete?: (results: CalibratedSkillLevel[]) => void;
  assessmentType?: 'quick' | 'detailed' | 'validation';
}

export function EnhancedAssessmentFlow({ 
  onComplete, 
  assessmentType = 'detailed' 
}: EnhancedAssessmentFlowProps) {
  const [assessment] = useState(new EnhancedSkillAssessment());
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | number>('');
  const [confidence, setConfidence] = useState(0.5);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<CalibratedSkillLevel[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (!currentQuestion || isPaused) return;

    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isPaused]);

  // Start assessment
  const startAssessment = () => {
    try {
      const newSession = assessment.startAssessment(assessmentType, 'user_123');
      setSession(newSession);
      setCurrentQuestion(assessment.getNextQuestion(newSession.id));
      setTimeSpent(0);
      setError(null);
    } catch (err) {
      setError('Failed to start assessment. Please try again.');
    }
  };

  // Submit answer
  const submitAnswer = () => {
    if (!session || !currentQuestion) return;

    try {
      assessment.submitAnswer(
        session.id,
        currentQuestion.id,
        currentAnswer,
        confidence,
        timeSpent
      );

      // Get next question
      const nextQuestion = assessment.getNextQuestion(session.id);
      
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setCurrentAnswer('');
        setConfidence(0.5);
        setTimeSpent(0);
      } else {
        // Assessment complete
        const skillLevels = assessment.completeAssessment(session.id);
        setResults(skillLevels);
        onComplete?.(skillLevels);
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
    }
  };

  // Skip question
  const skipQuestion = () => {
    if (!session || !currentQuestion) return;
    
    assessment.submitAnswer(session.id, currentQuestion.id, '', 0, timeSpent);
    
    const nextQuestion = assessment.getNextQuestion(session.id);
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setCurrentAnswer('');
      setConfidence(0.5);
      setTimeSpent(0);
    } else {
      const skillLevels = assessment.completeAssessment(session.id);
      setResults(skillLevels);
      onComplete?.(skillLevels);
    }
  };

  // Restart assessment
  const restartAssessment = () => {
    setSession(null);
    setCurrentQuestion(null);
    setCurrentAnswer('');
    setConfidence(0.5);
    setTimeSpent(0);
    setResults(null);
    setError(null);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get progress percentage
  const getProgress = () => {
    if (!session || !currentQuestion) return 0;
    const totalQuestions = session.questions.length;
    const answeredQuestions = session.answers.length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Results view
  if (results) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Assessment Complete!</span>
            </CardTitle>
            <CardDescription>
              Here are your calibrated skill levels and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((skill) => (
                <div key={skill.skillId} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize">{skill.skillId.replace('_', ' ')}</h3>
                    <div className="flex space-x-2">
                      <Badge variant="outline">
                        Level {skill.level.toFixed(1)}/5
                      </Badge>
                      <Badge className={getDifficultyColor(Math.round(skill.confidence * 5))}>
                        {Math.round(skill.confidence * 100)}% Confidence
                      </Badge>
                      <Badge variant="secondary">
                        {skill.trend}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Evidence:</span>
                      <span className="text-sm">{skill.evidence.length} sources</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <Button onClick={restartAssessment} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Assessment
              </Button>
              <Button onClick={() => window.print()}>
                Export Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Question view
  if (currentQuestion) {
    return (
      <div className="space-y-6">
        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Question {session?.answers.length || 0 + 1} of {session?.questions.length}</span>
                <span>{getProgress()}% Complete</span>
              </div>
              <Progress value={getProgress()} />
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Time: {formatTime(timeSpent)}</span>
                  <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                    Difficulty: {currentQuestion.difficulty}/5
                  </Badge>
                  <Badge variant="outline">
                    {currentQuestion.points} points
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPaused(!isPaused)}
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>{currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)} Skills</span>
            </CardTitle>
            <CardDescription>
              {currentQuestion.type === 'self-assessment' 
                ? 'Rate your skill level honestly'
                : 'Choose the best answer based on your experience'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-lg font-medium">
                {currentQuestion.question}
              </div>

              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={currentAnswer === option}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'self-assessment' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {currentAnswer || 1}/5
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={currentAnswer || 1}
                      onChange={(e) => setCurrentAnswer(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confidence Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  How confident are you in this answer? ({Math.round(confidence * 100)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={confidence}
                  onChange={(e) => setConfidence(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Not confident</span>
                  <span>Very confident</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={skipQuestion}
                >
                  Skip Question
                </Button>
                
                <Button
                  onClick={submitAnswer}
                  disabled={!currentAnswer && currentQuestion.type !== 'scenario'}
                >
                  {session && assessment.getNextQuestion(session.id) ? 'Next Question' : 'Complete Assessment'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Start view
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Enhanced Skill Assessment</span>
          </CardTitle>
          <CardDescription>
            A comprehensive evaluation of your technical and soft skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Quick Assessment</h3>
                <p className="text-sm text-muted-foreground">5-10 minutes</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Detailed Assessment</h3>
                <p className="text-sm text-muted-foreground">20-30 minutes</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">Validation Test</h3>
                <p className="text-sm text-muted-foreground">15-20 minutes</p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="text-center">
              <Button onClick={startAssessment} size="lg">
                <Play className="h-4 w-4 mr-2" />
                Start {assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)} Assessment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
