import { Message, Events } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessages } from '#utils';

export const event = {
  name: Events.MessageDelete,
  execute: (_client: Bot, message: Message) => {
    const { guild, author, content, channel } = message;

    if (!guild) return;

    if (message.author.bot) return;

    return sendLogMessages(
      guild,
      new InfoEmbed(`***message deleted by ${author} in ${channel}*\n
      content:** \`${content}\``)
    );
  }
} satisfies Event;
