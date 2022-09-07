import { pino } from 'pino';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'dd-mm-yyyy HH:MM:ss'
  }
});

const logger = pino(transport);
export default logger;
