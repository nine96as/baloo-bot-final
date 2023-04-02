import { Message, Events } from 'discord.js';
import { Bot } from '#structures';
import { Event } from '#interfaces';
import { logger } from '#utils';

export const event = {
  name: Events.Warn,
  once: true,
  execute: (_client: Bot, m: Message) => {
    logger.warn(m);
  }
} satisfies Event;
