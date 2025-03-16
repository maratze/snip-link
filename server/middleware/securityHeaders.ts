import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  event.node.res.setHeader('X-Frame-Options', 'DENY');
  event.node.res.setHeader('X-Content-Type-Options', 'nosniff');
  event.node.res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  event.node.res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  event.node.res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'");
});