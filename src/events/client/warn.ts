import { Message } from 'discord.js';
import { Bot } from '../../structures/bot';
import { Event } from '../../structures/event';
import logger from '../../utils/functions/logger';

export const event: Event = {
  name: 'warn',
  once: true,
  execute(_client: Bot, m: Message) {
    logger.warn(m);
  }
};
