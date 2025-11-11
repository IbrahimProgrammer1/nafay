import { NextResponse } from 'next/server';
import { getSession } from '@/../lib/auth.server';
import { prisma } from '@/../lib/prisma';

// Add this line to mark the route as dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    // If there's no session or userId, the user is not logged in.
    if (!session?.userId) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
        // The session is invalid (e.g., user was deleted)
        return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Me route error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}