import { Events, GuildBan } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessage } from '#utils';

export const event = {
  name: Events.GuildBanAdd,
  execute: (_client: Bot, ban: GuildBan) => {
    const { user, guild, reason } = ban;

    return sendLogMessage(
      guild,
      new InfoEmbed(`***user ${user} banned.*\n
      reason:** \`${reason ?? 'Not specified'}\``)
    );
  }
} satisfies Event;
