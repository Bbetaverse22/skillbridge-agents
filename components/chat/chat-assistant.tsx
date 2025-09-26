"use client";

import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import {
  isToolOrDynamicToolUIPart,
  type DynamicToolUIPart,
  type ReasoningUIPart,
  type SourceUrlUIPart,
  type TextUIPart,
  type ToolUIPart,
  type UIMessage,
} from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { SanitizerPromptInput } from "@/components/sanitizer/sanitizer-prompt-input";
import {
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "@/components/ai-elements/sources";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";

export default function ChatAssistant() {
  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (
    message: { text?: string; files?: any[] },
    _event: React.FormEvent
  ) => {
    const text = message.text?.trim();
    if (!text || isLoading) return;

    try {
      await sendMessage({ text });
    } catch (sendError) {
      console.error("Failed to send message", sendError);
    }
  };

  const renderedMessages = useMemo(() => {
    return messages.filter((message) => message.role !== "system");
  }, [messages]);

  const renderTextContent = (message: UIMessage) => {
    const text = message.parts
      .filter((part): part is TextUIPart => part.type === "text")
      .map((part) => part.text)
      .join("")
      .trim();

    if (!text) return null;

    return (
      <MessageContent>
        <Response>{text}</Response>
      </MessageContent>
    );
  };

  const renderReasoning = (message: UIMessage) => {
    const reasoningParts = message.parts.filter(
      (part): part is ReasoningUIPart => part.type === "reasoning"
    );

    if (reasoningParts.length === 0) return null;

    const reasoningText = reasoningParts.map((part) => part.text).join("\n\n");
    const isStreamingReasoning = reasoningParts.some(
      (part) => part.state === "streaming"
    );

    return (
      <Reasoning isStreaming={isStreamingReasoning}>
        <ReasoningTrigger />
        <ReasoningContent>{reasoningText}</ReasoningContent>
      </Reasoning>
    );
  };

  type ToolLikePart = ToolUIPart | DynamicToolUIPart;

  const renderTools = (message: UIMessage) => {
    const toolParts = message.parts.filter(
      (part): part is ToolLikePart => isToolOrDynamicToolUIPart(part)
    );

    if (toolParts.length === 0) return null;

    return (
      <div className="mt-4 space-y-2">
        {toolParts.map((toolPart) => {
          const toolName: string =
            toolPart.type === "dynamic-tool"
              ? toolPart.toolName
              : toolPart.type.replace(/^tool-/, "");

          const toolInput = "input" in toolPart ? toolPart.input : undefined;
          const showInput =
            toolInput !== undefined || toolPart.state === "input-streaming";

          const output =
            toolPart.state === "output-available"
              ? toolPart.output
              : undefined;

          const errorText =
            toolPart.state === "output-error" ? toolPart.errorText : undefined;

          return (
            <Tool
              key={toolPart.toolCallId}
              defaultOpen={toolPart.state === "output-available"}
            >
              <ToolHeader type={toolName} state={toolPart.state} />
              <ToolContent>
                {showInput && toolInput !== undefined && toolInput !== null && (
                  <ToolInput input={toolInput} />
                )}
                {(output || errorText) && (
                  <ToolOutput output={output} errorText={errorText} />
                )}
              </ToolContent>
            </Tool>
          );
        })}
      </div>
    );
  };

  const renderSources = (message: UIMessage) => {
    const sourceParts = message.parts.filter(
      (part): part is SourceUrlUIPart => part.type === "source-url"
    );

    if (sourceParts.length === 0) return null;

    const sources = sourceParts.map((source) => ({
      key: source.sourceId,
      url: source.url,
      title: source.title ?? source.url,
    }));

    if (sources.length === 0) return null;

    return (
      <div className="mt-4">
        <Sources>
          <SourcesTrigger count={sources.length} />
          <SourcesContent>
            {sources.map((source) => (
              <Source
                key={source.key}
                href={source.url!}
                title={source.title}
              />
            ))}
          </SourcesContent>
        </Sources>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      <Conversation className="flex-1 h-0 overflow-hidden">
        <ConversationContent className="space-y-4">
          {renderedMessages.length === 0 ? (
            <ConversationEmptyState
              title="Start a conversation"
              description="Ask me anything and I'll help you out!"
            />
          ) : (
            renderedMessages.map((message) => (
              <Message key={message.id} from={message.role}>
                {renderTextContent(message)}
                {message.role === "assistant" && (
                  <>
                    {renderReasoning(message)}
                    {renderTools(message)}
                    {renderSources(message)}
                  </>
                )}
              </Message>
            ))
          )}
          {error && (
            <Message from="assistant">
              <MessageContent>
                <Response>
                  {"Sorry, I ran into an issue processing that. Please try again."}
                </Response>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
      </Conversation>

      <div className="p-4 flex-shrink-0">
        <SanitizerPromptInput
          onSubmit={handleSubmit}
          placeholder="What would you like to know? (Secrets will be automatically sanitized)"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
