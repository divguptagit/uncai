import { NextResponse } from 'next/server';
import { auth } from '@/app/auth/auth';

export async function GET(request: Request) {
  return auth(request);
}

export async function POST(request: Request) {
  return auth(request);
}
