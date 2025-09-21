"use client";

import { useState } from "react";
import { sanitizerAgent, SanitizationResult } from "@/lib/sanitizer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Copy, Check } from "lucide-react";

const DEMO_EXAMPLES = [
  {
    name: "API Keys",
    text: "My OpenAI key is sk-1234567890abcdef1234567890abcdef1234567890abcdef",
    description: "Contains OpenAI API key"
  },
  {
    name: "Database URL",
    text: "Database connection: mongodb://user:password123@localhost:27017/mydb",
    description: "Contains database credentials"
  },
  {
    name: "Personal Info",
    text: "Contact me at john.doe@example.com or call (555) 123-4567. My SSN is 123-45-6789",
    description: "Contains email, phone, and SSN"
  },
  {
    name: "JWT Token",
    text: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    description: "Contains JWT token"
  },
  {
    name: "Credit Card",
    text: "Payment info: 4532-1234-5678-9012 expires 12/25",
    description: "Contains credit card number"
  }
];

export function SanitizerDemo() {
  const [inputText, setInputText] = useState("");
  const [sanitizationResult, setSanitizationResult] = useState<SanitizationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSanitize = () => {
    const result = sanitizerAgent.sanitize(inputText);
    setSanitizationResult(result);
  };

  const handleExample = (example: typeof DEMO_EXAMPLES[0]) => {
    setInputText(example.text);
    const result = sanitizerAgent.sanitize(example.text);
    setSanitizationResult(result);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sanitizer Agent Demo
          </CardTitle>
          <CardDescription>
            Test the sanitization engine with various types of sensitive data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example Buttons */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Try these examples:</h4>
            <div className="flex flex-wrap gap-2">
              {DEMO_EXAMPLES.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExample(example)}
                  className="text-xs"
                >
                  {example.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Text:</label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text with sensitive data to test sanitization..."
              className="min-h-[100px]"
            />
            <Button onClick={handleSanitize} disabled={!inputText.trim()}>
              Sanitize Text
            </Button>
          </div>

          {/* Results */}
          {sanitizationResult && (
            <div className="space-y-4">
              {/* Sanitization Status */}
              <Alert className={sanitizationResult.isSanitized ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  {sanitizationResult.isSanitized 
                    ? `Found and sanitized ${sanitizationResult.secretsFound.length} secrets`
                    : "No secrets detected - text is safe"
                  }
                </AlertDescription>
              </Alert>

              {/* Secrets Found */}
              {sanitizationResult.secretsFound.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Secrets Detected:</h4>
                  <div className="space-y-1">
                    {sanitizationResult.secretsFound.map((secret, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <Badge
                          variant={
                            secret.severity === 'critical' || secret.severity === 'high'
                              ? 'destructive'
                              : secret.severity === 'medium'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {secret.severity}
                        </Badge>
                        <span className="font-mono bg-red-50 text-red-800 px-1 rounded">
                          {secret.match}
                        </span>
                        <span className="text-muted-foreground">
                          ({secret.type.replace('_', ' ')})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Original vs Sanitized */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-red-600">Original Text:</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(sanitizationResult.originalText)}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-xs font-mono">
                    {sanitizationResult.originalText}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-green-600">Sanitized Text:</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(sanitizationResult.sanitizedText)}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded text-xs font-mono">
                    {sanitizationResult.sanitizedText}
                  </div>
                </div>
              </div>

              {/* Sanitization Log */}
              {sanitizationResult.sanitizationLog.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Sanitization Log:</h4>
                  <div className="space-y-1">
                    {sanitizationResult.sanitizationLog.map((log, index) => (
                      <div key={index} className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
