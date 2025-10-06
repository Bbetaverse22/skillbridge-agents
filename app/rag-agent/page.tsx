"use client";

import ChatAssistant from "@/components/chat/chat-assistant";

export default function RAGAgentPage() {
  return (
    <div className="h-screen bg-background flex flex-col max-w-4xl mx-auto overflow-hidden">
      <div className="border-b p-4">
        <h1 className="text-2xl font-semibold">RAG Knowledge Agent</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ask about SkillBridge.ai capabilities, codebase design, or technical topics. Responses use the Vectorize knowledge base when helpful.
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatAssistant api="/api/rag-agent" />
      </div>
    </div>
  );
}

