import { Events, GuildBan } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessages } from '#utils';

export const event = {
  name: Events.GuildBanAdd,
  execute: (_client: Bot, ban: GuildBan) => {
    const { user, guild, reason } = ban;

    return sendLogMessages(
      guild,
      new InfoEmbed(`***user ${user} banned.*\n
      reason:** \`${reason ?? 'Not specified'}\``)
    );
  }
} satisfies Event;
