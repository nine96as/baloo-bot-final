import { Events, ActivityType } from 'discord.js';
import logger from '../../utils/functions/logger';
import Bot from '../../structures/bot';
import Event from '../../structures/event';

export default class Ready implements Event {
  client: Bot;
  name = Events.ClientReady;
  once = true;

  constructor(client: Bot) {
    this.client = client;
  }

  execute = async () => {
    logger.info(`logged in as ${this.client.user?.tag}.`);
    this.client.user?.setActivity('with discord.js', {
      type: ActivityType.Playing
    });
  };
}
