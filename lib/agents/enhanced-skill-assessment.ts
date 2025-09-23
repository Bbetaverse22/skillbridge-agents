export interface AssessmentQuestion {
  id: string;
  skillId: string;
  category: string;
  type: 'multiple-choice' | 'scenario' | 'self-assessment' | 'practical';
  difficulty: number; // 1-5
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  timeLimit?: number; // seconds
  points: number;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string | number;
  confidence: number; // 0-1
  timeSpent: number; // seconds
  timestamp: Date;
}

export interface SkillEvidence {
  type: 'quiz' | 'portfolio' | 'peer-review' | 'practical-test' | 'self-assessment';
  value: number; // 0-1
  weight: number; // 0-1
  timestamp: Date;
  source: string;
  details?: any;
}

export interface CalibratedSkillLevel {
  skillId: string;
  level: number; // 1-5
  confidence: number; // 0-1
  evidence: SkillEvidence[];
  lastUpdated: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export interface AssessmentSession {
  id: string;
  userId: string;
  type: 'quick' | 'detailed' | 'validation';
  questions: AssessmentQuestion[];
  answers: AssessmentAnswer[];
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'abandoned';
}

export class EnhancedSkillAssessment {
  private questions: AssessmentQuestion[] = [];
  private sessions: Map<string, AssessmentSession> = new Map();

  constructor() {
    this.initializeQuestions();
  }

  /**
   * Start a new assessment session
   */
  startAssessment(type: 'quick' | 'detailed' | 'validation', userId: string): AssessmentSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const questions = this.getQuestionsForType(type);
    const session: AssessmentSession = {
      id: sessionId,
      userId,
      type,
      questions,
      answers: [],
      startTime: new Date(),
      status: 'in-progress'
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Submit an answer for a question
   */
  submitAnswer(sessionId: string, questionId: string, answer: string | number, confidence: number, timeSpent: number): void {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const assessmentAnswer: AssessmentAnswer = {
      questionId,
      answer,
      confidence,
      timeSpent,
      timestamp: new Date()
    };

    session.answers.push(assessmentAnswer);
  }

  /**
   * Complete assessment and calculate results
   */
  completeAssessment(sessionId: string): CalibratedSkillLevel[] {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.endTime = new Date();
    session.status = 'completed';

    return this.calculateSkillLevels(session);
  }

  /**
   * Get next question based on current progress
   */
  getNextQuestion(sessionId: string): AssessmentQuestion | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const answeredQuestionIds = new Set(session.answers.map(a => a.questionId));
    const unansweredQuestions = session.questions.filter(q => !answeredQuestionIds.has(q.id));

    if (unansweredQuestions.length === 0) return null;

    // Adaptive questioning: prioritize questions that will give most information
    return this.selectOptimalQuestion(unansweredQuestions, session.answers);
  }

  /**
   * Calculate calibrated skill levels from assessment data
   */
  private calculateSkillLevels(session: AssessmentSession): CalibratedSkillLevel[] {
    const skillMap = new Map<string, SkillEvidence[]>();

    // Process answers into evidence
    session.answers.forEach(answer => {
      const question = session.questions.find(q => q.id === answer.questionId);
      if (!question) return;

      const evidence: SkillEvidence = {
        type: question.type === 'self-assessment' ? 'self-assessment' : 'quiz',
        value: this.calculateAnswerValue(question, answer),
        weight: this.calculateQuestionWeight(question, answer),
        timestamp: answer.timestamp,
        source: `question_${question.id}`,
        details: { answer: answer.answer, confidence: answer.confidence }
      };

      if (!skillMap.has(question.skillId)) {
        skillMap.set(question.skillId, []);
      }
      skillMap.get(question.skillId)!.push(evidence);
    });

    // Calculate calibrated levels
    const calibratedLevels: CalibratedSkillLevel[] = [];
    
    skillMap.forEach((evidence, skillId) => {
      const level = this.calculateWeightedLevel(evidence);
      const confidence = this.calculateConfidence(evidence);
      const trend = this.calculateTrend(evidence);

      calibratedLevels.push({
        skillId,
        level,
        confidence,
        evidence,
        lastUpdated: new Date(),
        trend
      });
    });

    return calibratedLevels;
  }

  /**
   * Select the most informative next question
   */
  private selectOptimalQuestion(questions: AssessmentQuestion[], answers: AssessmentAnswer[]): AssessmentQuestion {
    // Simple implementation: select question with highest points
    // In practice, this would use more sophisticated algorithms
    return questions.reduce((best, current) => 
      current.points > best.points ? current : best
    );
  }

  /**
   * Calculate answer value (0-1) based on correctness and confidence
   */
  private calculateAnswerValue(question: AssessmentQuestion, answer: AssessmentAnswer): number {
    if (question.type === 'self-assessment') {
      // For self-assessment, use the answer value directly (1-5 scale)
      return (answer.answer as number) / 5;
    }

    if (question.correctAnswer) {
      const isCorrect = answer.answer === question.correctAnswer;
      // Weight by confidence
      return isCorrect ? answer.confidence : (1 - answer.confidence) * 0.2;
    }

    // For open-ended questions, use confidence as proxy
    return answer.confidence;
  }

