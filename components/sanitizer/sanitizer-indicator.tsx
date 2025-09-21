"use client";

import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { SecretMatch } from "@/lib/sanitizer";

interface SanitizerIndicatorProps {
  secretsFound: SecretMatch[];
  isSanitized: boolean;
  showDetails?: boolean;
  onToggleDetails?: () => void;
}

export function SanitizerIndicator({
  secretsFound,
  isSanitized,
  showDetails = false,
  onToggleDetails,
}: SanitizerIndicatorProps) {
  const criticalCount = secretsFound.filter(s => s.severity === 'critical').length;
  const highCount = secretsFound.filter(s => s.severity === 'high').length;
  const mediumCount = secretsFound.filter(s => s.severity === 'medium').length;
  const lowCount = secretsFound.filter(s => s.severity === 'low').length;

  if (secretsFound.length === 0) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <ShieldCheck className="h-4 w-4" />
        <span>No secrets detected</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {isSanitized ? (
          <ShieldCheck className="h-4 w-4 text-green-600" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        )}
        <span className="text-sm font-medium">
          {isSanitized ? 'Secrets sanitized' : 'Secrets detected'}
        </span>
        <span className="text-xs text-muted-foreground">
          ({secretsFound.length} found)
        </span>
        {onToggleDetails && (
          <button
            onClick={onToggleDetails}
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {showDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showDetails ? 'Hide' : 'Show'} details
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {criticalCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {criticalCount} Critical
          </Badge>
        )}
        {highCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {highCount} High
          </Badge>
        )}
        {mediumCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {mediumCount} Medium
          </Badge>
        )}
        {lowCount > 0 && (
          <Badge variant="outline" className="text-xs">
            {lowCount} Low
          </Badge>
        )}
      </div>

      {showDetails && (
        <div className="space-y-1 text-xs text-muted-foreground">
          {secretsFound.map((secret, index) => (
            <div key={index} className="flex items-center gap-2">
              <Badge
                variant={
                  secret.severity === 'critical' || secret.severity === 'high'
                    ? 'destructive'
                    : secret.severity === 'medium'
                    ? 'secondary'
                    : 'outline'
                }
                className="text-xs"
              >
                {secret.severity}
              </Badge>
              <span className="truncate">{secret.type.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
