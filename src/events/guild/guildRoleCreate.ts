import { Events, Role } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessage } from '#utils';

export const event = {
  name: Events.GuildRoleCreate,
  execute: (_client: Bot, role: Role) => {
    const { permissions, guild } = role;

    return sendLogMessage(
      guild,
      new InfoEmbed(`***role ${role} created*\n
      permissions:** \`${
        permissions
          .toArray()
          .map((p) => p)
          .join(', ')
          .replace('_', ' ') || 'none'
      }\``)
    );
  }
} satisfies Event;
