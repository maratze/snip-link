import { defineEventHandler, getHeader } from 'h3';
import jwt from 'jsonwebtoken';
export default defineEventHandler((event) => {
  const token = getHeader(event, 'Authorization')?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string }; // Use a default value for development
      event.context.userId = decoded.userId;
    } catch (error) {
      // Token is invalid or expired
      console.warn('Invalid token:', error);
    }
  }
});