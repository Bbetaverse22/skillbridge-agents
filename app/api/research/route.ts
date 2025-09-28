import { NextRequest, NextResponse } from "next/server";
import { VectorizeService } from "@/lib/retrieval";
import {
  type KnowledgeBaseRequest,
  type KnowledgeBaseResponse,
} from "@/lib/types/retrieval";

const vectorizeService = (() => {
  try {
    return new VectorizeService();
  } catch (error) {
    console.error("Vectorize service initialization failed", error);
    return null;
  }
})();

export async function POST(request: NextRequest) {
  if (!vectorizeService) {
    return NextResponse.json(
      {
        error:
          "Vectorize service not configured. Set VECTORIZE_ORG_ID, VECTORIZE_PIPELINE_ID, and VECTORIZE_ACCESS_TOKEN.",
      },
      { status: 500 }
    );
  }

  let body: KnowledgeBaseRequest;

  try {
    body = (await request.json()) as KnowledgeBaseRequest;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  if (!body?.query?.trim()) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  try {
    const documents = await vectorizeService.retrieveDocuments(body.query, {
      topK: body.topK,
      filter: body.filter,
    });

    const context = vectorizeService.buildContext(documents);
    const sources = vectorizeService.toChatSources(documents);

    const response: KnowledgeBaseResponse = {
      content: context,
      sources,
      retrievedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Knowledge base retrieval failed", error);
    return NextResponse.json(
      { error: (error as Error).message ?? "Knowledge base retrieval failed" },
      { status: 500 }
    );
  }
}

