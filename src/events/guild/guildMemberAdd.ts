import { Events, GuildMember } from 'discord.js';
import { Bot } from '#structures';
import { EmojiEmbed, Event, InfoEmbed } from '#interfaces';
import { sendLogMessage, sendWelcomeMessage } from '#utils';
import { emojis } from '#assets';

export const event = {
  name: Events.GuildMemberAdd,
  execute: async (_client: Bot, member: GuildMember) => {
    const { guild } = member;

    sendWelcomeMessage(
      guild,
      member,
      new EmojiEmbed(emojis.join, `${member} welcome to **${guild.name}**`)
    );

    return sendLogMessage(
      guild,
      new InfoEmbed(`***member ${member} joined the server.***`)
    );
  }
} satisfies Event;
