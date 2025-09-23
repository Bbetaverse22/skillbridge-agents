import { GapAnalysisResult, GitHubAnalysis } from '@/lib/agents/gap-analyzer';

interface StoredSkillGap {
  id: string;
  userId: string;
  githubAnalysis: GitHubAnalysis;
  skillAssessment: GapAnalysisResult;
  createdAt: Date;
  lastAccessed: Date;
}

class SkillGapStorage {
  private storage: Map<string, StoredSkillGap> = new Map();
  private userSessions: Map<string, string> = new Map(); // userId -> latest skillGapId

  /**
   * Store skill gap analysis results
   */
  storeSkillGap(userId: string, githubAnalysis: GitHubAnalysis, skillAssessment: GapAnalysisResult): string {
    const id = `skillgap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const storedGap: StoredSkillGap = {
      id,
      userId,
      githubAnalysis,
      skillAssessment,
      createdAt: new Date(),
      lastAccessed: new Date()
    };

    this.storage.set(id, storedGap);
    this.userSessions.set(userId, id);
    
    return id;
  }

  /**
   * Get the latest skill gap analysis for a user
   */
  getLatestSkillGap(userId: string): StoredSkillGap | null {
    const latestId = this.userSessions.get(userId);
    if (!latestId) return null;

    const skillGap = this.storage.get(latestId);
    if (skillGap) {
      skillGap.lastAccessed = new Date();
    }
    
    return skillGap || null;
  }

  /**
   * Get skill gap by ID
   */
  getSkillGap(id: string): StoredSkillGap | null {
    const skillGap = this.storage.get(id);
    if (skillGap) {
      skillGap.lastAccessed = new Date();
    }
    return skillGap || null;
  }

  /**
   * Get all skill gaps for a user
   */
  getUserSkillGaps(userId: string): StoredSkillGap[] {
    const userGaps = Array.from(this.storage.values())
      .filter(gap => gap.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return userGaps;
  }

  /**
   * Get skill gap summary for chat
   */
  getSkillGapSummary(userId: string): string | null {
    const latestGap = this.getLatestSkillGap(userId);
    if (!latestGap) return null;

    const { skillAssessment, githubAnalysis } = latestGap;
    
    const summary = `
SKILL GAP ANALYSIS SUMMARY
Repository: ${githubAnalysis.repository}
Overall Score: ${skillAssessment.overallScore}%
Skill Level: ${githubAnalysis.skillLevel}

Technologies Found:
- Languages: ${githubAnalysis.languages.join(', ')}
- Frameworks: ${githubAnalysis.frameworks.join(', ')}
- Tools: ${githubAnalysis.tools.join(', ')}

Top Skill Gaps:
${skillAssessment.skillGaps.slice(0, 3).map((gap, index) => 
  `${index + 1}. ${gap.skill.name}: ${gap.skill.currentLevel}/5 → ${gap.skill.targetLevel}/5 (Gap: ${gap.gap})`
).join('\n')}

Key Recommendations:
${skillAssessment.recommendations.slice(0, 3).map((rec, index) => 
  `${index + 1}. ${rec}`
).join('\n')}
    `.trim();

    return summary;
  }

  /**
   * Get specific skill information
   */
  getSkillDetails(userId: string, skillName: string): any | null {
    const latestGap = this.getLatestSkillGap(userId);
    if (!latestGap) return null;

    const skillGap = latestGap.skillAssessment.skillGaps.find(
      gap => gap.skill.name.toLowerCase().includes(skillName.toLowerCase())
    );

    if (!skillGap) return null;

    return {
      skill: skillGap.skill,
      gap: skillGap.gap,
      priority: skillGap.priority,
      recommendations: skillGap.recommendations
    };
  }

  /**
   * Clean up old skill gaps (older than 30 days)
   */
  cleanup(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const [id, skillGap] of this.storage.entries()) {
      if (skillGap.createdAt < thirtyDaysAgo) {
        this.storage.delete(id);
      }
    }
  }
}

// Export singleton instance
export const skillGapStorage = new SkillGapStorage();

// Clean up old data every hour
setInterval(() => {
  skillGapStorage.cleanup();
}, 60 * 60 * 1000);
