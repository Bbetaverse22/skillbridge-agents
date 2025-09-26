'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, BookOpen, Code, Users, Building2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PDFResource {
  id: string;
  name: string;
  url: string;
  category: 'system-design' | 'programming' | 'soft-skills' | 'architecture';
  description: string;
  size?: string;
  pages?: number;
}

interface ProcessedResource extends PDFResource {
  status: string;
  instructions: string;
  downloadUrl: string;
}

const categoryIcons = {
  'system-design': <Building2 className="h-4 w-4" />,
  'programming': <Code className="h-4 w-4" />,
  'soft-skills': <Users className="h-4 w-4" />,
  'architecture': <Building2 className="h-4 w-4" />
};

const categoryColors = {
  'system-design': 'bg-blue-100 text-blue-800',
  'programming': 'bg-green-100 text-green-800',
  'soft-skills': 'bg-purple-100 text-purple-800',
  'architecture': 'bg-orange-100 text-orange-800'
};

export function PDFResources() {
  const [resources, setResources] = useState<PDFResource[]>([]);
  const [processedResources, setProcessedResources] = useState<ProcessedResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pdf/process');
      const data = await response.json();
      
      if (data.success) {
        setResources(data.resources);
      } else {
        setError(data.error || 'Failed to fetch resources');
      }
    } catch (err) {
      setError('Network error while fetching resources');
    } finally {
      setLoading(false);
    }
  };

  const processResources = async (category?: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/pdf/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProcessedResources(data.resources);
      } else {
        setError(data.error || 'Failed to process resources');
      }
    } catch (err) {
      setError('Network error while processing resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, name: string) => {
    // Open PDF in new tab for download
    window.open(url, '_blank');
  };

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(resources.map(r => r.category)))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">PDF Resources for Skill Analysis</h2>
          <p className="text-muted-foreground">
            Download and integrate these PDFs into your vectorization pipeline for enhanced skill assessment
          </p>
        </div>
        <Button 
          onClick={() => processResources()}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          {loading ? 'Processing...' : 'Process All Resources'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          {categories.slice(1).map(category => (
            <TabsTrigger key={category} value={category}>
              {categoryIcons[category as keyof typeof categoryIcons]}
              <span className="ml-2 capitalize">{category.replace('-', ' ')}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </div>
                    <Badge className={categoryColors[resource.category]}>
                      {categoryIcons[resource.category]}
                      <span className="ml-1 capitalize">{resource.category.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {resource.pages && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {resource.pages} pages
                      </div>
                    )}
                    {resource.size && (
                      <div>{resource.size}</div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(resource.url, resource.name)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => processResources(resource.category)}
                      disabled={loading}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Process
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {processedResources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Results</CardTitle>
            <CardDescription>
              Resources ready for vectorization and integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {processedResources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{resource.name}</div>
                    <div className="text-sm text-muted-foreground">{resource.description}</div>
                  </div>
                  <Badge variant="outline">{resource.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Implementation Guide</CardTitle>
          <CardDescription>
            Steps to integrate these PDFs into your vectorization pipeline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Install Dependencies</h4>
            <code className="block p-2 bg-muted rounded text-sm">
              pnpm add pdf-parse axios cheerio
            </code>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">2. Download PDFs</h4>
            <p className="text-sm text-muted-foreground">
              Use the download buttons above to get the PDF files locally
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">3. Process with Vector Database</h4>
            <p className="text-sm text-muted-foreground">
              Upload the PDFs to your vector database (Pinecone, Weaviate, etc.) for analysis
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">4. Integrate with Skill Assessment</h4>
            <p className="text-sm text-muted-foreground">
              Use the processed content to enhance your skill gap analysis and generate better questions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
