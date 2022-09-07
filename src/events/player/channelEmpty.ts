import { Message } from 'discord.js';
import Bot from '../../structures/bot';
import Event, { CustomEvents } from '../../structures/event';

export default class ChannelEmpty implements Event {
  client: Bot;
  name = CustomEvents.ChannelEmpty;
  once = true;

  constructor(client: Bot) {
    this.client = client;
  }

  execute = async (queue: {
    metadata: {
      channel: { send: (arg0: string) => Promise<Message<boolean>> };
    };
  }) => {
    queue.metadata.channel
      .send('❌ | nobody is in the voice channel, leaving...')
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  };
}
