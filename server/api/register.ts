import { defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, name } = body;

  if (!email || !password || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email already in use',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'secret', // Use a default value for development
    { expiresIn: '7d' }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    token: token,
  };
});