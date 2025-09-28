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
    const { topK = 5 } = options;

    try {
      const response = await this.pipelinesApi.retrieveDocuments({
        organizationId: this.organizationId,
        pipelineId: this.pipelineId,
        retrieveDocumentsRequest: {
          question: query,
          numResults: topK,
        },
      });

      return response.documents ?? [];
    } catch (error: any) {
      const errorInfo = await this.safeReadError(error);
      console.error("Vectorize retrieve error", errorInfo);
      throw new Error(`Vectorize retrieval failed: ${errorInfo.message}`);
    }
  }

  buildContext(documents: VectorizeDocument[], query?: string): string {
    if (documents.length === 0) {
      return "";
    }

    // If this is a definition/explanation query, provide a synthesized answer
    if (query && this.isDefinitionQuery(query)) {
      return this.buildDefinitionAnswer(documents, query);
    }

    // Group documents by source to avoid duplicate sources
    const sourceGroups = new Map<string, VectorizeDocument[]>();
    documents.forEach(doc => {
      const source = doc.source_display_name || doc.source || "Unknown";
      if (!sourceGroups.has(source)) {
        sourceGroups.set(source, []);
      }
      sourceGroups.get(source)!.push(doc);
    });

    return Array.from(sourceGroups.entries())
      .map(([sourceName, docs]) => {
        const combinedText = docs
          .map(doc => doc.text || "")
          .filter(Boolean)
          .join("\n\n");

        const summary = this.buildSummary(combinedText);

        const lines = [
          `Source: ${sourceName}`,
          docs[0]?.source ? `URL: ${docs[0].source}` : undefined,
          summary ? `Content: ${summary}` : undefined,
        ].filter(Boolean);

        return lines.join("\n");
      })
      .join("\n\n---\n\n");
  }

  private isDefinitionQuery(query: string): boolean {
    const lowerQuery = query.toLowerCase();
    return (
      lowerQuery.startsWith("what is ") ||
      lowerQuery.startsWith("what are ") ||
      lowerQuery.includes(" definition") ||
      lowerQuery.includes(" explain") ||
      lowerQuery.includes(" describe") ||
      lowerQuery.includes(" tell me about") ||
      lowerQuery.includes(" overview") ||
      lowerQuery.includes(" from the official") ||
      lowerQuery.includes(" official documentation") ||
      lowerQuery.includes(" docs") ||
      (lowerQuery.includes(" is ") && !!lowerQuery.split(" is ")[1]?.trim()) ||
      (lowerQuery.includes(" are ") && !!lowerQuery.split(" are ")[1]?.trim())
    );
  }

  private buildDefinitionAnswer(documents: VectorizeDocument[], query: string): string {
    // Extract the subject from definition queries
    const subject = this.extractSubjectFromQuery(query);

    // Look for definition/explanation content in the documents
    const definitionContent = this.findDefinitionContent(documents, subject);

    if (definitionContent) {
      const summary = this.buildSummary(definitionContent, 1000);
      const sources = documents
        .filter(doc => doc.source_display_name || doc.source)
        .slice(0, 3)
        .map(doc => doc.source_display_name || doc.source || "Unknown")
        .join(", ");

      return `Based on ${sources}:\n\n${summary}`;
    }

    // Fallback to regular context building if no good definition found
    return this.buildContext(documents);
  }

  private extractSubjectFromQuery(query: string): string {
    const lowerQuery = query.toLowerCase();

    // Handle "what is X" queries
    if (lowerQuery.startsWith("what is ")) {
      return query.substring(8).trim();
    }

    // Handle "what are X" queries
    if (lowerQuery.startsWith("what are ")) {
      return query.substring(9).trim();
    }

    // Handle "tell me about X" queries
    if (lowerQuery.includes("tell me about")) {
      return query.split("tell me about")[1]?.trim() || "";
    }

    // Handle "explain X" queries
    if (lowerQuery.includes("explain")) {
      return query.split("explain")[1]?.trim() || "";
    }

    // Handle "describe X" queries
    if (lowerQuery.includes("describe")) {
      return query.split("describe")[1]?.trim() || "";
    }

    // Handle "X from the official documentation" queries
    if (lowerQuery.includes(" from the official")) {
      return query.split(" from the official")[0]?.trim() || "";
    }

    // Handle "X official documentation" queries
    if (lowerQuery.includes(" official documentation")) {
      return query.split(" official documentation")[0]?.trim() || "";
    }

    // Handle "X docs" queries
    if (lowerQuery.includes(" docs") && !lowerQuery.includes("what are docs")) {
      return query.split(" docs")[0]?.trim() || "";
    }

    // Handle "is X" queries (reverse order)
    if (lowerQuery.includes(" is ") && lowerQuery.split(" is ")[1]?.trim()) {
      const parts = lowerQuery.split(" is ");
      // If the part after "is" is not a definition keyword, treat the first part as subject
      const afterIs = parts[1].trim();
      if (!["a", "an", "the"].includes(afterIs) && afterIs.length > 2) {
        return parts[0].trim();
      }
    }

    // Default: return the whole query
    return query;
  }

  private findDefinitionContent(documents: VectorizeDocument[], subject: string): string | null {
    // Look for content that contains definitions, introductions, or overviews
    const definitionKeywords = [
      "is a", "is an", "are a", "are an",
      "definition", "overview", "introduction",
      "is a programming language", "is a framework",
      "is a superset", "extends javascript",
      "developed by microsoft", "strict syntactical superset",
      "adds optional static typing", "transcompiles to javascript",
      "typed superset of javascript"
    ];

    for (const doc of documents) {
      const text = doc.text || "";
      const lowerText = text.toLowerCase();
      const lowerSubject = subject.toLowerCase();

      // Check if the subject is mentioned in this document
      if (lowerText.includes(lowerSubject)) {
        // Look for definition patterns
        const sentences = text.split(/(?<=[.!?])\s+/);

        for (const sentence of sentences) {
          const lowerSentence = sentence.toLowerCase();

          // Check for definition patterns
          const hasDefinitionPattern = definitionKeywords.some(keyword =>
            lowerSentence.includes(keyword)
          );

          // Or check if it's an introductory sentence about the subject
          if (hasDefinitionPattern ||
              (lowerSentence.includes(lowerSubject) &&
               (lowerSentence.includes("is") || lowerSentence.includes("are")))) {
            return sentence.trim();
          }
        }

        // If we found the subject but no clear definition, return the first relevant paragraph
        const paragraphs = text.split("\n\n");
        for (const paragraph of paragraphs) {
          if (paragraph.toLowerCase().includes(lowerSubject)) {
            return paragraph.trim();
          }
        }
      }
    }

    return null;
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

  private buildSummary(text: string, maxLength = 800): string {
    if (!text) {
      return "";
    }

    // Clean up the text but preserve important formatting
    const cleaned = text.replace(/\s+/g, " ").trim();
    if (!cleaned) {
      return "";
    }

    // Try to find complete sentences first
    const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);

    if (sentences.length === 0) {
      return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength)}…` : cleaned;
    }

    let summary = "";
    let currentLength = 0;

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      const nextLength = currentLength + trimmedSentence.length + (summary ? 1 : 0);

      // If adding this sentence would exceed maxLength, try to find a good break point
      if (nextLength > maxLength && summary) {
        // Look for a good truncation point within the sentence
        const words = trimmedSentence.split(/\s+/);
        let partialSentence = "";

        for (const word of words) {
          const testLength = currentLength + partialSentence.length + word.length + 2;
          if (testLength > maxLength) {
            break;
          }
          partialSentence += (partialSentence ? " " : "") + word;
        }

        if (partialSentence) {
          summary += (summary ? " " : "") + partialSentence;
          return `${summary}…`;
        }
        break;
      }

      summary += (summary ? " " : "") + trimmedSentence;
      currentLength = summary.length;

      if (currentLength >= maxLength) {
        return `${summary}…`;
      }
    }

    return summary;
  }
}

