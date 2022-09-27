import { Message } from 'discord.js';
import { Bot, Event } from '#structures';
import { logger } from '#functions';

export const event: Event = {
  name: 'warn',
  once: true,
  execute(_client: Bot, m: Message) {
    logger.warn(m);
  }
};
