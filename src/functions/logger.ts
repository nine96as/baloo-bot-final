import { pino } from 'pino';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'dd-mm HH:MM:ss'
  }
});

export const logger = pino(transport);
