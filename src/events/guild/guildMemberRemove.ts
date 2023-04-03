import { Events, GuildMember } from 'discord.js';
import { Bot } from '#structures';
import { EmojiEmbed, Event, InfoEmbed } from '#interfaces';
import { sendLeaveMessage, sendLogMessage } from '#utils';
import { emojis } from '#assets';

export const event = {
  name: Events.GuildMemberRemove,
  execute: async (_client: Bot, member: GuildMember) => {
    const { guild } = member;

    sendLeaveMessage(
      guild,
      member,
      new EmojiEmbed(emojis.leave, `${member} cya!`).setFooter({
        text: `there are now ${guild.memberCount} members.`
      })
    );

    return sendLogMessage(
      guild,
      new InfoEmbed(`***member ${member} left the server.***`)
    );
  }
} satisfies Event;
