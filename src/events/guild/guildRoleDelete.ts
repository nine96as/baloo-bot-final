import { Events, Role } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessages } from '#utils';

export const event = {
  name: Events.GuildRoleDelete,
  execute: (_client: Bot, role: Role) => {
    const { guild, name } = role;

    return sendLogMessages(
      guild,
      new InfoEmbed(`***role*** \`${name}\` ***deleted.***`)
    );
  }
} satisfies Event;
