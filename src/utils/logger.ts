import { pino } from 'pino';

// Defines pino-pretty formatting options
const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'dd-mm HH:MM:ss'
  }
});

/**
 * Creates logger instance with formatting layer
 */
export const logger = pino(transport);
