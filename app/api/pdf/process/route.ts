import { NextRequest, NextResponse } from 'next/server';
import { PDFProcessor } from '@/lib/pdf-processor';

const pdfProcessor = new PDFProcessor();

/**
 * GET /api/pdf/process - Get available PDF resources
 */
export async function GET() {
  try {
    const resources = pdfProcessor.getResources();
    return NextResponse.json({
      success: true,
      resources,
      total: resources.length
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch PDF resources',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pdf/process - Process a specific PDF resource
 */
export async function POST(request: NextRequest) {
  try {
    const { resourceId, category } = await request.json();
    
    if (!resourceId && !category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Either resourceId or category must be provided' 
        },
        { status: 400 }
      );
    }

    let resources;
    if (resourceId) {
      resources = pdfProcessor.getResources().filter(r => r.id === resourceId);
    } else if (category) {
      resources = pdfProcessor.getResourcesByCategory(category);
    }

    if (!resources || resources.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No resources found for the given criteria' 
        },
        { status: 404 }
      );
    }

    // For now, return the resources with processing instructions
    // In a full implementation, you would actually process the PDFs
    const processedResources = resources.map(resource => ({
      id: resource.id,
      name: resource.name,
      category: resource.category,
      description: resource.description,
      status: 'ready_for_processing',
      instructions: 'PDF processing requires additional dependencies. See implementation guide.',
      downloadUrl: resource.url
    }));

    return NextResponse.json({
      success: true,
      resources: processedResources,
      implementationGuide: pdfProcessor.getImplementationInstructions()
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process PDF resources',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
