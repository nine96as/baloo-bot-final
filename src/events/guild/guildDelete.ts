import { Event } from '#interfaces';
import { Bot } from '#structures';
import { logger, prisma } from '#utils';
import { Events, Guild } from 'discord.js';

export const event = {
  name: Events.GuildDelete,
  execute: async (_client: Bot, guild: Guild) => {
    if (!guild || !guild.id) return;

    const { id, name } = guild;

    try {
      await prisma.guild.delete({ where: { guildId: id } }).then(() => {
        logger.info(
          `left guild [${name}] (${id}), and successfully deleted the records in the database.`,
          { label: 'event' }
        );
      });
    } catch (e) {
      logger.error(e);
    }
  }
} satisfies Event;
