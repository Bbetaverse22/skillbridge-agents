import { NextRequest, NextResponse } from "next/server";
import { CoordinatorAgent } from "@/lib/agents/coordinator";
import { SYSTEM_INSTRUCTIONS } from "@/components/agent/prompt";
import {
  convertToModelMessages,
  streamText,
  type TextUIPart,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  console.log("=== RAG AGENT API ROUTE CALLED ===");
  try {
    const { messages } = await request.json();
    console.log("RAG Agent messages received:", messages.length);

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

    const tools = coordinatorAgent.getTools({ gateByKeywords: false });

    const modelMessages = convertToModelMessages(uiMessages);

    console.log("RAG Agent - Available tools:", Object.keys(tools));
    console.log("RAG Agent - About to call streamText...");

    const result = await streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: modelMessages,
      tools,
      onFinish: (result) => {
        console.log("RAG Agent finished:", {
          finishReason: result.finishReason,
          usage: result.usage,
          toolCalls: result.toolCalls?.length || 0,
        });
      },
    });

    // Check if we need to continue after tool calls
    const finishReason = await result.finishReason;
    if (finishReason === 'tool-calls') {
      // Continue the conversation with tool results
      const toolResults = await result.toolResults || [];
      
      // Extract the knowledge base response text
      const knowledgeBaseResponse = toolResults.find(tr => tr.toolName === 'knowledge_base')?.output?.message || 
                                   toolResults.find(tr => tr.toolName === 'knowledge_base')?.output?.response ||
                                   JSON.stringify(toolResults[0]?.output || {});
      
      const followUpResult = await streamText({
        model: openai("gpt-4o"),
        system: `${systemPrompt}

IMPORTANT: You have access to knowledge base information. Use this information to provide a comprehensive, helpful response to the user's question.

Knowledge Base Information:
${knowledgeBaseResponse}`,
        messages: modelMessages,
      });

      // Return a combined stream that shows tool execution first, then the response
      return new Response(
        new ReadableStream({
          start(controller) {
            // First, send the original result with tool calls
            const originalStream = result.toUIMessageStreamResponse({
              sendReasoning: true,
              sendSources: true,
              messageMetadata: () => ({ routedAgent, endpoint: "rag-agent" }),
            });
            
            const reader = originalStream.body?.getReader();
            if (reader) {
              const pump = () => {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    // Wait a moment to ensure tool execution is fully displayed
                    setTimeout(() => {
                      // After original stream is done, send the follow-up response
                      const followUpStream = followUpResult.toUIMessageStreamResponse({
                        sendReasoning: true,
                        sendSources: true,
                        messageMetadata: () => ({ routedAgent, endpoint: "rag-agent" }),
                      });
                      
                      const followUpReader = followUpStream.body?.getReader();
                      if (followUpReader) {
                        const pumpFollowUp = () => {
                          followUpReader.read().then(({ done: followUpDone, value: followUpValue }) => {
                            if (followUpDone) {
                              controller.close();
                            } else {
                              controller.enqueue(followUpValue);
                              pumpFollowUp();
                            }
                          });
                        };
                        pumpFollowUp();
                      } else {
                        controller.close();
                      }
                    }, 100); // Small delay to ensure tool execution is complete
                  } else {
                    controller.enqueue(value);
                    pump();
                  }
                });
              };
              pump();
            } else {
              controller.close();
            }
          }
        }),
        {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
          },
        }
      );
    }

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      sendSources: true,
      messageMetadata: () => ({
        routedAgent,
        endpoint: "rag-agent",
      }),
      onError: (streamError) => {
        console.error("RAG Agent stream error:", streamError);
        return "The RAG agent encountered a streaming issue.";
      },
    });
  } catch (error) {
    console.error("RAG Agent API error:", error);
    return NextResponse.json(
      { error: "Failed to generate RAG agent response" },
      { status: 500 }
    );
  }
}

