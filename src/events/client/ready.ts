import { ActivityType, Events } from 'discord.js';
import { Bot } from '#structures';
import { Event } from '#interfaces';
import { checkLockdownChannels, logger } from '#utils';

export const event = {
  name: Events.ClientReady,
  once: true,
  execute: (client: Bot) => {
    logger.info(
      `logged in as ${client.user?.tag}. ready for ${client.guilds.cache.size} guilds.`
    );
    client.user?.setActivity(`${client.guilds.cache.size} servers`, {
      type: ActivityType.Watching
    });

    // Run checks on lockdown channels for every guild
    client.guilds.cache.forEach(async (g) => {
      checkLockdownChannels(client, g);
    });
  }
} satisfies Event;
