import { Events, GuildEmoji } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessages } from '#utils';

export const event = {
  name: Events.GuildEmojiDelete,
  execute: async (_client: Bot, emoji: GuildEmoji) => {
    const { guild, name } = emoji;

    return sendLogMessages(
      guild,
      new InfoEmbed(`***emoji*** \`${name}\` ***deleted.***`)
    );
  }
} satisfies Event;
