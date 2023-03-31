import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  errorFormat: 'minimal',
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'error', emit: 'event' }
  ]
});
