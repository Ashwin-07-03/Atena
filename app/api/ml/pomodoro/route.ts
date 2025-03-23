import { NextRequest, NextResponse } from 'next/server';

// Get ML service URL from environment or use default
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5050';

// Helper function to handle errors
const handleError = (error: any) => {
  console.error('ML Service error:', error);
  return NextResponse.json(
    { error: 'Failed to communicate with ML service' },
    { status: 500 }
  );
};

// GET handler for health check
export async function GET() {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`, {
      cache: 'no-store',
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'ML service health check failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error);
  }
}

// POST handler for pomodoro operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation } = body;
    
    // Validate operation
    if (!operation || !['recommend', 'feedback', 'retrain'].includes(operation)) {
      return NextResponse.json(
        { error: 'Invalid operation' },
        { status: 400 }
      );
    }
    
    // Route to appropriate ML service endpoint
    let endpoint = '';
    switch (operation) {
      case 'recommend':
        endpoint = '/api/pomodoro/recommend';
        break;
      case 'feedback':
        endpoint = '/api/pomodoro/feedback';
        break;
      case 'retrain':
        endpoint = '/api/pomodoro/retrain';
        break;
    }
    
    // Forward request to ML service
    const response = await fetch(`${ML_SERVICE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `ML service returned error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error);
  }
} 