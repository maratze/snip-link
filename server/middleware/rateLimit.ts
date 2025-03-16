import { defineEventHandler, sendError, createError } from 'h3';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 500, // 5 requests
  duration: 10, // per 10 seconds
});

export default defineEventHandler(async (event) => {
  try {
    await rateLimiter.consume(event.node.req.socket.remoteAddress || 'local', 1);
  } catch (error) {
    sendError(event, createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
    }));
  }
});