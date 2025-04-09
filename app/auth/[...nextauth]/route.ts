import NextAuth from 'next-auth';
import { authOptions } from '../auth-options';

const handler = NextAuth(authOptions);

export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
