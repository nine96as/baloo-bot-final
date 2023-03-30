import { Bot } from '#structures';
import { BaseGuildTextChannel, Guild } from 'discord.js';
import { setTimeout } from 'timers';
import { prisma } from './prisma';

/**
 * Checks all indexes from LockdownSystem model, where the lockdown is ended if the
 * duration has passed, otherwise the lockdown is set to end from the remaining time assigned.
 * @param {Bot} client The Discord bot client instance that received the event.
 * @param {Guild} guild The guild to check against
 */
export const checkLockdownChannels = async (client: Bot, guild: Guild) => {
  // Fetches LockdownSystem indexes in database (if any)
  prisma.lockdownSystem
    .findMany({
      where: { guildId: guild.id }
    })
    .then(async (dataArray) => {
      // Verifies LockdownSystem indexes by fetching channel
      dataArray.forEach(async (d) => {
        const channel = client.guilds.cache
          .get(d.guildId)
          ?.channels.cache.get(d.channelId) as BaseGuildTextChannel;

        // If there are no locked channels, nothing to be done
        if (!channel) return;

        // If the lockdown expiry time has passed, lockdown is ended
        const timeNow = Date.now();
        if (d.duration < timeNow) {
          channel.permissionOverwrites
            .edit(d.guildId, {
              SendMessages: null
            })
            .then(async () => {
              return prisma.lockdownSystem.delete({
                where: { channelId: channel.id }
              });
            });
        }

        // If above condition not met, expiry duration is logged, with lockdown
        // ending when the duration has elapsed
        const end = d.duration - Date.now();

        setTimeout(async () => {
          channel.permissionOverwrites
            .edit(d.guildId, {
              SendMessages: null
            })
            .then(async () => {
              return prisma.lockdownSystem.delete({
                where: { guildId: guild.id, channelId: channel.id }
              });
            });
        }, end);
      });
    });
};
