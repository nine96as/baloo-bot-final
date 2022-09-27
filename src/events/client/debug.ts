import { Message } from 'discord.js';
import { Bot, Event } from '#structures';
import { logger } from '#functions';

export const event: Event = {
  name: 'debug',
  once: true,
  execute(_client: Bot, m: Message) {
    logger.debug(m);
  }
};
