"use client";

import { useState, useEffect } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { SanitizerIndicator } from "./sanitizer-indicator";
import { sanitizerAgent, SanitizationResult } from "@/lib/sanitizer";
import { Shield, AlertTriangle } from "lucide-react";

interface SanitizerPromptInputProps {
  onSubmit: (message: { text?: string; files?: any[] }, event: React.FormEvent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SanitizerPromptInput({
  onSubmit,
  placeholder = "What would you like to know?",
  disabled = false,
}: SanitizerPromptInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [sanitizationResult, setSanitizationResult] = useState<SanitizationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time sanitization as user types
  useEffect(() => {
    if (inputValue.trim()) {
      const result = sanitizerAgent.sanitize(inputValue);
      setSanitizationResult(result);
    } else {
      setSanitizationResult(null);
    }
  }, [inputValue]);

  const handleSubmit = async (message: { text?: string; files?: any[] }, event: React.FormEvent) => {
    if (!message.text?.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Use sanitized text for submission
      const textToSubmit = sanitizationResult?.sanitizedText || message.text;
      
      await onSubmit(
        { text: textToSubmit, files: message.files },
        event
      );
      
      // Clear input after successful submission
      setInputValue("");
      setSanitizationResult(null);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasSecrets = (sanitizationResult?.secretsFound.length ?? 0) > 0;
  const hasCriticalSecrets = sanitizationResult?.secretsFound.some(s => s.severity === 'critical');

  return (
    <div className="space-y-3">
      {/* Sanitization Status */}
      {sanitizationResult && (
        <div className="space-y-2">
          <SanitizerIndicator
            secretsFound={sanitizationResult.secretsFound}
            isSanitized={sanitizationResult.isSanitized}
            showDetails={showDetails}
            onToggleDetails={() => setShowDetails(!showDetails)}
          />
          
          {/* Warning for critical secrets */}
          {hasCriticalSecrets && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-red-800 text-sm">
                Critical secrets detected! These will be sanitized before sending.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Form */}
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            className="min-h-[80px]"
          />
          <PromptInputToolbar>
            <div className="flex items-center gap-2">
              {hasSecrets && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Sanitized</span>
                </div>
              )}
            </div>
            <PromptInputSubmit 
              status={isSubmitting ? "submitted" : undefined}
              disabled={disabled || isSubmitting || !inputValue.trim()}
            />
          </PromptInputToolbar>
        </PromptInputBody>
      </PromptInput>

      {/* Sanitization Preview */}
      {sanitizationResult && sanitizationResult.isSanitized && showDetails && (
        <div className="space-y-2 p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium">Sanitization Preview:</div>
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-muted-foreground">Original: </span>
              <span className="font-mono bg-red-50 text-red-800 px-1 rounded">
                {sanitizationResult.originalText}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Sanitized: </span>
              <span className="font-mono bg-green-50 text-green-800 px-1 rounded">
                {sanitizationResult.sanitizedText}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
