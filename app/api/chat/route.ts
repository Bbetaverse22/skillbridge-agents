import { SYSTEM_INSTRUCTIONS } from "@/components/agent/prompt";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { sanitizerAgent } from "@/lib/sanitizer";
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

    // Server-side validation: Double-check for secrets that might have leaked through
    const validationResults = messages.map((msg: any) => {
      if (msg.role === 'user') {
        const validation = sanitizerAgent.validate(msg.content);
        if (!validation.isValid) {
          console.warn('Server-side validation detected secrets:', validation.remainingSecrets);
          // Sanitize the message content
          const sanitizedResult = sanitizerAgent.sanitize(msg.content);
          return {
            role: msg.role,
            content: sanitizedResult.sanitizedText,
            originalContent: msg.content,
            wasSanitized: sanitizedResult.isSanitized,
            secretsFound: sanitizedResult.secretsFound,
          };
        }
      }
      return {
        role: msg.role,
        content: msg.content,
      };
    });

    // Initialize Coordinator Agent
    const coordinatorAgent = new CoordinatorAgent();

    // Route query to appropriate agent
    const lastMessage = messages[messages.length - 1];
    const routedAgent = coordinatorAgent.routeQuery(lastMessage.content, {});

    // Convert to AI SDK format
    const aiMessages = validationResults.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate response based on routed agent
    let result;
    if (routedAgent === 'coordinator') {
      // Handle general queries with Coordinator Agent
      result = await generateText({
        model: openai("gpt-4o"),
        system: SYSTEM_INSTRUCTIONS,
        messages: aiMessages,
        tools: {
          web_search: openai.tools.webSearch({
            searchContextSize: "low",
          }),
        },
      });
    } else {
      // Route to specialized agent
      result = await coordinatorAgent.handleSpecializedQuery(routedAgent, aiMessages);
    }

    return NextResponse.json({
      response: result.text,
      sources: result.sources || [],
      toolCalls: result.toolCalls || [],
      routedAgent,
      sanitizationApplied: validationResults.some((msg: any) => msg.wasSanitized),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
