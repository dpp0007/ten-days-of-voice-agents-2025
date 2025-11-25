import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to learner_history.json in backend
    const historyPath = path.join(process.cwd(), '..', 'backend', 'shared-data', 'learner_history.json');
    
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, 'utf-8');
      const history = JSON.parse(data);
      return NextResponse.json(history);
    }
    
    // Return empty structure if file doesn't exist
    return NextResponse.json({
      last_concept: null,
      last_mode: null,
      concepts: {}
    });
  } catch (error) {
    console.error('Error reading learner history:', error);
    return NextResponse.json(
      { error: 'Failed to load progress data' },
      { status: 500 }
    );
  }
}
