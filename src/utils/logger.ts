import { pino } from 'pino';
import { config } from '#utils';

/**
 * Defines pino-pretty and logtail formatting options
 */
const transport = pino.transport({
  targets: [
    {
      level: 'info',
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'dd-mm HH:MM:ss' }
    },
    {
      level: 'info',
      target: '@logtail/pino',
      options: {
        sourceToken: config.logtailSourceToken,
        colorize: true,
        translateTime: 'dd-mm HH:MM:ss'
      }
    }
  ]
});

/**
 * Creates logger instance with formatting layer
 */
export const logger = pino(transport);
