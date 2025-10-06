"use client";

/**
 * Sticky Agent Status Bar
 * Persistent header showing real-time agent state
 */

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Pause, Play, AlertCircle } from 'lucide-react';

type AgentStatus = 'IDLE' | 'ANALYZING' | 'RESEARCHING' | 'PLANNING' | 'ACTING' | 'MONITORING' | 'COMPLETE' | 'ERROR';

interface StickyAgentStatusProps {
  status: AgentStatus;
  progress: number;
  currentTask: string;
  onPause?: () => void;
  onResume?: () => void;
  onViewLogs?: () => void;
  estimatedTimeRemaining?: string;
  isPaused?: boolean;
}

export function StickyAgentStatus({
  status,
  progress,
  currentTask,
  onPause,
  onResume,
  onViewLogs,
  estimatedTimeRemaining,
  isPaused = false
}: StickyAgentStatusProps) {
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'IDLE':
        return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
      case 'ANALYZING':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
      case 'RESEARCHING':
        return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300';
      case 'PLANNING':
        return 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300';
      case 'ACTING':
        return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300';
      case 'MONITORING':
        return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300';
      case 'COMPLETE':
        return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300';
      case 'ERROR':
        return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
    }
  };

  const isActive = status !== 'IDLE' && status !== 'COMPLETE' && status !== 'ERROR';

  if (!isActive) {
    return null; // Don't show when idle
  }

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Status & Progress */}
          <div className="flex items-center space-x-4 flex-1">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Badge className={getStatusColor(status)}>
                  {status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {progress}%
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <p className="text-sm truncate">{currentTask}</p>
                {estimatedTimeRemaining && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    • {estimatedTimeRemaining} remaining
                  </span>
                )}
              </div>
              
              {/* Thin Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            {onViewLogs && (
              <Button variant="outline" size="sm" onClick={onViewLogs}>
                <AlertCircle className="h-4 w-4 mr-2" />
                View Logs
              </Button>
            )}
            
            {!isPaused && onPause && (
              <Button variant="outline" size="sm" onClick={onPause}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            
            {isPaused && onResume && (
              <Button variant="default" size="sm" onClick={onResume}>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

