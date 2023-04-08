import { Event } from '#interfaces';
import { Bot } from '#structures';
import { logger, prisma } from '#utils';
import { Events, Guild } from 'discord.js';

export const event = {
  name: Events.GuildCreate,
  execute: async (_client: Bot, guild: Guild) => {
    if (!guild || !guild.id) return;

    const { id, name } = guild;

    try {
      await prisma.guild
        .upsert({
          where: { guildId: id },
          create: { guildId: id },
          update: { guildId: id }
        })
        .then(() => {
          logger.info(
            `joined guild [${name}] (${id}), and successfully created a reference in the database.`,
            { label: 'event' }
          );
        });
    } catch (e) {
      logger.error(e);
    }
  }
} satisfies Event;
