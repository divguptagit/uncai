import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import crypto from 'crypto';

const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_SECRET = process.env.AUTH_SECRET || 'your-fallback-secret';
const TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes

export async function generateCsrfToken(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  const timestamp = Date.now();
  const userId = session.user.id;
  
  // Create a unique token using user ID, timestamp, and server secret
  const data = `${userId}-${timestamp}`;
  const token = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(data)
    .digest('hex');

  return token;
}

function isValidToken(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token);
}

export async function validateCsrfToken(request: NextRequest): Promise<boolean> {
  try {
    const token = request.headers.get(CSRF_TOKEN_HEADER);
    if (!token) return false;

    const session = await auth();
    if (!session?.user?.id) return false;

    return isValidToken(token);
  } catch (error) {
    console.error('CSRF validation error:', error);
    return false;
  }
}
