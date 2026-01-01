
import type { Core } from '@strapi/strapi';
// @ts-ignore
import { RateLimit } from 'koa2-ratelimit';

/**
 * Robust and performant rate limiting middleware for Strapi 5.
 * Uses koa2-ratelimit which is already available in Strapi's dependencies.
 */

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
    // Default configuration: 500 requests per 15 minutes per IP
    const defaultOptions = {
        interval: { min: 15 },
        max: 500,
        message: 'Too many requests, please try again later.',
        // Extract IP address robustly, especially when behind a proxy/load balancer
        keyGenerator: (ctx: any) => {
            return ctx.headers['x-forwarded-for'] || ctx.ip;
        },
        ...config,
    };

    return RateLimit.middleware(defaultOptions);
};
