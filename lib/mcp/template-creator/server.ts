#!/usr/bin/env node

/**
 * Custom Template Creator MCP Server
 *
 * This MCP server provides tools for extracting clean, reusable templates
 * from example GitHub repositories by removing custom implementation details.
 *
 * Tools provided:
 * 1. extract_template - Extract a clean template from repository code
 * 2. analyze_structure - Analyze repository structure and identify template-worthy files
 * 3. generate_boilerplate - Generate boilerplate code based on patterns
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

interface TemplateExtractionOptions {
  preserveStructure: boolean;
  keepComments: boolean;
  includeTypes: boolean;
  removeBusinessLogic: boolean;
}

interface ExtractedTemplate {
  files: TemplateFile[];
  structure: string;
  instructions: string[];
  placeholders: Record<string, string>;
}

interface TemplateFile {
  path: string;
  content: string;
  description: string;
  placeholders: string[];
}

class TemplateCreatorServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'template-creator',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools(),
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'extract_template':
          return await this.extractTemplate(args);
        case 'analyze_structure':
          return await this.analyzeStructure(args);
        case 'generate_boilerplate':
          return await this.generateBoilerplate(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private getTools(): Tool[] {
    return [
      {
        name: 'extract_template',
        description: 'Extract a clean, reusable template from repository code by removing custom implementation details and replacing them with placeholders',
        inputSchema: {
          type: 'object',
          properties: {
            repoUrl: {
              type: 'string',
              description: 'GitHub repository URL to extract template from',
            },
            filePatterns: {
              type: 'array',
              items: { type: 'string' },
              description: 'File patterns to include (e.g., ["*.ts", "*.tsx", "package.json"])',
            },
            options: {
              type: 'object',
              properties: {
                preserveStructure: {
                  type: 'boolean',
                  description: 'Keep directory structure intact',
                  default: true,
                },
                keepComments: {
                  type: 'boolean',
                  description: 'Preserve code comments',
                  default: true,
                },
                includeTypes: {
                  type: 'boolean',
                  description: 'Keep TypeScript types and interfaces',
                  default: true,
                },
                removeBusinessLogic: {
                  type: 'boolean',
                  description: 'Remove specific business logic, keep structure',
                  default: true,
                },
              },
            },
          },
          required: ['repoUrl', 'filePatterns'],
        },
      },
      {
        name: 'analyze_structure',
        description: 'Analyze repository structure to identify key files and patterns suitable for template extraction',
        inputSchema: {
          type: 'object',
          properties: {
            repoUrl: {
              type: 'string',
              description: 'GitHub repository URL to analyze',
            },
            depth: {
              type: 'number',
              description: 'Directory depth to analyze',
              default: 3,
            },
          },
          required: ['repoUrl'],
        },
      },
      {
        name: 'generate_boilerplate',
        description: 'Generate boilerplate code based on detected patterns and best practices',
        inputSchema: {
          type: 'object',
          properties: {
            technology: {
              type: 'string',
              description: 'Technology/framework (e.g., "react", "express", "nextjs")',
            },
            features: {
              type: 'array',
              items: { type: 'string' },
              description: 'Features to include (e.g., ["authentication", "database", "testing"])',
            },
            typescript: {
              type: 'boolean',
              description: 'Use TypeScript',
              default: true,
            },
          },
          required: ['technology', 'features'],
        },
      },
    ];
  }

  private async extractTemplate(args: any) {
    const { repoUrl, filePatterns, options = {} } = args;

    try {
      // In a real implementation, this would:
      // 1. Clone or fetch the repository
      // 2. Parse the code files
      // 3. Remove custom business logic
      // 4. Replace specific values with placeholders
      // 5. Generate usage instructions

      const template = await this.performTemplateExtraction(
        repoUrl,
        filePatterns,
        options
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(template, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Template extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  private async analyzeStructure(args: any) {
    const { repoUrl, depth = 3 } = args;

    try {
      const analysis = await this.performStructureAnalysis(repoUrl, depth);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Structure analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  private async generateBoilerplate(args: any) {
    const { technology, features, typescript = true } = args;

    try {
      const boilerplate = await this.performBoilerplateGeneration(
        technology,
        features,
        typescript
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(boilerplate, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Boilerplate generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  private async performTemplateExtraction(
    repoUrl: string,
    filePatterns: string[],
    options: Partial<TemplateExtractionOptions>
  ): Promise<ExtractedTemplate> {
    // This is a simplified implementation
    // In production, you'd use GitHub API to fetch files and parse them

    const template: ExtractedTemplate = {
      files: [],
      structure: '',
      instructions: [],
      placeholders: {},
    };

    // Example: Extract package.json template
    if (filePatterns.includes('package.json')) {
      template.files.push({
        path: 'package.json',
        content: JSON.stringify(
          {
            name: '{{PROJECT_NAME}}',
            version: '1.0.0',
            description: '{{PROJECT_DESCRIPTION}}',
            scripts: {
              dev: '{{DEV_COMMAND}}',
              build: '{{BUILD_COMMAND}}',
              test: '{{TEST_COMMAND}}',
            },
            dependencies: {
              '{{DEPENDENCY_NAME}}': '{{DEPENDENCY_VERSION}}',
            },
          },
          null,
          2
        ),
        description: 'Package configuration with placeholders',
        placeholders: [
          'PROJECT_NAME',
          'PROJECT_DESCRIPTION',
          'DEV_COMMAND',
          'BUILD_COMMAND',
        ],
      });
    }

    // Generate instructions
    template.instructions = [
      'Replace all {{PLACEHOLDER}} values with your specific values',
      'Update dependencies to match your project requirements',
      'Customize scripts based on your workflow',
      'Review and modify file structure as needed',
    ];

    template.structure = `
└── {{PROJECT_NAME}}/
    ├── src/
    │   ├── components/
    │   ├── lib/
    │   └── app/
    ├── tests/
    ├── package.json
    └── README.md
    `;

    template.placeholders = {
      PROJECT_NAME: 'Your project name',
      PROJECT_DESCRIPTION: 'Brief description of your project',
      DEV_COMMAND: 'Development server command',
      BUILD_COMMAND: 'Production build command',
    };

    return template;
  }

  private async performStructureAnalysis(repoUrl: string, depth: number) {
    // Simplified structure analysis
    return {
      repoUrl,
      mainLanguage: 'TypeScript',
      framework: 'Next.js',
      keyFiles: [
        'package.json',
        'tsconfig.json',
        'next.config.js',
        'src/app/page.tsx',
      ],
      directories: ['src', 'components', 'lib', 'public'],
      recommendedPatterns: ['**/*.ts', '**/*.tsx', 'package.json', '*.config.*'],
      templateWorthiness: 0.85,
      insights: [
        'Well-structured Next.js project',
        'TypeScript configured',
        'Component-based architecture',
        'Suitable for template extraction',
      ],
    };
  }

  private async performBoilerplateGeneration(
    technology: string,
    features: string[],
    typescript: boolean
  ) {
    const extension = typescript ? 'ts' : 'js';

    return {
      technology,
      features,
      files: [
        {
          path: `src/index.${extension}`,
          content: this.generateIndexFile(technology, typescript),
          description: 'Main entry point',
        },
        {
          path: `src/config.${extension}`,
          content: this.generateConfigFile(features, typescript),
          description: 'Configuration file',
        },
        {
          path: 'package.json',
          content: this.generatePackageJson(technology, features),
          description: 'Package dependencies',
        },
      ],
      setupInstructions: [
        `Install dependencies: npm install`,
        `Configure environment: Copy .env.example to .env`,
        `Start development: npm run dev`,
      ],
    };
  }

  private generateIndexFile(technology: string, typescript: boolean): string {
    const typeAnnotation = typescript ? ': void' : '';

    return `// Main entry point for ${technology} application
import { config } from './config';

async function main()${typeAnnotation} {
  console.log('Starting ${technology} application...');
  // TODO: Add your application logic here
}

main().catch(console.error);
`;
  }

  private generateConfigFile(features: string[], typescript: boolean): string {
    const typeAnnotation = typescript ? ': Config' : '';

    return `${typescript ? 'interface Config {\n  [key: string]: any;\n}\n\n' : ''}export const config${typeAnnotation} = {
  features: ${JSON.stringify(features, null, 2)},
  // TODO: Add your configuration here
};
`;
  }

  private generatePackageJson(technology: string, features: string[]): string {
    return JSON.stringify(
      {
        name: `{{PROJECT_NAME}}`,
        version: '1.0.0',
        description: `${technology} project with ${features.join(', ')}`,
        scripts: {
          dev: 'node src/index.js',
          build: 'tsc',
          test: 'jest',
        },
      },
      null,
      2
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Template Creator MCP Server running on stdio');
  }
}

// Start the server
const server = new TemplateCreatorServer();
server.run().catch(console.error);
