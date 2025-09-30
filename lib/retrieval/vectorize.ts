import type { KnowledgeBaseSource } from "../types/retrieval";
import { assertEnv } from "../utils";

export type VectorizeDocument = {
  id?: string;
  text?: string;
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

type RetrieveDocumentsResponse = {
  documents?: VectorizeDocument[];
};

export class VectorizeService {
  private readonly organizationId: string;
  private readonly pipelineId: string;
  private readonly accessToken: string;
  private readonly baseUrl: string;

  constructor(env: NodeJS.ProcessEnv = process.env) {
    this.organizationId = assertEnv(
      "VECTORIZE_ORG_ID",
      env.VECTORIZE_ORG_ID
    );
    this.pipelineId = assertEnv(
      "VECTORIZE_PIPELINE_ID",
      env.VECTORIZE_PIPELINE_ID
    );
    this.accessToken = assertEnv(
      "VECTORIZE_ACCESS_TOKEN",
      env.VECTORIZE_ACCESS_TOKEN
    );

    const configuredBaseUrl = env.VECTORIZE_BASE_URL ?? "https://api.vectorize.io/v1";
    this.baseUrl = configuredBaseUrl.replace(/\/$/, "");
  }

  async retrieveDocuments(
    query: string,
    options: VectorizeRetrieveOptions = {}
  ): Promise<VectorizeDocument[]> {
    const body = {
      question: query,
      numResults: options.topK ?? 5,
      filter: options.filter,
    };

    const response = await this.post<RetrieveDocumentsResponse>(
      `/org/${this.organizationId}/pipelines/${this.pipelineId}/retrieval`,
      body
    );

    return response.documents ?? [];
  }

  buildContext(documents: VectorizeDocument[]): string {
    if (documents.length === 0) {
      return "";
    }

    return documents
      .map((doc, index) => {
        const sourceName =
          doc.source_display_name || doc.source || `Document ${index + 1}`;
        const lines = [
          `Source: ${sourceName}`,
          doc.source ? `URL: ${doc.source}` : undefined,
          doc.text?.trim() ? doc.text.trim() : undefined,
        ].filter(Boolean);

        return lines.join("\n");
      })
      .join("\n\n---\n\n");
  }

  toChatSources(documents: VectorizeDocument[]): KnowledgeBaseSource[] {
    return documents.map((doc, index) => ({
      id: doc.id ?? `doc-${index}`,
      title: doc.source_display_name || doc.source || `Document ${index + 1}`,
      url: doc.source,
      snippet: doc.text ?? "",
      similarity: doc.similarity,
      relevancy: doc.relevancy,
      metadata: doc.metadata,
    }));
  }

  async search(
    query: string,
    options?: VectorizeRetrieveOptions
  ): Promise<{ context: string; sources: KnowledgeBaseSource[] }> {
    const documents = await this.retrieveDocuments(query, options);

    return {
      context: this.buildContext(documents),
      sources: this.toChatSources(documents),
    };
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `Vectorize request failed (${response.status}): ${await this.readError(response)}`
      );
    }

    return (await response.json()) as T;
  }

  private async readError(response: Response): Promise<string> {
    try {
      const text = await response.text();
      return text || "No body";
    } catch (error) {
      console.error("Failed to read Vectorize error response", error);
      return "Unable to read response body";
    }
  }
}
