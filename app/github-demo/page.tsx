'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepository {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  updated: string;
}

export default function GitHubDemo() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [error, setError] = useState('');

  const fetchGitHubData = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setUser(null);
    setRepositories([]);

    try {
      // Simulate API call - in real implementation, this would call the chat API
      // with a message like "Analyze GitHub user {username}"
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              parts: [
                {
                  type: 'text',
                  text: `Analyze GitHub user ${username} and provide a skill assessment`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze GitHub user');
      }

      // For demo purposes, we'll show a placeholder response
      // In the real implementation, the AI would use the GitHub tools
      setUser({
        login: username,
        name: username,
        bio: 'GitHub user',
        avatar_url: `https://github.com/${username}.png`,
        html_url: `https://github.com/${username}`,
        public_repos: Math.floor(Math.random() * 100),
        followers: Math.floor(Math.random() * 1000),
        following: Math.floor(Math.random() * 500),
        created_at: '2020-01-01T00:00:00Z',
      });

      setRepositories([
        {
          name: 'sample-repo-1',
          description: 'A sample repository',
          language: 'TypeScript',
          stars: Math.floor(Math.random() * 100),
          forks: Math.floor(Math.random() * 50),
          url: `https://github.com/${username}/sample-repo-1`,
          updated: new Date().toISOString(),
        },
        {
          name: 'sample-repo-2',
          description: 'Another sample repository',
          language: 'JavaScript',
          stars: Math.floor(Math.random() * 50),
          forks: Math.floor(Math.random() * 25),
          url: `https://github.com/${username}/sample-repo-2`,
          updated: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">GitHub Integration Demo</h1>
        <p className="text-muted-foreground">
          Experience the power of GitHub analysis with our AI-powered skill assessment tools.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>GitHub User Analysis</CardTitle>
          <CardDescription>
            Enter a GitHub username to analyze their profile, repositories, and technical skills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchGitHubData()}
            />
            <Button onClick={fetchGitHubData} disabled={loading || !username.trim()}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {user && (
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <CardTitle>{user.name || user.login}</CardTitle>
                    <CardDescription>@{user.login}</CardDescription>
                    {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.public_repos}</div>
                    <div className="text-sm text-muted-foreground">Repositories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on GitHub →
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repositories">
            <div className="grid gap-4">
              {repositories.map((repo, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {repo.name}
                          </a>
                        </CardTitle>
                        <CardDescription>{repo.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{repo.language}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>⭐ {repo.stars} stars</span>
                      <span>🍴 {repo.forks} forks</span>
                      <span>Updated {new Date(repo.updated).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills Analysis</CardTitle>
                <CardDescription>
                  AI-powered analysis of technical skills based on GitHub activity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Primary Languages</h4>
                    <div className="flex gap-2">
                      <Badge>TypeScript</Badge>
                      <Badge>JavaScript</Badge>
                      <Badge>Python</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Skill Level Assessment</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>TypeScript</span>
                        <span className="text-green-600">Expert</span>
                      </div>
                      <div className="flex justify-between">
                        <span>JavaScript</span>
                        <span className="text-blue-600">Advanced</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Python</span>
                        <span className="text-yellow-600">Intermediate</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Consider contributing to more open source projects</li>
                      <li>Explore additional programming languages</li>
                      <li>Focus on creating higher-quality projects</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>GitHub Integration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Profile Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Get comprehensive user statistics, repository counts, and activity patterns.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Repository Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Analyze specific repositories for technical depth and skill assessment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Skill Assessment</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered evaluation of technical skills based on GitHub activity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Repository Search</h4>
              <p className="text-sm text-muted-foreground">
                Search repositories by technology, topic, or specific criteria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

