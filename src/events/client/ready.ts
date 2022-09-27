import { ActivityType } from 'discord.js';
import { Bot, Event } from '#structures';
import { logger } from '#functions';

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
