import { Event } from '#interfaces';
import { Bot } from '#structures';
import { logger, prisma } from '#utils';
import { Events, Guild } from 'discord.js';

export const event = {
  name: Events.GuildDelete,
  execute: async (_client: Bot, guild: Guild) => {
    if (!guild || !guild.id) return;

    try {
      await prisma.guild.delete({ where: { guildId: guild.id } }).then(() => {
        logger.info(
          `left ${guild.name} (${guild.id}), and successfully deleted the records in the database.`,
          { label: 'event' }
        );
      });
    } catch (e) {
      //   logger.error(
      //     `joined ${guild.name} (${guild.id}), errored while deleting a record in the database.`,
      //     { label: 'event' }
      //   );
      logger.error(e);
    }
  }
} satisfies Event;
