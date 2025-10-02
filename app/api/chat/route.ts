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
import type { KnowledgeBaseSource } from "@/lib/types/retrieval";

export async function POST(request: NextRequest) {
  console.log("=== API ROUTE CALLED ===");
  console.log("Request URL:", request.url);
  console.log("Request method:", request.method);
  try {
    const body = await request.json();
    const { messages } = body;
    console.log("Messages received:", messages.length);

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
    
    // Extract tabContext from the last user message metadata
    const tabContext = (lastUserMessage?.metadata as any)?.tabContext;
    console.log("Tab context:", tabContext);

    const lastUserText = lastUserMessage
      ? lastUserMessage.parts
          .filter((part): part is TextUIPart => part.type === "text")
          .map((part) => part.text)
          .join("\n")
          .trim()
      : "";

    const routedAgent = coordinatorAgent.routeQuery(lastUserText, { tabContext });
    console.log("Routed agent:", routedAgent);

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
      onFinish: ({ finishReason, usage, toolCalls }) => {
        console.log("Chat finished:", {
          finishReason,
          usage,
          toolCalls: toolCalls?.length ?? 0,
        });
      },
    });

    const streamOptions = {
      sendReasoning: true,
      sendSources: true,
      messageMetadata: () => ({ routedAgent }),
      onError: (streamError: unknown) => {
        console.error("Chat stream error:", streamError);
        return "The assistant encountered a streaming issue.";
      },
    } as const;

    const toolCalls = (await result.toolCalls) ?? [];

    if (toolCalls.length > 0) {
      const toolResults = (await result.toolResults) ?? [];
      const knowledgeBaseOutput = toolResults.find(
        (item) => item.toolName === "knowledge_base"
      )?.output as
        | { context?: string; sources?: KnowledgeBaseSource[] }
        | undefined;

      const knowledgeBaseContext =
        typeof knowledgeBaseOutput?.context === "string"
          ? knowledgeBaseOutput.context
          : "";
      const knowledgeBaseSources: KnowledgeBaseSource[] = Array.isArray(
        knowledgeBaseOutput?.sources
      )
        ? (knowledgeBaseOutput!.sources as KnowledgeBaseSource[])
        : [];

      const knowledgeBaseSummary = [
        knowledgeBaseContext.trim(),
        knowledgeBaseSources.length
          ? `Sources:\n${knowledgeBaseSources
              .map((source, index) => {
                const title = source.title || `Source ${index + 1}`;
                return source.url ? `${title} - ${source.url}` : title;
              })
              .join("\n")}`
          : undefined,
      ]
        .filter(Boolean)
        .join("\n\n");

      const followUpResult = await streamText({
        model: openai("gpt-4o"),
        system: `${systemPrompt}

The knowledge_base tool returned the following information that you MUST use when replying:

${knowledgeBaseSummary || "(no additional context returned)"}

Incorporate these details in your response and cite specific sources when helpful.`,
        messages: modelMessages,
      });

      const initialResponse = result.toUIMessageStreamResponse(streamOptions);
      const followUpResponse = followUpResult.toUIMessageStreamResponse(streamOptions);

      const combinedStream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const pipe = async (response: Response) => {
            const body = response.body;
            if (!body) {
              return;
            }

            const reader = body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              if (value) {
                controller.enqueue(value);
              }
            }
          };

          await pipe(initialResponse);
          await pipe(followUpResponse);
          controller.close();
        },
      });

      return new Response(combinedStream, {
        headers: initialResponse.headers,
        status: initialResponse.status,
        statusText: initialResponse.statusText,
      });
    }

    return result.toUIMessageStreamResponse(streamOptions);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
