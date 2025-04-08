import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface RateLimitConfig {
  interval: number; // in seconds
  limit: number;
}

const ipRequests = new Map<string, { count: number; timestamp: number }>();

export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware() {
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    const now = Date.now();

    const currentRequests = ipRequests.get(ip) || { count: 0, timestamp: now };

    // Reset count if interval has passed
    if (now - currentRequests.timestamp > config.interval * 1000) {
      currentRequests.count = 0;
      currentRequests.timestamp = now;
    }

    if (currentRequests.count >= config.limit) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }

    currentRequests.count++;
    ipRequests.set(ip, currentRequests);

    // Clean up old entries every hour
    if (now % 3600000 < 1000) {
      const hourAgo = now - 3600000;
      ipRequests.forEach((value, key) => {
        if (value.timestamp < hourAgo) {
          ipRequests.delete(key);
        }
      });
    }

    return null;
  };
}
