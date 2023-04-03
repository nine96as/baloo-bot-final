import { Events, GuildBan } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessage } from '#utils';

export const event = {
  name: Events.GuildBanRemove,
  execute: (_client: Bot, ban: GuildBan) => {
    const { user, guild } = ban;

    return sendLogMessage(guild, new InfoEmbed(`***user ${user} unbanned.***`));
  }
} satisfies Event;
