import { Queue } from 'discord-player';
import { Message } from 'discord.js';
import { Bot } from '../../structures/bot';
import { Event } from '../../structures/event';

export const event: Event = {
  name: 'botDisconnect',
  once: true,
  execute(_client: Bot, queue: Queue) {
    // @ts-ignore
    queue.metadata.channel
      .send('❌ i was disconnected from the voice channel, clearing queue!')
      .then((msg: Message) => {
        setTimeout(() => msg.delete(), 5000);
      });
  }
};
