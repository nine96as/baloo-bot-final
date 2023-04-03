import { Message, Events } from 'discord.js';
import { Bot } from '#structures';
import { EmojiEmbed, Event } from '#interfaces';
import { sendAfkReturnMessage, sendAfkMentionMessage } from '#utils';
import { emojis } from '#assets';

export const event = {
  name: Events.MessageCreate,
  execute: async (_client: Bot, message: Message) => {
    if (message.author.bot) return;

    sendAfkReturnMessage(
      message,
      new EmojiEmbed(
        emojis.return,
        `***${message.author}: welcome back, your AFK has been removed.***`
      )
    );

    return sendAfkMentionMessage(message);
  }
} satisfies Event;
