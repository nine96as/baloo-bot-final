import { ActivityType, Events } from 'discord.js';
import { Bot } from '#structures';
import { Event } from '#interfaces';
import { logger } from '#utils';

export const event: Event = {
  name: Events.ClientReady,
  once: true,
  execute(client: Bot) {
    logger.info(`logged in as ${client.user?.tag}.`);
    client.user?.setActivity('with discord.js', {
      type: ActivityType.Playing
    });
  }
};
