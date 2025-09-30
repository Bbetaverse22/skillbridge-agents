"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  isToolOrDynamicToolUIPart,
  type DynamicToolUIPart,
  type ReasoningUIPart,
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
import { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputToolbar, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
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

type ChatAssistantProps = {
  api?: string;
};

export default function ChatAssistant({ api }: ChatAssistantProps = {}) {
  const { messages, sendMessage, status, error } = useChat(
    api
      ? {
          id: `chat-${api}`,
        }
      : undefined
  );
  const [inputValue, setInputValue] = useState("");

  const isLoading = status === "submitted" || status === "streaming";

  const loggedKnowledgeBaseStates = useRef(new Set<string>());

  const handleSubmit = async (
    message: { text?: string; files?: any[] },
    event: React.FormEvent
  ) => {
    event?.preventDefault?.();

    const text = (message.text ?? inputValue).trim();
    if (!text || isLoading) return;

    try {
      await sendMessage({ text });
      setInputValue("");
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

  useEffect(() => {
    for (const message of messages) {
      const parts = Array.isArray(message.parts) ? message.parts : [];
      const toolParts = parts.filter((part): part is ToolLikePart =>
        isToolOrDynamicToolUIPart(part)
      );

      for (const toolPart of toolParts) {
        const toolName =
          toolPart.type === "dynamic-tool"
            ? toolPart.toolName
            : toolPart.type.replace(/^tool-/, "");

        if (toolName !== "knowledge_base") {
          continue;
        }

        const callId = toolPart.toolCallId ?? `${message.id}-${toolName}`;
        const stateKey = `${callId}:${toolPart.state ?? "unknown"}`;

        if (loggedKnowledgeBaseStates.current.has(stateKey)) {
          continue;
        }

        loggedKnowledgeBaseStates.current.add(stateKey);

        const toolInput = "input" in toolPart ? toolPart.input : undefined;
        const output =
          toolPart.state === "output-available" ? toolPart.output : undefined;
        const errorText =
          toolPart.state === "output-error" ? toolPart.errorText : undefined;

        console.log("[SkillBridge][KnowledgeBase]", {
          toolCallId: callId,
          state: toolPart.state,
          input: toolInput,
          output,
          errorText,
        });
      }
    }
  }, [messages]);

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
                {message.role === "assistant" && (
                  <>
                    {renderTools(message)}
                    {renderReasoning(message)}
                  </>
                )}
                {renderTextContent(message)}
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
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What would you like to know?"
              disabled={isLoading}
              className="min-h-[80px]"
            />
            <PromptInputToolbar>
              <PromptInputSubmit
                status={isLoading ? "submitted" : undefined}
                disabled={isLoading || !inputValue.trim()}
              />
            </PromptInputToolbar>
          </PromptInputBody>
        </PromptInput>
      </div>
    </div>
  );
}
