import { ActivityType } from 'discord.js';
import { Bot } from '../../structures/bot';
import { Event } from '../../structures/event';
import logger from '../../utils/functions/logger';

export const event: Event = {
  name: 'ready',
  once: true,
  execute(client: Bot) {
    logger.info(`logged in as ${client.user?.tag}.`);
    client.user?.setActivity('with discord.js', {
      type: ActivityType.Playing
    });
  }
};
