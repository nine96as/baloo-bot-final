import { Queue } from 'discord-player';
import { Message } from 'discord.js';
import { Bot } from '../../structures/bot';
import { Event } from '../../structures/event';
import logger from '../../utils/functions/logger';

export const event: Event = {
  name: 'connectionError',
  once: true,
  execute(_client: Bot, queue: Queue, error: Error) {
    logger.error(error);
    // @ts-ignore
    queue.metadata.channel
      .send(`❌ error emitted from connection: ${error.message}`)
      .then((msg: Message) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
}
