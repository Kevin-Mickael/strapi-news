/**
 * Custom Rate Limiting Middleware for Strapi 5
 * Location: src/middlewares/rate-limit.ts
 * 
 * Protects API from abuse by limiting requests per IP per time window.
 * Configuration in: config/middlewares.ts
 * 
 * Exemplo:
 * {
 *   name: 'global::rate-limit',
 *   config: {
 *     interval: { min: 1 },  // 1 minute
 *     max: 100,              // 100 requests
 *   }
 * }
 */

import type { Core } from '@strapi/strapi';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store: Record<string, RateLimitEntry> = {};

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  // Parse interval configuration
  let intervalMs = 60 * 1000; // Default: 1 minute in milliseconds
  
  if (config.interval) {
    if (typeof config.interval === 'number') {
      // If number, assume milliseconds
      intervalMs = config.interval;
    } else if (config.interval.min) {
      // If object with min property
      intervalMs = config.interval.min * 60 * 1000;
    } else if (config.interval.sec) {
      // If object with sec property
      intervalMs = config.interval.sec * 1000;
    }
  }

  const max = config.max ?? 100;
  const message = config.message ?? 'Too many requests, please try again later.';
  
  // Default key generator using IP address
  const keyGenerator = config.keyGenerator ?? ((ctx: any) => {
    return ctx.headers['x-forwarded-for'] || ctx.request.ip || ctx.ip || 'unknown';
  });

  return async (ctx: any, next: any) => {
    try {
      const key = keyGenerator(ctx);
      const now = Date.now();

      // Clean up old entries
      for (const k in store) {
        if (store[k].resetTime < now) {
          delete store[k];
        }
      }

      // Initialize or update counter
      if (!store[key] || store[key].resetTime < now) {
        store[key] = {
          count: 1,
          resetTime: now + intervalMs,
        };
      } else {
        store[key].count++;
      }

      // Get remaining requests
      const remaining = Math.max(0, max - store[key].count);
      const resetTime = Math.ceil((store[key].resetTime - now) / 1000);

      // Add rate limit headers to response
      ctx.set('X-RateLimit-Limit', max.toString());
      ctx.set('X-RateLimit-Remaining', remaining.toString());
      ctx.set('X-RateLimit-Reset', store[key].resetTime.toString());

      // If limit exceeded, return 429
      if (store[key].count > max) {
        ctx.status = 429;
        ctx.body = {
          error: 'Too Many Requests',
          message,
          retryAfter: resetTime,
        };
        ctx.set('Retry-After', resetTime.toString());
        return;
      }

      await next();
    } catch (error) {
      // Log error but don't break the app
      console.error('Rate limit middleware error:', error);
      await next();
    }
  };
};
