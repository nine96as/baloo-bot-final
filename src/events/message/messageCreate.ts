import { Message, Events, ChannelType } from 'discord.js';
import { Bot } from '#structures';
import { EmojiEmbed, Event } from '#interfaces';
import {
  sendAfkReturnMessage,
  sendAfkMentionMessage,
  sendChatbotMessage
} from '#utils';
import { emojis } from '#assets';

export const event = {
  name: Events.MessageCreate,
  execute: async (client: Bot, message: Message) => {
    if (message.author.bot) return;

    if (message.channel.type === ChannelType.PrivateThread) {
      sendChatbotMessage(message, client);
    }

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
