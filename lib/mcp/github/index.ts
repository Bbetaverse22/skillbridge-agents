/**
 * GitHub MCP Client - Public API
 *
 * Exports all public types and client for easy importing.
 */

export { GitHubMCPClient, getGitHubMCPClient, closeGitHubMCPClient } from './client';

export type {
  // Repository Types
  GitHubRepository,
  SearchRepositoriesOptions,
  SearchRepositoriesResponse,
  MinimalRepository,

  // File Content Types
  GetFileContentsOptions,
  FileContent,
  DecodedFileContent,

  // Issue Types
  CreateIssueOptions,
  GitHubIssue,

  // Client Configuration
  GitHubMCPClientConfig,

  // Utility Types
  GitHubExample,
  SortOrder,
  RepositorySort,
} from './types';
