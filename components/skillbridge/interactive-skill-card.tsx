"use client";

/**
 * Interactive Skill Gap Card
 * Expandable card showing detailed skill information and actionable recommendations
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Code, 
  DollarSign, 
  Clock,
  ExternalLink
} from 'lucide-react';

interface SkillGap {
  name: string;
  currentLevel: number;
  targetLevel: number;
  priority: number;
  gap: number;
  recommendations?: string[];
  salaryImpact?: string;
  timeEstimate?: string;
  courses?: Array<{ name: string; url: string; platform: string }>;
}

interface InteractiveSkillCardProps {
  skill: SkillGap;
  onStartLearning?: (skillName: string) => void;
}

export function InteractiveSkillCard({ skill, onStartLearning }: InteractiveSkillCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'destructive';
    if (priority >= 6) return 'default';
    return 'secondary';
  };

  const getPriorityBarColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-500';
    if (priority >= 6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const gapPercent = (skill.gap / skill.targetLevel) * 100;

  // Mock data for demonstration (would come from real analysis in production)
  const mockRecommendations = skill.recommendations || [
    `Learn ${skill.name} fundamentals through interactive tutorials`,
    `Build 2-3 portfolio projects using ${skill.name}`,
    `Contribute to open-source projects requiring ${skill.name}`
  ];

  const mockCourses = skill.courses || [
    { name: `${skill.name} for Beginners`, platform: 'Udemy', url: '#' },
    { name: `Master ${skill.name}`, platform: 'Frontend Masters', url: '#' },
    { name: `${skill.name} Complete Guide`, platform: 'Coursera', url: '#' }
  ];

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isExpanded ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-4">
        {/* Header - Always Visible */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{skill.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getPriorityColor(skill.priority)}>
                Priority: {skill.priority}/10
              </Badge>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getPriorityBarColor(skill.priority)} transition-all`}
                style={{ width: `${Math.min(100, gapPercent)}%` }} 
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Current: {skill.currentLevel}/5</span>
              <span>Gap: {skill.gap} levels</span>
              <span>Target: {skill.targetLevel}/5</span>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-4" onClick={(e) => e.stopPropagation()}>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {skill.salaryImpact && (
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Salary Impact</p>
                    <p className="font-semibold">{skill.salaryImpact}</p>
                  </div>
                </div>
              )}
              {skill.timeEstimate && (
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Est. Time</p>
                    <p className="font-semibold">{skill.timeEstimate}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Recommended Actions</span>
              </p>
              <ul className="space-y-1">
                {mockRecommendations.slice(0, 3).map((rec, i) => (
                  <li key={i} className="text-sm flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Top Courses</p>
              <div className="space-y-2">
                {mockCourses.slice(0, 3).map((course, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                    asChild
                  >
                    <a href={course.url} target="_blank" rel="noopener noreferrer">
                      <span className="truncate">{course.name}</span>
                      <div className="flex items-center space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          {course.platform}
                        </Badge>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <Button 
                className="flex-1"
                onClick={() => onStartLearning?.(skill.name)}
              >
                Start Learning
              </Button>
              <Button variant="outline" className="flex-1">
                Find Practice Issues
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

