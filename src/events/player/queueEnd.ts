import { Queue } from 'discord-player';
import { Message } from 'discord.js';
import { Bot } from '../../structures/bot';
import { Event } from '../../structures/event';

export const event: Event = {
  name: 'queueEnd',
  once: true,
  execute(_client: Bot, queue: Queue) {
    // @ts-ignore
    queue.metadata.channel
      .send('🎶 the queue has ended, leaving...')
      .then((msg: Message) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
};
