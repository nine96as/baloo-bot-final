import { Message } from 'discord.js';
import Bot from '../../structures/bot';
import Event, { CustomEvents } from '../../structures/event';

export default class BotDisconnect implements Event {
  client: Bot;
  name = CustomEvents.BotDisconnect;
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
      .send('❌ | i was disconnected from the voice channel, clearing queue!')
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
  };
}
