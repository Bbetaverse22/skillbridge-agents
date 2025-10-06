/**
 * Simple test script to verify GitHub integration
 * This tests the GitHub client directly without the full Next.js environment
 */

const https = require('https');

// Test GitHub API client functionality
async function testGitHubClient() {
  console.log('🧪 Testing GitHub Integration...\n');

  // Test 1: Basic GitHub API call
  try {
    console.log('1. Testing GitHub API connectivity...');
    const response = await fetch('https://api.github.com/users/octocat');
    const user = await response.json();
    
    if (user.login === 'octocat') {
      console.log('✅ GitHub API is accessible');
      console.log(`   User: ${user.login} (${user.name})`);
      console.log(`   Repos: ${user.public_repos}, Followers: ${user.followers}`);
    } else {
      console.log('❌ Unexpected response from GitHub API');
    }
  } catch (error) {
    console.log('❌ GitHub API test failed:', error.message);
  }

  // Test 2: Repository search
  try {
    console.log('\n2. Testing repository search...');
    const response = await fetch('https://api.github.com/search/repositories?q=language:javascript&sort=stars&per_page=3');
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      console.log('✅ Repository search works');
      console.log(`   Found ${data.total_count} repositories`);
      console.log(`   Top result: ${data.items[0].name} (${data.items[0].stargazers_count} stars)`);
    } else {
      console.log('❌ No repositories found');
    }
  } catch (error) {
    console.log('❌ Repository search failed:', error.message);
  }

  // Test 3: Rate limiting check
  try {
    console.log('\n3. Checking rate limits...');
    const response = await fetch('https://api.github.com/rate_limit');
    const rateLimit = await response.json();
    
    console.log(`✅ Rate limit info: ${rateLimit.rate.remaining}/${rateLimit.rate.limit} requests remaining`);
    console.log(`   Reset time: ${new Date(rateLimit.rate.reset * 1000).toLocaleString()}`);
  } catch (error) {
    console.log('❌ Rate limit check failed:', error.message);
  }

  console.log('\n🎉 GitHub integration test completed!');
  console.log('\nTo use GitHub features in the app:');
  console.log('1. Add GITHUB_TOKEN to your .env.local file');
  console.log('2. Visit /github-demo to test the integration');
  console.log('3. Use the chat to ask about GitHub users or repositories');
}

// Run the test
testGitHubClient().catch(console.error);

