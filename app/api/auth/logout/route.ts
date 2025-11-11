import { NextResponse } from 'next/server';
import { deleteSession } from '@/../lib/auth.server';

// Add this line to mark the route as dynamic
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}