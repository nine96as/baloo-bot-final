import { Event } from '#interfaces';
import { Bot } from '#structures';
import { logger, prisma } from '#utils';
import { Events, Guild } from 'discord.js';

export const event = {
  name: Events.GuildCreate,
  execute: async (_client: Bot, guild: Guild) => {
    if (!guild || !guild.id) return;

    try {
      await prisma.guild
        .upsert({
          where: { guildId: guild.id },
          create: { guildId: guild.id },
          update: { guildId: guild.id }
        })
        .then(() => {
          logger.info(
            `joined ${guild.name} (${guild.id}), and successfully created a record in the database.`,
            { label: 'event' }
          );
        });
    } catch (e) {
      //   logger.error(
      //     `Joined ${guild.name} (${guild.id}), errored while creating a record in the database.`,
      //     { label: 'event' }
      //   );
      logger.error(e);
    }
  }
} satisfies Event;
