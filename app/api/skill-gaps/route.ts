import { NextRequest, NextResponse } from 'next/server';
import { skillGapStorage } from '@/lib/storage/skill-gap-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user_123';
    const action = searchParams.get('action') || 'summary';

    switch (action) {
      case 'summary':
        const summary = skillGapStorage.getSkillGapSummary(userId);
        if (!summary) {
          return NextResponse.json({
            success: false,
            message: 'No skill gap analysis found. Please run a GitHub repository analysis first.'
          });
        }
        return NextResponse.json({
          success: true,
          data: { summary }
        });

      case 'latest':
        const latestGap = skillGapStorage.getLatestSkillGap(userId);
        if (!latestGap) {
          return NextResponse.json({
            success: false,
            message: 'No skill gap analysis found. Please run a GitHub repository analysis first.'
          });
        }
        return NextResponse.json({
          success: true,
          data: latestGap
        });

      case 'skill':
        const skillName = searchParams.get('skillName');
        if (!skillName) {
          return NextResponse.json({
            success: false,
            message: 'Skill name is required'
          }, { status: 400 });
        }
        
        const skillDetails = skillGapStorage.getSkillDetails(userId, skillName);
        if (!skillDetails) {
          return NextResponse.json({
            success: false,
            message: `No details found for skill: ${skillName}`
          });
        }
        
        return NextResponse.json({
          success: true,
          data: skillDetails
        });

      case 'list':
        const userGaps = skillGapStorage.getUserSkillGaps(userId);
        return NextResponse.json({
          success: true,
          data: userGaps
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Supported actions: summary, latest, skill, list'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Skill gaps API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, githubAnalysis, skillAssessment } = await request.json();

    if (!userId || !githubAnalysis || !skillAssessment) {
      return NextResponse.json({
        success: false,
        message: 'userId, githubAnalysis, and skillAssessment are required'
      }, { status: 400 });
    }

    const id = skillGapStorage.storeSkillGap(userId, githubAnalysis, skillAssessment);
    
    return NextResponse.json({
      success: true,
      data: { id }
    });

  } catch (error) {
    console.error('Skill gaps API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
