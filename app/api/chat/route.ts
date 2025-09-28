import { SYSTEM_INSTRUCTIONS } from "@/components/agent/prompt";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  type TextUIPart,
  type UIMessage,
} from "ai";
import { NextRequest, NextResponse } from "next/server";
import { CoordinatorAgent } from "@/lib/agents/coordinator";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const uiMessages = messages as UIMessage[];

    const coordinatorAgent = new CoordinatorAgent();

    const lastUserMessage = [...uiMessages]
      .reverse()
      .find((msg) => msg.role === "user");

    const lastUserText = lastUserMessage
      ? lastUserMessage.parts
          .filter((part): part is TextUIPart => part.type === "text")
          .map((part) => part.text)
          .join("\n")
          .trim()
      : "";

    const routedAgent = coordinatorAgent.routeQuery(lastUserText, {});

    const systemPrompt =
      routedAgent === "coordinator"
        ? SYSTEM_INSTRUCTIONS
        : coordinatorAgent.getSystemPrompt(routedAgent);

    const modelMessages = convertToModelMessages(uiMessages);

    const tools = coordinatorAgent.getTools();

    const result = await streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: modelMessages,
      tools,
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      sendSources: true,
      messageMetadata: () => ({
        routedAgent,
      }),
      onError: (streamError) => {
        console.error("Chat stream error:", streamError);
        return "The assistant encountered a streaming issue.";
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
