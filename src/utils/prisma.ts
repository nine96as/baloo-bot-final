import { PrismaClient } from '@prisma/client';

/**
 * Creates prisma client instance with error formatting layer
 */
export const prisma = new PrismaClient({
  errorFormat: 'minimal',
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'error', emit: 'event' }
  ]
});
