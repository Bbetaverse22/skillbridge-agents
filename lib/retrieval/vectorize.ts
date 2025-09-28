import { Configuration, PipelinesApi } from "@vectorize-io/vectorize-client";
import type { KnowledgeBaseSource } from "../types/retrieval";
import { assertEnv } from "../utils";

export type VectorizeDocument = {
  id: string;
  text: string;
  source?: string;
  source_display_name?: string;
  metadata?: Record<string, unknown>;
  similarity?: number;
  relevancy?: number;
};

export type VectorizeRetrieveOptions = {
  topK?: number;
  filter?: Record<string, unknown>;
};

export class VectorizeService {
  private pipelinesApi: PipelinesApi;
  private organizationId: string;
  private pipelineId: string;

  constructor() {
    const orgId = assertEnv("VECTORIZE_ORG_ID", process.env.VECTORIZE_ORG_ID);
    const pipelineId = assertEnv(
      "VECTORIZE_PIPELINE_ID",
      process.env.VECTORIZE_PIPELINE_ID
    );
    const accessToken = assertEnv(
      "VECTORIZE_ACCESS_TOKEN",
      process.env.VECTORIZE_ACCESS_TOKEN
    );

    const config = new Configuration({
      accessToken,
      basePath: process.env.VECTORIZE_BASE_URL ?? "https://api.vectorize.io/v1",
    });

    this.organizationId = orgId;
    this.pipelineId = pipelineId;
    this.pipelinesApi = new PipelinesApi(config);
  }

  async retrieveDocuments(
    query: string,
    options: VectorizeRetrieveOptions = {}
  ): Promise<VectorizeDocument[]> {
    const { topK = 5, filter } = options;

    try {
      const response = await this.pipelinesApi.retrieveDocuments({
        organizationId: this.organizationId,
        pipelineId: this.pipelineId,
        retrieveDocumentsRequest: {
          question: query,
          numResults: topK,
          filter,
        },
      });

      return response.documents ?? [];
    } catch (error: any) {
      const errorInfo = await this.safeReadError(error);
      console.error("Vectorize retrieve error", errorInfo);
      throw new Error(`Vectorize retrieval failed: ${errorInfo.message}`);
    }
  }

  buildContext(documents: VectorizeDocument[]): string {
    if (documents.length === 0) {
      return "";
    }

    return documents
      .map((doc, index) => {
        const title = doc.source_display_name || doc.source || `Document ${index + 1}`;
        return `${title}\n${doc.text}`.trim();
      })
      .join("\n\n---\n\n");
  }

  toChatSources(documents: VectorizeDocument[]): KnowledgeBaseSource[] {
    return documents.map((doc) => ({
      id: doc.id,
      title: doc.source_display_name || doc.source || "Unknown source",
      url: doc.source,
      snippet: doc.text,
      similarity: doc.similarity,
      relevancy: doc.relevancy,
      metadata: doc.metadata,
    }));
  }

  private async safeReadError(error: any) {
    if (!error) {
      return { message: "Unknown error" };
    }

    const message = error?.message ?? "Vectorize request failed";

    if (error?.response?.text) {
      try {
        const text = await error.response.text();
        return { message, details: text };
      } catch (readError) {
        console.error("Failed to read Vectorize error body", readError);
      }
    }

    return { message, details: error?.response?.data ?? error };
  }
}