  /**
   * Calculate question weight based on difficulty and time spent
   */
  private calculateQuestionWeight(question: AssessmentQuestion, answer: AssessmentAnswer): number {
    const difficultyWeight = question.difficulty / 5;
    const timeWeight = Math.min(answer.timeSpent / (question.timeLimit || 60), 1);
    const confidenceWeight = answer.confidence;
    
    return (difficultyWeight + timeWeight + confidenceWeight) / 3;
  }

  /**
   * Calculate weighted skill level from evidence
   */
  private calculateWeightedLevel(evidence: SkillEvidence[]): number {
    if (evidence.length === 0) return 1;

    const totalWeight = evidence.reduce((sum, e) => sum + e.weight, 0);
    const weightedSum = evidence.reduce((sum, e) => sum + (e.value * e.weight), 0);
    
    return Math.min(5, Math.max(1, (weightedSum / totalWeight) * 5));
  }

  /**
   * Calculate confidence in skill level
   */
  private calculateConfidence(evidence: SkillEvidence[]): number {
    if (evidence.length === 0) return 0;

    // More evidence = higher confidence
    const evidenceCount = evidence.length;
    const avgWeight = evidence.reduce((sum, e) => sum + e.weight, 0) / evidenceCount;
    const recency = this.calculateRecency(evidence);

    return Math.min(1, (evidenceCount / 10) * avgWeight * recency);
  }

  /**
   * Calculate trend based on evidence over time
   */
  private calculateTrend(evidence: SkillEvidence[]): 'improving' | 'stable' | 'declining' {
    if (evidence.length < 2) return 'stable';

    const sortedEvidence = evidence.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const recent = sortedEvidence.slice(-3);
    const older = sortedEvidence.slice(0, -3);

    if (older.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, e) => sum + e.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, e) => sum + e.value, 0) / older.length;

    const diff = recentAvg - olderAvg;
    if (diff > 0.1) return 'improving';
    if (diff < -0.1) return 'declining';
    return 'stable';
  }

  /**
   * Calculate recency factor for evidence
   */
  private calculateRecency(evidence: SkillEvidence[]): number {
    const now = new Date();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    
    const recentEvidence = evidence.filter(e => 
      (now.getTime() - e.timestamp.getTime()) < maxAge
    );

    return recentEvidence.length / evidence.length;
  }

  /**
   * Initialize assessment questions
   */
  private initializeQuestions(): void {
    // Technical Skills Questions
    this.questions.push(
      {
        id: 'tech_1',
        skillId: 'programming',
        category: 'technical',
        type: 'scenario',
        difficulty: 3,
        question: 'A user reports that your web application is running slowly. What would be your first step in debugging this issue?',
        options: [
          'Check server logs for errors',
          'Profile the application to identify bottlenecks',
          'Restart the application server',
          'Check database query performance'
        ],
        correctAnswer: 'Profile the application to identify bottlenecks',
        explanation: 'Profiling helps identify the actual cause of performance issues before making changes.',
        timeLimit: 120,
        points: 10
      },
      {
        id: 'tech_2',
        skillId: 'programming',
        category: 'technical',
        type: 'multiple-choice',
        difficulty: 2,
        question: 'Which of the following is NOT a benefit of using version control?',
        options: [
          'Code backup and recovery',
          'Collaboration with team members',
          'Automatic code compilation',
          'Change history tracking'
        ],
        correctAnswer: 'Automatic code compilation',
        explanation: 'Version control manages code changes, not compilation.',
        timeLimit: 60,
        points: 5
      }
    );

    // Soft Skills Questions
    this.questions.push(
      {
        id: 'soft_1',
        skillId: 'communication',
        category: 'soft',
        type: 'scenario',
        difficulty: 4,
        question: 'You need to explain a complex technical concept to a non-technical stakeholder. How would you approach this?',
        options: [
          'Use technical jargon to show expertise',
          'Create visual diagrams and use analogies',
          'Provide detailed documentation',
          'Schedule a follow-up meeting'
        ],
        correctAnswer: 'Create visual diagrams and use analogies',
        explanation: 'Visual aids and analogies help bridge the gap between technical and non-technical understanding.',
        timeLimit: 90,
        points: 8
      }
    );

    // Self-Assessment Questions
    this.questions.push(
      {
        id: 'self_1',
        skillId: 'programming',
        category: 'technical',
        type: 'self-assessment',
        difficulty: 1,
        question: 'Rate your programming experience level',
        points: 3
      }
    );
  }

  /**
   * Get questions for specific assessment type
   */
  private getQuestionsForType(type: 'quick' | 'detailed' | 'validation'): AssessmentQuestion[] {
    switch (type) {
      case 'quick':
        return this.questions.filter(q => q.difficulty <= 2).slice(0, 10);
      case 'detailed':
        return this.questions;
      case 'validation':
        return this.questions.filter(q => q.type !== 'self-assessment');
      default:
        return [];
    }
  }
}
