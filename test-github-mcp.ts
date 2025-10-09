/**
 * GitHub MCP Client Test
 *
 * Tests the GitHub MCP client with all 3 core tools:
 * 1. search_repositories
 * 2. get_file_contents
 * 3. create_issue (test in separate demo repo)
 *
 * Run with: pnpm tsx test-github-mcp.ts
 */

import { config } from 'dotenv';
import { GitHubMCPClient } from './lib/mcp/github/client';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testGitHubMCP() {
  console.log('\n🚀 GitHub MCP Client - Test Suite\n');
  console.log('='.repeat(60));

  // Debug: Check if token is loaded
  console.log('\n🔍 Debug: GITHUB_TOKEN exists?', !!process.env.GITHUB_TOKEN);
  console.log('🔍 Debug: Token length:', process.env.GITHUB_TOKEN?.length || 0);

  const client = new GitHubMCPClient();

  try {
    // ========================================================================
    // Test 1: Connection
    // ========================================================================
    console.log('\n📡 Test 1: Connecting to GitHub MCP Server...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // ========================================================================
    // Test 2: List Available Tools
    // ========================================================================
    console.log('\n🔧 Test 2: Listing Available Tools...');
    const tools = await client.listTools();
    console.log(`✅ Found ${tools.length} tools:`);
    tools.slice(0, 5).forEach((tool: any) => {
      console.log(`   • ${tool.name}`);
    });
    if (tools.length > 5) {
      console.log(`   ... and ${tools.length - 5} more`);
    }

    // ========================================================================
    // Test 3: Search Repositories
    // ========================================================================
    console.log('\n🔍 Test 3: Searching GitHub Repositories...');
    console.log('   Query: "react authentication stars:>1000"');

    const repos = await client.searchRepositories(
      'react authentication stars:>1000',
      {
        per_page: 5,
        sort: 'stars',
        order: 'desc',
        minimal_output: true,
      }
    );

    console.log(`✅ Found ${repos.length} repositories:\n`);
    repos.forEach((repo: any, i: number) => {
      console.log(`   ${i + 1}. ${repo.full_name || repo.name}`);
      console.log(`      ⭐ Stars: ${repo.stars || repo.stargazers_count}`);
      console.log(`      📝 ${repo.description || 'No description'}`);
      console.log(`      🔗 ${repo.url || repo.html_url}`);
      console.log('');
    });

    // ========================================================================
    // Test 4: Get File Contents
    // ========================================================================
    console.log('📄 Test 4: Getting File Contents...');
    console.log('   File: facebook/react/package.json');

    const fileContent = await client.getFileContents(
      'facebook',
      'react',
      'package.json'
    );

    console.log('✅ File retrieved successfully!');
    console.log(`   Name: ${fileContent.name}`);
    console.log(`   Content Length: ${fileContent.decodedContent?.length || 0} chars`);
    console.log(`   SHA: ${fileContent.sha.substring(0, 10)}...`);
    console.log(`   Type: ${fileContent.type}`);

    // Debug: show first 100 chars of content
    if (fileContent.decodedContent) {
      console.log(`   First 100 chars: ${fileContent.decodedContent.substring(0, 100)}...`);
    }

    // Parse package.json
    try {
      const pkg = JSON.parse(fileContent.decodedContent);
      console.log(`\n   📦 Package Info:`);
      console.log(`      Name: ${pkg.name}`);
      console.log(`      Version: ${pkg.version}`);
      console.log(`      License: ${pkg.license}`);
    } catch (e) {
      console.log(`   ⚠️  Could not parse package.json: ${e}`);
    }

    // ========================================================================
    // Test 5: Create Issue (Optional - Commented Out)
    // ========================================================================
    console.log('\n📝 Test 5: Create Issue (Skipped)');
    console.log('   ⚠️  Issue creation requires write access to a repository');
    console.log('   ⚠️  Uncomment the code below to test with your own repo\n');

    /*
    // Uncomment to test issue creation in YOUR repo:
    const issue = await client.createIssue(
      'YOUR_USERNAME',
      'YOUR_REPO',
      'Test Issue from SkillBridge.ai',
      'This is a test issue created by the GitHub MCP client.\n\n' +
      'Testing SkillBridge.ai GitHub MCP integration.',
      {
        labels: ['test', 'automation'],
      }
    );

    console.log('✅ Issue created!');
    console.log(`   Number: #${issue.number}`);
    console.log(`   Title: ${issue.title}`);
    console.log(`   URL: ${issue.html_url}`);
    */

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n🎉 All Tests Passed!\n');
    console.log('Summary:');
    console.log('  ✅ MCP Server Connection');
    console.log('  ✅ Tool Listing');
    console.log('  ✅ Repository Search');
    console.log('  ✅ File Content Retrieval');
    console.log('  ⏭️  Issue Creation (Skipped - requires write access)');
    console.log('\n' + '='.repeat(60) + '\n');

    // Cleanup
    await client.disconnect();
  } catch (error) {
    console.error('\n❌ Test Failed!');
    console.error('Error:', error);
    console.error('\nStack:', (error as Error).stack);

    // Cleanup on error
    await client.disconnect().catch(() => {});
    process.exit(1);
  }
}

// Run the test
console.log('\n' + '█'.repeat(60));
console.log('   GITHUB MCP CLIENT - TEST SUITE');
console.log('█'.repeat(60));

testGitHubMCP();
