import { PrismaClient } from '@prisma/client';
import { SERVER_SETTINGS } from './settings.js';

const prisma = new PrismaClient({
  log:
    SERVER_SETTINGS.nodeEnv === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('Database disconnected');
}

export { prisma, connectDatabase, disconnectDatabase };
