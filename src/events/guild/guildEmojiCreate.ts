import { Events, GuildEmoji } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessage } from '#utils';

export const event = {
  name: Events.GuildEmojiCreate,
  execute: async (_client: Bot, emoji: GuildEmoji) => {
    const { guild } = emoji;

    const creator = await emoji.fetchAuthor();

    return sendLogMessage(
      guild,
      new InfoEmbed(`***emoji ${emoji} created by ${creator}***`)
    );
  }
} satisfies Event;
