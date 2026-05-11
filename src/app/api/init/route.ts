import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully',
      demoAccounts: {
        admin: { email: 'admin@aura.com', password: 'admin123' },
        seller: { email: 'seller@aura.com', password: 'seller123' },
        user: { email: 'user@aura.com', password: 'user123' }
      }
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}